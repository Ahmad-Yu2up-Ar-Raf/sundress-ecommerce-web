<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrdersController extends Controller
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


    $query = Orders::where('user_id', Auth::id())->with("items.product")->withCount("items");


    if ($search) {
        $query->where(function($q) use ($search) {
            $searchLower = strtolower($search);
            $q->whereRaw('LOWER(id) LIKE ?', ["%{$searchLower}%"]);
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



    $orders = $query->orderBy('created_at', 'asc')
        ->paginate($perPage, ['*'], 'page', $page);



    return Inertia::render('dashboard/orders',[
        'status' => true,
        'message' => 'Orders retrieved successfully',
        'data' => $orders->items() ?? [],
        'meta' => [
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? [],
            ],
            'pagination' => [
                'total' => $orders->total(),
                'currentPage' => $orders->currentPage(),
                'perPage' => $orders->perPage(),
                'lastPage' => $orders->lastPage(),
                'hasMore' => $orders->currentPage() < $orders->lastPage(),
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
    public function show(Orders $orders)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Orders $orders)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Orders $orders)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Orders $orders)
    {
        //
    }
}
