<?php

namespace App\Http\Controllers;

use App\Models\CartItems;
use App\Models\OrderItems;
use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    /**
     * ✅ Handle Stripe webhook with signature verification
     */
    public function handle(Request $request): Response
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('app.stripe_webhook');

        Log::info('Stripe webhook received', [
            'type' => $request->input('type'),
            'ip' => $request->ip(),
        ]);

        // ✅ CRITICAL: Verify Stripe signature
        try {
            $event = Webhook::constructEvent(
                $payload,
                $sig_header,
                $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            Log::warning('Invalid Stripe webhook payload', ['error' => $e->getMessage()]);
            return response('Invalid payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::warning('Invalid Stripe webhook signature', [
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);
            return response('Invalid signature', 403);
        } catch (\Exception $e) {
            Log::error('Stripe webhook error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response('Webhook error', 500);
        }

        // Handle event type
        match ($event->type) {
            'checkout.session.completed' => $this->handleCheckoutCompleted($event->data->object),
            'payment_intent.succeeded' => $this->handlePaymentIntentSucceeded($event->data->object),
            'charge.refunded' => $this->handleChargeRefunded($event->data->object),
            default => Log::info('Unhandled webhook event', ['type' => $event->type])
        };

        return response('Webhook handled', 200);
    }

    /**
     * ✅ Process successful checkout and create Order + OrderItems
     */
    private function handleCheckoutCompleted($session)
    {
        Log::info('Webhook: checkout.session.completed', [
            'session_id' => $session->id,
            'payment_status' => $session->payment_status,
        ]);

        try {
            DB::transaction(function () use ($session) {
                // ✅ Find pending order with locking to prevent double-processing
                $order = Orders::where('stripe_session_id', $session->id)
                    ->where('payment_status', 'pending')
                    ->lockForUpdate()
                    ->first();

                if (!$order) {
                    Log::warning('Order not found or already processed', [
                        'session_id' => $session->id,
                    ]);
                    return;
                }

                // ✅ Update order with payment details
                $order->update([
                    'stripe_payment_intent_id' => $session->payment_intent,
                    'stripe_customer_id' => $session->customer,
                    'payment_status' => 'succeeded',
                    'paid_at' => now(),
                ]);

                // ✅ Process order items with revenue split per seller
                $paymentMetadata = $order->payment_metadata;
                $platformCommissionRate = 0.10; // 10% platform fee

                foreach ($paymentMetadata as $sellerId => $vendorData) {
                    $sellerSubtotal = (float) $vendorData['amount'];
                    $platformCommission = $sellerSubtotal * $platformCommissionRate;
                    $sellerFinalAmount = $sellerSubtotal - $platformCommission;

                    $itemCount = count($vendorData['items']);

                    foreach ($vendorData['items'] as $item) {
                        OrderItems::create([
                            'order_id' => $order->id,
                            'vendor_id' => $sellerId,
                            'product_id' => $item['product_id'],
                            'quantity' => $item['quantity'],
                            'sub_total' => $item['sub_total'],
                            
                            // ✅ Revenue split (proportional to item subtotal)
                            'seller_amount' => ($item['sub_total'] / $sellerSubtotal) * $sellerFinalAmount,
                            'platform_commission' => ($item['sub_total'] / $sellerSubtotal) * $platformCommission,
                        ]);
                    }

                    Log::info('Revenue split calculated', [
                        'order_id' => $order->id,
                        'vendor_id' => $sellerId,
                        'subtotal' => $sellerSubtotal,
                        'platform_commission' => $platformCommission,
                        'seller_final' => $sellerFinalAmount,
                    ]);
                }

                // ✅ NOW clear the cart (after successful order creation)
                CartItems::where('user_id', $order->user_id)->delete();

                Log::info('Order processed successfully', [
                    'order_id' => $order->id,
                    'session_id' => $session->id,
                    'total_items' => $order->items()->count(),
                ]);
            });

        } catch (\Exception $e) {
            Log::error('Failed to process checkout webhook', [
                'session_id' => $session->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            // ⚠️ Still return 200 to prevent infinite retries
            // Set up monitoring/alerting for these errors
        }
    }

    private function handlePaymentIntentSucceeded($paymentIntent)
    {
        Log::info('Payment intent succeeded', ['pi_id' => $paymentIntent->id]);
        
        // Optional: Update order status if needed
        Orders::where('stripe_payment_intent_id', $paymentIntent->id)
            ->update(['payment_status' => 'succeeded']);
    }

    private function handleChargeRefunded($charge)
    {
        Log::info('Charge refunded', ['charge_id' => $charge->id]);
        
        Orders::where('stripe_payment_intent_id', $charge->payment_intent)
            ->update(['payment_status' => 'refunded']);
    }
}