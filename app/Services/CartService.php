<?php

namespace App\Services;

use App\Models\Products;
use Illuminate\Support\Facades\Auth;

class CartService
{


    private ?array $cachedCartItems = null;
    /**
     * Create a new class instance.
     */



    protected const COOKIE_NAME = 'cartItems';


    protected const COOKIE_LIFETIME = 60 * 24 * 365;


    public function addItemToCart(Products $product , int $quantity = 1)
    {

    }

    public function updateItemQuantity(int $productId , int $quantity = 1)
    {
        
    }
    public function removeItemFromCart(int $productId )
    {

    }



    public function getCartItems():array
    {

        try {
            if($this->cachedCartItems === null) {
                if(Auth::check()){
                    $cartItems = $this->getCartItemsFromDatabase();
                }else{
                       $cartItems = $this->getCartItemsFromCookies();
                }

               $cartItems = $cartItems ?? [];
$productIds = collect($cartItems)->map(fn($item) => $item['product_id']);

                $products = Products::whereIn('id' , $productIds)->with('user')->forWebsite()->get()->keyBy('id');
                $cartItemData = [];

                foreach ($cartItems as $key => $cartItem) {
                    $product = data_get($products, $cartItem['product_id']);

                    if(!$product) continue;


                    $imageUrl = null;
                }
            }
            return $this->cachedCartItems;
        } catch (\Exception $th) {
            //throw $th;
        }



        return[];
    }



    public function getTotalPrice(): float
    {
        return 0.2;
    }
    public function updateItemQuantityInDatabase(int $productId , int $quantity = 1): void
    {

    }
    public function updateItemQuantityInCookies(int $productId , int $quantity = 1): void
    {

    }
    public function saveItemToDatabase(int $productId , int $quantity = 1): void
    {

    }
    public function saveItemToCookies(int $productId , int $quantity = 1): void
    {

    }
    public function removeItemFromDatabase(int $productId , int $quantity = 1): void
    {

    }
    public function removeItemFromCookies(int $productId , int $quantity = 1): void
    {

    }
    public function getCartItemsFromDatabase(): void
    {

    }
    public function getCartItemsFromCookies(): void
    {

    }
}

