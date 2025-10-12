"use client";
import React, { useEffect } from "react";

import { ProductsSchema } from "@/lib/validations/index.t";
import { ProductCard } from "@/components/ui/Product-card";
import { BouncingDots } from "@/components/molecule-ui/bouncing-dots";
import { cn } from "@/lib/utils";
import {useProducts } from "@/hooks/actions/useProducts";
import { useState } from "react";
import { SkeletonCard } from "@/components/ui/fragments/shadcn-ui/CardSkeletons";
import { paramsProps } from "@/types";
import FilterDrawwer from "@/components/ui/fragments/shadcn-ui/FilterDrawwer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/fragments/shadcn-ui/select"


const InfiniteScrollDemo = ({  params }: paramsProps) => {
  const [products, setProducts] = useState<ProductsSchema[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [areMoreProducts, setAreMoreProducts] = useState(true);
  const [isWhistlist, setWistlist] = useState<boolean | null>(null);
    const { getProducts} = useProducts()
 const limit = 8;
// const [orderBy, setOrderBy] = useState<string >("created_at")
  const updateProduct = (productId: number | undefined, isWishlisted: boolean) => {
    setProducts(currentProducts => 
      currentProducts.map(product => 
        product.id === productId 
          ? { ...product, is_whislisted: isWishlisted }
          : product
      )
    );
  };


  const getProductss = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
       
   
   
    const { data: newProducts  , meta  } = await getProducts({      params : {

...params,

 perPage: limit , page: page
    } });
   setTotal(meta.pagination.total)
    if (newProducts.length < limit) {
      setAreMoreProducts(false);
    }

    if (page === 1) {
      setProducts(newProducts);
    } else {
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (areMoreProducts) {
      getProductss();
    }
  }, [page, areMoreProducts , isWhistlist ]);




  useEffect(() => {
    const handleScroll = () => {
      const buffer = 100;
      const currentPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const pageHeight = document.documentElement.scrollHeight;

      const distanceFromBottom = pageHeight - currentPosition;

      if (distanceFromBottom <= buffer && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading ]);


  return (

  <>

    <main className=" px-4  xl:px-0  grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4  gap-y-6 gap-x-1  sm:gap-y-10 xl:gap-x-2.5  ">
        {products.map((product ,i) => 
    

    <ProductCard
    key={i}
    className=" min-h-[15em]"
    Product={product}
    isWhistlist={isWhistlist}
    setWhistlist={setWistlist}
    onWishlistChange={(isWishlisted) => updateProduct(product.id, isWishlisted)}
  />
        )}
        </main>
          {(loading && products.length > 0) && <BouncingDots  className={cn(" bg-primary my-10 ")}/>}
          {(loading && products.length === 0) && (
             <div className=" px-4  md:px-0  grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4  gap-y-9 gap-x-3  sm:gap-y-10 xl:gap-x-2.5 ">
            
                   <SkeletonCard/>
                   <SkeletonCard/>
                   <SkeletonCard/>
                   <SkeletonCard/>
                 
                  </div>   
          )}
  </>
     

      
    
  );
};

export default InfiniteScrollDemo;
