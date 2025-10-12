<?php

namespace Database\Factories;

use App\Models\Products;
use App\Models\User;
use App\Models\Whishlist;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Whishlist>
 */
class WhishlistFactory extends Factory
{
    protected $model = Whishlist::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
       'user_id' => User::factory(),
            'product_id' => Products::factory(),
        ];
    }
}
