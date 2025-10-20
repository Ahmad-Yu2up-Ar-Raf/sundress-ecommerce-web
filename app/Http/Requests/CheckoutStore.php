<?php

namespace App\Http\Requests;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\ShippingMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CheckoutStore extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            // Buyer information
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                // ✅ REMOVED unique constraint - allow repeat customers!
            ],
            'phone' => [
                'required',
                'string',
                'max:20', // Add max length
            ],
            'country' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'zipCode' => [
                'required',
                'string',
                'max:10',
            ],
            'address' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',

            // Payment information
            'payment_method' => [
                'required',
                Rule::in(PaymentMethod::values()),
            ],
            'nameOfCard' => 'nullable|string|max:255',
            'cardNumber' => [
                'nullable',
                'string', // Changed from digits:4
                'max:4',
            ],
            'expiryMonth' => 'nullable|integer|min:1|max:12',
            'expiryYear' => 'nullable|integer|min:' . date('Y') . '|max:' . (date('Y') + 20),
            'cvv' => 'nullable|string|max:4', // Add CVV validation

            // ✅ ADD: Frontend sends these from summary
            'subtotal' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'shipping' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:100', // Minimum 100 (IDR or cents)

            // Shipping
            'shipping_method' => [
                'required',
                Rule::in(ShippingMethod::values()),
            ],

            // Optional fields
            'paid_at' => 'nullable|date',
            'status' => [
                'nullable',
                Rule::in(OrderStatus::values()),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Email harus valid.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'zipCode.required' => 'Kode pos wajib diisi.',
            'total_price.min' => 'Total harga minimal Rp100.',
            'payment_method.in' => 'Metode pembayaran tidak valid.',
            'shipping_method.in' => 'Metode pengiriman tidak valid.',
        ];
    }
}