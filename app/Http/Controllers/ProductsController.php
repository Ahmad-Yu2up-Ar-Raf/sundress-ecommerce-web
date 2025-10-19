<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductsStore;
use App\Http\Requests\ProductsUpdate;
use App\Models\Products;
use App\Models\Whishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $request)
{
    $perPage = $request->input('perPage', 10);
    $search = $request->input('search');
    $page = $request->input('page', 1);
    $status = $request->input('status');
    $category = $request->input('category');

    $free_shipping = $request->input('free_shipping');

    $query = Products::where('user_id', Auth::id())->withCount("reviews")->withCount("orderItem")->withAvg("reviews", "star_rating");


    $user = Auth::user();
  


    if ($search) {
        $query->where(function($q) use ($search) {
            $searchLower = strtolower($search);
            $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"])
              ->orWhereRaw('LOWER(description) LIKE ?', ["%{$searchLower}%"]);
        });
    }

 
    if ($status) {
        if (is_array($status)) {
            $query->whereIn('status', $status);
        } elseif (is_string($status)) {
            $statusArray = explode(',', $status);
            $query->whereIn('status', $statusArray);
        }
    }
    if ($free_shipping) {
      if (is_array($free_shipping)) {
            $query->whereIn('free_shipping', $free_shipping);
        } elseif (is_string($free_shipping)) {
            $free_shippingArray = explode(',', $free_shipping);
            $query->whereIn('free_shipping', $free_shippingArray);
        }
      
    }
    if ($category) {
        if (is_array($category)) {
            $query->whereIn('category', $category);
        } elseif (is_string($category)) {
            $categoryArray = explode(',', $category);
            $query->whereIn('category', $categoryArray);
        }
    }


    $products = $query->orderBy('created_at', 'asc')
        ->paginate($perPage, ['*'], 'page', $page);


    $products->through(function ($item) use ($user) {
        $isWishlisted = false;

        if ($user) {
            $isWishlisted = Whishlist::where('user_id', $user->id)
                ->where('product_id', $item->id)
                ->exists();
        }

        return [
            ...$item->toArray(),
            'cover_image' => $item->cover_image ? url($item->cover_image) : null,
          
            'is_whislisted' => $isWishlisted ? $isWishlisted : null,
        ];
    });
    return Inertia::render('seller/products',[
        'status' => true,
        'message' => 'Products retrieved successfully',
        'data' => $products->items() ?? [],
        'meta' => [
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? [],
            ],
            'pagination' => [
                'total' => $products->total(),
                'currentPage' => $products->currentPage(),
                'perPage' => $products->perPage(),
                'lastPage' => $products->lastPage(),
                'hasMore' => $products->currentPage() < $products->lastPage(),
            ],
        ],
    ]);

}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductsStore $request)
    {
        try {

            
                    $productPath = null;
    if (request()->hasFile('cover_image')) {
            $file = request()->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('product/', $filename, 'public');
            $productPath = 'storage/' . $path;
        }
      
            $product = Products::create([
                ...$request->validated(),
                'user_id' => Auth::id(),
                    'cover_image' => $productPath,
            ]);

            $fileCount = count($product->showcase_images ?? []);
            $message = $fileCount > 0 
                ? "Product berhasil ditambahkan dengan {$fileCount} file."
                : "Product berhasil ditambahkan.";

            return redirect()->route('seller.products.index')
                ->with('success', $message);

        } catch (\Exception $e) {
            Log::error('Product creation error: ' . $e->getMessage());
            
            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Products $products)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Products $products)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductsUpdate $request, Products $product)
    {
        try {
            DB::beginTransaction();

            $validatedData = $request->validated();

            // Handle cover image update
            if (request()->hasFile('cover_image')) {
                // Delete old cover image if exists
                if ($product->cover_image && Storage::disk('public')->exists(str_replace('storage/', '', $product->cover_image))) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $product->cover_image));
                }

                $file = request()->file('cover_image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('product/', $filename, 'public');
                $validatedData['cover_image'] = 'storage/' . $path;
            }

            // Update product data (showcase_images will be handled by observer)
            $product->update($validatedData);

            DB::commit();
     
     return redirect()->route('seller.products.index')
                ->with('success');

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Product update error: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Failed to update product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        
        $ids = $request->input('ids');
        if (empty($ids)) {
            return redirect()->route('seller.products.index')
                ->with('error', 'Tidak ada product yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $products = Products::whereIn('id', $ids)->where('user_id', Auth::id())->get();
        if ($products->count() !== count($ids)) {
            return redirect()->route('seller.products.index')
                ->with('error', 'Unauthorized access atau product tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
            // SOLUSI: Delete satu per satu agar Observer terpicu
            foreach ($products as $product) {
                if ($product->cover_image && Storage::disk('public')->exists(str_replace('storage/', '', $product->cover_image))) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $product->cover_image));
                }
        
                $product->delete(); // Ini akan trigger observer products
            }
            
            DB::commit();

            $deletedCount = $products->count();
            return redirect()->route('seller.products.index')
                ->with('success', "{$deletedCount} Products berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Products deletion error: ' . $e->getMessage());
            return redirect()->route('seller.products.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }



    
    public function statusUpdate(Request $request)
    {
        
        $ids = $request->input('ids');
        $value = $request->input('value');
        $colum = $request->input('colum');

        if (empty($ids)) {
            return redirect()->route('seller.products.index')
                ->with('error', 'Tidak ada product yang dipilih untuk dihapus.');
        }

        // Validasi apakah semua ID milik user yang sedang login
        $products = Products::whereIn('id', $ids)->where('user_id', Auth::id())->get();
        if ($products->count() !== count($ids)) {
            return redirect()->route('seller.products.index')
                ->with('error', 'Unauthorized access atau product tidak ditemukan.');
        }

        try {
            DB::beginTransaction();
              
             foreach ($products as $product) {
                $product->update([$colum => $value]);
            }

   

            
            
            DB::commit();
            

            $deletedCount = $products->count();
            return redirect()->route('seller.products.index')
                ->with('success', "{$deletedCount} Products berhasil dihapus beserta semua file terkait.");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Products deletion error: ' . $e->getMessage());
            return redirect()->route('seller.products.index')
                ->with('error', 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage());
        }
    }
}
