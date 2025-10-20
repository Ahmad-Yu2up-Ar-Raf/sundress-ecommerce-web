<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Orders extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'country',
        'province',
        'phone',
        'zipCode',
        'firstName',
        'lastName',
        'nameOfCard',
        'email',
        'cardNumber', // last 4 digits
        'total_price',
        'status',
        'shipping_method',
        'address',
        'expiryMonth',
        'expiryYear',
        'notes',

        'payment_method',
        'paid_at',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'total_price' => 'integer', 
        'expiryMonth' => 'integer',
        'expiryYear' => 'integer',
        'phone' => 'string',
        'zipCode' => 'string',
        'status' => OrderStatus::class,
        'payment_method' => PaymentMethod::class,
    ];

    /**
     * Relasi ke User (buyer)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

 
    public function items(): HasMany
    {
        return $this->hasMany(OrderItems::class, 'order_id');
    }
}
