"use client";


import { Box, CreditCard, Loader, Plus, ShoppingCart } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/fragments/shadcn-ui/button";
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
import { ProductsSchema } from "@/lib/validations/index.t";
import CartProductsCard from "./cart-product-card";


interface type  extends React.ComponentPropsWithRef<typeof Sheet>{
  trigger? : boolean
  order? : ProductsSchema[]
}



const CartProducts : ProductsSchema[] = [
  {
      "id": 316,
      "created_at": "2025-10-14T12:09:46.000000Z",
      "updated_at": "2025-10-14T04:36:28.000000Z",
      "name": "est recusandae at",
      "description": "Voluptatum sed et qui nihil corporis dolorum quia. Esse consequatur rem quis sit sapiente necessitatibus. Amet non totam sunt aut voluptatem.",
      "country": "Fiji",
      "city": "Lake Margretborough",
      "status": "available",
      "category": "home",
      "free_shipping": false,
      "price": 440538,
      "currency": "IDR",
      "stock": 3,
      "cover_image": "https://picsum.photos/seed/bd03cf1b-8fb7-47cb-be0a-b635cb5cc381/700/800/",
   
      "reviews_count": 9,
      "order_item_count": 9,
   
  },


]

export function CartProductsSheet({ ...props}: type) {




  const order_count  = props.order?.length

  const isDesktop = useIsMobile();
console.log(props.order)

if (!isDesktop) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange} modal={true} >
   <SheetTrigger  asChild>
   <Button variant={"ghost"} size={"icon"} className=" relative">

<ShoppingCart className="size-5 text-accent-foreground/70 hover:text-primary cursor-pointer transition-all duration-300 ease-out" />
 { order_count && order_count > 0 && (

<span className={(" absolute bottom-[-0.2em] bg-primary rounded-full py-[1.8px] px-1.5  text-xs text-primary-foreground right-[-0.3em]")}>{order_count}</span>
)}
</Button>
   </SheetTrigger>
    
      <SheetContent className="flex flex-col py-1.5 gap-6 overflow-y-scroll ">
        <SheetHeader className="text-left  px-0 space-y-1 bg-background z-30  sticky top-0   pt-4 pb-0 border-b  ">
          <SheetTitle className=" pb-2 px-6"> <span  className=" text-3xl">Shopping Cart</span> <span  className=" font-thin block">{order_count} Items</span> </SheetTitle>
          <SheetDescription className=" border-primary/20 py-2.5 border-t-2 items-center px-6 flex bg-secondary gap-3 text-accent-foreground">
            <Box className=" size-4.5"/>
        <span className=" text-base">
        You've unlocked free shipping!
            </span>  
          </SheetDescription>
       
        </SheetHeader>
   <main className=" px-6">
    {/* {props.order?.map((item , i) => (

    <CartProductsCard Product={item} key={i}/>
    ))} */}
   </main>
      <SheetFooter  className="text-left sm:px-6 space-y-1 bg-background z-30  sticky bottom-0   p-4 border-t ">
        <div className=" space-y-2.5">

      <div className="  flex w-full justify-between">
    <h3  className=" font-medium text-muted-foreground text-lg">
        Sub Total
    </h3>
    <h3  className=" font-medium text-muted-foreground text-lg">
    $949.96
    </h3>
</div>
      <div className="  flex w-full justify-between">
    <h3  className=" font-medium text-muted-foreground text-lg">
        Shipping
    </h3>
    <h3  className=" font-medium text-muted-foreground text-lg">
Free
    </h3>
</div>
        </div>
        <div className=" pt-4 border-t space-y-3 w-full">
<div className=" mb-6 flex w-full justify-between">
    <h3  className=" font-semibold text-2xl">
        Total
    </h3>
    <h3  className=" font-extrabold text-2xl">
    $949.96
    </h3>
</div>
         <Button  size={"lg"} className="  w-full">
        <CreditCard/> <span> Checkout</span>   
         </Button>
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
     <Drawer  open={props.open} onOpenChange={props.onOpenChange}   modal={true}  >
   <DrawerTrigger asChild className={cn(props.trigger == false && "sr-only" )} >
       <Button variant="outline" className=" w-fit text-sm  bg-background" size="sm">
          <Plus  className=" mr-3 "/>
          Add New 
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-col  ">
        <DrawerHeader className="text-left sm:px-6 space-y-1 bg-background    p-4 border-b  ">
        <DrawerTitle className=" text-xl">Add New <Button type="button"   variant={"outline"} className=" ml-2  px-2.5 text-base">products</Button> </DrawerTitle>
              <DrawerDescription className=" text-sm">
                             Fill in the details below to create a new task
                       </DrawerDescription>
        </DrawerHeader>

       
      </DrawerContent>
    </Drawer>
)
}