"use client";


import { Box, CreditCard, Loader, Plus, ShoppingCart } from "lucide-react";
import * as React from "react";

import { Button, buttonVariants } from "@/components/ui/fragments/shadcn-ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/fragments/shadcn-ui/sheet";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,

  DrawerClose,

  DrawerContent,
  DrawerDescription,

  DrawerFooter,

  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/fragments/shadcn-ui/drawer";

import { cn } from "@/lib/utils";

import CartProductsCard from "./cart-product-card";
import { cartCart } from "@/types";
import NumberFlow from "@number-flow/react";
import { Link } from "@inertiajs/react";






interface type  extends React.ComponentPropsWithRef<typeof Sheet>{
  trigger? : boolean
  cart? : cartCart[]
  cartCount? : number
  cartTotal? : number
}





export function CartProductsSheet({ ...props}: type) {






 
  

  const cart_count  = props.cartCount

  const isDesktop = useIsMobile();

  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px';

   
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.stop();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      
      // Re-enable Lenis
      if (lenis) {
        lenis.start();
      }
    };
  }, []);
if (!isDesktop) {
  return (
    <Sheet 
    
    
    open={props.open} onOpenChange={props.onOpenChange} modal={true} >
   <SheetTrigger  asChild>
   <Button variant={"ghost"} size={"icon"} className=" relative">

<ShoppingCart className="size-5 text-accent-foreground/70 hover:text-primary cursor-pointer transition-all duration-300 ease-out" />
 {cart_count! > 0 && (

<span className={(" absolute bottom-[-0.2em] bg-primary rounded-full py-[1.8px] px-1.5  text-xs text-primary-foreground right-[-0.3em]")}>{cart_count}</span>
)}
</Button>
   </SheetTrigger>
    
      <SheetContent
      
      
          ref={contentRef}
        data-lenis-prevent
      
        style={{
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      className="flex flex-col gap-6 overflow-y-scroll ">
        <SheetHeader className="text-left  px-0 space-y-1 bg-background z-30  sticky top-0   pt-4 pb-0 border-b  ">
          <SheetTitle className=" pb-1 px-6"> <span  className=" text-xl">Shopping Cart</span> <span  className=" font-thin block text-sm">{cart_count} Items</span> </SheetTitle>
          <SheetDescription className=" border-primary/20 py-2 border-t-2 items-center px-6 flex bg-secondary gap-3 text-accent-foreground">
            <Box className=" size-3.5"/>
        <span className=" text-sm">
        You've unlocked free shipping!
            </span>  
          </SheetDescription>
       
        </SheetHeader>
   <main className={cn(" space-y-7 px-6",

    props.cart?.length == 0 && 'flex h-full justify-center content-center items-center'
   )}>

{props.cart?.length == 0 && (
  <p className=" text-muted-foreground text-2xl">
    Empty
  </p>
)}

    {   props.cart?.map((item , i) => (

    <CartProductsCard ProductCart={item} key={i}/>
    ))}
   </main>
      <SheetFooter  className="text-left  px-6 space-y-1 bg-background z-30  sticky bottom-0    border-t ">
        <div className=" space-y-2">

      <div className="  flex w-full justify-between">
    <h3  className=" font-medium text-muted-foreground">
        Sub Total
    </h3>
 <NumberFlow
          value={props?.cartTotal!}
          className=" font-medium text-muted-foreground "
          format={{ style: 'currency', currency: 'USD' ,   minimumFractionDigits: 0,  }}
        />
</div>
      <div className="  flex w-full justify-between">
    <h3  className=" font-medium text-muted-foreground ">
        Shipping
    </h3>
    <h3  className=" font-medium text-muted-foreground ">
Free
    </h3>
</div>
        </div>
        <div className=" pt-2  border-t space-y-3 w-full">
<div className=" mb-4 flex w-full justify-between">
    <h3  className=" font-semibold text-lg">
        Total
    </h3>
 <NumberFlow
          value={props?.cartTotal!}
          className=' font-extrabold text-lg'
          format={{ style: 'currency', currency: 'USD' ,   minimumFractionDigits: 0,  }}
        />
</div>
         <Link  href="/checkout" className={cn( buttonVariants({ variant: "default"})  ,"  w-full")}>
        <CreditCard/> <span> Checkout</span>   
         </Link>
         <SheetClose className=" w-full">


         <Button variant={"outline"}  size={"lg"} className=" w-full">
       <span> Continue Shopping</span>   
         </Button>
         </SheetClose>
        </div>
      </SheetFooter>
      </SheetContent> 
    </Sheet>
  );
}

return(
     <Drawer 
    
    
    open={props.open} onOpenChange={props.onOpenChange} modal={true} >
   <DrawerTrigger  asChild>
   <Button variant={"ghost"} size={"icon"} className=" relative">

<ShoppingCart className="size-5 text-accent-foreground/70 hover:text-primary cursor-pointer transition-all duration-300 ease-out" />
 {cart_count! > 0 && (

<span className={(" absolute bottom-[-0.2em] bg-primary rounded-full py-[1.8px] px-1.5  text-xs text-primary-foreground right-[-0.3em]")}>{cart_count}</span>
)}
</Button>
   </DrawerTrigger>
    
      <DrawerContent
      
      
          ref={contentRef}
        data-lenis-prevent
      
        style={{
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      className="flex flex-col gap-6 overflow-y-scroll ">
        <DrawerHeader className="text-left  px-0 space-y-1 bg-background z-30  sticky top-0   pt-4 pb-0 border-b  ">
          <DrawerTitle className=" pb-1 px-6"> <span  className=" text-xl">Shopping Cart</span> <span  className=" font-thin block text-sm">{cart_count} Items</span> </DrawerTitle>
          <DrawerDescription className=" border-primary/20 py-2 border-t-2 items-center px-6 flex bg-secondary gap-3 text-accent-foreground">
            <Box className=" size-3.5"/>
        <span className=" text-sm">
        You've unlocked free shipping!
            </span>  
          </DrawerDescription>
       
        </DrawerHeader>
   <main className=" space-y-7 px-6">
    {props.cart?.map((item , i) => (

    <CartProductsCard ProductCart={item} key={i}/>
    ))}
   </main>
      <DrawerFooter  className="text-left  px-6 space-y-1 bg-background z-30  sticky bottom-0    border-t ">
        <div className=" space-y-2">

      <div className="  flex w-full justify-between">
    <h3  className=" font-medium text-muted-foreground">
        Sub Total
    </h3>
 <NumberFlow
          value={props?.cartTotal!}
          className=" font-medium text-muted-foreground "
        format={{ 
                            style: 'currency', 
                            currency: 'USD',   
                      
                        }}
        />
</div>
      <div className="  flex w-full justify-between">
    <h3  className=" font-medium text-muted-foreground ">
        Shipping
    </h3>
    <h3  className=" font-medium text-muted-foreground ">
Free
    </h3>
</div>
        </div>
        <div className=" pt-2  border-t space-y-3 w-full">
<div className=" mb-4 flex w-full justify-between">
    <h3  className=" font-semibold text-lg">
        Total
    </h3>
 <NumberFlow
          value={props?.cartTotal!}
          className=' font-extrabold text-lg'
        format={{ 
                            style: 'currency', 
                            currency: 'USD',   
                      
                        }}
        />
</div>
         <Link    href="/checkout" className="  w-full">
        <CreditCard/> <span> Checkout</span>   
         </Link>
         <DrawerClose className=" w-full">


         <Button variant={"outline"}  size={"lg"} className=" w-full">
       <span> Continue Shopping</span>   
         </Button>
         </DrawerClose>
        </div>
      </DrawerFooter>
      </DrawerContent> 
    </Drawer>
)
}