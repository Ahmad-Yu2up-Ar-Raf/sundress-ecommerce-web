/**
 * v0 by Vercel.
 * @see https://v0.app/t/z7dBjtRFoLo
 * Documentation: https://v0.app/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Link } from "@inertiajs/react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../shadcn-ui/card";
import { Order } from "@/types";
import { useLottie } from "lottie-react";
import animationData from "./success.json";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../../shadcn-ui/button";
import { ChevronRight } from "lucide-react";
export default function SuccessCardPayment({ order } : { order : Order[]}) {
    const lottieOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { View } = useLottie(lottieOptions);
  return (
    <Card className="  bg-muted/20 outline-1 shadow-none w-full max-w-md m-auto">
     
      <CardContent className="flex flex-col items-center justify-center flex-grow text-center p-4 md:p-6">
         <div

       
        className=" size-30"
      >
        {View}
      </div>


        <CardTitle className="mt-4 text-2xl md:text-3xl font-semibold">Payment Successful</CardTitle>
  
        <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">Thank you for your purchase!</CardDescription>
        <div className="mt-6 border space-y-3 rounded-lg p-4 w-full max-w-md">
         
          <div className="flex justify-between text-sm">
            <span>Amount Paid:</span>
            <span className="font-medium">$100.00</span>
          </div>
          <div className="flex justify-between text-sm ">
            <span>Date & Time:</span>
            <span className="font-medium">January 22, 2024, 10:30 AM</span>
          </div>
          <div className="flex justify-between text-sm ">
            <span>Reference Number:</span>
            <span className="font-medium">1234567890</span>
          </div>
           <div className="flex justify-between text-sm">
            <span>Total Orders:</span>
            <span className="font-medium">{order.length}</span>
          </div>
        </div>
        <CardAction className=" gap-3 mt-5 w-full flex justify-center content-center items-center">

        <Link
          href="/buyer/orders"
          className={cn(buttonVariants({variant:"default"}))}
          prefetch={false}
        >
         Orders Status
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({variant:"secondary"}))}
          prefetch={false}
        >
         Continue shopping <ChevronRight/>
        </Link>
        </CardAction>
   
      </CardContent>
    </Card>
  )
}

