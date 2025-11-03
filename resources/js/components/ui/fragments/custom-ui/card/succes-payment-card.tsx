import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../../shadcn-ui/button";
import MediaItem from "../MediaItem";
import animationData from "@/config/assets/animations/Order Status for Food Delivery.json";
import { useLottie } from "lottie-react";
import { Link } from "@inertiajs/react";
import { Order } from "@/types";
import { ProductsSchema } from "@/lib/validations/index.t";
import { OrderItemType, OrderType } from "@/lib/validations/orders";
// Define TypeScript types for the component props for type safety and reusability
interface OrderItemProps {
  imageUrl: string;
  name: string;
  details: string;
  price: number;
}

interface OrderSummaryItemProps {
  label: string;
  value: string;
}
import confetti from "canvas-confetti"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/fragments/shadcn-ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/fragments/shadcn-ui/avatar";
import { ChevronDown, ChevronUp } from "lucide-react";
interface compoentProps {
  data: Order
}

interface OrderStatusProps {
  orders : compoentProps[]
 orderItems : OrderItemType[]
  statusTitle: string;
  statusDescription: string;
  item: OrderItemProps;
  summary: OrderSummaryItemProps[];
  trackingStatus: string;
  onTrackOrder?: () => void;
  className?: string;
}

// Reusable Card component for consistent styling
const InfoCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground p-6",
        className
      )}
      {...props}
    />
  )
);
InfoCard.displayName = "InfoCard";


export const OrderStatus: React.FC<OrderStatusProps> = ({
  orders,
  statusTitle,
  orderItems,
  statusDescription,
  item,
  summary,
  trackingStatus,
  onTrackOrder,
  className,
}) => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };





console.log(orderItems)
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };
  const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
      const style = { width:  "100%", height: "100%" , margin: "auto"  , }; // atur sesuai kebutuhan
   const { View } = useLottie(lottieOptions, style);
    const appliedShowMore = orderItems.length >= 3 
     const [isOpen, setIsOpen] = React.useState(false)


      const handleClick = () => {
    const end = Date.now() + 3 * 1000 // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]
    const frame = () => {
      if (Date.now() > end) return
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      })
      requestAnimationFrame(frame)
    }
    frame()
  }


  handleClick()
  return (
    <motion.div
      className={cn("max-w-md w-full mx-auto p-4 ", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header section with illustration and status */}
      <motion.div variants={itemVariants} className="text-center space-y-2 mb-8">
         <div className=" m-auto md:size-45 size-36 ">
              {  View}
              </div> 
        <h1 className="text-2xl font-bold text-foreground">{statusTitle}</h1>
        <p className="text-muted-foreground">{statusDescription}</p>
      </motion.div>


     {appliedShowMore ? (

      <Collapsible 
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("flex flex-col gap-3 mb-6   pt-2 relative     overflow-hidden"

      )}>
   
      
        {orderItems.slice(0, 1).map((item ,i) =>  {
   
        return(
              <motion.div 
      key={i}
      variants={itemVariants} className="">
        <InfoCard>
          <div className="flex items-center space-x-4">
            <MediaItem
              webViewLink={`${item.product?.cover_image}`}
                
              className="w-16 min-h-16 overflow-hidden rounded-xl  bg-muted object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{item.product?.name}</p>
              <p className="text-sm text-muted-foreground">Quantity : {item.quantity}</p>
            </div>
            <p className="font-bold text-foreground">
              ${item.price}
            </p>
          </div>
        </InfoCard>
      </motion.div>
        )})}
           <CollapsibleContent  className=" space-y-4">
        {orderItems && orderItems.slice(4, orderItems.length).map((item ,i) =>  {
   
        return(
 <motion.div 
      key={i}
      variants={itemVariants} className="">
        <InfoCard>
          <div className="flex items-center space-x-4">
            <MediaItem
              webViewLink={`${item.product?.cover_image}`}
                
              className="w-16 min-h-16 overflow-hidden rounded-xl  bg-muted object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{item.product?.name}</p>
              <p className="text-sm text-muted-foreground">Quantity : {item.quantity}</p>
            </div>
            <p className="font-bold text-foreground">
              ${item.price}
            </p>
          </div>
        </InfoCard>
      </motion.div>
        )})}
           </CollapsibleContent>
             <CollapsibleTrigger  className=" w-full">
          <Button variant="outline" size="default" className="  py-5.5  justify-between w-full">
           {isOpen == false ?  
           (
            <>
                 <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2   *:data-[slot=avatar]:size-8">
        <Avatar className="">
          <AvatarImage src={`${orderItems[0]!.product!.cover_image}`} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar className="">
          <AvatarImage
      src={`${orderItems[1]!.product!.cover_image}`}
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar className="">
          <AvatarImage
        src={`${orderItems[2]!.product!.cover_image}`}
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </div>
      <div className=" text-muted-foreground flex items-center gap-3">
            Show all {orderItems.length - 4} orders

            <ChevronDown />
      </div>
            </>
            ) : 
            (
              <>
              Show Less
                <ChevronUp />
              </>
            
            )
              }
           
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
     ) : (

<div className=" space-y-3 mb-6">

      {orderItems.map((item, i) => (

      <motion.div 
      key={i}
      variants={itemVariants} className="">
        <InfoCard>
          <div className="flex items-center space-x-4">
            <MediaItem
              webViewLink={`${item.product?.cover_image}`}
                
              className="w-16 min-h-16 overflow-hidden rounded-xl  bg-muted object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{item.product?.name}</p>
              <p className="text-sm text-muted-foreground">Quantity : {item.quantity}</p>
            </div>
            <p className="font-bold text-foreground">
              ${item.price}
            </p>
          </div>
        </InfoCard>
      </motion.div>
      ))}
</div>
     )}

      
      {/* Order summary card */}
      <motion.div variants={itemVariants} className="mb-8">
        <InfoCard className="space-y-4">
            <h2 className="font-semibold text-lg text-foreground">Order Summary</h2>
            {summary.map((line, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">{line.label}</p>
                    <p className="text-foreground font-medium text-right">{line.value}</p>
                </div>
            ))}
        </InfoCard>
      </motion.div>

      {/* Action button and final status text */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <Link href="/buyer/orders"  className={cn(buttonVariants({ variant: "default"}) ,"w-full")}>
            My Orders
        </Link>
        <Link href="/explore"  className={cn(buttonVariants({ variant: "secondary"}) ,"w-full")}>
            Continue Shopping
        </Link>
        <p className="text-xs text-green-600 dark:text-green-500 font-medium">{trackingStatus}</p>
      </motion.div>
    </motion.div>
  );
};