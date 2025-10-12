"use client"


import React from 'react'




import { useEffect, useState } from "react";
import {   useProducts } from "@/hooks/actions/useProducts";
import { ApiResponse } from '@/types';
import ProductsCarousel from '@/feature/auth/components/SectionCarosul';








function ProductsBestRating() {
  const [isWhistlist , setWistlist] = useState<boolean | null >(null)
  const { getProducts } = useProducts();
  const [DataProducts, setData] = useState<ApiResponse >();
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    (async () => {
      const res = await getProducts({ params: {  
         order_by: "reviews_avg_star_rating"
      }});
      if (res) setData(res);
      setLoading(false);
    })();
  }, [isWhistlist]);

  
 
  return (
<ProductsCarousel href='/'   isWhistlist={isWhistlist} label='Good quality!' setWhistlist={setWistlist} title='Top Rating'  loading={loading} data={DataProducts?.data!} />
  )
}

export default ProductsBestRating




