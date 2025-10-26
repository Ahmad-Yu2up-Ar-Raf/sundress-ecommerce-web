<?php

namespace App\Services;

use App\Models\CartItems;
use App\Models\Products;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
class CartService
{


    private ?array $cachedCartItems = null;
    /**
     * Create a new class instance.
     */



    protected const COOKIE_NAME = 'cartItems';


    protected const COOKIE_LIFETIME = 60 * 24 * 365;


// app/Services/CartService.php

public function addItemToCart(Products $product, int $quantity = 1)
{
    // compute safe subtotal (cast to int)
    $subTotal = (int) ($product->price ?? 0) * max(1, $quantity);

    if (Auth::check()) {
        $this->saveItemToDatabase($product->id, $quantity, $subTotal);
    } else {
        $this->saveItemToCookies($product->id, $quantity, $subTotal);
    }
}

public function removeItemFromCart(int $productId )
{
    if(Auth::check()){
        $this->removeItemFromDatabase($productId );
       }else{
        $this->removeItemFromCookies($productId);
       }
}

    public function updateItemQuantity(int $productId , int $quantity = 1 ,  $price)
    {
        if(Auth::check()){
            $this->updateItemQuantityInDatabase($productId, $quantity , $price );
           }else{
            $this->updateItemQuantityInCookies($productId, $quantity , $price );
           }
           
    }
   







    public function getCartItems(): array
    {
        try {
            if ($this->cachedCartItems === null) {
                $cartItemsRaw = Auth::check()
                    ? $this->getCartItemsFromDatabase()
                    : $this->getCartItemsFromCookies();
    
                // pastikan array
                $cartItemsRaw = $cartItemsRaw ?? [];
    
                // ambil semua product_id yang valid
                $productIds = collect($cartItemsRaw)
                    ->pluck('product_id')
                    ->filter()
                    ->unique()
                    ->values()
                    ->all();
    
             $products = Products::whereIn('id', $productIds)
    ->with('vendor')
    ->forWebsite()
    ->get()
    ->keyBy('id');
                $cartItemData = [];
foreach ($cartItemsRaw as $raw) {
    $productId = isset($raw['product_id']) ? (int) $raw['product_id'] : null;
    if (! $productId) continue;

    $productModel = $products->get($productId);
    if (! $productModel) continue;

    // quantity fallback
    $quantity = isset($raw['quantity']) ? max(1, (int)$raw['quantity']) : 1;

    // unit price logic...
    if (isset($raw['price']) && $quantity > 0) {
        $unitPrice = (int) round((int)$raw['price'] / $quantity);
    } else {
        $unitPrice = (int) $productModel->price;
    }

    $subTotal = (int) ($unitPrice * $quantity);

    $cartItemData[] = [
        'id' => $raw['id'] ?? (string) Str::uuid(),
        'product_id' => $productModel->id,
        'quantity' => $quantity,
        'unit_price' => $unitPrice,
        'price' => $subTotal,
        'product' => $productModel->toArray(), // sudah termasuk price_formatted, cover_image_url, showcase_images_url
        'vendor' => $productModel->vendor ? $productModel->vendor->toArray() : null,
    ];
}

    
                $this->cachedCartItems = $cartItemData;
            }
    
            return $this->cachedCartItems;
        } catch (\Throwable $e) {
            // jangan swallow — log & rethrow (atau return empty array tergantung kebijakan)
            Log::error('CartService::getCartItems error: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }

    public function getTotalQuantity(): int
    {
        $totalQuantity = 0;
        foreach($this->getCartItems() as $item){
            $totalQuantity += $item["quantity"];
        }
        return $totalQuantity;
    }





    
    public function getTotalPrice(): float
    {
        $total = 0;

        foreach ($this->getCartItems() as $item) {
            $total += $item["quantity"] * $item['price'];
        }
        return $total;
    }



    public function updateItemQuantityInDatabase(int $productId , int $quantity = 1 , int $price): void
    {
        $userId = Auth::id();
        $cartItem = CartItems::where('user_id', $userId)->where('product_id', $productId)->first();

        if($cartItem){
            $cartItem->update([
                'quantity' => $quantity,
                'price' => $price,
            ]);
        }

        
    }
    public function updateItemQuantityInCookies(int $productId , int $quantity = 1 , int $price): void
    {
        $cartItem = $this->getCartItemsFromCookies();
        $itemKey = $productId;


        if(isset($cartItem[$itemKey])){
            $cartItem[$itemKey]['quantity'] = $quantity;
            $cartItem[$itemKey]['price'] = $price;
            
        }

        Cookie::queue(self::COOKIE_NAME, json_encode($cartItem), self::COOKIE_LIFETIME);
    }



    public function saveItemToDatabase(int $productId, int $quantity = 1, int $subTotal): void
    {
        $userId = Auth::id();
        
        $cartItem = CartItems::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            // ✅ Item sudah ada - increment quantity
            $product = Products::find($productId);
            
            if ($product) {
                $newQuantity = $cartItem->quantity + $quantity;
                $newSubTotal = (int)($product->price * $newQuantity);
                
                // ✅ PENTING: Update quantity dan price sekaligus
                $cartItem->update([
                    'quantity' => $newQuantity,
                    'price' => $newSubTotal,
                ]);
                
                Log::info('Cart item updated', [
                    'cart_item_id' => $cartItem->id,
                    'product_id' => $productId,
                    'old_quantity' => $cartItem->quantity - $quantity,
                    'new_quantity' => $newQuantity,
                    'new_price' => $newSubTotal
                ]);
            }
        } else {
            // ✅ Item baru - create
            CartItems::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $subTotal,
            ]);
            
            Log::info('Cart item created', [
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $subTotal
            ]);
        }
    }

    public function saveItemToCookies(int $productId , int $quantity = 1 ,  int $price): void
    {



        $cartItems =  $this->getCartItemsFromCookies();
  
        $itemKey = $productId;

        if(isset($cartItems[$itemKey])){
            $cartItems[$itemKey]['quantity'] += $quantity;
            $cartItems[$itemKey]['price'] = $price;
        }else{
            $cartItems[$itemKey] = [
                'id' => Str::uuid(),
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,

            ];
        }

        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    public function removeItemFromDatabase(int $productId , int $quantity = 1): void
    {
        $userId = Auth::id();
         CartItems::where('user_id', $userId)->where('product_id', $productId)->delete();
    }



    public function removeItemFromCookies(int $productId , int $quantity = 1): void
    {
        $cartItems = $this->getCartItemsFromCookies();


        $cartKey = $productId;

        unset($cartItems[$cartKey]);

        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }


    public function getCartItemsFromDatabase() : array
    {
        $userId = Auth::id();
        $cartItems = CartItems::where('user_id', $userId)->orderBy('created_at', 'desc') ->get()->map(function ($cartItem) {
            return [
                'id' => $cartItem->id,
                'product_id' => $cartItem->product_id,
                'quantity'=> $cartItem->quantity,
                'price' => $cartItem->price,
            ];
        })->toArray();


        return $cartItems;
    }
    public function getCartItemsFromCookies(): array
    {
        $cartItems = json_decode(Cookie::get(self::COOKIE_NAME, '[]') , true);

        return $cartItems;
    }


    public function getCartItemsGrouped(): array
    {
        $cartItems = $this->getCartItems();
    
        $collection = collect($cartItems)
            // pastikan hanya items yang punya vendor id valid
            ->filter(fn($item) => ! empty(data_get($item, 'vendor.id')));
    
        $grouped = $collection->groupBy(fn($item) => (int) data_get($item, 'vendor.id'));
    
        $result = $grouped->map(function ($items, $vendorId) {
            // ambil vendor dari first item (vendor sudah array)
            $vendor = $items->first()['vendor'] ?? null;
    
            // items disiapkan: gunakan only fields yang dibutuhkan (hindari embedding full model jika besar)
            $itemsArr = $items->map(function ($i) {
                return [
                    'id' => $i['id'],
                    'product_id' => $i['product_id'],
                    'quantity' => $i['quantity'],
                    'unit_price' => $i['unit_price'],
                    'price' => $i['price'],
                    'product' => $i['product'],
                ];
            })->values()->toArray();
    
            return [
                'vendor_id' => $vendorId,
                'vendor' => $vendor,
                'items' => $itemsArr,
                'total_quantity' => (int) $items->sum('quantity'),
                // total_price: jumlahkan price (karena price = unit_price * quantity)
                'total_price' => (int) $items->sum(fn($it) => $it['price']),
            ];
        })->values()->toArray();
    
        return $result;
    }
    


    public function moveCartItemsToDatabase($userId): void
    {
        $cartItems = $this->getCartItemsFromCookies();

        foreach($cartItems as $itemKey => $cartItem){
            $existingItem = CartItems::where('user_id', $userId)
            ->where('product_id', $cartItem['product_id'])->first();


            if ($existingItem) {
                $existingItem->update([
                    'quantity' => $existingItem->quantity + $cartItem['quantity'],
                    'price' => $cartItem['price'],
                ]);
            }else{
                CartItems::create([
                    'user_id' => $userId,
                    'product_id' => $cartItem['product_id'],
                    'quantity' => $cartItem['quantity'],
                    'price' => $cartItem['price'],
                ]);
            }
        }

        Cookie::queue(self::COOKIE_NAME, '', -1);
    }
}

