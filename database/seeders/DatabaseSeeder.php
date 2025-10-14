<?php

namespace Database\Seeders;
use App\Enums\RoleEnums;
use App\Models\CartItems;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Reviews;
use App\Models\User;
use App\Models\Whishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
         app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'Products.view',  'Products.create', 'Order.create', "Whishlist.create",
            'Products.edit', 'Products.delete', 'Products.publish',
            'Products.unpublish', 'events.manage',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // 2️⃣ Roles
        $SellerRole = Role::firstOrCreate(['name' => RoleEnums::Seller->value, 'guard_name' => 'web']);
        $buyyerRole = Role::firstOrCreate(['name' => RoleEnums::Buyer->value, 'guard_name' => 'web']);

        $SellerRole->syncPermissions([
            'Products.view', 'Products.create', 'Products.edit',
            'Products.delete', 'Products.publish', 'Products.unpublish',
        ]);

        $buyyerRole->syncPermissions(['Order.create'  ,  "Whishlist.create"]);



    User::factory()
    ->count(50)
    ->has(
        Products::factory()
            ->count(10)
            ->state(fn (array $attr, User $user) => ['user_id' => $user->id])
    )
    ->create()
    ->each(function ($seller) {
        $seller->assignRole(RoleEnums::Seller->value);

        $products = $seller->products()
            ->where('status', 'available')
            ->where('stock', '>', 0)
            ->get();

        if ($products->isNotEmpty()) {
            User::factory()
                ->count(10)
                ->create()
                ->each(function ($buyer) use ($products) {
                    $buyer->assignRole(RoleEnums::Buyer->value);
                    $orderCount = rand(2, 8);

                    for ($i = 0; $i < $orderCount; $i++) {
                        $product = $products->random();

                        if ($product->stock > 0) {
                            $quantity = rand(1, min(5, $product->stock));
                            CartItems::create([
                                'user_id' => $buyer->id,
                                'product_id' => $product->id,
                                'quantity' => $quantity,
                                'sub_total' => $product->price * $quantity
                            ]);
                            
                       

                            $buyersWithCarts = User::whereHas('cartItems')->get(); // asumsi relasi user->cartItems ada

                            foreach ($buyersWithCarts as $buyer) {
                                // ambil cart items beserta product
                                $cartItems = CartItems::where('user_id', $buyer->id)
                                    ->with('product')
                                    ->get();
                            
                                if ($cartItems->isEmpty()) {
                                    continue;
                                }
                            
                                // Group cart items per seller (product->user_id)
                                $groupedBySeller = $cartItems->groupBy(function ($ci) {
                                    return $ci->product->user_id ?? 0;
                                });
                            
                                foreach ($groupedBySeller as $sellerId => $items) {
                                    DB::transaction(function () use ($buyer, $sellerId, $items) {
                                        // hitung total order (sum subtotal)
                                        $total = 0;
                                        foreach ($items as $ci) {
                                            // gunakan subtotal jika sudah diisi, kalau belum hitung dari product.price * qty
                                            $price = (int) ($ci->product->price ?? 0);
                                            $subtotal = (int) ($ci->sub_total ?: ($price * $ci->quantity));
                                            $total += $subtotal;
                                        }
                            
                                        // buat order per seller
                                        $order = Orders::factory()->create([
                                            'user_id' => $buyer->id,
                                         
                                            'total_price' => $total,
                                          
                                        
                                        ]);
                            
                                        // buat order items untuk setiap cart item di grup ini
                                        foreach ($items as $ci) {
                                            $product = $ci->product;
                                            if (! $product) {
                                                continue; // safety
                                            }
                            
                                            $price = (int) ($product->price ?? 0);
                                            $subtotal = (int) ($ci->sub_total ?: ($price * $ci->quantity));
                            
                                            OrderItems::factory()->create([
                                                'seller_id' => $sellerId,
                                                'order_id' => $order->id,
                                                'product_id' => $product->id,
                                                'quantity' => $ci->quantity,
                                                'sub_total' => $subtotal,
                                            
                                            ]);
                                            $product->decrement('stock', $ci->quantity);
                                        } 
                            
                                        // hapus cart items yang sudah diproses untuk buyer ini (hanya yang dipakai)
                                        $cartIds = $items->pluck('id')->toArray();
                                        CartItems::whereIn('id', $cartIds)->delete();
                                    });


                                    if (rand(1, 100) <= 85) {
                                        Reviews::factory()->create([
                                            'user_id' => $buyer->id,
                                            'product_id' => $product->id
                                        ]);
                                    }
                                }
                            }
                            
                        }
                    }
                });
        }
    });

    }
}
