<?php

use App\Http\Controllers\BuyyerController;
use App\Http\Controllers\CartItemsController;
use App\Http\Controllers\OrderItemsController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\WhishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::post('/stripe/webhook', [StripeController::class, 'webhook'])->name('stripe.webhook');

// ✅ Stripe webhook MUST be outside auth middleware

Route::prefix('cart')->name('cart.')->group(function () {
    Route::patch('/{product}', [CartItemsController::class, 'update'])->name('update');
    Route::post('/add', [CartItemsController::class, 'add'])->name('add');
    Route::delete('/{product}', [CartItemsController::class, 'destroy'])->name('destroy');
});
Route::prefix('whishlist')->name('whishlist.')->group(function () {

    Route::post('/store', [WhishlistController::class, 'store'])->name('store');
    Route::delete('/{product}', [WhishlistController::class, 'destroy'])->name('destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::resource('orders', OrdersController::class);


    Route::middleware(['role:buyer'])->prefix('buyer')->name('buyer.')->group(function () {
        Route::resource('/', BuyyerController::class);
        Route::resource('/orders', OrdersController::class);
    });
    

    // ✅ FIX: Checkout routes
    Route::prefix('checkout')->name('checkout.')->group(function () {
        Route::get('/', [CartItemsController::class, 'index'])->name('index');
        Route::post('/payment', [CartItemsController::class, 'checkout'])->name('payment');
        
  
    });
    Route::prefix('stripe')->name('stripe.')->group(function () {
      
        
  
        Route::get('/success', [StripeController::class, 'success'])->name('success');
        Route::get('/failure', [StripeController::class, 'failure'])->name('failure');
    });

    Route::middleware(['role:seller'])->prefix('seller')->name('seller.')->group(function () {
        Route::resource('/', SellerController::class);
        Route::resource('/products', ProductsController::class);
        Route::post('/products/{products}/status', [ProductsController::class, 'statusUpdate'])->name('products.status');
        Route::resource('/orders', OrderItemsController::class);
        Route::post('/orders/{orders}/status', [OrderItemsController::class, 'statusUpdate'])->name('orders.status');
    });
});

Route::get('products', [ProductsController::class, 'index'])->name('products');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';