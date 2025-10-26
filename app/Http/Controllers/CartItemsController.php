<?php

namespace App\Http\Controllers;
use Illuminate\Support\Str;

use App\Enums\OrderStatus;
use App\Enums\ShippingMethod;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class CartItemsController extends Controller
{
    private const STRIPE_MINIMUMS = [
        'IDR' => 10000,
        'JPY' => 50,
        'USD' => 0.50,
        'EUR' => 0.50,
        'MYR' => 2,
        'SGD' => 0.50,
    ];

    private const ZERO_DECIMAL_CURRENCIES = [
        'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 
        'pyg', 'rwf', 'vnd', 'vuv', 'xaf', 'xof', 'xpf', 'idr'
    ];

    public function index(CartService $cartService)
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
        $product = Products::findOrFail($productId);
        
        $cartService->addItemToCart($product, $quantity);
        return back()->with('success', 'Product added to cart successfully');
    }

    public function update(Request $request, Products $product, CartService $cartService)
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'integer', 'min:1']
        ]);

        $quantity = $request->input('quantity');
        $price = $request->input('price');

        $cartService->updateItemQuantity($product->id, $quantity, $price);
        return back()->with('success', 'Product updated to cart successfully');
    }

    public function destroy(Request $request, Products $product, CartService $cartService): RedirectResponse
    {
        $cartService->removeItemFromCart($product->id);
        return back()->with('success', 'Product removed from cart');
    }

    private function toStripeAmount(float $price, string $currency): int
    {
        $currencyLower = strtolower($currency);
        
        if (in_array($currencyLower, self::ZERO_DECIMAL_CURRENCIES)) {
            return (int) round($price);
        }
        
        return (int) round($price * 100);
    }

    private function getMinimumAmount(string $currency): float
    {
        $currencyUpper = strtoupper($currency);
        return self::STRIPE_MINIMUMS[$currencyUpper] ?? 0.50;
    }

    private function formatCurrency(float $amount, string $currency): string
    {
        $currencyUpper = strtoupper($currency);
        
        switch ($currencyUpper) {
            case 'IDR':
                return 'Rp ' . number_format($amount, 0, ',', '.');
            case 'USD':
                return '$' . number_format($amount, 2, '.', ',');
            case 'EUR':
                return '€' . number_format($amount, 2, '.', ',');
            case 'JPY':
                return '¥' . number_format($amount, 0, ',', '.');
            default:
                return $currencyUpper . ' ' . number_format($amount, 2, '.', ',');
        }
    }

    public function checkout(Request $request, CartService $cartService)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'country' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'zipCode' => ['required', 'string', 'max:10'],
            'address' => 'nullable|string|max:1000',
            'note' => 'nullable|string',

            // ✅ CRITICAL: Frontend sudah hitung, backend hanya validasi
            'subtotal' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0.50',

            'shipping_method' => [
                'required',
                Rule::in(ShippingMethod::values()),
            ],

            'status' => [
                'nullable',
                Rule::in(OrderStatus::values()),
            ],
        ]);

        $user = $request->user();
        if (!$user) {
            return redirect()->back()->withErrors([
                'checkout' => 'User not authenticated.'
            ]);
        }

        $currency = strtoupper(config('app.currency', 'USD'));
        $minimumAmount = $this->getMinimumAmount($currency);

        // ✅ Validasi minimum amount dari frontend
        $totalPrice = (float) $validated['total_price'];
    

        if ($totalPrice < $minimumAmount) {
            return redirect()->back()->withErrors([
                'checkout' => sprintf(
                    'Minimum pembayaran adalah %s. Total Anda: %s',
                    $this->formatCurrency($minimumAmount, $currency),
                    $this->formatCurrency($totalPrice, $currency)
                )
            ]);
        }

        Stripe::setApiKey(config('app.stripe_secret_key') ?? env('STRIPE_SECRET'));

        // ✅ Get cart items untuk create order items
        $allCartItems = $cartService->getCartItemsGrouped();

        DB::beginTransaction();
        try {
            $vendorId = $request->input('vendor_id', null);
            $orders = [];
            $lineItems = [];

            if ($vendorId) {
                $checkoutCartItems = array_values(array_filter($allCartItems, function ($g) use ($vendorId) {
                    return isset($g['vendor_id']) && (string)$g['vendor_id'] === (string)$vendorId;
                }));
                
                if (empty($checkoutCartItems)) {
                    throw new \Exception("Vendor ID {$vendorId} not found in cart.");
                }
            } else {
                $checkoutCartItems = $allCartItems;
            }

            // ✅ GUNAKAN total_price dari frontend (yang sudah dihitung dengan benar)
            foreach ($checkoutCartItems as $group) {
                $vendor = $group['vendor'] ?? null;
                $cartItems = $group['items'] ?? [];

                // ✅ Create order dengan total_price dari FRONTEND
                $order = Orders::create([
                    'stripe_session_id' => null,
                    'user_id' => $user->id,
                    'vendor_user_id' => data_get($vendor, 'user_id') ?? null,
                    'status' => OrderStatus::Pending->value,
                    'firstName' => $validated['firstName'],
                    'lastName' => $validated['lastName'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'],
                    'address' => $validated['address'] ?? null,
                    'country' => $validated['country'],
                    'province' => $validated['province'],
                    'zipCode' => $validated['zipCode'],
                    'shipping_method' => $validated['shipping_method'],
                    'total_price' => $totalPrice, // ✅ Dari frontend
                    'notes' => $validated['note'] ?? null,
                ]);

                $orders[] = $order;

                // ✅ Create order items dan line items untuk Stripe
                foreach ($cartItems as $cartItem) {
                    $product = $cartItem['product'] ?? [];
                    $productName = data_get($product, 'name', 'Product');
                    
                    $coverImage = data_get($product, 'cover_image');
                    $showcase = data_get($product, 'showcase_images', []);
                    $images = [];
                    
                    if (!empty($coverImage)) {
                        $images = is_array($coverImage) ? $coverImage : [$coverImage];
                    } elseif (!empty($showcase)) {
                        $images = is_array($showcase) ? $showcase : [$showcase];
                    }

                    $quantity = isset($cartItem['quantity']) ? (int) $cartItem['quantity'] : 1;
                    
                    // ✅ CRITICAL: Gunakan price dari cart_items (sudah include quantity)
                    $totalItemPrice = (float) ($cartItem['price'] ?? 0);
                    $unitPrice = $totalItemPrice / $quantity; // Hitung unit price untuk Stripe

                    OrderItems::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem['product_id'] ?? data_get($product, 'id'),
                        'quantity' => $quantity,
                        'price' => $totalItemPrice, // Total price untuk item ini
                    ]);

                    // ✅ Line item untuk Stripe
                    $lineItems[] = [
                        'price_data' => [
                            'currency' => strtolower($currency),
                            'product_data' => [
                                'name' => $productName,
                                'images' => array_map(function ($img) {
                                    return Str::startsWith($img, ['http://', 'https://']) 
                                        ? $img 
                                        : url($img);
                                }, $images),
                            ],
                            'unit_amount' => $this->toStripeAmount($unitPrice, $currency),
                        ],
                        'quantity' => $quantity,
                    ];
                }
            }

            if (empty($lineItems)) {
                throw new \Exception('No line items to checkout.');
            }

            Log::info('Creating Stripe Session', [
                'line_items_count' => count($lineItems),
                'total_amount' => $totalPrice,
                'currency' => $currency,
            ]);

            // ✅ Create Stripe checkout session
            $session = Session::create([
                'customer_email' => $user->email,
                'line_items' => $lineItems,
                'mode' => 'payment',
               
                'success_url' => route('stripe.success') . "?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url' => route('stripe.failure'),
            ]);

            foreach ($orders as $order) {
                $order->stripe_session_id = $session->id;
                $order->save();
            }

            DB::commit();

            Log::info('Checkout Success', [
                'session_id' => $session->id,
                'orders_created' => count($orders),
            ]);

            return Inertia::location($session->url);

        } catch (\Exception $th) {
            Log::error('Checkout Error', [
                'message' => $th->getMessage(),
                'trace' => $th->getTraceAsString(),
                'user_id' => $user->id ?? null,
                'total_price' => $totalPrice ?? 0,
            ]);
            
            DB::rollBack();

            return redirect()->back()->withErrors([
                'checkout' => 'Terjadi kesalahan saat checkout: ' . $th->getMessage()
            ]);
        }
    }
}