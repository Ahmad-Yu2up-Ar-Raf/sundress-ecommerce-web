"use client"



import {
  Carousel,

  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/fragments/shadcn-ui/carousel";
import { cn } from '@/lib/utils';



import { Badge } from '@/components/ui/fragments/shadcn-ui/badge';
import { Link } from "@inertiajs/react";
import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button';
import { OptionItem } from '@/types'
import { CategoryProductsOptions } from "@/config/enums/CategoryProductsStatus";
import CategoryCard from "@/components/ui/fragments/custom-ui/card/CategoryCard";


type componentsProps = {
title?: string
label?: string
href?: string
linkLabel?: string


}


function CategoryCarousel({ linkLabel = "Explore more" , title="Products category"  , ...props }: componentsProps) {

  

  return (
    <section  className='  container  space-y-7'> 

    <header className='  px-4   flex-row flex justify-between items-end'>
      <h1 className=' text-2xl md:text-3xl lg:items-center  flex-col gap-1 lg:gap-1 flex lg:flex-row  font-bold'>
        {title}
        {props.label && (

        <Badge className=' ml-3  font-bold    scale-110 -rotate-2 lg:-rotate-6 text-lg md:text-xl' >
         {props.label}
        </Badge>
        )}
      </h1>
      {props.href && (

      <Link
      className={cn( 
        buttonVariants({variant : "secondary"})
        , '  text-xs p-3' )}
      href={props.href}
      >
      {linkLabel}
      </Link>
      )}
    </header>
     
      <Carousel
          className=' lg:sr-only'
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
            {CategoryProductsOptions.slice(0,5).map((item : OptionItem , i : number) => (
              <CarouselItem
                key={i}
                className={cn("max-w-[210px]  basis-full relative z-40  md:max-w-[300px]" , 

  i > 0 ? 'pl-1' : 'pl-0',
                )}
              >
                 <CategoryCard CategoryData={item }  className=' min-h-[7em] '/>
              </CarouselItem>
            ))}
          
          </CarouselContent>
            <CarouselPrevious  />
      <CarouselNext/>
        </Carousel>
        <div className=" px-4  ">
  
  <div className="    sr-only lg:not-sr-only   grid  grid-cols-5  gap-1.5">
      {CategoryProductsOptions.slice(0,5).map((item,i) => {

return (
<CategoryCard CategoryData={item}  key={i} className=' min-h-[9.7em] cursor-pointer '/> 
      ) })}
  </div>
</div>


    </section>
  )
}

export default CategoryCarousel




