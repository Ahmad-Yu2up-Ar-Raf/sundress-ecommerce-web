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
import React, { useState, useCallback, useEffect } from "react"
import { formatIDR } from "@/hooks/use-money-format"
import { Button } from "../../fragments/shadcn-ui/button"
import { Trash2 } from "lucide-react"
import { cartCart } from "@/types"
import NumberFlow from "@number-flow/react"
import { router } from "@inertiajs/react";
import debounce from "lodash.debounce";
import { toast } from "sonner"
import { Badge } from "../../fragments/shadcn-ui/badge"

type componentProps = {
    className?: string
    ProductCart: cartCart
}

// di bagian atas komponen, destructure supaya jelas
export default function CartProductsCard({ ProductCart, className }: componentProps) {
  const Product = ProductCart.product
  const productId = Product.id

  const [value, setValue] = useState(ProductCart.quantity)
  const [subTotal, setSubTotal] = useState<number>(Product.price * ProductCart.quantity)

  useEffect(() => {
    setSubTotal(value * Product.price)
  }, [value, Product.price])

  const debouncedUpdate = useCallback(
    debounce((quantity: number, calculatedSubTotal: number) => {
      console.log('Updating cart:', { quantity, calculatedSubTotal, productId })
      console.log('patch url ->', route('cart.update', productId)) // debug: lihat url

      router.patch(
        route('cart.update', productId),
        {
          quantity,
          sub_total: calculatedSubTotal
        },
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: () => console.log('Cart updated successfully'),
          onError: (errors) => console.error('Failed to update cart:', errors)
        }
      )
    }, 600),
    [productId] // depend on cart item id
  )

  const handleQuantityChange = (newQuantity: number) => {
    setValue(newQuantity)
    const newSubTotal = newQuantity * Product.price
    debouncedUpdate(newQuantity, newSubTotal)
  }

 const [processing, setProcessing] = React.useState(false);

const handleDelete = (id: number) => {
  try {
    setProcessing(true);
    toast.loading("Product deleting...", { id: "products-delete" });

    router.delete(route('cart.destroy', id), {
       preserveScroll: true,
          preserveState: true,
      onBefore: () => setProcessing(true),
      onSuccess: () => {
        toast.success("Product deleted successfully", { id: "products-delete" });
        // reload untuk memastikan data fresh
        router.reload();
      },
      onError: (errors: any) => {
        console.error("Delete error:", errors);
        toast.error(errors?.message || "Failed to delete the product", { id: "products-delete" });
      },
      onFinish: () => setProcessing(false)
    });
  } catch (error) {
    console.error("Delete operation error:", error);
    toast.error("An unexpected error occurred", { id: "products-delete" });
    setProcessing(false);
  }
};

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedUpdate.cancel()
        }
    }, [debouncedUpdate])

    return (
        <Card className={cn("w-full  rounded-none h-[4.5em] justify-between flex-row gap-5 shadow-none border-0 p-0 bg-background" , className)}>
            <CardContent id="card-content" className="gap-4.5 px-0 flex flex-row">
                <div id="card-content-img" className="min-w-18.5 relative  rounded-xl h-full flex-row gap-5 shadow-none border-0 p-0 bg-background">
                    <MediaItem 
                        webViewLink={`${Product.cover_image}`}
                        className={cn("relative rounded-xl h-full w-full flex-shrink-0 overflow-hidden")}
                    />
                      <Badge
                size="sm"
                className="absolute z-20 rounded-xl bg-primary text-primary-foreground -top-1 -right-1 text-xs min-w-1 h-5 p-2 flex items-center justify-center"
              >
                  <NumberFlow
                        value={value}
                        className='text-[12px]'
                        
                    />
              </Badge>
                </div>
                
                <div
                    data-slot="card-header"
                    className="flex pb-0.1 justify-between flex-col"
                >
                    <div>
                        <CardTitle className="capitalize font-medium tracking-tight text-sm leading-6 line-clamp-1">
                            {Product.name}
                        </CardTitle>
                        <CardDescription className="tracking-tight text-[11px] ">
                            Stock • {Product.stock}
                        </CardDescription>
                    </div>
                    
                    <CardAction>
                        <InputToggle
                        max={Product.stock}
                            min={1}
                            value={value} 
                            onChange={handleQuantityChange}
                        />
                    </CardAction>
                </div>
            </CardContent>
            
            <div className="w-fit text-right gap-0.5 flex pb-0.1 justify-between items-end content-end flex-col">
                <Trash2
                
                onClick={() => {
                  handleDelete(productId!)
                }}
                className="cursor-pointer size-3.5 text-muted-foreground hover:text-accent-foreground"/>
                
                <h5>
                    <NumberFlow
                        value={subTotal}
                        className='text-sm'
                        format={{ 
                            style: 'currency', 
                            currency: 'IDR',   
                            minimumFractionDigits: 0  
                        }}
                    />
                    <span className="block line-through text-muted-foreground text-xs">
                        $399.99 
                    </span>
                </h5>  
            </div>
        </Card>
    )
}