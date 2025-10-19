<?php

use App\Http\Controllers\BuyyerController;
use App\Http\Controllers\CartItemsController;
use App\Http\Controllers\OrderItemsController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\WhishlistController;
use App\Models\CartItems;
use App\Models\OrderItems;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('whistlist', WhishlistController::class);
    Route::resource('orders', OrdersController::class);

    Route::post('unwhistlist', [WhishlistController::class, 'unwhislited'])
        ->name('unwhistlist');
    Route::middleware(['role:buyer'])->prefix('buyer')->name('buyer.')->group(function () {

        Route::resource('/', BuyyerController::class);
    });
    Route::prefix('cart')->name('cart.')->group(function () {
        Route::patch('/{cartItem}', [CartItemsController::class, 'update'])->name('update');

        Route::post('/add', [CartItemsController::class, 'add'])->name('add');
        Route::delete('/{cartItem}', [CartItemsController::class, 'destroy'])->name('destroy');
        
        Route::post('checkout', [CartItemsController::class, 'checkout'])
            ->name('cart.checkout');
    });

    Route::prefix('checkout')->name('checkout.')->group(function () {

   Route::get('/', [CartItemsController::class, 'index'])->name('index');
   Route::post('/payment', [CartItemsController::class, 'checkout'])->name('payment');

    });

    Route::middleware(['role:seller'])->prefix('seller')->name('seller.')->group(function () {

        Route::resource('/', SellerController::class);
        Route::resource('/products', ProductsController::class);
        Route::post('/products/{products}/status', [ProductsController::class, 'statusUpdate'])->name('products.status');
        Route::resource('/orders', OrderItemsController::class);
        Route::post('/orders/{orders}/status', [OrderItemsController::class, 'statusUpdate'])->name('orders.status');
    });
});

Route::get('products', [ProductsController::class, 'index'])
    ->name('products');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
