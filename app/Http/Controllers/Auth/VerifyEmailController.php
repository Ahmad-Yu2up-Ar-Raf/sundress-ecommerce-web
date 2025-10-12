<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
 public function __invoke(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            
      return ($request->user()->hasRole('seller') 
            ? redirect()->intended(route('seller.index', absolute: false) . '?verified=1' )
            :  redirect()->intended(route('buyer.index', absolute: false) . '?verified=1' ));
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }
 
       return ($request->user()->hasRole('seller') 
            ? redirect()->intended(route('seller.index', absolute: false) . '?verified=1' )
            :  redirect()->intended(route('buyer.index', absolute: false) . '?verified=1' ));
    }
}
