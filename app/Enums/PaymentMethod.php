<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case BankTransfer = 'bank_transfer';
    case EWallet = 'e_wallet';
    case CreditCard = 'credit_card';
    case CashOnDelivery = 'cash_on_delivery';
}
