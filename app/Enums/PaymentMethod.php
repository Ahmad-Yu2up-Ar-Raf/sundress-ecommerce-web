<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case BankTransfer = 'bank_transfer';
    case EWallet = 'e_wallet';
    case CreditCard = 'credit_card';
    case CashOnDelivery = 'cash_on_delivery';
     public static function values(): array
    {
        return array_map(fn(self $s) => $s->value, self::cases());
    }
}
