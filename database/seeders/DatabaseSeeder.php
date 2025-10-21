<?php

namespace Database\Seeders;
use App\Enums\RoleEnums;
use App\Models\CartItems;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Reviews;
use App\Models\User;
use App\Models\Vendors;
use App\Models\Whishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
        Vendors::factory()->has(Products::factory(10))
    )
    ->create()
    ->each(function ($seller) {

        $seller->assignRole(RoleEnums::Seller->value);
        $vendor = $seller->vendor;
        if (! $vendor) return;

        $products = $vendor->products()->forWebsite()->get();
        if ($products->isEmpty()) return;

        User::factory()
            ->count(10)
            ->create()
            ->each(function ($buyer) use ($products) {
                $buyer->assignRole(RoleEnums::Buyer->value);

                // tambahkan beberapa item ke cart buyer ini
                $orderCount = rand(2, 8);
                for ($i = 0; $i < $orderCount; $i++) {
                    $product = $products->random();

                    if ($product->stock <= 0) continue;

                    $quantity = rand(1, min(5, $product->stock));
                    CartItems::create([
                        'user_id'    => $buyer->id,
                        'product_id' => $product->id,
                        'quantity'   => $quantity,
                        'sub_total'  => $product->price * $quantity,
                    ]);
                }

                // PROSES checkout hanya untuk buyer ini (tidak global)
                $cartItems = CartItems::where('user_id', $buyer->id)
                    ->with('product')
                    ->get();

                if ($cartItems->isEmpty()) return;

                // Filter out cart items yang tidak punya produk atau vendor
                $validItems = $cartItems->filter(function ($ci) {
                    return $ci->product && ! empty($ci->product->vendor_id);
                });

                if ($validItems->isEmpty()) {
                    // optional: hapus cart jika produk invalid
                    CartItems::where('user_id', $buyer->id)->delete();
                    return;
                }

                $groupedBySeller = $validItems->groupBy(function ($ci) {
                    return (int) $ci->product->vendor_id;
                });

                foreach ($groupedBySeller as $vendorId => $items) {
                    // cast & sanitize vendorId
                    $vendorId = (int) $vendorId;
                    if ($vendorId <= 0) {
                        Log::warning('Seeder: skipped group with invalid vendor id', [
                            'buyer_id' => $buyer->id ?? null,
                            'vendorId' => $vendorId,
                            'item_ids' => $items->pluck('id')->toArray(),
                        ]);
                        continue;
                    }
                
                    // FILTER lagi, pastikan semua item punya product dan product->vendor_id sesuai
                    $items = $items->filter(function ($ci) use ($vendorId) {
                        return $ci->product
                            && ! empty($ci->product->vendor_id)
                            && ((int)$ci->product->vendor_id === $vendorId);
                    })->values();
                
                    if ($items->isEmpty()) {
                        Log::warning('Seeder: no valid items left after vendor-id filter', [
                            'buyer_id' => $buyer->id ?? null,
                            'vendorId' => $vendorId,
                        ]);
                        continue;
                    }
                
                    DB::transaction(function () use ($buyer, $vendorId, $items) {
                        $total = $items->sum(function ($ci) {
                            return (int) ($ci->sub_total ?: ($ci->product->price * $ci->quantity));
                        });
                
                        $order = Orders::factory()->create([
                            'user_id'     => $buyer->id,
                            'total_price' => $total,
                        ]);
                
                        foreach ($items as $ci) {
                            $product = $ci->product;
                            if (! $product) continue;
                
                            // final safety check
                            if (empty($product->vendor_id) || (int)$product->vendor_id !== $vendorId) {
                                Log::warning('Seeder: product vendor mismatch (skipping)', [
                                    'order_id' => $order->id,
                                    'product_id' => $product->id,
                                    'product_vendor_id' => $product->vendor_id,
                                    'expected_vendor_id' => $vendorId,
                                ]);
                                continue;
                            }
                
                            $subtotal = (int) ($ci->sub_total ?: ($product->price * $ci->quantity));
                
                            OrderItems::factory()->create([
                                'vendor_id'  => $vendorId,
                                'order_id'   => $order->id,
                                'product_id' => $product->id,
                                'quantity'   => $ci->quantity,
                                'sub_total'  => $subtotal,
                            ]);
                
                            $product->decrement('stock', $ci->quantity);
                        }
                
                        CartItems::whereIn('id', $items->pluck('id')->toArray())->delete();
                    });
                
                    if (rand(1, 100) <= 85) {
                        $firstProduct = $items->first()->product;
                        if ($firstProduct) {
                            Reviews::factory()->create([
                                'user_id' => $buyer->id,
                                'product_id' => $firstProduct->id,
                            ]);
                        }
                    }
                }
            });
    });
    }
}
