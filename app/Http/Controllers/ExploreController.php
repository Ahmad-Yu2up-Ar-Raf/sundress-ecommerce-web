<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExploreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index(Request $request)
    {
        $perPage = $request->input('perPage', 12);
        $search = $request->input('search');
        $page = $request->input('page', 1);
        $status = $request->input('status');
        $category = $request->input('category');    

        $free_shipping = $request->input('free_shipping');

        $query = Products::forWebsite();
    $recordProducts = Products::forWebsite()->get();

        if ($search) {
            $query->where(function ($q) use ($search) {
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

   $products = (clone $query)->reorder('created_at','desc')
    ->paginate($perPage, ['*'], 'page', $page);

     $StatusProductsCategoryCount = $recordProducts->groupBy('category')->map(function ($group) {
            return $group->count();
        });
     $totalProducts = $recordProducts->count();



        return Inertia::render('explore/index', [
            'status' => true,
            'message' => 'Products retrieved successfully',
            'data' => $products->items() ?? [],
            'totalProducts' => $totalProducts,
            'ProductscategoryCount' => $StatusProductsCategoryCount,
            'meta' => [
                'filters' => [
                    'search' => $search ?? '',
                    'status' => $status ?? [],
                    'category' => $category ?? [],
                ],
                'pagination' => [
                    'total' => $products->total(),
                    'currentPage' => $products->currentPage(),
                    'perPage' => $products->perPage(),
                    'lastPage' => $products->lastPage(),
                    'hasMore' => $products->currentPage() < $products->lastPage(),
                ],
            ],
        ], 200);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
   public function show(Products $product, Request $request)
    {
        // Load candidates with votes count and barang data

$product =   Products::with('vendor')->forWebsite()->findOrFail($product->id);
   $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);
   

        $query = Products::forWebsite();


   $productSimillar = (clone $query)->reorder('created_at','desc')
    ->paginate($perPage, ['*'], 'page', $page);
   $productByVendor = (clone $query)->where('vendor_id', $product->vendor_id)->reorder('created_at','desc')
    ->paginate($perPage, ['*'], 'page', $page);


  
        return Inertia::render('explore/[id]', [
            'product' => $product,
            'productSimillar' => $productSimillar->items() ?? [],
            'productByVendor' => $productByVendor->items() ?? [],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
