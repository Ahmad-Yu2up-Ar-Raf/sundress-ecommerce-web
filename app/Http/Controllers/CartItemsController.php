<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartStore;
use App\Http\Requests\CheckoutStore;
use App\Models\CartItems;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Checkout\Session;
use Stripe\Climate\Order;
use Stripe\Stripe;

class CartItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */


public function index(Request $request)
{
    // Diterima: perPage bisa angka atau 'all'
    $perPage = $request->input('perPage', 3);
    $page = (int) $request->input('page', 1);

    // Base query
    $query = CartItems::where('user_id', Auth::id())->with('product')->orderBy('created_at', 'asc');

    // Struktur yang akan kita kembalikan
    $data = [];
    $pagination = [
        'total' => 0,
        'currentPage' => $page,
        'perPage' => (int) $perPage,
        'lastPage' => 0,
        'hasMore' => false,
    ];

    if ($perPage === 'all') {
        // Ambil semua item sebagai Collection
        $collection = $query->get(); // Collection
        $data = $collection->values()->all(); // array of models

        $count = $collection->count();
        $pagination = [
            'total' => $count,
            'currentPage' => 1,
            'perPage' => $count,
            'lastPage' => ($count > 0) ? 1 : 0,
            'hasMore' => false,
        ];
    } else {
        // Pastikan perPage integer yang valid
        $perPageInt = (int) $perPage > 0 ? (int) $perPage : 3;

        // Paginate akan return LengthAwarePaginator
        $paginator = $query->paginate($perPageInt, ['*'], 'page', $page);

        // items() returns array of items
        $data = $paginator->items();

        $pagination = [
            'total' => $paginator->total(),
            'currentPage' => $paginator->currentPage(),
            'perPage' => $paginator->perPage(),
            'lastPage' => $paginator->lastPage(),
            'hasMore' => $paginator->currentPage() < $paginator->lastPage(),
        ];
    }

    return Inertia::render('checkout/index', [
        'status' => true,
        'message' => 'CartItems retrieved successfully',
        'data' => $data,
        'pagination' => $pagination,
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
public function add(CartStore $request): RedirectResponse
{
    $data = $request->validated(); // ambil input sebagai array
    $userId = Auth::id();
    $qtyToAdd = $data['quantity'] ?? 1;

    return DB::transaction(function () use ($userId, $data, $qtyToAdd) {
        // Ambil produk, kunci untuk update stock
        $product = Products::where('id', $data['product_id'])->lockForUpdate()->first();
        if (!$product) return back()->with('error', 'Product not found');
        if ($product->stock <= 0) return back()->with('error', 'Product out of stock');

        $cartItem = CartItems::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->lockForUpdate()
            ->first();

        if ($cartItem) {
            $newQty = min($cartItem->quantity + $qtyToAdd, $product->stock);
            if ($newQty <= 0) {
                $cartItem->delete();
                return back()->with('success', 'Item removed from cart');
            }
            $cartItem->update([
                'quantity' => $newQty,
                'sub_total' => $product->price * $newQty,
            ]);
            return back()->with('success', 'Cart updated');
        }

        // buat cart baru
        $finalQty = min($qtyToAdd, $product->stock);
        CartItems::create([
            'user_id' => $userId,
            'product_id' => $product->id,
            'quantity' => $finalQty,
            'sub_total' => $product->price * $finalQty,
        ]);

        return back()->with('success', 'Product added to cart');
    });
}


 public function update(Request $request, CartItems $cartItem): RedirectResponse
{
    // HAPUS dd($cartItem) jika ada
    $data = $request->validate([
        'quantity'  => 'required|integer|min:0',
        'sub_total' => 'required|numeric|min:0',
    ]);

    try {
        return DB::transaction(function () use ($cartItem, $data) {
            // Ambil product yang relevan (pakai model Products atau relation)
            // Cara 1: lewat relation (jika relasi 'product' terdefinisi)
            $product = $cartItem->product()->lockForUpdate()->first();

            // Alternatif: Products::where('id', $cartItem->product_id)->lockForUpdate()->first();

            if (! $product) {
                 return back()->with('success', 'Product Cart updated successfully');
            }

            $newQty = (int) $data['quantity'];
            $sub_total = (float) $data['sub_total'];

            if ($newQty <= 0) {
                $cartItem->delete();
                 return back()->with('success', 'Product Cart updated successfully');
            }

            if ($newQty > $product->stock) {
                  return back()->with('erro', 'Product Cart updated successfully');
            }

            $cartItem->quantity = $newQty;
            $cartItem->sub_total = $sub_total;
            $cartItem->save();

            // Kembalikan data terbaru supaya frontend bisa update UI
         return back()->with('success', 'Product Cart updated successfully');
        });
    } catch (\Throwable $e) {
        Log::error('Cart update failed: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
       return back()->with('error', 'Product Cart updated successfully');
    }
}


    public function destroy(CartItems $cartItem): RedirectResponse
    {

        $cartItem->delete();

        // Jika kamu menggunakan soft deletes dan mau benar-benar forcé:
        // $cartItem->forceDelete();

        return back()->with('success', 'Product Cart deleted successfully');
        // atau return response()->json(null, 204);
    }

    /**
     * Display the specified resource.
     */
    public function show(CartItems $cartItems)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CartItems $cartItems)
    {
        //
    }
    public function checkout(CheckoutStore  $request , CartItems $cartItems)
    {

     Stripe::setApiKey(config('app.stripe_secret_key'));
     DB::beginTransaction();
     try {
         $checkoutCartItems =    CartItems::where('user_id', Auth::id())->with('user')->with('product')->get();
         $checkoutCartItemsSum =    CartItems::where('user_id', Auth::id())->sum('sub_total');
             $order = Orders::create([
                ...$request->validated(),
                'total_price' => $checkoutCartItemsSum,
                'user_id' => Auth::id(),
            ]);

            $orders[] = $order;

            foreach ($checkoutCartItems as $checkoutCartItem) {
                OrderItems::create([
                    'order_id' => $order->id,
                    'seller_id' => $checkoutCartItem['user_id'],
                    'quantity' => $checkoutCartItem['quantity'],
                    'sub_total' => $checkoutCartItem['sub_total'],
                ]);


                $lineItem = [
                    'price_data' => [
                        'currency' => config('app.currency'),
                        'product_data' => [
                            'name' =>  $checkoutCartItem->product['name']
                        ],
                        'unit_amount' => $checkoutCartItem['sub_total'] * 100
                    ],
                    'quantity' => $checkoutCartItem['quantity']
                ];
                $lineItems[] = $lineItem;
            }

            $session = Session::create([
                'customer_email' => Auth::user()->email,
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => route('stripe.succes', []) . "?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url' => route('stripe.failure', []),

            ]);

            foreach ($orders as $order) {
               $order->stripe_session_id = $session->id;
               $order->save();
            };

            DB::commit();
            return redirect($session->url);
     } catch (\Exception $th) {
        Log::error($th);
        Db::rollBack();
        return back()->with('error', $th->getMessage() ? : 'Something went wrong');
     }
    }

    /**
     * Update the specified resource in storage.
     */



    
}
