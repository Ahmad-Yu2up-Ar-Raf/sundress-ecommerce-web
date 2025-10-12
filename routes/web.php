<?php

use App\Http\Controllers\BuyyerController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\OverviewController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\WhishlistController;
use Illuminate\Support\Facades\Route;


Route::get('/', [WelcomeController::class, 'index']);


Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('whistlist', WhishlistController::class);
    Route::resource('orders', OrdersController::class);

        Route::post('unwhistlist', [WhishlistController::class , 'unwhislited'])
       
    ->name('unwhistlist');
    Route::middleware(['role:buyer'])->prefix('buyer')->name('buyer.')->group(function () {

        Route::resource('/', BuyyerController::class);
    });






    Route::middleware(['role:seller'])->prefix('seller')->name('seller.')->group(function () {
     
        Route::resource('/', SellerController::class);
    });
});




    Route::get('products', [ProductsController::class, 'index'])
        ->name('products');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
