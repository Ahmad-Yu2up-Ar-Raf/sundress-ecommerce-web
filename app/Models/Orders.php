<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Number;

class Orders extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'country',
        'province',
        'phone',
        'stripe_session_id',
        'zipCode',
        'firstName',
        'lastName',
   
        'email',
      
        'total_price',
        'status',
        'vendor_subtotal',
        'vendor_user_id',
        'shipping_method',
        'address',
    
        'notes',
        'website_commission',
        'payment_intent',
        'online_payment_commission',
    
    ];

    protected $casts = [
    
        'total_price' => 'integer', 
        'notes' => 'string',
        'phone' => 'string',
        'zipCode' => 'string',
        'status' => OrderStatus::class,

    ];

    /**
     * Relasi ke User (buyer)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function vendorUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_user_id');
    }
    public function vendor(): BelongsTo
    {

        return $this->belongsTo(Vendors::class, 'vendor_user_id', 'user_id');
    }
    
 
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItems::class, 'order_id');
    }


    
}
