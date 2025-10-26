<?php

namespace App\Models;

use App\Enums\CategoryProductsStatus;
use App\Enums\ProductStatus;
use App\Observers\ProductsObserver;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

#[ObservedBy(ProductsObserver::class)]
class Products extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'vendor_id',
        'name',
        'free_shipping',
        'description',
        'status',
        'stock',
        'cover_image',
        'price',
        'province',
        'country',
        'currency',
        'showcase_images',
        'category',
    ];

    protected $casts = [
        'name' => 'string',
        'cover_image' => 'string',
        'free_shipping' => 'boolean',
        'province' => 'string',
        'country' => 'string',
        'currency' => 'string',
        'description' => 'string',
        'stock' => 'integer',
        'category' => CategoryProductsStatus::class,
        'status' => ProductStatus::class,
        'price' => 'integer',
        'showcase_images' => 'array',
    ];

    /**
     * Virtual attributes that will be appended to toArray()/toJson()
     * Note: is_whislisted depends on Auth/Cookie; this is implemented but
     * consider preloading wishlisted ids to avoid N+1 (see setPreloadedWishlistedIds).
     */
    protected $appends = [
        'formatted_price',
        'cover_image_url',
        'showcase_images_urls',
        'is_whislisted',
    ];

    /**
     * Optional: preload array of wishlisted product IDs for this request,
     * to avoid DB hits when model->toArray() triggers is_whislisted on many models.
     * Usage (example, from service):
     *   Products::setPreloadedWishlistedIds($wishlistedIds);
     */
    protected static ?array $preloadedWishlistedIds = null;

    public static function setPreloadedWishlistedIds(array $ids): void
    {
        self::$preloadedWishlistedIds = array_values(array_unique(array_map('intval', $ids)));
    }

    public static function clearPreloadedWishlistedIds(): void
    {
        self::$preloadedWishlistedIds = null;
    }

    /* ---------- relations ---------- */

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendors::class, 'vendor_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Orders::class, 'product_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Reviews::class, 'product_id');
    }

    // keep the existing spelling if you already used it elsewhere
    public function whishlist(): HasMany
    {
        return $this->hasMany(Whishlist::class, 'product_id');
    }

    public function cartItem(): HasMany
    {
        return $this->hasMany(CartItems::class, 'product_id');
    }

    public function orderItem(): HasMany
    {
        return $this->hasMany(OrderItems::class, 'product_id');
    }

    /* ---------- accessors / helpers ---------- */

public function getFormattedPriceAttribute(): ?string
{
    $priceStr = $this->getAttribute('price');
    if ($priceStr === null) return null;

    $currency = strtoupper($this->getAttribute('currency') ?? 'USD');

    // convert string price into decimal normalized string
    $price = (string)$priceStr;

    if ($currency === 'USD') {
        // USD -> show 2 decimals with $ sign
        // price may be e.g. "12.3456" -> round to 2 decimal for display
        $amount = round((float)$price, 2);
        return '$' . number_format($amount, 2, '.', ',');
    }

    if ($currency === 'IDR') {
        // IDR -> no decimals usually, format thousands
        // price could be "716255.0000" -> cast to int
        $amount = (int) round((float)$price);
        // Rp 716.255
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }

    // default: generic formatting (show up to 4 decimals trimmed)
    $amount = (float)$price;
    return $currency . ' ' . number_format($amount, 4, '.', ',');
}

   public function getCoverImageUrlAttribute(): ?string
{
    $path = $this->getAttribute('cover_image');
    if (empty($path)) return null;
    return filter_var($path, FILTER_VALIDATE_URL) ? $path : url($path);
}

    public function getShowcaseImagesUrlsAttribute(): array
    {
        $arr = $this->attributes['showcase_images'] ?? [];
        if (!is_array($arr)) $arr = [];
        return collect($arr)
            ->map(fn($p) => $p ? url($p) : null)
            ->filter()
            ->values()
            ->toArray();
    }

    /**
     * Dynamic attribute used by $appends: is_whislisted
     * Returns: true (if wishlisted) or null (if not). Matches your prior pattern.
     *
     * IMPORTANT:
     *  - This will query DB if preloaded ids not set and user is logged in AND relation not loaded.
     *  - To avoid N+1, call Products::setPreloadedWishlistedIds([...]) before serializing collections.
     */
    public function getIsWhislistedAttribute(): ?bool
    {
        // If caller preloaded IDs, use that (fast, no DB)
        if (is_array(self::$preloadedWishlistedIds)) {
            return in_array((int)$this->id, self::$preloadedWishlistedIds, true) ? true : null;
        }

        $user = Auth::user();
        if ($user) {
            // if relation already eager loaded, use it
            if ($this->relationLoaded('whishlist')) {
                $found = $this->whishlist->where('user_id', $user->id)->isNotEmpty();
                return $found ? true : null;
            }

            // fallback to query (single exists)
            $exists = Whishlist::where('user_id', $user->id)
                ->where('product_id', $this->id)
                ->exists();

            return $exists ? true : null;
        }

        // guest: read cookie
        $wishlistItems = json_decode(Cookie::get('WhishlistItems', '[]'), true);
        if (!is_array($wishlistItems)) {
            return null;
        }

        // cookie may be associative [id => true] or list [id, id2]
        // check both keys and values
        if (isset($wishlistItems[(string)$this->id]) || isset($wishlistItems[(int)$this->id])) {
            return true;
        }

        foreach ($wishlistItems as $k => $v) {
            if ((string)$v === (string)$this->id || (string)$k === (string)$this->id) {
                return true;
            }
        }

        return null;
    }

    /* legacy helper for other code */
    public function isWishlistedBy(?\App\Models\User $user = null): bool
    {
        $user = $user ?? Auth::user();

        if ($user) {
            // consistent with relation name above
            if ($this->relationLoaded('whishlist')) {
                return $this->whishlist->where('user_id', $user->id)->isNotEmpty();
            }

            return Whishlist::where('user_id', $user->id)
                ->where('product_id', $this->id)
                ->exists();
        }

        $wishlistItems = json_decode(Cookie::get('WhishlistItems', '[]'), true);
        if (!is_array($wishlistItems)) return false;

        if (isset($wishlistItems[(string)$this->id]) || isset($wishlistItems[(int)$this->id])) {
            return true;
        }

        foreach ($wishlistItems as $k => $v) {
            if ((string)$v === (string)$this->id || (string)$k === (string)$this->id) {
                return true;
            }
        }

        return false;
    }

    /* ---------- scopes ---------- */

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ProductStatus::Available->value)->where('stock', '>', 0);
    }

    public function scopeForWebsite(Builder $query): Builder
    {
        return $query->published();
    }

    public function updateRatingStats()
    {
        $this->update([
            'average_rating' => round($this->reviews()->avg('star_rating'), 1),
            'reviews_count' => $this->reviews()->count(),
        ]);
    }
}
