<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vendors extends Model
{
    use HasFactory;

    protected $table = 'vendors';

    protected $fillable = [
        'user_id',
        'name',
        'store_name',
        'store_addres',
        'cover_image',
      
    ];

    protected $casts = [
        'name' => 'string',
        'store_name' => 'string',
        'store_addres' => 'string',
        'cover_image' => 'string',

    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products() 
    {
        return $this->hasMany(Products::class, 'vendor_id');
    }


    
    public function orderItem() 
    {
        return $this->hasMany(OrderItems::class, 'vendor_id');
    }

}
