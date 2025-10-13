'use client'
import { Button } from "@/components/ui/fragments/shadcn-ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/fragments/shadcn-ui/card"

import { Heart, ShoppingCart,  Star } from "lucide-react"

import { Badge } from "../shadcn-ui/badge"
import { Link, router, usePage } from "@inertiajs/react"

import MediaItem from "./MediaItem"
import {
  Tooltip,
   TooltipPanel,
  TooltipTrigger,
} from "@/components/ui/fragments/animate-ui/tooltip"
import { ProductsSchema } from "@/lib/validations/index.t"
import { formatIDR } from "@/hooks/use-money-format"

import React from "react"

import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useModal } from "../../core/layout/provider/ContextProvider"
import { User as profile, type SharedData } from '@/types';
type ProductProps  = {
  Product: ProductsSchema;
  className?: string;
  isWhistlist?: boolean | null;

  label?: string
}

export function ProductCard({  Product ,className  , label , isWhistlist,...props }: ProductProps & React.HTMLAttributes<HTMLDivElement>) {
  const [loading, setLoading] = React.useState(false);  
const Price = formatIDR(Product.price)

     const [isPending, startTransition] = React.useTransition();
     const user = usePage<SharedData>().props.auth.user;
   const showcase_images = Product.showcase_images 
   const appDomain = import.meta.env.APP_URL || 'http://localhost:8000';
const data = { product_id: Product.id }   
const { open } = useModal();
const onClick = () => open({ redirectTo: "/" });


     function handleWhishlist() {

if(user != null){

  setLoading(true)
  startTransition(async () => {
    try {
      if(Product.is_whislisted == true) {
       toast.loading("Removing...", { id: "whishlist"});
  
       router.post(route('unwhistlist'),  data, { 
           preserveScroll: true,
           preserveState: true,
           forceFormData: true, 
           onSuccess: (success) => {              
     
             toast.success("Products removed from whishlist", { id: "whishlist"});
             setLoading(false);
           },
           onError: (error) => {
             console.error("Submit error:" , error);
           toast.error(`Error: ${Object.values(error).join(', ')}` , {id: "whishlist"});
             setLoading(false);
             
           }
         });
     }else {
                 toast.loading("Adding...", { id: "whishlist"});
         router.post(route('whistlist.store'),  data, { 
           preserveScroll: true,
           preserveState: true,
           forceFormData: true, 
           onSuccess: () => {
   
          
             toast.success("Added from wishlist", { id: "whishlist"});
             setLoading(false);
           },
           onError: (error) => {
             console.error("Submit error:" , error);
           toast.error(`Error: ${Object.values(error).join(', ')}` , {id: "whishlist"});
             setLoading(false);
             
           }
         });
     }
    } catch (error) {
      console.log(error)
      toast.error("Network error");
    } 
  });
}

onClick()
 


  }

  return (
  
    <Card className={cn("w-full  h-full   gap-4 max-w-sm shadow-none border-0 p-0 bg-background dark:bg-background" )} {...props}>
        <CardContent className={cn(" group rounded-xl overflow-hidden bg-background relative px-0  min-h-[18em] md:min-h-[21em]  " , className )}>
      {label && (

          <Badge  className="absolute z-30 bg-primary/80 rounded-xl top-2.5 left-2.5">
           {label}
          </Badge>
      )}
      <CardAction className=" absolute pt-1.5 md:pt-0  h-full justify-between bottom-0 right-0 flex flex-col">
    <Tooltip>

      <TooltipTrigger   onClick={handleWhishlist}   render={  
        <Button  size={"sm"} variant={"ghost"} className={cn("  hover:bg-primary    z-40    text-accent   md:py-5   rounded-full" ,


          ( Product.is_whislisted ) ? 'hover:text-primary  transition-all duration-300   ease-out   [&_svg]:fill-primary hover:[&_svg]:fill-none  hover:[&_svg]:text-accent' : ''
        )}>

  <Heart  className={cn("     transition-all duration-300 ease-out " ,

( Product.is_whislisted ) ? ' size-6 text-primary ' : 'size-5 text-white dark:text-black'
  )}/>


    </Button>} />
      <TooltipPanel
       
      >
        
        <p>{ Product.is_whislisted ? 'Remove from Whistlist' :  'Add to whishlist'}</p>
      </TooltipPanel>

    </Tooltip>
          <Tooltip>

      <TooltipTrigger render={
          <Button  className="    lg:size-12    relative z-40 size-11 rounded-full ">
  <ShoppingCart className=" size-5.5 "/>
</Button>} />
      <TooltipPanel
       
      >
        
        <p>Buy Now</p>
      </TooltipPanel>
   
    
         
       
           </Tooltip>
        </CardAction>
             <div className="absolute z-30 bottom-0 right-0 size-14.5 lg:size-16">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62 62" className=" relative z-20">
    <path d="M 36 10 L 52 10 C 57.523 10 62 5.523 62 0 L 62 62 L 0 62 C 5.523 62 10 57.523 10 52 L 10 36 C 10 21.641 21.641 10 36 10 Z" fill="var(--background)"/>
</svg>
          </div>
 
             <Link 
           href={`/products/${Product.id}`}
           className=" absolute h-full w-full"
             >
               <MediaItem 
        webViewLink={`${Product.cover_image}`}
       
          className={cn("  rounded-xl opacity-100 transition-all duration-300 ease-out     object-center  object-cover w-full h-full ",

          showcase_images &&   showcase_images.length > 0 &&  "group-hover:opacity-0"
          )}
        
          />

         
             </Link>
             <Link 
      href={`/products/${Product.id}`}
           className="  absolute h-full w-full"
             >
              {  showcase_images &&  showcase_images.length > 0 && (

        <MediaItem 
           webViewLink={`${appDomain}${showcase_images[0].preview}`}
          className="  rounded-xl   transition-all duration-300 ease-out opacity-0    group-hover:opacity-100  object-center  object-cover w-full h-full"
     
          />
              )}
         
         
             </Link>
      
      </CardContent>
          <Link 
          className=" space-y-4 lg:space-y-4"
    href={`/products/${Product.id}`}
      >

      <CardHeader   className=" pl-0 py-0 pr-2.5 bg-background ">
        <Badge  variant={"outline"} className="  w-fit lg:text-sm border-0 p-0">
        <Star className=" size-4 fill-primary text-primary"/>  <span className=" font-medium">{ Product.reviews_avg_star_rating != null ?  Math.round(Product.reviews_avg_star_rating! * 10) / 10 : 0.0 }</span>
<span className=" text-muted-foreground">({Product.reviews_count})</span>
        </Badge>
        <CardTitle className=" lg:text-lg leading-6 line-clamp-2">{Product.name} </CardTitle>
        {/* <CardDescription>
          Enter your email below to login to your account
        </CardDescription> */}
      
      </CardHeader>
    
      <CardFooter className=" text-left  bg-background  p-0">
        <div className=" flex flex-col">

       <h1 className=" text-left     font-semibold  lg:text-lg ">{Price}</h1>
       <p className="   md:text-sm text-xs text-accent-foreground/90 line-clamp-1">{Product.orders_count} Product terjual </p>
        </div>
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </CardFooter>
      </Link>
    </Card>
    
  )
}
