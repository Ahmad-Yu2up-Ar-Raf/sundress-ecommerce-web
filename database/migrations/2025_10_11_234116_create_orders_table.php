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
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(User::class, 'vendor_user_id');
            $table->string('country');
            $table->string('province');
            $table->string('phone');
            $table->string('zipCode');
            $table->string('firstName');
            $table->string('lastName');
  
            $table->string('email');


            $table->decimal('website_commission', 20 , 4)->nullable();
            $table->decimal('online_payment_commission', 20 , 4)->nullable();
            $table->decimal('vendor_subtotal', 20 , 4)->nullable();
            $table->decimal('total_price', 20 , 4);
            $table->string('stripe_session_id')->nullable();
            $table->string('status')->default(OrderStatus::Pending->value);
            $table->string('shipping_method')->default(ShippingMethod::EXPRESS->value);
            $table->longText('address')->nullable();
         
            $table->text('notes')->nullable();
            $table->string('payment_intent')->nullable();
       
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
