import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { ProductsSchema } from "../validations/index.t";



   type functionType = {
 setLoading?: React.Dispatch<React.SetStateAction<boolean>>

 Product: ProductsSchema
   }
  export async  function handleWhishlist({ setLoading , Product }: functionType) {


  setLoading!(true)
const data = { product_id: Product.id }   
    try {
      if(Product.is_whislisted == true) {
       toast.loading("Removing...", { id: "whishlist"});
  
         router.delete(route('whishlist.destroy', Product.id), {
             preserveScroll: true,
                preserveState: true,
            onBefore: () => setLoading!(true),
            onSuccess: () => {
              toast.success("Product deleted successfully", { id: "whishlist" });
              // reload untuk memastikan data fresh
              router.reload();
            },
            onError: (errors: any) => {
              console.error("Delete error:", errors);
              toast.error(errors?.message || "Failed to delete the product", { id: "whishlist" });
            },
            onFinish: () => setLoading!(false)
          });
     }else {
                 toast.loading("Adding...", { id: "whishlist"});
         router.post(route('whishlist.store'),  data, { 
           preserveScroll: true,
           preserveState: true,
           forceFormData: true, 
           onSuccess: () => {
   
          
             toast.success("Added from wishlist", { id: "whishlist"});
             setLoading!(false);
           },
           onError: (error) => {
             console.error("Submit error:" , error);
           toast.error(`Error: ${Object.values(error).join(', ')}` , {id: "whishlist"});
             setLoading!(false);
             
           }
         });
     }
    } catch (error) {
      console.log(error)
      toast.error("Network error");
    } 


 


  }