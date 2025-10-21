<?php

namespace App\Http\Controllers;

use App\Models\OrderItems;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderItemsController extends Controller
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


    $query = OrderItems::where('vendor_id', Auth::id())->with("product");


    if ($search) {
        $query->where(function($q) use ($search) {
            $searchLower = strtolower($search);
            $q->whereRaw('LOWER(id) LIKE ?', ["%{$searchLower}%"])
              ->orWhereRaw('LOWER(order_id) LIKE ?', ["%{$searchLower}%"]);
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
 
  

    $ordersItems = $query->orderBy('created_at', 'asc')
        ->paginate($perPage, ['*'], 'page', $page);


 
    return Inertia::render('seller/orders',[
        'status' => true,
        'message' => 'Products retrieved successfully',
        'data' => $ordersItems->items() ?? [],
        'meta' => [
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? [],
            ],
            'pagination' => [
                'total' => $ordersItems->total(),
                'currentPage' => $ordersItems->currentPage(),
                'perPage' => $ordersItems->perPage(),
                'lastPage' => $ordersItems->lastPage(),
                'hasMore' => $ordersItems->currentPage() < $ordersItems->lastPage(),
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderItems $orderItems)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OrderItems $orderItems)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OrderItems $orderItems)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderItems $orderItems)
    {
        //
    }
}
