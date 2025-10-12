<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Orders extends Model
{
   use HasFactory;

    protected $table = 'orders';
    protected $fillable = [
        'user_id',
        'product_id',
        'address',
        'payment_method',
        'paid_at',
        'quantity',
        'payment_proof',
        'notes',
        'status',
        'total_price',
    ];

    protected $casts = [

        'address' => 'string',
        'paid_at' => 'datetime',
        'notes' => 'string',
        'payment_proof' => 'string',
        'quantity' => 'integer',
        'status' => OrderStatus::class,
        'payment_method' => PaymentMethod::class,
        'total_price' => 'integer',
    ];

    /**
     * Relasi ke User (Admin yang input)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function product(): BelongsTo
    {
       return $this->belongsTo(Products::class , 'product_id');
    }
}
