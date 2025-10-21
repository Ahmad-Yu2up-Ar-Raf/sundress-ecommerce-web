<?php

namespace App\Providers;

use App\Http\Controllers\WhishlistController;
use App\Services\CartService;
use App\Services\WhishlistService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CartService::class);
        $this->app->singleton(WhishlistService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
