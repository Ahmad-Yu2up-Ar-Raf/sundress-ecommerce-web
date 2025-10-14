<?php

use App\Enums\Courier;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
               $table->foreignId('user_id')->constrained()->onDelete('cascade');
               $table->string('country');
               $table->string('province');
               $table->string('phone');
               $table->string('zipCode');
               $table->string('firstName');
               $table->string('lastName');
               $table->string('nameOfCard')->nullable();
               $table->string('email')->unique();
               $table->string('cardNumber', 4)->nullable(); 
  
    $table->unsignedBigInteger('total_price')->default(0);
    $table->string('status')->default(OrderStatus::Pending->value);
    $table->string('shipping_method')->default(Courier::LOCAL_COURIER->value);
    $table->longText('address')->nullable();
    $table->unsignedTinyInteger('expiryMonth')->nullable(); 
    $table->year('expiryYear')->nullable();
    $table->text('notes')->nullable();
    $table->string('payment_proof')->nullable();
    $table->string('payment_method')->default(PaymentMethod::CashOnDelivery->value);
    $table->timestamp('paid_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
