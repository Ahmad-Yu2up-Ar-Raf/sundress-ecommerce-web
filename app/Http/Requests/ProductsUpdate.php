<?php

namespace App\Http\Requests;

use App\Enums\CategoryProductsStatus;
use App\Enums\ProductStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProductsUpdate extends FormRequest
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
          $productId = $this->route('product')->id ?? $this->route('products')->id;

        return [
            'name' => 'required|unique:products,name,' . $productId . ' |max:255|string',
             
         
            'stock' => 'required|numeric|min:0|max:9999999999999.99',
            'free_shipping' => 'nullable|boolean',
            'price' => 'nullable|numeric|min:0|max:9999999999999.99',
            'description' => 'nullable|string|max:1000',
            'city' => 'nullable|string|max:1000',
            'currency' => 'nullable|string|max:1000',
            'country' => 'nullable|string|max:1000',
            'category' => [
                'nullable',
            Rule::in(CategoryProductsStatus::values())
            
            ],
            'status' => [
                'nullable',
            Rule::in(ProductStatus::values())
            
            ],
            'cover_image' => 'required|max:2048',
            // Validasi untuk struktur showcase_images yang kompleks dengan base64
            'showcase_images' => 'nullable|array|min:1|max:10',
            'showcase_images.*.file' => 'nullable|array',
            'showcase_images.*.file.name' => 'nullable|string|max:255',
            'showcase_images.*.file.size' => [
                'nullable',
                'numeric',
                'max:10485760',
            ],
            'showcase_images.*.file.type' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    $allowedTypes = [
                        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
                        'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'
                    ];
                    
                    if (!in_array($value, $allowedTypes)) {
                        $fail('File harus berupa gambar (jpeg, jpg, png, gif, webp) atau video (mp4, avi, mov, wmv, flv, webm).');
                    }
                },
            ],
            'showcase_images.*.id' => 'nullable|string',
            'showcase_images.*.preview' => 'nullable|string',
          
            'showcase_images.*.base64Data' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    // Validasi format base64
                    if (!preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $value)) {
                        $fail('Invalid base64 data format.');
                    }
                    
                    // Cek apakah bisa di-decode
                    $decoded = base64_decode($value, true);
                    if ($decoded === false) {
                        $fail('Invalid base64 data.');
                    }
                },
            ],
        ];
    }

}
