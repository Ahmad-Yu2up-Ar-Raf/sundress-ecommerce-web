<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartStore;
use App\Models\CartItems;
use App\Models\Products;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function add(CartStore $request) : RedirectResponse
    {
        $data = $request;
        $userId = Auth::id();
        $qtyToAdd = $data['quantity'] ?? 1;

        return DB::transaction(function () use ($userId, $data, $qtyToAdd) {
            // kunci baris product untuk menghindari race stock
            $product = Products::where('id', $data['product_id'])->lockForUpdate()->first();

            if (! $product) {
                return back()->with('success', 'Product added successfully');
            }

            if ($product->stock <= 0) {
                return back()->with('success', 'Product added successfully');
            }

            // Ambil (dan kunci) cart item jika sudah ada
            $cartItem = CartItems::where('user_id', $userId)
                         ->where('product_id', $product->id)
                         ->lockForUpdate()
                         ->first();

            if ($cartItem) {
                // hitung qty baru, pastikan tidak melebihi stok
                $newQty = $cartItem->quantity + $qtyToAdd;
                $newQty = min($newQty, max(0, $product->stock)); // clamp

                // jika baru qty = 0 => hapus
                if ($newQty <= 0) {
                    $cartItem->delete();
                    return back()->with('success', 'Product added successfully');
                }

                $cartItem->quantity = $newQty;
                $cartItem->sub_total = $product->price * $newQty;
                $cartItem->save();

                return back()->with('success', 'Product added successfully');
            }

            // jika belum ada, buat baru, clamp quantity by stock
            $finalQty = min($qtyToAdd, max(1, $product->stock));
    CartItems::create([
                'user_id' => $userId,
                'product_id' => $product->id,
                'quantity' => $finalQty,
                'sub_total' => $product->price * $finalQty,
            ]);

            return back()->with('success', 'Product added successfully');
        });
    }

    
    public function update(CartStore $request, CartItems $cartItem)
    {
   
        $data = $request->validate();

        return DB::transaction(function () use ($cartItem, $data) {
            $product = Products::where('id', $cartItem->product_id)->lockForUpdate()->first();
            if (! $product) {
                return response()->json(['message'=>'Product not found'], 404);
            }

            $newQty = $data['quantity'];
            if ($newQty <= 0) {
                $cartItem->delete();
                return response()->json(['message'=>'Item removed'], 200);
            }

            // clamp to available stock
            if ($newQty > $product->stock) {
                return response()->json([
                    'message' => 'Requested quantity exceeds available stock',
                    'available' => $product->stock
                ], 422);
            }

            $cartItem->quantity = $newQty;
            $cartItem->sub_total = $product->price * $newQty;
            $cartItem->save();

            return back()->with('success', 'Whishlist removed successfully');
        });
    }

    public function destroy(CartStore $cartItem)
    {
   
        $cartItem->delete();
        return back()->with('success', 'Whishlist removed successfully');
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

    /**
     * Update the specified resource in storage.
     */
  
}
