<?php

namespace Database\Seeders;
use App\Enums\RoleEnums;
use App\Helpers\ImageHelper;
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
use Exception;
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



// Reduced number of records for development/testing
$userCount = 10; // Reduced to 10 users for testing
$productsPerVendor = 5; // Reduced to 5 products per vendor

// Clear tracked URLs before starting
ImageHelper::clearUsedUrls();

// Create users in smaller batches with proper rate limiting
$users = collect();
for ($i = 0; $i < $userCount; $i += 2) {  // Process 2 users at a time
    $batchSize = min(2, $userCount - $i);  // Handle last batch correctly
    
    try {
        $batchUsers = User::factory()
            ->count($batchSize)
            ->has(
                Vendors::factory()
                    ->has(
                        Products::factory($productsPerVendor)
                            ->state(function () {
                                // Add longer delay between product creation
                                sleep(2); // 2 second delay between products
                                return [];
                            })
                    )
            )
            ->create();
    } catch (Exception $e) {
        Log::error('Failed to create batch of users and products', [
            'error' => $e->getMessage(),
            'batch_size' => $batchSize,
            'products_per_vendor' => $productsPerVendor
        ]);
        throw $e;
    }
        
    // Assign roles to the batch
    $batchUsers->each(function ($seller) {
        $seller->assignRole(RoleEnums::Seller->value);
    });
    
    $users = $users->concat($batchUsers);
    
    if ($i + $batchSize < $userCount) {
        sleep(3); // 3 second delay between batches, but not after the last batch
    }
}
    }
}
