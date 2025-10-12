<?php

namespace App\Http\Controllers\Auth;

use App\Enums\RoleEnum;
use App\Enums\UserOccupasion;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register/index');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
$request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        'country' => 'required|string|max:255',
        'province' => 'required|string|max:255',
        'phone' => 'required|string|max:255',
       'occupasion' => [
    'required',
Rule::in(UserOccupasion::values())

],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'province' => $request->province,
            'country' => $request->country,
            'phone' => $request->phone,
            'occupasion' => $request->occupasion,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));
$user->assignRole("buyer");

        Auth::login($user);
   return ($request->user()->hasRole('seller') 
            ? redirect()->intended(route('seller.index', absolute: false) )
            :  redirect()->intended(route('buyer.index', absolute: false) ));
    }
}
