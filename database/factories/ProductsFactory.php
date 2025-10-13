<?php

namespace Database\Factories;

use App\Enums\CategoryProductsStatus;

use App\Helpers\ImageHelper;
use App\Models\Products;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductsFactory extends Factory
{
    protected $model = Products::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->unique()->words(3, true),
            'description' => $this->faker->paragraph(),
            'free_shipping' => $this->faker->boolean(),
            'status' => $this->faker->randomElement(['available', 'not_available']),
            'category' => $this->faker->randomElement(CategoryProductsStatus::cases()),
            'price' => $this->faker->numberBetween(10000, 1000000),
            'currency' => 'IDR',
            'city' => $this->faker->city(),
            'country' => $this->faker->country(),
            'stock' => $this->faker->numberBetween(0, 100),
        
            'cover_image' => ImageHelper::random(700, 800),
            'showcase_images' => [
                ImageHelper::random(700, 800),
                ImageHelper::random(700, 800),
                ImageHelper::random(700, 800),
            ],
                    'created_at' => $this->faker->dateTimeBetween('now', '+1 month'), // <- ini
        'updated_at' => now(),
        ];
    }

    public function available()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'available',
                'stock' => $this->faker->numberBetween(1, 100),
            ];
        });
    }
}
