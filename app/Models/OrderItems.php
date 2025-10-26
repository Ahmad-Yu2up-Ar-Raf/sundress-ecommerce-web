<?php

namespace App\Models;

use App\Enums\OrderItem;
use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class OrderItems extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    protected $fillable = [
        'vendor_id',
        'order_id',
        'quantity',
        'seller_amount',
        'platform_commission',
        'product_id',
        'price',
        'status',
    ];

    protected $casts = [
        'price' => 'integer',
        'quantity' => 'integer',
        'status' => OrderItem::class,
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Orders::class, 'order_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    protected static function booted()
    {
        static::updated(function (OrderItems $item) {
            // normalisasi nilai status baru menjadi string lowercase
            $newStatus = $item->status;
            if (is_object($newStatus) && isset($newStatus->value)) {
                $newStatusVal = (string) $newStatus->value;
            } else {
                $newStatusVal = (string) $newStatus;
            }
            $newStatusNorm = strtolower($newStatusVal);
    
            $isApproved = in_array($newStatusNorm, ['approve', 'approved']);
    
            // hanya lanjut jika field status berubah ke approved
            if (! $item->wasChanged('status') || ! $isApproved) {
                return;
            }
    
            DB::transaction(function () use ($item) {
                // lock order row supaya tidak ada race saat banyak seller approve bersamaan
                $order = $item->order()->lockForUpdate()->first();
                if (! $order) {
                    return;
                }
    
                $items = $order->items()->get();
    
                if ($items->isEmpty()) {
                    return;
                }
    
                // hitung yang sudah approved
                $approvedCount = $items->filter(function ($it) {
                    $s = $it->status;
                    if (is_object($s) && isset($s->value)) {
                        $sv = (string) $s->value;
                    } else {
                        $sv = (string) $s;
                    }
                    return in_array(strtolower($sv), ['approve', 'approved']);
                })->count();
    
                $totalCount = $items->count();
    
                // jika semua items sudah approved => set order ke Processing
                if ($approvedCount === $totalCount) {
                    $current = $order->status;
                    $currentVal = is_object($current) && isset($current->value) ? (string) $current->value : (string) $current;
                    $currentNorm = strtolower($currentVal);
    
                    $higherStatuses = ['processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
                    if (! in_array($currentNorm, $higherStatuses)) {
                        // PENTING: Gunakan updateQuietly agar tidak trigger observer lagi
                        $order->updateQuietly([
                            'status' => OrderStatus::Processing
                        ]);
                    }
                }
            });
        });
    
        // TAMBAHKAN: Pastikan vendor_id tidak pernah null saat updating
        static::updating(function (OrderItems $item) {
            if (empty($item->vendor_id) && !$item->isDirty('vendor_id')) {
                // Jika vendor_id null dan tidak sedang diubah, ambil dari original
                $item->vendor_id = $item->getOriginal('vendor_id');
            }
            
            // Jika masih null, ambil dari product
            if (empty($item->vendor_id) && $item->product) {
                $item->vendor_id = $item->product->vendor_id;
            }
        });
    }
}
