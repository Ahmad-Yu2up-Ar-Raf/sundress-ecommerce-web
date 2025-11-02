import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { ProductsSchema } from "../validations/index.t";

   
   type functionType = {
 setLoading?: React.Dispatch<React.SetStateAction<boolean>>
 Product : ProductsSchema
   }
   export async  function handleCart({  setLoading , Product }: functionType) {



  setLoading!(true)
const data = { product_id: Product.id }   
    try {

                 toast.loading("Adding...", { id: "cart"});
         router.post(route('cart.add', Product.id),  data, { 
           preserveScroll: true,
           preserveState: true,
           forceFormData: true, 
           onSuccess: () => {
   
          
             toast.success("Product added to cart", { id: "cart"});
             setLoading!(false);
           },
           onError: (error) => {
             console.error("Submit error:" , error);
           toast.error(`Error: ${Object.values(error).join(', ')}` , {id: "cart"});
             setLoading!(false);
             
           }
         });
   
    } catch (error) {
      console.log(error)
      toast.error("Network error");
    } 


 


  }   