<?php

namespace App\Enums;

enum ProductStatus: string
{
      case Available = 'available';
    case Not_Available = 'not_available';
    case Coming_Soon = 'coming_soon';
}
