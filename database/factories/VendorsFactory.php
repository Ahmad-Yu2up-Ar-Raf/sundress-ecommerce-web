<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vendors;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vendors>
 */
class VendorsFactory extends Factory
{
    protected $model = Vendors::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'store_name' => $this->faker->unique()->name(),
            'store_addres' => $this->faker->unique()->address()
        ];
    }
}
