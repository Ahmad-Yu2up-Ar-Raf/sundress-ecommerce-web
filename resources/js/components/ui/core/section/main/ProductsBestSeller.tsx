"use client"


import React from 'react'




import { useEffect, useState } from "react";
import {   useProducts } from "@/hooks/actions/useProducts";
import { ApiResponse } from '@/types';
import ProductsCarousel from '@/feature/auth/components/SectionCarosul';








function ProductsBestSeller() {
  const [isWhistlist , setWistlist] = useState<boolean | null >(null)
  const { getProducts } = useProducts();
  const [DataProducts, setData] = useState<ApiResponse >();
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    (async () => {
      const res = await getProducts({ params: {  
         order_by: "orders_count"
      }});
      if (res) setData(res);
      setLoading(false);
    })();
  }, [isWhistlist]);

  
 
  return (
<ProductsCarousel tag='Best Seller' href='/'   isWhistlist={isWhistlist} label='Top Seller!' setWhistlist={setWistlist} title='Our Best Seller'  loading={loading} data={DataProducts?.data!} />
  )
}

export default ProductsBestSeller




