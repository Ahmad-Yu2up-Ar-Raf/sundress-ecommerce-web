<?php

use App\Enums\CategoryProductsStatus;
use App\Enums\ProductStatus;
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


        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')->constrained("users")->onDelete('cascade');
            $table->string('store_name');
            $table->longText('store_addres')->nullable();
            $table->string('cover_image')->nullable();
        });
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('vendor_id')->constrained("vendors")->onDelete('cascade');
            $table->string('name')->unique();
            $table->longText('description')->nullable();
            $table->string('country')->default('ID')->nullable();
            $table->string('province')->nullable()->nullable();
            $table->string('status')->default(ProductStatus::Available->value);
            $table->string('category')->default(CategoryProductsStatus::Food->value);
            $table->boolean('free_shipping')->default(false);
            $table->decimal('price', 20 , 4)->nullable();
            $table->char('currency', 3)->default('USD');
            $table->integer('stock')->default(1);
            $table->string('cover_image');
            $table->json('showcase_images')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('products');
    }
};
