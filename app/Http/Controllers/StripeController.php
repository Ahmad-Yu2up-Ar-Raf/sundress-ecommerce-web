<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeController extends Controller
{
    /**
     * ✅ Handle successful payment redirect from Stripe
     */
    public function success(Request $request)
    {
        $sessionId = $request->query('session_id');

        if (!$sessionId) {
            return redirect()->route('home')->with('error', 'Invalid session');
        }

        try {
            Stripe::setApiKey(config('app.stripe_secret_key'));
            
            // Retrieve session from Stripe
            $session = Session::retrieve($sessionId);

            // Find order
            $order = Orders::where('stripe_session_id', $sessionId)
                ->with('items.product')
                ->first();

            if (!$order) {
                return redirect()->route('home')
                    ->with('warning', 'Order processing in progress. Check your email for confirmation.');
            }

            return Inertia::render('checkout.success', [
                'order' => $order,
                'session' => [
                    'id' => $session->id,
                    'payment_status' => $session->payment_status,
                    'amount_total' => $session->amount_total / 100, // Convert from cents
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Checkout success page error', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('home')
                ->with('info', 'Payment received. Order details will be emailed to you shortly.');
        }
    }

    /**
     * ✅ Handle cancelled payment
     */
    public function cancelled(Request $request)
    {
        // Optional: Clean up pending order if needed
        // But better to keep it for retry attempts

        return Inertia::render('checkout/cancelled', [
            'message' => 'Payment was cancelled. Your cart is still available.',
        ]);
    }
}