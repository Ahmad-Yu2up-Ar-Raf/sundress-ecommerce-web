<?php

namespace App\Http\Controllers;

use App\Models\OrderItems;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SellerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recordProducts = Products::all()->where('user_id', Auth::id());

        $queryProductsIds = $recordProducts->pluck('id')->toArray();
        $recordOrders = OrderItems::all()->whereIn('product_id', $queryProductsIds);

        // Ambil semua produk milik user
        $queryProductsIds = Products::where('user_id', Auth::id())->pluck('id');

        // Hitung jumlah product yang dibuat per tanggal (sudah ada)

        $ordersCounts = OrderItems::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as orders'),
            DB::raw('sum(sub_total) as revenue')
        )
            ->whereIn('product_id', $queryProductsIds)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('date');

        // Top 5 produk best seller
        $topProducts = Products::where('user_id', Auth::id())
            ->select('name')
            ->withCount('orderItem')
            ->orderByDesc('order_item_count')
            ->take(5)
            ->get();

        // Gabungkan semua tanggal yang ada
        $allDates = collect($ordersCounts->keys())
            ->unique()
            ->sort();

        // Map data menjadi format chart
        $counts = $allDates->map(function ($date) use ($ordersCounts) {
            return [
                'date' => $date,

                'orders' => $ordersCounts->get($date)->orders ?? 0,
                'revenue' => $ordersCounts->get($date)->revenue ?? 0,
            ];
        })->values();

        $statusCount = $recordProducts->groupBy('status')->map(function ($group) {
            return $group->count();
        });
        $StatusOrdersCount = $recordOrders->groupBy('status')->map(function ($group) {
            return $group->count();
        });
        $StatusProductsCategoryCount = $recordProducts->groupBy('category')->map(function ($group) {
            return $group->count();
        });

        $totalProducts = Products::where('user_id', Auth::id())->count();
        //   $totalProductsDipinjam = Products::where('user_id', Auth::id())->where('status', 'dipinjam')->count();

        $totalOrders = OrderItems::whereIn('product_id', $queryProductsIds)->count();
        $terjualOrders = OrderItems::whereIn('product_id', $queryProductsIds)->where('status', 'approve')->count();
        $totalRevenue = OrderItems::whereIn('product_id', $queryProductsIds)
            ->sum('sub_total');

        // $topProducts->through(function ($item) {

        return Inertia::render('seller/index', [
            'reports' => [
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'totalOrdersDiterima' => $terjualOrders,
                'totalPendapatan' => $totalRevenue,
                'topProducts' => $topProducts,

                'ProductscategoryCount' => $StatusProductsCategoryCount,
                'ProductsstatusCount' => $statusCount,
                'StatusOrdersCount' => $StatusOrdersCount,
                'countsByDate' => $counts,
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
