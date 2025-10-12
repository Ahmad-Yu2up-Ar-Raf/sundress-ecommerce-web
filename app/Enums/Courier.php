<?php

namespace App\Enums;

enum Courier: string
{
    case JNE = 'jne';
    case JNT = 'jnt';
    case SICEPAT = 'sicepat';
    case TIKI = 'tiki';
    case POS_INDONESIA = 'pos_indonesia';
    case NINJAVAN = 'ninjavan';
    case SHOPEE_EXPRESS = 'shopee_express';
    case LION_PARCEL = 'lion_parcel';
    case DHL = 'dhl';
    case FEDEX = 'fedex';
    case UPS = 'ups';
    case LOCAL_COURIER = 'local_courier'; 
    case PICKUP = 'pickup';
    case OTHER = 'other'; 
}
