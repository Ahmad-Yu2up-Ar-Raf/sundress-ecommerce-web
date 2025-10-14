import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/fragments/shadcn-ui/card"
import { cn } from "@/lib/utils"
import { ProductsSchema } from "@/lib/validations/index.t"
import MediaItem from "../../fragments/custom-ui/MediaItem"
import { InputToggle } from "../../fragments/custom-ui/toggle-cart"
import { useState } from "react"
import { formatIDR } from "@/hooks/use-money-format"
import { Button } from "../../fragments/shadcn-ui/button"
import { Trash2 } from "lucide-react"


type componentProps = {
    className? : string
    Product: ProductsSchema
}

  export default function CartProductsCard({ ...props } : componentProps) {
    const Product = props.Product
    const [value, setValue] = useState(0)
    return(
        <Card className={cn("w-full overflow-hidden rounded-none   h-[5.5em]   justify-between flex-row gap-5  shadow-none border-0 p-0 bg-background " )} >
            <CardContent className=" gap-6 px-0 flex flex-row">

            <div className="w-25 overflow-hidden  rounded-xl  h-full  flex-row gap-5  shadow-none border-0 p-0 bg-background">

         <MediaItem 
        webViewLink={`${Product.cover_image}`}
       
          className={cn(" relative h-full w-full flex-shrink-0 overflow-hidden "

        
          )}
        
          />
 
            </div>
            <div
            
               data-slot="card-header"
            className=" gap-0.5 flex pb-0.1 justify-between flex-col">
       
       <div className=" space-y-0.5">

        <CardTitle className="  capitalize  text-lg leading-6 line-clamp-1">{Product.name} </CardTitle>
        <CardDescription className=" text-sm">
        Black • Standard
        </CardDescription>
       </div>
       <CardAction>

        <InputToggle 
    
        value={value} 
        onChange={setValue}
      />
       </CardAction>
      </div>
            </CardContent>
            <div
            
             
            className="  w-fit text-right gap-0.5 flex pb-0.1 justify-between items-end content-end flex-col">
                  

        <Trash2 className=" cursor-pointer  size-4.5 text-muted-foreground hover:text-accent-foreground"/>

    
               
  <h5 className=" ">
 <span className="text-sm font-bold">
     {formatIDR(Product.price)}
    
    </span>
    <span className=" block line-through text-muted-foreground text-xs">
    $399.99 
    </span>
    </h5>  
      </div>
    
    </Card>
    )
  }