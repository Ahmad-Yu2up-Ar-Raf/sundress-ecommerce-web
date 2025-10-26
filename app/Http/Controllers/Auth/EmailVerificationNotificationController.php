<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
             
    return ($request->user()->hasRole('seller') 
            ? redirect()->intended(route('seller.index', absolute: false) )
            :  redirect()->intended(route('buyer.index', absolute: false) ));
        }

        $request->user()->sendEmailVerificationNotification();
  // simpan sent timestamp supaya frontend bisa menghitung sisa waktu setelah reload
    session(['verification_sent_at' => now()->toISOString()]);
        return back()->with('status', 'verification-link-sent');
    }
}
