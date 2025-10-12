<?php

namespace Database\Factories;

use App\Helpers\ImageHelper;
use App\Models\Products;
use App\Models\Reviews;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewsFactory extends Factory
{
    protected $model = Reviews::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'product_id' => Products::factory(),
            'comments' => $this->faker->paragraph(),
            'star_rating' => $this->faker->numberBetween(1, 5),
            'media' => [
                ImageHelper::random(700, 800),
                ImageHelper::random(700, 800),
                ImageHelper::random(700, 800),
            ],
        ];
    }
}
