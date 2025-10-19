<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ImageHelper
{
    /**
     * Ambil image random dari Foodish API.
     * 
     * Mengembalikan langsung URL gambar (string),
     * misal: "https://foodish-api.com/images/pasta/pasta23.jpg"
     *
     * @return string|null
     */
   protected static $cache = [];

    public static function random(): ?string
    {
        if (empty(self::$cache)) {
            $categories = ['burger', 'pasta', 'pizza', 'rice', 'dessert'];
            foreach ($categories as $cat) {
                $url = "https://foodish-api.com/api/images/{$cat}";
                $response = Http::get($url);
                if ($response->successful()) {
                    self::$cache[] = $response->json()['image'];
                }
            }
        }

        return self::$cache[array_rand(self::$cache)] ?? null;
    }
}