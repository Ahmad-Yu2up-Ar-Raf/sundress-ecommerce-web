<?php

namespace App\Http\Controllers;

use App\Http\Requests\WhishlistStore;
use App\Models\Products;
use App\Models\Whishlist;
use App\Services\WhishlistService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WhishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(Request $request,  WhishlistService $whishlistService) : RedirectResponse
    {  
              
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
          
        ]);
    

        $productId = $data['product_id'];
    
        // ambil product model (pastikan ada)
        $product = Products::findOrFail($productId);
    
        // panggil service — biarkan service yang hitung price
        $whishlistService->addItemToWhishlist($product);
    
        return back()->with('success', 'Product added to whishlist successfully');

    }


    public function destroy(Products $product ,WhishlistService $whishlistService) : RedirectResponse
    {  
              

        $whishlistService->removeItemFromWhishlist($product->id);

        return back()->with('success', 'Product removed from whishlish');

    }

    /**
     * Display the specified resource.
     */
    public function show(Whishlist $whishlist)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Whishlist $whishlist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Whishlist $whishlist)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
  
}
