<?php

use App\Enums\OrderItem;
use App\Enums\OrderStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        
            
            // Add index for seller queries
            $table->index('seller_id');
            

    $table->decimal('shipping_cost', 15, 2)->nullable()->default(0);
            $table->string('status')->default(OrderItem::Pending->value);
            $table->foreignId('seller_id')->constrained("users")->onDelete('cascade');
            $table->unsignedInteger('quantity')->default(1);
            $table->foreignId('product_id')->constrained("products")->onDelete('cascade');
            $table->foreignId('order_id')->constrained("orders")->onDelete('cascade');
            $table->unsignedBigInteger('sub_total')->default(0);
                     $table->bigInteger('seller_amount')->default(0)->after('sub_total');
            $table->bigInteger('platform_commission')->default(0)->after('seller_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
