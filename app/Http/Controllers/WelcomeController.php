<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Whishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WelcomeController extends Controller
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
    $order_by = $request->input('order_by') ?? "created_at";
    $free_shipping = $request->input('free_shipping');

    $query = Products::where('status', 'available')
        ->where('stock', '>', 0)->withCount("reviews")->withCount("orderItem")->withAvg("reviews", "star_rating");


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
            ;
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


    $products = $query->orderBy($order_by, 'asc')
        ->paginate($perPage, ['*'], 'page', $page);
    $productsBestRating = $query->orderBy('reviews_avg_star_rating', 'desc')
        ->paginate($perPage, ['*'], 'page', $page);
        
    $productsFreeShipping = $query->orderBy($order_by, 'asc')->where('free_shipping', true)
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

    $productsFreeShipping->through(function ($item) use ($user) {
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

    $productsBestRating->through(function ($item) use ($user) {
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

    return Inertia::render("home", [
        'status' => true,
        'message' => 'Products retrieved successfully',
        'data' => $products->items() ?? [],
        'dataFreeShipping' => $productsFreeShipping->items() ?? [],
        'dataBestRating' => $productsBestRating->items() ?? [],
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
    public function show(string $id)
    {
        //
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
