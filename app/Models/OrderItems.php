<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItems extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    protected $fillable = [
        'seller_id',
        'order_id',
        'quantity',
        'product_id',
        'sub_total',
     
    ];

    protected $casts = [
        'sub_total' => 'integer',
        'quantity' => 'integer',
   'status' => OrderStatus::class,
    ];

    /**
     * Relasi ke User (buyer)
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
    
    public function order(): BelongsTo
    {
        return $this->belongsTo(Orders::class, 'order_id');
    }
    

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}
