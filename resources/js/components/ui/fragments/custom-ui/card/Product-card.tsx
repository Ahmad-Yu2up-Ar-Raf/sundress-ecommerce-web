'use client'
import { Button } from "@/components/ui/fragments/shadcn-ui/button"
import {
  Card,
  CardAction,
  CardContent,

  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/fragments/shadcn-ui/card"

import { Heart, ShoppingCart,  Star } from "lucide-react"

import { Badge } from "../../shadcn-ui/badge"
import { Link, } from "@inertiajs/react"

import MediaItem from "../MediaItem"
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "@/components/ui/fragments/custom-ui/animate-ui/tooltip"
import { ProductsSchema } from "@/lib/validations/index.t"

import React from "react"



import { cn } from "@/lib/utils"

import { getCategoryColor, getCategoryIcon } from "@/lib/utils/products/category-utils"
import { CategoryProductsStatus } from "@/config/enums/CategoryProductsStatus"
import { handleCart } from "@/lib/actions/cart-action"
import { handleWhishlist } from "@/lib/actions/whishlis-actions"

type ProductProps  = {
  Product: ProductsSchema;
  className?: string;
  isWhistlist?: boolean | null;

  label?: string
    index?: number
}

export function ProductCard({ Product ,className , index  , label , isWhistlist,...props }: ProductProps & React.HTMLAttributes<HTMLDivElement>) {
  const [loading, setLoading] = React.useState(false);  
const Price = Product.formatted_price


   const showcase_images  = Product.showcase_images 




 

     const category = Product.category as CategoryProductsStatus
     const IconProduct = getCategoryIcon(category );
     const ColorProduct = getCategoryColor(category );
  return (
  
    <Card 
     
    className={cn("w-full   h-full m-auto   gap-4 max-w-sm shadow-none border-0 p-0 bg-background dark:bg-background" )} {...props}>
        <CardContent className={cn(" group rounded-xl overflow-hidden bg-background relative px-0  min-h-[16em] md:min-h-[21em]  " , className )}>
    

    <Badge
    icon={IconProduct}
          variant="outline"
          className={cn(
            'absolute z-30 bg-primary/80   font-semibold   text-[9px] md:text-xs    capitalize rounded-xl top-2.5 left-2.5 text-primary-foreground',
            ColorProduct
          )}
        >
          
          {category}
        </Badge>

      <CardAction className=" absolute pt-1.5 md:pt-0  h-full justify-between bottom-0 right-0 flex flex-col">
    <Tooltip>

      <TooltipTrigger   onClick={() => {handleWhishlist({ setLoading: setLoading , Product: Product})}}   render={  
        <Button  size={"sm"} variant={"ghost"} className={cn("  hover:bg-destructive    z-40  px-0      md:py-5     rounded-full" ,


          ( Product.is_whislisted ) ? 'hover:text-destructive  transition-all duration-300   ease-out   [&_svg]:fill-destructive hover:[&_svg]:fill-none  hover:[&_svg]:text-accent' : ''
        )}>

  <Heart  className={cn("    border-white   transition-all duration-300 ease-out " ,

( Product.is_whislisted ) ? ' size-6 text-destructive ' : 'size-5 text-white'
  )}/>


    </Button>} />
      <TooltipPanel
       
      >
        
        <p>{ Product.is_whislisted ? 'Remove from Whistlist' :  'Add to whishlist'}</p>
      </TooltipPanel>

    </Tooltip>
          <Tooltip>

      <TooltipTrigger onClick={() => {handleCart({ setLoading: setLoading , Product: Product})}} render={
          <Button  className="  text-white   lg:size-12    relative z-40 size-11 rounded-full ">
  <ShoppingCart className=" size-5.5 "/>
</Button>} />
      <TooltipPanel
       
      >
        
        <p>Add to cart</p>
      </TooltipPanel>
   
    
         
       
           </Tooltip>
        </CardAction>
             <div className="absolute z-30 bottom-0 right-0 size-14.5 lg:size-16">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62 62" className=" relative z-20">
    <path d="M 36 10 L 52 10 C 57.523 10 62 5.523 62 0 L 62 62 L 0 62 C 5.523 62 10 57.523 10 52 L 10 36 C 10 21.641 21.641 10 36 10 Z" fill="var(--background)"/>
</svg>
          </div>
 
             <Link 
           href={`/explore/${Product.id}`}
        
           className="  cursor-zoom-in  absolute h-full w-full"
             >
               <MediaItem 
        webViewLink={`${Product.cover_image}`}
   
          className={cn("  rounded-xl opacity-100 transition-all duration-300 ease-out     object-center  object-cover w-full h-full ",

          showcase_images &&   showcase_images.length > 0 &&  "group-hover:opacity-0"
          )}
        
          />

         
             </Link>
             <Link 
      href={`/explore/${Product.id}`}
           className="  absolute h-full w-full"
             >
              {  showcase_images &&  showcase_images.length > 0 && (

        <MediaItem 
           webViewLink={`${showcase_images[0]}`}
     
          className="  rounded-xl   transition-all duration-300 ease-out opacity-0    group-hover:opacity-100  object-center  object-cover w-full h-full"
     
          />
              )}
         
         
             </Link>
      
      </CardContent>
          <Link 
          className=" space-y-4 lg:space-y-4"
    href={`/explore/${Product.id}`}
      >

      <CardHeader   className=" pl-0 py-0 pr-2.5 bg-background ">
                <Tooltip>
 <TooltipTrigger  className="w-fit">

        <Badge  variant={"outline"} className="   text-accent-foreground w-fit lg:text-sm border-0 p-0">
        <Star className=" size-4 fill-primary text-primary"/>  <span className=" font-medium">{ Product.reviews_avg_star_rating != null ?  Math.round(Product.reviews_avg_star_rating! * 10) / 10 : 0.0 }</span>
<span className="">({Product.reviews_count})</span>
        </Badge>
 </TooltipTrigger>
            <TooltipPanel
       
      >
        
        <p>Average Rating</p>
      </TooltipPanel>
        </Tooltip>
        <CardTitle className=" font-medium tracking-tight lg:text-lg leading-6 line-clamp-2">{Product.name} </CardTitle>
        {/* <CardDescription>
          Enter your email bel ow to login to your account
        </CardDescription> */}
      
      </CardHeader>
    
      <CardFooter className=" text-left  bg-background  p-0">
        <div className=" flex flex-col">

       <h1 className=" text-left    font-medium  ">{Price}</h1>
       <p className="   md:text-sm text-xs text-accent-foreground/90 line-clamp-1">{Product.order_item_count || 0} Sold </p>
        </div>
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
      </CardFooter>
      </Link>
    </Card>
    
  )
}
