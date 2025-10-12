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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
              $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('name')->unique();
    $table->longText('description')->nullable();
    $table->string('country')->default('ID');
    $table->string('city')->nullable();
    $table->string('status')->default(ProductStatus::Available->value);
    $table->string('category')->default(CategoryProductsStatus::Food->value);
    $table->boolean('free_shipping')->default(false);
    $table->unsignedBigInteger('price')->default(0);
    $table->char('currency', 3)->default('IDR');
    $table->integer('stock')->default(1);
    $table->string('thumbnail_image');
    $table->string('main_image');
    $table->json('showcase_images')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
