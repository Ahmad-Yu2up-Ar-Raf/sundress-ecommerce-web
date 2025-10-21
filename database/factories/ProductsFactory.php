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
        $faker = \Faker\Factory::create();
        return [
            'vendor_id' => User::factory(),
            'name' => $faker->unique()->name(),
            'description' => $faker->paragraph(),
            'free_shipping' => $faker->boolean(),
            'status' => $faker->randomElement(['available', 'not_available']),
            'category' => $faker->randomElement(CategoryProductsStatus::cases()),
            'price' => $faker->numberBetween(10000, 1000000),
            'currency' => 'IDR',
            'province' => $faker->city(),
            'country' => $faker->country(),
            'stock' => $faker->numberBetween(0, 100),

            'cover_image' => ImageHelper::random(),
            'showcase_images' => [
                ImageHelper::random(),
                ImageHelper::random(),
                ImageHelper::random(),
            ],
            'created_at' => $faker->dateTimeBetween('now', '+1 month'), // <- ini
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
