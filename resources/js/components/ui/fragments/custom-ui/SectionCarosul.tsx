"use client"
import { ProductCard } from './Product-card';

import React from 'react'



import {
  Carousel,

  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/fragments/shadcn-ui/carousel";
import { cn } from '@/lib/utils';
import { ProductsSchema } from '@/lib/validations/index.t';


import { SkeletonCard } from './CardSkeletons';
import { Badge } from '@/components/ui/fragments/shadcn-ui/badge';
import { Link } from '@inertiajs/react';
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronRight } from 'lucide-react';





type componentsProps = {
title?: string
label?: string
href?: string
linkLabel?: string
loading: boolean
tag?: string


data: ProductsSchema[]
}


function ProductsCarousel({ linkLabel = "Explore more" , title="Newest Products"  , ...props }: componentsProps) {

  const isMobile = useIsMobile()


  return (
    <section  className='container space-y-10 '> 

    <header className='  px-4    flex-row flex justify-between items-end'>
      <h1 className=' pr-3 text-2xl md:text-3xl lg:items-center  flex-col gap-1 lg:gap-1 flex lg:flex-row  font-bold'>
        {title}
        {props.label && (

        <Badge size={"lg"} className=' ml-3  font-bold text-primary-foreground  rounded-lg   scale-110 -rotate-2 lg:-rotate-6 text-lg md:text-xl' >
         {props.label}
        </Badge>
        )}
      </h1>
      {props.href && (

      <Link
      className={cn( 
        buttonVariants({variant : "secondary"})
        , '  text-xs px-3 py-0 text-black' )}
      href={props.href}
      >
      {linkLabel}
      <ChevronRight/>
      </Link>
      )}
    </header>
      {props.loading ? (
    <div className="  pl-4  overflow-hidden xl:px-0  grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4  gap-y-9 gap-x-3  sm:gap-y-10 xl:gap-x-2.5 ">

       <SkeletonCard/>
       <SkeletonCard/>
      
      {!isMobile && (
        <>
        <SkeletonCard/>
        
        <SkeletonCard/>
        </>
          
      )}
     
      </div>   
      ) : (

      <Carousel
       
          opts={{
            align: "start",
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="mx-4 relative cursor-grab  2xl:mr-[max(0rem,calc(50vw-700px))]">
            {props.data!.map((item : ProductsSchema , i : number) => 
            {

              return(
                <CarouselItem
                  key={i}
                  className={cn("max-w-[210px]  relative z-40  md:max-w-[300px]" , 
  
    i > 0 ? 'pl-1.5' : 'pl-0',
                  )}
                >
                   <ProductCard key={i} label={props.tag}className=' min-h-[17em] ' Product={item}/>
                </CarouselItem>
              )
            }
            
            )}
          
          </CarouselContent>
            <CarouselPrevious  />
      <CarouselNext/>
        </Carousel>
      )}


    </section>
  )
}

export default ProductsCarousel




