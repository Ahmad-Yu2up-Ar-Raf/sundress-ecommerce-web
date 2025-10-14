<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItems>
 */
class OrderItemsFactory extends Factory
{
    protected $model = OrderItems::class;

    /**
     * Toggle untuk men-disable decrement stok saat seeding (default: false => decrement)
     */
    protected bool $skipStockDecrement = false;

    public function definition(): array
    {
        $statuses = array_map(fn($case) => $case->value, OrderStatus::cases());

        return [
            // jika tidak diberi saat create(), factory akan membuat order & product baru
            'order_id'   => Orders::factory(),
            'product_id' => Products::factory(),
            'seller_id'  => null, // akan diisi di afterCreating berdasarkan product->user_id
            'quantity'   => $this->faker->numberBetween(1, 3),
            'sub_total'  => 0, // akan dihitung di afterCreating
            'status'     => $this->faker->randomElement($statuses),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (OrderItems $item) {
            // ambil product
            $product = $item->product()->first();

            if (! $product) {
                // tak seharusnya terjadi, tapi aman fallback
                $item->sub_total = 0;
                $item->seller_id = null;
                $item->save();
                return;
            }

            // set seller_id dari product owner
            $item->seller_id = $product->user_id;

            // pastikan quantity tidak melebihi stok bila stok ada
            $stock = (int) $product->stock;
            if ($stock > 0 && $item->quantity > $stock) {
                $item->quantity = $stock;
            }

            // hitung subtotal
            $item->sub_total = (int) ($product->price * $item->quantity);

            $item->save();

            // opsi: kurangi stok produk (default kita lakukan)
            if (! $this->skipStockDecrement) {
                if ($product->stock > 0) {
                    $decrement = min($item->quantity, $product->stock);
                    $product->decrement('stock', $decrement);
                }
            }

            // sinkronkan total_price di order (agar order.total_price = SUM(order_items.sub_total))
            $order = $item->order()->first();
            if ($order) {
                $sum = $order->items()->sum('sub_total');
                $order->total_price = (int) $sum;
                $order->save();
            }
        });
    }

    /**
     * Jangan kurangi stok produk saat membuat item (helper chainable)
     *
     * Usage: OrderItems::factory()->count(3)->withoutStockDecrement()->create();
     */
    public function withoutStockDecrement(): static
    {
        $factory = $this->state(function (array $attributes) {
            return [];
        });

        // set flag pada instance factory
        $factory->skipStockDecrement = true;

        return $factory;
    }

    /**
     * Helper: buat order-item untuk order tertentu
     */
    public function forOrder(Orders $order): static
    {
        return $this->state(fn() => ['order_id' => $order->id]);
    }

    /**
     * Helper: buat order-item untuk product tertentu
     */
    public function forProduct(Products $product): static
    {
        return $this->state(fn() => ['product_id' => $product->id]);
    }
}
