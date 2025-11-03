// components/ui/product-detail-page.tsx
import * as React from "react";
import { ChevronRight, Star, Tag, Ruler, Users, Info, Heart, Share2, ShoppingCart, Send, Camera, ChevronLeft, TagIcon, InfoIcon, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils"; // Your utility for merging tailwind classes
import { Button, buttonVariants } from "@/components/ui/fragments/shadcn-ui/button";
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/fragments/shadcn-ui/avatar";
import { ProductsSchema } from "@/lib/validations/index.t";
import { Vendor } from "@/types";
import { Link } from "@inertiajs/react";

import { ProductStatus } from "@/config/enums/ProductsStatus";
import { CategoryProductsStatus } from "@/config/enums/CategoryProductsStatus";
import { getProductStatusIcon } from "@/lib/utils/products/ProductsStatus-utils";
import { getCategoryIcon } from "@/lib/utils/products/category-utils";
import ThumnailSlider from "@/components/ui/fragments/custom-ui/ui-layout/image-carousel";
import { batasiKata } from "@/hooks/use-worldMax";
import { handleWhishlist } from "@/lib/actions/whishlis-actions";
import { handleCart } from "@/lib/actions/cart-action";
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";
import {  
   Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,} from "@/components/ui/fragments/shadcn-ui/accordion";
import { useInitials } from "@/hooks/use-initials";




export interface ProductDetailPageProps {
  product: ProductsSchema  & {
  vendor : Vendor
} ;


}

// A small component for rendering rating stars
const StarRating = ({ rating, className }: { rating: number; className?: string }) => (
  <div className={cn("flex items-center gap-0.5", className)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50"
        )}
      />
    ))}
    <span className="ml-2 text-sm font-medium text-muted-foreground">{rating}</span>
  </div>
);


export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const seller = product.vendor
  const shocase =   product.showcase_images as unknown as string[]
    const images : string[] = [
      product?.cover_image! as string,
      ...shocase
    ]
         const status = product.status as ProductStatus
         const category = product.category as CategoryProductsStatus
         const IconStatus = getProductStatusIcon(status );
         const IconProduct = getCategoryIcon(category );
         const maxWord =  batasiKata(seller.store_addres, 2)
           const [loading, setLoading] = React.useState(false);  
           const initial = useInitials()
  return (
    <section className="mx-auto   px-5 pt-5  lg:space-y-8  h-fit sm:px-10 container max-w-[80em] space-y-5 ">
      {/* Breadcrumbs Navigation */}
        <nav className='z-50 top-0 bg-background/95 backdrop-blur flex items-center justify-between'>
        <Link 
          href="/" 
          className={cn(
            buttonVariants({ variant: "link" }), 
            'flex has-[>svg]:px-0 w-fit py-2 md:flex text-base items-center gap-1 px-0 group transition-colors'
          )}
        >
          <ChevronLeft className=" group-hover:-translate-x-1 group-hover:transform transition-all ease-out duration-300" />
          <span>Back</span>
        </Link>
      </nav>




      {/* Main content grid */}
      <main className="grid grid-cols-1 h-full lg:min-h-[38em] w-full lg:grid-cols-2 md:gap-10 gap-4 lg:gap-15">
        {/* Image Gallery Section */}
      <ThumnailSlider images={images}/>

        {/* Product Details Section */}
        <article className="space-y-7 lg:px-5    ">
          <header className=" md:space-y-6 lg:space-y-7 space-y-4">
              <div className=" space-y-2">
            <Badge  variant={"outline"} className="   text-accent-foreground w-fit lg:text-xs border-0 p-0">
                  <Star className=" size-3 fill-yellow-500 text-yellow-500"/>  <span className=" font-bold">{ product.reviews_avg_star_rating != null ?  Math.round(product.reviews_avg_star_rating! * 10) / 10 : 0.0 }</span>
          <span className="">({product.reviews_count})</span>
                  </Badge>

          <h1 className="text-xl md:text-4xl font-extrabold tracking-tighter">{product.name}</h1>
              </div>
          <div className="">
            <h2 className="text-left text-lg   font-semibold ">{product.formatted_price}</h2>
            <p className="text-xs   text-muted-foreground">
             Prices incl. VAT plus shipping costs
            </p>
          </div>

          <div className="flex gap-2 md:mt-0 mt-6 [&_svg]:size-5  [&_button]:text-sm">
            <Button 
            disabled={loading}
            onClick={() => {handleCart({ setLoading: setLoading , Product: product})}} 
            size="lg" className="flex-1 gap-4 w-full">
              {loading ? (

              <Spinner  className="" />
              ):   <ShoppingCart className=""/> }
               Add To Cart</Button>
            <Button
                       disabled={loading}
             onClick={() => {handleWhishlist({ setLoading: setLoading  , Product: product})}}  
            size="lg" variant="outline" className=" sm:flex-1 gap-4  w-fit ">
               {loading ? (
<Spinner  className="" />
               
              ):   <Heart className={cn("" ,

                ( product.is_whislisted ) && ' size-6 text-destructive  fill-destructive' )}/>}
              
              
              <span className="  hidden md:inline-flex">

              {(!product.is_whislisted)  ? "Add To Whishlist" : "Remove From Whishlist"}
              </span>
              
              </Button>
          </div>
          </header>

          {/* Tags/Badges */}
          <div className="flex flex-wrap gap-2 [&_svg]:size-3.5 ">
           
              <Badge  variant="secondary" icon={IconProduct} className=" font-normal py-1 px-3 gap-2">
               {product.category}
              </Badge>
              <Badge  variant="secondary" icon={IconStatus} className=" font-normal py-1 px-3 gap-2">
               {product.status}
              </Badge>
        
         <Badge icon={TagIcon} variant={"secondary"}  className="font-normal py-1 px-3 gap-2">
             Free Shipping
              </Badge>
             
           <Badge icon={InfoIcon} variant={"secondary"}  className="font-normal py-1 px-3 gap-2">
             New 
              </Badge>
          </div>

          {/* Description */}
   
  <Accordion
 
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem >
        <AccordionButton>Product Information</AccordionButton>
        <AccordionPanel className="flex flex-col gap-4 text-balance">
          <p>
            {product.description}
          </p>
          {/* <p>
            Key features include advanced processing capabilities, and an
            intuitive user interface designed for both beginners and experts.
          </p> */}
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem >
        <AccordionButton>Shipping Details</AccordionButton>
        <AccordionPanel className="flex flex-col gap-4 text-balance">
          <p>
            We offer worldwide shipping through trusted courier partners.
            Standard delivery takes 3-5 business days, while express shipping
            ensures delivery within 1-2 business days.
          </p>
          <p>
            All orders are carefully packaged and fully insured. Track your
            shipment in real-time through our dedicated tracking portal.
          </p>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className=" ">
        <AccordionButton>Return Policy</AccordionButton>
        <AccordionPanel className="flex flex-col gap-4 text-balance">
          <p>
            We stand behind our products with a comprehensive 30-day return
            policy. If you&apos;re not completely satisfied, simply return the
            item in its original condition.
          </p>
          <p>
            Our hassle-free return process includes free return shipping and
            full refunds processed within 48 hours of receiving the returned
            item.
          </p>
        </AccordionPanel>
      </AccordionItem>

       
          </Accordion>
          {/* Seller Information */}
          <div className="">
             <Link 
             href={`/vendor/${seller.id}`}
             className={cn(buttonVariants({variant: "ghost"}) ,"flex px-1 h-full justify-between items-center")}>
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={seller.cover_image} alt={seller.store_name} />
                        <AvatarFallback>{initial(seller.store_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold line-clamp-1">{seller.store_name}</p>
                        <p className=" text-xs line-clamp-1">{maxWord}</p>
                    </div>
                </div>
                <div  className={cn(buttonVariants({variant: "link"}) ,"text-primary flex items-center")}>
                <span className=" sr-only">
 Visit Store
                </span>
                    <ArrowRight/>
                </div>
            </Link>
          </div>
        </article>
      </main>
    </section>
  );
};