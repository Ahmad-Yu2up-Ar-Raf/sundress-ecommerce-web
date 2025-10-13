"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { ProductForm } from "../form/products-form";
import { ProductsSchema, productsSchema } from "@/lib/validations/index.t";
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
import { router } from "@inertiajs/react";

import { cn } from "@/lib/utils";


interface type  extends React.ComponentPropsWithRef<typeof Sheet>{
  trigger? : boolean

}


export function CreateproductsSheet({ ...props}: type) {

  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);  




  const isDesktop = useIsMobile();

  const form = useForm<ProductsSchema>({
    mode: "onSubmit", 
    defaultValues: {
      name: "", 
      description: "",
      status : "available",
      category: "toys",
      price : 0, 
      free_shipping : false
    },
    resolver: zodResolver(productsSchema),
  }) 

function onSubmit(input: ProductsSchema) {
   
    
    
console.log(input)
    toast.loading("products creating....", {
      id: "create-products"
    });
    
  startTransition(() => {
    setLoading(true);

    // Prepare data dengan struktur yang benar



    router.post(route(`seller.products.store`), input, { 
      preserveScroll: true,
      preserveState: true,

      onSuccess: () => {
        form.reset();
        props?.onOpenChange!(false);
        toast.success("products created successfully", {
          id: "create-products"
        });
        setLoading(false);
      },
      onError: (error) => {
        console.error("Submit error:", error);
        toast.error(`Error: ${Object.values(error).join(', ')}`, {
          id: "create-products"
        });
        setLoading(false);
      },
      onFinish: () => {
        setLoading(false);
 
      }
    });
  });
}

if (!isDesktop) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange} modal={true} >
 
      <SheetTrigger asChild  className={cn(props.trigger == false && "sr-only" )} >
        <Button variant="outline" className=" text-sm  w-fit bg-background" size="sm">
          <Plus  className=" mr-3 "/>
          Add New 
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 overflow-y-scroll ">
        <SheetHeader className="text-left sm:px-6 space-y-1 bg-background z-30  sticky top-0   p-4 border-b  ">
          <SheetTitle className=" text-lg">Add New <Button type="button"   variant={"outline"} className=" ml-2  px-2.5 text-base capitalize">products</Button> </SheetTitle>
          <SheetDescription className=" sr-only">
            Fill in the details below to create a new task
          </SheetDescription>
        </SheetHeader>
        <ProductForm type="products" isPending={loading} form={form}   onSubmit={onSubmit}>
          <SheetFooter className="gap-3 px-3 py-4 w-full flex-row justify-end  flex  border-t sm:space-x-0">
            <SheetClose disabled={loading} asChild onClick={() => form.reset()}>
              <Button  disabled={loading} type="button" className="  w-fit" size={"sm"} variant="outline">
                    {loading && <Loader className="animate-spin" />}
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={loading} type="submit" className="w-fit dark:bg-primary !pointer-products-auto  dark:text-primary-foreground  bg-primary text-primary-foreground " size={"sm"}>
              {loading && <Loader className="animate-spin" />}
              Add
            </Button>
          </SheetFooter>
        </ProductForm>
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

         <ProductForm   type="products" isPending={loading} form={form}  onSubmit={onSubmit}>
        <DrawerFooter className="gap-3 px-3 py-4 w-full flex-row justify-end  flex  border-t sm:space-x-0">
             <DrawerClose disabled={loading} asChild onClick={() => form.reset()}>
                            <Button  disabled={loading} type="button" className="  w-fit" size={"sm"} variant="outline">
                                  {loading && <Loader className="animate-spin" />}
                              Cancel
                            </Button>
                          </DrawerClose>
                          <Button type="submit"  disabled={loading} className="w-fit  !pointer-products-auto  dark:bg-primary  dark:text-primary-foreground  bg-primary text-primary-foreground " size={"sm"}>
                            {loading && <Loader className="animate-spin" />}
                            Add
                          </Button>
        </DrawerFooter>
          </ProductForm>
      </DrawerContent>
    </Drawer>
)
}