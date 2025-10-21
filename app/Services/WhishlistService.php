<?php

namespace App\Services;
use Illuminate\Support\Str;
use App\Models\Products;
use App\Models\Whishlist;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;

class WhishlistService
{

    private ?array $cachedWhishlist = null;
    /**
     * Create a new class instance.
     */



    protected const COOKIE_NAME = 'WhishlistItems';


    protected const COOKIE_LIFETIME = 60 * 24 * 365;
    /**
     * Create a new class instance.
     */
    public function addItemToWhishlist (Products $product)
    {
    
    
        if (Auth::check()) {
            $this->saveItemToDatabase($product->id);
        } else {
            $this->saveItemToCookies($product->id);
        }
    }
    
    public function removeItemFromWhishlist (int $productId )
    {
        if(Auth::check()){
            $this->removeItemFromDatabase($productId );
           }else{
            $this->removeItemFromCookies($productId);
           }
    }
    
    public function getWhishlistFromDatabase() : array
    {
        $userId = Auth::id();
        $WhishlistItems = Whishlist::where('user_id', $userId)->orderBy('created_at', 'desc') ->get()->map(function ($whishlistItem) {
            return [
                'id' => $whishlistItem->id,
                'product_id' => $whishlistItem->product_id,
           
            ];
        })->toArray();


        return $WhishlistItems;
    }
    public function getWhishlistFromCookies(): array
    {
        $WhishlistItems = json_decode(Cookie::get(self::COOKIE_NAME, '[]') , true);

        return $WhishlistItems;
    }


    public function saveItemToDatabase(int $productId, ): void
    {
        $userId = Auth::id();
        
        $whishlistItem = Whishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($whishlistItem) {
            $product = Products::find($productId);
            
            if ($product) {
                
                // ✅ PENTING: Update quantity dan sub_total sekaligus
                $whishlistItem->delete();
                
                Log::info('Whishlist Item removed', [
                    'whishlist_id' => $whishlistItem->id,
                    'product_id' => $productId,
                 
                ]);
            }
        } else {
            // ✅ Item baru - create
            Whishlist::create([
                'user_id' => $userId,
                'product_id' => $productId,
            ]);
            
            Log::info('Whishlist Item created', [
                'product_id' => $productId,
            ]);
        }
    }

    public function saveItemToCookies(int $productId ): void
    {



        $WhishlistItems =  $this->getWhishlistFromCookies();
  
        $itemKey = $productId;

        if(isset($WhishlistItems[$itemKey])){
            unset($whishlistItems[$itemKey]);
        }else{
            $WhishlistItems[$itemKey] = [
                'id' => Str::uuid(),
                'product_id' => $productId,
             

            ];
        }

        Cookie::queue(self::COOKIE_NAME, json_encode($WhishlistItems), self::COOKIE_LIFETIME);
    }

    public function removeItemFromDatabase(int $productId): void
    {
        $userId = Auth::id();
         Whishlist::where('user_id', $userId)->where('product_id', $productId)->delete();
    }



    public function removeItemFromCookies(int $productId ): void
    {
        $whishlistItems = $this->getWhishlistFromCookies();


        $whishlistKey = $productId;

        unset($whishlistItems[$whishlistKey]);

        Cookie::queue(self::COOKIE_NAME, json_encode($whishlistItems), self::COOKIE_LIFETIME);
    }

    public function getWhishlist(): array
    {
        try {
            if ($this->cachedWhishlist === null) {
                $WhishlistItemsRaw = Auth::check()
                    ? $this->getWhishlistFromDatabase()
                    : $this->getWhishlistFromCookies();
    
                // pastikan array
                $WhishlistItemsRaw = $WhishlistItemsRaw ?? [];
    
                // ambil semua product_id yang valid
                $productIds = collect($WhishlistItemsRaw)
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
    
                $whishlistItemData = [];
    
                foreach ($WhishlistItemsRaw as $raw) {
                    // raw mungkin associative array from cookies or DB record with keys
                    $productId = isset($raw['product_id']) ? (int) $raw['product_id'] : null;
                    if (! $productId) continue;
    
                    $productModel = $products->get($productId);
                    if (! $productModel) continue; // produk sudah tidak ada / tidak published
    


    
                    $whishlistItemData[] = [
                        'id' => $raw['id'] ?? (string) Str::uuid(),
                        'product_id' => $productModel->id,
                        'product' => $productModel->toArray(),
                        'vendor' => $productModel->vendor ? $productModel->vendor->toArray() : null,
                    ];
                }
    
                $this->cachedWhishlist = $whishlistItemData;
            }
    
            return $this->cachedWhishlist;
        } catch (\Throwable $e) {
            // jangan swallow — log & rethrow (atau return empty array tergantung kebijakan)
            Log::error('Whishlist Service::getWhishlist error: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return [];
        }
    }



    public function moveWhishlistToDatabase($userId): void
    {
        $whishlistItems = $this->getWhishlistFromCookies();

        foreach($whishlistItems as $itemKey => $whishlistItem){
            $existingItem = Whishlist::where('user_id', $userId)
            ->where('product_id', $whishlistItem['product_id'])->first();


            if (!$existingItem) {
                Whishlist::create([
                    'user_id' => $userId,
                    'product_id' => $whishlistItem['product_id'],
                ]);
            }
        }

        Cookie::queue(self::COOKIE_NAME, '', -1);
    }
}
