<?php

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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('user_id')->index()->constrained("users")->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->foreignId('product_id')
            ->index()
            ->constrained("products")->cascadeOnDelete();
             $table->decimal('price',20 , 4)->nullable();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
