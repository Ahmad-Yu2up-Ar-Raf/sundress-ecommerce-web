<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\ShippingMethod;
use App\Models\User;
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
          $table->foreignId('user_id')->constrained("users")->onDelete('cascade');
            $table->string('country');
            $table->string('province');
            $table->string('phone');
            $table->string('zipCode');
            $table->string('firstName');
            $table->string('lastName');
            $table->string('nameOfCard')->nullable();
            $table->string('email')->unique();
            $table->string('cardNumber', 4)->nullable();
              $table->json('payment_metadata')->nullable(); // store line items breakdown per seller
    $table->enum('payment_status', ['pending', 'processing', 'succeeded', 'failed', 'refunded'])->default('pending');
    $table->string('idempotency_key')->nullable()->unique(); // prevent duplicate webhooks
            $table->decimal('website_commission', 20 , 4)->nullable();
            $table->decimal('online_payment_commission', 20 , 4)->nullable();
            $table->decimal('vendor_subtotal', 20 , 4)->nullable();
            $table->unsignedBigInteger('total_price')->default(0);
            $table->string('status')->default(OrderStatus::Pending->value);
            $table->string('shipping_method')->default(ShippingMethod::EXPRESS->value);
            $table->longText('address')->nullable();
            $table->unsignedTinyInteger('expiryMonth')->nullable();
            $table->year('expiryYear')->nullable();
            $table->text('notes')->nullable();
   
            $table->string('payment_intent')->nullable();
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
