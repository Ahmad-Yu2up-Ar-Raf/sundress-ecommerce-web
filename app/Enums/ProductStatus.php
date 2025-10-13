<?php

namespace App\Enums;

enum ProductStatus: string
{
      case Available = 'available';
    case Not_Available = 'not_available';
    case Coming_Soon = 'coming_soon';
    public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
