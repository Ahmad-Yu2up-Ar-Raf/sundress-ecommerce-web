<?php

namespace App\Enums;

enum ShippingMethod: string
{
    case STANDARD = 'standard';
    case EXPRESS = 'express';
    case OVERNIGHT = 'overnight';
     public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
