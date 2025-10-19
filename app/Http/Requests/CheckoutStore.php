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
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
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
                // perhatikan: unique di orders mungkin tidak cocok untuk repeat buyer
                // gunakan Rule::unique hanya jika kamu mau 1 email = 1 order saja
                Rule::unique('orders', 'email'),
            ],
            'phone' => [
                'required',
                'string'
            ],
            'country' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'zipCode' => [
                'required',
                'string',
             
            ],
            'address' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',

            // Payment information
            'payment_method' => [
                'required',
                Rule::in(PaymentMethod::values()),
            ],
            'payment_intent' => 'nullable|string|max:255',
            'nameOfCard' => 'nullable|string|max:255',
            'cardNumber' => [
                'nullable',
                'digits:4',
                'regex:/^[0-9]{4}$/',
            ],
            'expiryMonth' => 'nullable|integer|max:12',
            'expiryYear' => 'nullable|integer|min:' . date('Y') . '|max:' . (date('Y') + 20),

            // Order + pricing
            'total_price' => 'required|numeric|min:1000|max:9999999999999.99',
            'website_commission' => 'nullable|numeric|min:0|max:1000000000',
            'online_payment_commission' => 'nullable|numeric|min:0|max:1000000000',
            'vendor_subtotal' => 'nullable|numeric|min:0|max:1000000000',

            // Shipping
            'shipping_method' => [
                'required',
                Rule::in(ShippingMethod::values()),
            ],

            // Optional timestamps
            'paid_at' => 'nullable|date',

            // Order status
            'status' => [
                'nullable',
                Rule::in(OrderStatus::values()),
            ],

        
        ];
    }

    /**
     * Custom messages (opsional)
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'Email ini sudah digunakan dalam pesanan lain.',
            'phone.regex' => 'Nomor telepon harus dalam format yang valid',
            'zipCode.regex' => 'Kode pos harus terdiri dari 4–10 digit angka.',
            'total_price.min' => 'Total harga minimal Rp1.000.',
            'payment_method.in' => 'Metode pembayaran tidak valid.',
            'shipping_method.in' => 'Metode pengiriman tidak valid.',
        ];
    }
}
