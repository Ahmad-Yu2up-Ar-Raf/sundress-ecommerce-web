<?php

namespace App\Enums;

enum OrderStatus: string
{
     case Pending = 'pending';            // Order created, waiting for payment
    case Paid = 'paid';                  // Payment received
    case Unpaid = 'unpaid';                  // Payment received
    case Processing = 'processing';      // Order is being prepared
    case Shipped = 'shipped';            // Order has been shipped
    case Delivered = 'delivered';        // Order successfully delivered
    case Cancelled = 'cancelled';        // Order cancelled by user/admin
    case Refunded = 'refunded';         
}
