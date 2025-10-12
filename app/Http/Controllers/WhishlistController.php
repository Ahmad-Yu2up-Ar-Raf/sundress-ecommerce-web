<?php

namespace App\Http\Controllers;

use App\Http\Requests\WhishlistStore;
use App\Models\Whishlist;
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
    public function store(WhishlistStore $request) : RedirectResponse
    {  
              
       Whishlist::create([
                ...$request->validated(),
                 'user_id' => Auth::id(),
            ]);

         

             return back()->with('success', 'Whishlist added successfully');

    }


    public function unwhislited(Request $request) : RedirectResponse
    {  
              

    $user = Auth::user();
    $token = $request->bearerToken();
    $product_id = $request->get('product_id');


    if($user){
        $whishlist = Whishlist::where('user_id' , $user->id)->where('product_id', $product_id);
              
   
              $whishlist->delete();
        
    }



      

           return back()->with('success', 'Whishlist removed successfully');

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
    public function destroy(Whishlist $whishlist)
    {
        //
    }
}
