
import Providers from "@/components/ui/core/layout/provider";
import ProductsBlock from "@/components/ui/core/block/pages/ProductsBlock";
import { ApiResponse } from "@/types";




export default function Pages({ ...props }: ApiResponse &  {
    totalProducts : number
  }   ) {

console.log(props.data)


  return (
    <Providers>
    <ProductsBlock Data={props}/>
    </Providers>
  );
}
