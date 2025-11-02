"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

import { Button } from "../../../fragments/shadcn-ui/button";
import { ChevronLeft, ArrowRight, ArrowUp } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/fragments/shadcn-ui/carousel";
import { cn } from "@/lib/utils";

import { CategoryProductsOptions } from "@/config/enums/CategoryProductsStatus";
import HeaderProducts from "@/components/ui/core/layout/header/jelajahiProductsHeader";
import { ApiResponse } from "@/types";
import { ProductCard } from "@/components/ui/fragments/custom-ui/card/Product-card";
import { Link, router } from "@inertiajs/react";
  import debounce from "lodash.debounce";
import { buttonVariants } from "../../../fragments/shadcn-ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import SlidingPagination from "../../../fragments/custom-ui/sliding-pagination";

import { ProductsSchema } from "@/lib/validations/index.t";
interface ProductsBlockProps {
  initialKategori?: string;
  Data: ApiResponse & {
    totalProducts : number
  }
}

export default function ProductsBlock({ initialKategori = ""  , Data}: ProductsBlockProps) {

  const Products = Data.data
  const PaginatedData =  Data.meta!.pagination
  const filters =  Data.meta!.filters
  const [searchTerm, setSearchTerm] = React.useState(filters.search);
  const [category, setCategoryActive] = React.useState(filters.category || null);
         const currentPath = window.location.pathname;
         const pathNames = currentPath.split('/').filter(path => path)[1]


      const debouncedSearch = React.useMemo(
      () =>
        debounce((search: string) => {
          router.get(route(`explore.index`), {
            search: search
          }, {
            preserveState: true,
            preserveScroll: true
          });
        }, 300),
      [pathNames] // Update dependencies
  );




  const handleSearchChange = (value: string) => {

                  setSearchTerm(value);
                  debouncedSearch(value);
  };

  // Pagination
  const totalPages = Data.meta?.pagination.total;









const [page, setPage] = useState(PaginatedData.currentPage)
useEffect(() => {
    router.get(
                           route(`explore.index`),
                           { 
                             page: page,
                                  category:category,
                                  
                           },
                           { 
                             preserveState: true,
                             preserveScroll: false,
                            
                           }
                         )
}, [page,setPage])
const isMobile = useIsMobile()
    const [selectedItem, setSelectedItem] = useState<ProductsSchema | null>(null);
    const [selectedItemModal, setSelectedItemModal] = useState<number | null>(null)
 const [buttonDisableNext, setbuttonDisableNext] = useState<boolean>(false);
   const [buttonDisablePrevious, setbuttonDisablePrevious ]  = useState<boolean>(false);





    useEffect(() => {
         
 const dataModal : ProductsSchema | null = Products![selectedItemModal!]


const buttonDisableNextCheck : boolean = selectedItemModal ==   Products!.length - 1
   const buttonDisablePreviouscheck : boolean = selectedItemModal == 0

setSelectedItem(dataModal)

if(buttonDisableNextCheck) {
    setbuttonDisableNext(true)
}else {
       setbuttonDisableNext(false)
}




console.log(Data)




if(buttonDisablePreviouscheck){
    setbuttonDisablePrevious(true)
}else {
        setbuttonDisablePrevious(false)
}

     
    },[selectedItemModal, selectedItem, Products, buttonDisableNext, buttonDisablePrevious, category ])




  return (
    <>
      
    <div  className="mx-auto sm:px-10 container max-w-[77em]  pt-6 space-y-5 md:space-y-6 ">
      <HeaderProducts 
     

        searchQuery={searchTerm!}
        onSearchChange={handleSearchChange}
      />
      <section className="py-1 w-full  flex-1">
        <div className=" space-y-7">
          {/* Category Filter Carousel */}
          <Carousel
            className="overflow-hidden"
            opts={{
              align: "start",
              breakpoints: {
                "(max-width: 768px)": {
                  dragFree: true,
                },
              },
            }}
          >
            <CarouselContent className="mx-0.5 relative cursor-grab">
                   <CarouselItem
                
                  className={cn("")}
                >
                  <Link
                  href="/explore"
                  
                      className={buttonVariants({ variant: filters.category == ""  ? "default" : "outline"})}
                  >
                    All
                    <span className="ml-2 text-xs opacity-70">
       {Data.totalProducts}
                    </span>
                  </Link>
                </CarouselItem>
              {CategoryProductsOptions.map((kat, i) => {
 const count = Data.ProductscategoryCount[kat.value];
                return(
                  <CarouselItem
                    key={i}
                    className={cn(" ")}
                  >
                    <Button
                      variant={ kat.value  == filters.category ? "default" : "outline"}
                    
                           onClick={() => {
  setCategoryActive(kat.value)
                                   router.get(
                             route(`explore.index`),
                             { 
                              
                                    category: kat.value,
  
                             },
                             { 
                               preserveState: true,
                               preserveScroll: true,
                              
                             }
                           )
                              }}
                    >
                      {kat.label}
                      <span className="ml-2 text-xs opacity-70">
                  {count}
                      </span>
                    </Button>
                  </CarouselItem>
                )
              }
              
              )}
            </CarouselContent>
          </Carousel>

          {/* Current Filter Info */}
          <div className="flex gap-5  px-5 flex-wrap items-center justify-between ">
            <p className="text-xs text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{Products?.length}</span> dari{" "}
              <span className="font-semibold text-foreground">{Data.totalProducts}</span> products
              {searchTerm && (
                <span className="ml-1">
                  untuk "<span className="font-semibold text-foreground">{searchTerm}</span>"
                </span>
              )}
            </p>
            {(filters.category != "" || searchTerm) && (
              <Link
                href="/explore"
                className={cn( buttonVariants({ variant: "secondary"}) ,"text-primary  text-xs")}
              >
                Reset Semua
              </Link>
            )}
          </div>

          {/* Grid */}
          <div
     
            className="grid  px-5 lg:gap-y-14 gap-y-10 gap-2 sm:gap-7 md:gap-3   grid-cols-2 lg:grid-cols-4 md:grid-cols-3 w-full auto-rows-fr"
          >
            {(Products && Products.length > 0) ?  (
              Products.map((product, i) => (
                <ProductCard
                  index={i}
                  key={i}
                  Product={product}
                    
                  className="products-card  min-h-[14em]"
                />
              ))
            ) : (
               (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg text-center mb-2">
                  {searchTerm 
                    ? `Tidak ada inovasi yang cocok dengan "${searchTerm}"`
                    : "Belum ada inovasi di kategori ini"
                  }
                </p>
                <p className="text-gray-400 text-sm">
                  {searchTerm 
                    ? "Coba kata kunci lain"
                    : "Coba kategori lain atau reset filter"
                  }
                </p>
              </div>
            )
            )}
          </div>

          {/* Pagination */}
          {totalPages! > 1 && (
            <div className="flex px-5  gap-4 items-center justify-between mt-15">
              <Button
                variant="ghost"
                className=" px-0 has-[>svg]:px-0"
         disabled={PaginatedData.currentPage == 1}
                    onClick={() => {
                                 router.get(
                           route(`explore.index`),
                           { 
                             page: PaginatedData.currentPage - 1,
                                  category:category,
                                  
                           },
                           { 
                          preserveState: true,
                             preserveScroll: false,
                            
                           }
                         )
                            }}
                        
               
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
{!isMobile && (

              <SlidingPagination
              paginatedData={Data}
        totalPages={PaginatedData.lastPage}
        currentPage={page}
        onPageChange={setPage}
        maxVisiblePages={9} // optional, number of visible buttons
      />
)}
              <Button
                variant="ghost"
                                className="has-[>svg]:px-0 px-0"
                disabled={PaginatedData.currentPage === PaginatedData.lastPage}
                    onClick={() => {
                                router.get(
                        route(`explore.index`),
                          { 
                            page: PaginatedData.currentPage + 1,
                     
                            category: category,
                        
                          },
                          { 
                                     preserveState: true,
                             preserveScroll: false,
                         
                          }
                        )
                           }}
             
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Back to Top */}
        
        </div>
      </section>
    </div>
    </>
  );
}