// import { Promo } from "@/feature/layout/Promo";
// import AppSponsor from "@/components/ui/core/section/main/AppSponsor";
// import CategoryCarousel from "@/components/ui/core/section/main/Category";
import Providers from "@/components/ui/core/layout/provider";
import AppSponsor from "@/components/ui/core/section/main/AppSponsor";
import CategoryCarousel from "@/components/ui/core/section/main/Category";
import Hero from "@/components/ui/core/section/main/Hero";

import ProductsCarousel from "@/components/ui/fragments/custom-ui/SectionCarosul";
import { ProductsSchema } from "@/lib/validations/index.t";
import { ApiResponse } from "@/types";
// import ProductsBestRating from "@/components/ui/core/section/main/ProductsBestFeedback";
// import ProductsBestSeller from "@/components/ui/core/section/main/ProductsBestSeller";
// import ProductsFreeShipping from "@/components/ui/core/section/main/ProductsFreeShipping";

// import { Suspense } from "react";




export default function Pages({ ...props }: ApiResponse & {
  dataFreeShipping : ProductsSchema[]
  dataBestRating : ProductsSchema[]
  productsBestSeller : ProductsSchema[]
  
} ) {

console.log(props)


  return (
   <Providers>
      {/* <Suspense>
   
                       <Promo/>
                       </Suspense> */}
<Hero/>
<ProductsCarousel label='For You!' href='/'  tag='New' title='New products'  loading={false} data={props.data!} />
<ProductsCarousel tag='Free Shipping' href='/'   label='Free Shipping!' title='Products with '  loading={false} data={props.dataFreeShipping!} />

<AppSponsor/>
<CategoryCarousel/>
<ProductsCarousel label='Good quality!'title='Top Rating'   loading={false} data={props.dataBestRating!} />
<ProductsCarousel label='Most Sold!'title='Best Sellers'   loading={false} data={props.productsBestSeller!} />
{/* <ProductsBestSeller/>
<ProductsBestRating/> */}
   </Providers>
  );
}
