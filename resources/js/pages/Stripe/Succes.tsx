
import { OrderStatus } from "@/components/ui/fragments/custom-ui/card/succes-payment-card";
import { formatUSD } from "@/hooks/use-money-format";
import { OrderItemType } from "@/lib/validations/orders";
import { Order } from "@/types";



interface compoentProps {
  data: Order
}

type pageProps = {
  orders : compoentProps[]
 orderItems : OrderItemType[]
}

export default function OrderStatusDemo({ orders , orderItems} : pageProps) {
  // Sample data to populate the component
  const sampleData  =  orders[0].data

  
  const orderData = {
    illustrationUrl: "https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-HNciDluT0NAzIwovOE2g7EpZORt7CQ.png&w=320&q=75",
    statusTitle: "Order Status",
    statusDescription: "Your package is on the way",
    item: {
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=64&h=64&fit=crop&q=80",
      name: "Apple Watch",
      details: "Color: Grey",
      price: 1500.00,
    },
    summary: [
   
      { label: "Total Price", value: `${formatUSD(sampleData.total_price)}` },
      { label: "Shipping Address", value: `${sampleData.address}` },
      { label: "Shipping Method", value: `${sampleData.shipping_method}` },
      { label: "Estimated Delivery", value: "11/03/25; 04:54pm" },
    ],
    trackingStatus: "Your order is confirmed and in transit",
  };



  return (
    <section className="flex items-center min-h-dvh  justify-center h-full bg-background p-4">
      <OrderStatus
      orderItems={orderItems}
        orders={orders}
        statusTitle={orderData.statusTitle}
        statusDescription={orderData.statusDescription}
        item={orderData.item}
        summary={orderData.summary}
        trackingStatus={orderData.trackingStatus}
    
      />
    </section>
  );
}