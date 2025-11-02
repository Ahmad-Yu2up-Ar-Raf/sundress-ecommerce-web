<?php

namespace App\Http\Controllers;
use App\Enums\OrderStatus;
use App\Http\Resources\OrderViewResource;
use App\Mail\CheckoutCompleted;
use App\Mail\NewOrderMail;
use App\Models\CartItems;
use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Stripe\Exception\SignatureVerificationException;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripeController extends Controller
{
    /**
     * ✅ Handle successful payment redirect from Stripe
     */
    public function success(Request $request)
    {
       $user = Auth::user();
       $session_id = $request->get('session_id');
       $orders = Orders::where('stripe_session_id', $session_id)->get();

       if($orders->count() === 0){
        abort(404);
       }

       foreach ($orders as $order) {
            if($order->user_id !== $user->id ){
                abort(403);
            }
       }

       $ordersResource = OrderViewResource::collection($orders)->collection->toArray();

    $orderItems = $orders->flatMap(function ($order) {
        return $order->orderItems->map(function ($item) use ($order) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'description' => $item->product->description,
                      'cover_image' => $item->product->cover_image,
                    'showcase_images' => $item->product->showcase_images,
                ],
                // tambahan useful info
                'order_id' => $order->id,
                'order_total_price' => $order->total_price,
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'vendor' => $order->vendorUser?->only(['id','name','email','store_name']) ?? null,
            ];
        });
    })->values()->toArray();

    return Inertia::render('Stripe/Succes', [
        'orders'     => $ordersResource,
        // 'total' => $ordersResource->sum(''),
        'orderItems' => $orderItems,
    ]);
    }

    /**
     * ✅ Handle cancelled payment
     */
    public function failure(Request $request)
    {
   
       
    }
    public function webhook(Request $request)
    {
        $stripe = new StripeClient(config('app.stripe_secret_key'));

        $endpoint_secret = config('app.stripe_webhook');

        $payload = $request->getContent();
        $sig_header = request()->header('Stripe-Signature');
        $event = null;

        try {
            $event = Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            Log::error($e);
            return response("Invalid Payload", 400);
        }catch(SignatureVerificationException $e){
             Log::error($e);
            return response("Invalid Payload", 400);
        }
     

        Log::info('=====================');
        Log::info('=====================');
        Log::info($event->type);
        Log::info($event);
        
        switch ($event->type) {
            case 'charge.updated':
               $charge = $event->data->object;
               $transactionId = $charge['balance_transaction'];
               $paymentIntent = $charge['payment_intent'];
               $balanceTransaction = $stripe->balanceTransactions->retrieve($transactionId);

                $orders = Orders::where('payment_intent' , $paymentIntent)->get();


                $totalAmount = $balanceTransaction['amount'];
                $stripeFee = 0;
                foreach ($balanceTransaction['fee_details'] as $key => $fee_detail) {
                    if($fee_detail['type'] === 'stripe_fee' ){

                        $stripeFee = $fee_detail['amount'];
                    }
                }

                $platformFreePercent = config('app.platform_fee_pct' , 10);


                foreach ($orders as $order){
                    $vendorShare = $order->total_price / $totalAmount;
                        /** @var Orders $order */
                    $order->online_payment_commission = $vendorShare * $stripeFee;

                    $order->website_commission =  ($order->total_price - $order->online_payment_commission) / 100 * $platformFreePercent;

                    $order->vendor_subtotal = $order->total_price - $order->online_payment_commission - $order->website_commission;

                    $order->save();

                    Mail::to($order->vendorUser)->send(new NewOrderMail($order));
                }



                    Mail::to($orders[0]->user)->send(new CheckoutCompleted($orders));
                break;
            case 'checkout.session.completed':
                $session =$event->data->object;
                $pi = $session['payment_intent'];

                $orders = Orders::query()
                        ->with(['orderItems'])
                        ->where(['stripe_session_id' => $session['id']])
                        ->get();


                $productsToDeletedFromCart = [];        
                foreach ($orders as $order) {
                    $order->payment_intent = $pi;
                    $order->status = OrderStatus::Paid;
                    $order->save();

                    $productsToDeletedFromCart = [
                        ...$productsToDeletedFromCart,
                        ...$order->orderItems->map(fn($item) => $item->product_id)->toArray(),
                    ];

                    foreach ($order->orderItems as $orderItem) {
                        /** @var OrderItems $orderItem */
                        $product = $orderItem->product;
                        if($product->quantity != null){
                            $product->quantity -= $orderItem->quantity;
                            $product->save();
                        }
                    }
                }


                CartItems::query()
                    ->where('user_id', $order->user_id)
                    ->whereIn('product_id', $productsToDeletedFromCart)
                    ->delete();
                break;
            
            default:
             echo 'Received unknow event type' . $event->type;
                break;
        }
        return response('', 200);
    }
}