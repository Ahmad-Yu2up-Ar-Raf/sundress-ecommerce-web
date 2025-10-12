<?php

namespace Database\Factories;

use App\Enums\Courier;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Helpers\ImageHelper;
use App\Models\Orders;
use App\Models\Products;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Orders>
 */
class OrdersFactory extends Factory
{  
    protected $model = Orders::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
public function definition(): array 
{
    return [
        'product_id' => Products::factory(),
        'address' => $this->faker->address(),
        'notes' => $this->faker->paragraph(),
        'status' => $this->faker->randomElement(OrderStatus::cases()),
        'payment_method' => $this->faker->randomElement(PaymentMethod::cases()),
        'courier' => $this->faker->randomElement(Courier::cases()),
        'quantity' => $this->faker->numberBetween(1, 100),
        'paid_at' => $this->faker->optional()->dateTimeBetween('-1 week', 'now'),
        'payment_proof' => ImageHelper::random(),
        'created_at' => now(),
        'updated_at' => now(),
        // total_price nanti di-set di afterCreating
        'total_price' => 0,
    ];
}

public function configure(): static
{
    return $this->afterCreating(function ($order) {
        $product = $order->product; // ambil product terkait
        $minDate = now()->max($product->created_at); // order.created_at > max(today, product.created_at)

        // set created_at random tapi valid
        $order->created_at = $this->faker->dateTimeBetween($minDate, '+1 month');

        // hitung total_price berdasarkan harga product * quantity
        $order->total_price = $product->price * $order->quantity;

        $order->save();
    });
}


}
