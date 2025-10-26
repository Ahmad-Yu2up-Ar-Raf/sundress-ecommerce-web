<?php

namespace Database\Factories;

use App\Models\CartItems;
use App\Models\Products;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CartItems>
 */
class CartItemsFactory extends Factory
{
    protected $model = CartItems::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'product_id' => Products::factory(),
            // default quantity; akan di-adjust di afterCreating jika perlu
            'quantity' => $this->faker->numberBetween(1, 5),
          
            'price' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (CartItems $cart) {
            $product = $cart->product()->first();

            // fallback: jika product tidak ditemukan (shouldn't happen), biarkan subtotal = 0
            if (! $product) {
                $cart->price = 0;
                $cart->save();
                return;
            }

            // Pastikan quantity tidak lebih besar dari stok produk (jika stok tersedia)
            $stock = (int) $product->stock;
            if ($stock > 0) {
                $quantity = min($cart->quantity, max(1, $stock));
            } else {
                // jika stok 0, masih buat cart item tapi quantity minimal 1
                $quantity = max(1, $cart->quantity);
            }

            // Hitung subtotal berdasarkan harga produk * quantity
            $cart->quantity = $quantity;
            $cart->price = (int) ($product->price * $quantity);

            $cart->save();
        });
    }

    /**
     * Optional helper states untuk membuat cart item untuk product tertentu / user tertentu.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn() => ['user_id' => $user->id]);
    }

    public function forProduct(Products $product): static
    {
        return $this->state(fn() => ['product_id' => $product->id]);
    }
}
