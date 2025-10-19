<?php

namespace App\Enums;

enum RoleEnums: string
{
    case Seller = 'seller';
    case Buyer = 'buyer';

    public static function values(): array
    {
        return array_map(fn (self $s) => $s->value, self::cases());
    }
}
