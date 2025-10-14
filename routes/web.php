<?php

use App\Http\Controllers\BuyyerController;
use App\Http\Controllers\CartItemsController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\OverviewController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\WhishlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index']);


Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('whistlist', WhishlistController::class);
    Route::resource('orders', OrdersController::class);

        Route::post('unwhistlist', [WhishlistController::class , 'unwhislited'])
       
    ->name('unwhistlist');
    Route::middleware(['role:buyer'])->prefix('buyer')->name('buyer.')->group(function () {
     
        
        Route::resource('/', BuyyerController::class);
    });
    Route::middleware(['role:buyer'])->prefix('cart')->name('cart.')->group(function () {
     
        Route::post('/add', [CartItemsController::class, 'add'])->name('cart.add');
        Route::patch('/{cartItem}', [CartItemsController::class, 'update'])->name('cart.update');
        Route::delete('/{cartItem}', [CartItemsController::class, 'destroy'])->name('cart.destroy');
      
    });
    Route::middleware(['role:buyer'])->prefix('checkout')->name('checkout.')->group(function () {

  
        Route::get('/', fn() => Inertia::render('checkout/index'))->name('shipping');
  
    });






    Route::middleware(['role:seller'])->prefix('seller')->name('seller.')->group(function () {
     
        Route::resource('/', SellerController::class);
        Route::resource('/products', ProductsController::class);
        Route::post('/products/{products}/status', [ProductsController::class, 'statusUpdate'])->name('products.status');
    });
});




    Route::get('products', [ProductsController::class, 'index'])
        ->name('products');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
