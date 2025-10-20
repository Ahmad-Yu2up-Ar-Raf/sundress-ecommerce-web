<?php

namespace App\Enums;

enum OrderItem : string
{
  case Pending = 'pending';            // Order created, waiting for payment
  case Approved = 'approved';            // Order created, waiting for payment
    case Cancelled = 'cancelled';                  // Payment received

    
     public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
