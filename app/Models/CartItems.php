<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class CartItems extends Model
{
    use HasFactory;

    protected $table = 'cart_items';

    protected $fillable = [
        'user_id',
        'quantity',
        'product_id',
        'sub_total',
     
    ];

    protected $casts = [
        'sub_total' => 'integer',
        'quantity' => 'integer',
   
    ];

    /**
     * Relasi ke User (buyer)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}