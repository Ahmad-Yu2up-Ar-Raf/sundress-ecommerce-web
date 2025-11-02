<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderViewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'total_price' => $this->total_price,
            'created_at' => $this->created_at,
            'address' => $this->address,
            'status' => $this->status,
            "shipping_method" =>  $this->shipping_method,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'vendorUser' => new VendorUserResource($this->vendorUser),
            'orderItems' => $this->orderItems->map(fn($item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'description' => $item->product->description,
                    'showcase_images' => $item->product->showcase_images,
                ],
            ]),
        ];
    }
}
