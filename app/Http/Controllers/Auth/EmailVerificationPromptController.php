<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
          if ($request->user()->hasVerifiedEmail()) {
         return ($request->user()->hasRole('seller') 
            ? redirect()->intended(route('seller.index', absolute: false) )
            :  redirect()->intended(route('buyer.index', absolute: false) ));
        }

        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
