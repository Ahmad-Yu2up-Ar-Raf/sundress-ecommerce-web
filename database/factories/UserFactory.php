<?php

namespace Database\Factories;

use App\Enums\UserOccupasion;
use App\Helpers\ImageHelper;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('Pa$$w0rd!'),
            'remember_token' => Str::random(10),
            'country' => $this->faker->country(),
            'province' => $this->faker->state(),
            'avatar' => ImageHelper::random(64, 64),  
            'occupasion' => $this->faker->randomElement(UserOccupasion::cases()),
          
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
