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
        'seller_id',
        'order_id',
        'quantity',
        'seller_amount',
        'platform_commission',
        'product_id',
        'sub_total',
     
        'status',
    ];

    protected $casts = [
        'sub_total' => 'integer',
        'quantity' => 'integer',
        'status' => OrderItem::class,
    ];

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

    protected static function booted()
    {
        static::updated(function (OrderItems $item) {
            // normalisasi nilai status baru menjadi string lowercase
            $newStatus = $item->status;
            // jika enum (BackedEnum), ambil value; kalau string tetap pakai string
            if (is_object($newStatus) && isset($newStatus->value)) {
                $newStatusVal = (string) $newStatus->value;
            } else {
                $newStatusVal = (string) $newStatus;
            }
            $newStatusNorm = strtolower($newStatusVal);

            // toleransi beberapa variasi nama ('approve' / 'approved')
            $isApproved = in_array($newStatusNorm, ['approve', 'approved']);

            // hanya lanjut jika field status berubah ke approved
            if (! $item->wasChanged('status') || ! $isApproved) {
                return;
            }

            // lakukan pengecekan dan update dalam transaction untuk mencegah race
            DB::transaction(function () use ($item) {
                // lock order row supaya tidak ada race saat banyak seller approve bersamaan
                $order = $item->order()->lockForUpdate()->first();
                if (! $order) {
                    return;
                }

                // ambil collection item (dalam memori) untuk memudahkan normalisasi cast enum
                $items = $order->items()->get();

                if ($items->isEmpty()) {
                    return;
                }

                // hitung yang sudah approved (normalisasi mirip di atas)
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
                    // ambil status order saat ini (normalisasi)
                    $current = $order->status;
                    $currentVal = is_object($current) && isset($current->value) ? (string) $current->value : (string) $current;
                    $currentNorm = strtolower($currentVal);

                    // jangan turunkan jika status sudah lebih maju
                    $higherStatuses = ['processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
                    if (! in_array($currentNorm, $higherStatuses)) {
                        $order->status = OrderStatus::Processing; // cast ke enum, Orders model sudah punya casting
                        $order->save();
                    }
                }
            });
        });
    }
}
