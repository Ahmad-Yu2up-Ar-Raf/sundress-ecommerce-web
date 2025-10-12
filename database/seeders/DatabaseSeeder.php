<?php

namespace Database\Seeders;
use App\Enums\RoleEnums;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Reviews;
use App\Models\User;
use App\Models\Whishlist;
use Illuminate\Database\Seeder;
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
                            Orders::factory()->create([
                                'user_id' => $buyer->id,
                                'product_id' => $product->id,
                                'quantity' => $quantity,
                                'total_price' => $product->price * $quantity
                            ]);
                            $product->decrement('stock', $quantity);

                            if (rand(1, 100) <= 85) {
                                Reviews::factory()->create([
                                    'user_id' => $buyer->id,
                                    'product_id' => $product->id
                                ]);
                            }
                        }
                    }
                });
        }
    });

    }
}
