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
    public function index(CartService $cartService )
    {
    
        return Inertia::render('checkout/index', [
            'status' => true,
            'message' => 'CartItems retrieved successfully',
            'data' => $cartService->getCartItems(),
           
        ]);
    }

 public function add(Request $request, CartService $cartService)
{
    $data = $request->validate([
        'product_id' => ['required', 'integer', 'exists:products,id'],
        'quantity'   => ['nullable', 'integer', 'min:1'],
    ]);

    $quantity = $data['quantity'] ?? 1;
    $productId = $data['product_id'];

    // ambil product model (pastikan ada)
    $product = Products::findOrFail($productId);

    // panggil service — biarkan service yang hitung sub_total
    $cartService->addItemToCart($product, $quantity);

    return back()->with('success', 'Product added to cart successfully');
}

    public function update(Request $request,Products $product ,CartService $cartService)
    {
            $request->validate([
      'quantity' => [ 'required' ,'integer' , 'min:1'],
      'sub_total' => [ 'required' ,'integer' , 'min:1']
       ]);

       $quantity = $request->input('quantity');
       $sub_total = $request->input('sub_total');

       $cartService->updateItemQuantity($product->id, $quantity, $sub_total);
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

            // 2) create order items (per cart item) — assign vendor_id dari product->user_id
            foreach ($cartItems as $item) {
                $product = $item->product;
                $sellerId = $product->user_id ?? ($product->seller->id ?? null);

                OrderItems::create([
                    'vendor_id' => $sellerId,
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