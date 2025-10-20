<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartStore;
use App\Http\Requests\CheckoutStore;
use App\Models\CartItems;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class CartItemsController extends Controller
{
    public function index(CartService $cartService ,Request $request)
    {
        dd($cartService);
        $perPage = $request->input('perPage', 3);
        $page = (int) $request->input('page', 1);

        $query = CartItems::where('user_id', Auth::id())
            ->with('product.seller')
            ->orderBy('created_at', 'asc');

        $data = [];
        $pagination = [
            'total' => 0,
            'currentPage' => $page,
            'perPage' => (int) $perPage,
            'lastPage' => 0,
            'hasMore' => false,
        ];

        if ($perPage === 'all') {
            $collection = $query->get();
            $data = $collection->values()->all();
            $count = $collection->count();
            
            $pagination = [
                'total' => $count,
                'currentPage' => 1,
                'perPage' => $count,
                'lastPage' => ($count > 0) ? 1 : 0,
                'hasMore' => false,
            ];
        } else {
            $perPageInt = (int) $perPage > 0 ? (int) $perPage : 3;
            $paginator = $query->paginate($perPageInt, ['*'], 'page', $page);
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

    public function add(Request $request , Products $product , CartService $cartService)
    {
        $request->mergeIfMissing([
        'quantity' => 1
        ]);

       $data = $request->validate([
      'quantity' => ['nullable','integer' , 'min:1']
       ]);

       $cartService->addItemToCart(
        $product,
        $data['quantity'],
       );


       return back()->with('succes' , "Product added to cart succesfully");
    }

    public function update(Request $request,Products $product ,CartService $cartService)
    {
            $request->validate([
      'quantity' => ['integer' , 'min:1']
       ]);

       $quantity = $request->input('quantity');

       $cartService->updateItemQuantity($product->id, $quantity);
         return back()->with('succes' , "Product updated to cart succesfully");
    }

    public function destroy(Request $request,Products $product ,CartService $cartService): RedirectResponse
    {
        
        $cartService->removeItemFromCart($product->id);

        return back()->with('success', 'Product removed from cart');
    }

    /**
     * ✅ FIXED: Proper checkout with detailed logging
     */

public function checkout(CheckoutStore $request)
{
    Log::info('🔍 SIMPLE CHECKOUT HIT', [
        'timestamp' => now(),
        'user_id' => Auth::id(),
    ]);

    $user = Auth::user();

    // load semua cart item user beserta relasi product (+ seller)
    $cartItems = CartItems::where('user_id', $user->id)
        ->with('product.seller')
        ->get();

    if ($cartItems->isEmpty()) {
        Log::warning('Checkout attempted with empty cart', ['user_id' => $user->id]);
        return back()->with('error', 'Keranjang kamu kosong');
    }

    $validated = $request->validated();

    try {
        return DB::transaction(function () use ($user, $cartItems, $validated) {
            // 1) create order (buyer-level)
            $order = Orders::create([
                'user_id' => $user->id,
                'firstName' => $validated['firstName'],
                'lastName' => $validated['lastName'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'] ?? null,
                'country' => $validated['country'],
                'province' => $validated['province'],
                'zipCode' => $validated['zipCode'],
                'shipping_method' => $validated['shipping_method'],
                'payment_method' => $validated['payment_method'],
                'total_price' => (int) $validated['total_price'],
                'notes' => $validated['notes'] ?? null,
                // 'status' atau 'paid_at' bisa di-set jika ingin
            ]);

            // 2) create order items (per cart item) — assign seller_id dari product->user_id
            foreach ($cartItems as $item) {
                $product = $item->product;
                $sellerId = $product->user_id ?? ($product->seller->id ?? null);

                OrderItems::create([
                    'seller_id' => $sellerId,
                    'order_id' => $order->id,
                    'quantity' => (int) $item->quantity,
                    'seller_amount' => (int) $item->sub_total,      
                    'platform_commission' => 0,                     
                    'product_id' => $item->product_id,
                    'sub_total' => (int) $item->sub_total,
                ]);
            }

            CartItems::where('user_id', $user->id)->delete();

            // 4) redirect ke home
            return redirect()->route('orders.index')->with('success', 'Order berhasil dibuat');
        });
    } catch (\Throwable $e) {
        Log::error('Simple checkout failed: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString()
        ]);
        return back()->with('error', 'Gagal membuat order — coba lagi');
    }
}

}