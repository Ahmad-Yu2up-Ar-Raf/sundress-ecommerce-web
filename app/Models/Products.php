<?php

namespace App\Models;

use App\Enums\CategoryProductsStatus;
use App\Enums\ProductStatus;
use App\Observers\ProductsObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
#[ObservedBy(ProductsObserver::class)]
class Products extends Model
{
     use HasFactory;

    protected $table = 'products';
    protected $fillable = [
        'user_id',
        'name',
        'free_shipping',
        'description',
        'status',
        'stock',
        'cover_image',
      
        'price',
        'city',
        'country',
        'currency',
        'showcase_images',
        'category'
    ];

    protected $casts = [
        'name' => 'string',
        'cover_image' => 'string',
        
        'free_shipping' => 'boolean',
        'city' => 'string',
        'country' => 'string',
        'currency' => 'string',
        'description' => 'string',
        'stock' => 'integer',
        'category' => CategoryProductsStatus::class  ,
        'status' => ProductStatus::class  ,
        'price' => 'integer',      
        'showcase_images' => 'array'
    ];

   
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
     
    public function orders(): HasMany
    {
       return $this->hasMany(Orders::class, 'product_id');
    }
    
    public function reviews(): HasMany
    {
       return $this->hasMany(Reviews::class, 'product_id');
    }

    public function whistlist(): HasMany
    {
       return $this->hasMany(Whishlist::class, 'product_id');
    }

    public function getPriceFormattedAttribute()
    {
        if ($this->currency === 'IDR') {
            return number_format($this->price, 0, ',', '.');
        }
    }

    public function updateRatingStats()
    {
        $this->update([
            'average_rating' => round($this->reviews()->avg('star_rating'), 1),
            'reviews_count' => $this->reviews()->count(),
        ]);
    }
}
