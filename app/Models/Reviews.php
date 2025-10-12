<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reviews extends Model
{
    use HasFactory;

    protected $table = 'reviews';
    protected $fillable = [
        'user_id',
        'product_id',
         'comments',
         'star_rating',
         'media'
    ];

    protected $casts = [
    'comments' => 'string',
         'star_rating' => 'integer',
        'media' => 'array'
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
