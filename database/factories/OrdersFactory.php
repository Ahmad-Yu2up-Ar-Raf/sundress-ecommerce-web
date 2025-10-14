<?php

namespace Database\Factories;

use App\Enums\Courier;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Helpers\ImageHelper;
use App\Models\Orders;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Orders>
 */
class OrdersFactory extends Factory
{
    protected $model = Orders::class;

    public function definition(): array
    {
     
        $orderStatuses = array_map(fn($case) => $case->value, OrderStatus::cases());
        $paymentMethods = array_map(fn($case) => $case->value, PaymentMethod::cases());
        $couriers = array_map(fn($case) => $case->value, Courier::cases());

        return [
            'user_id' => User::factory(),
            'country' => $this->faker->country(),
            'province' => $this->faker->state(),
            'phone' => $this->faker->phoneNumber(),     
            'zipCode' => $this->faker->postcode(),         
            'firstName' => $this->faker->firstName(),
            'lastName' => $this->faker->lastName(),
            'nameOfCard' => $this->faker->optional()->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'cardNumber' => substr($this->faker->creditCardNumber(), -4), 
            'total_price' => $this->faker->numberBetween(10000, 5000000),
            'status' => $this->faker->randomElement($orderStatuses),
            'shipping_method' => $this->faker->randomElement($couriers),
            'address' => $this->faker->address(),
            'expiryMonth' => $this->faker->optional()->numberBetween(1, 12),
            'expiryYear' => $this->faker->optional()->numberBetween((int)now()->format('Y'), (int)now()->format('Y') + 5),
            'notes' => $this->faker->optional()->sentence(),
            'payment_proof' => ImageHelper::random(),
            'payment_method' => $this->faker->randomElement($paymentMethods),
            'paid_at' => $this->faker->optional()->dateTimeBetween('-1 week', 'now'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Orders $order) {
            // Jika kamu punya order_items dan ingin total_price dihitung otomatis dari item:
            if ($order->relationLoaded('items') || $order->items()->exists()) {
                // pastikan kolom item punya price & quantity
                $sum = $order->items()->select(DB::raw('SUM(price * quantity) as total'))->pluck('total')->first();
                $order->total_price = (int) ($sum ?? 0);
                $order->save();
            }

            // contoh: pastikan created_at tidak di masa lalu (opsional)
            if ($order->created_at->lessThan(now()->subMonths(6))) {
                $order->created_at = $this->faker->dateTimeBetween('-3 months', 'now');
                $order->save();
            }
        });
    }
}
