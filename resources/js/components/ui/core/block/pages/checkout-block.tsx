"use client";

import { Button, buttonVariants } from "@/components/ui/fragments/shadcn-ui/button";
import {
Card,
CardContent,
CardHeader,
CardFooter,
CardTitle,
} from "@/components/ui/fragments/shadcn-ui/card";
import { Badge } from "@/components/ui/fragments/shadcn-ui/badge";
import { Input } from "@/components/ui/fragments/shadcn-ui/input";
import { Label } from "@/components/ui/fragments/shadcn-ui/label";
import { Checkbox } from "@/components/ui/fragments/shadcn-ui/checkbox";
import { Skeleton } from "@/components/ui/fragments/shadcn-ui/skeleton";
import React, { useState, useEffect } from "react";
import {
CreditCard,
Truck,
Shield,
MapPin,
Lock,

ShoppingBag,
Check,
ChevronLeft,
Percent,
X,

ClipboardList,

Notebook,
ChevronDown,
ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";


import { cartCart, OptionItem } from "@/types";
import { CountrySelector, ProvinceSelector } from "../../../fragments/custom-ui/input/location-input";
import { type SharedData } from '@/types';
import { Link, router, usePage } from "@inertiajs/react";
import { formatUSD } from "@/hooks/use-money-format";
import CartProductsCard from "@/components/ui/core/main/cart-product-card";
import { shippingMethods } from "@/config/enums/courier";
import { toast } from "sonner";
import { Spinner } from "../../../fragments/shadcn-ui/spinner";
import { Content, type Content as contentType } from "@tiptap/react"
import { PhoneInput } from "../../../fragments/custom-ui/input/phone-input";

import { MinimalTiptapEditor } from "../../../fragments/custom-ui/minimal-tiptap";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/fragments/shadcn-ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/fragments/shadcn-ui/avatar";
interface CheckoutSummary {
subtotal: number;
discount: number;
shipping: number | undefined;
tax: number;
total_price: number;
}

interface ShippingAddress {
firstName: string;
lastName: string;
email: string;
phone: string;
address: string;
country: string;
province: string;
zipCode: string;
shipping_method: string;
additional_information: string;
}

interface AdditionalInformation {
note: contentType;

}

export default function Checkout({ data : userCartData }: { data: cartCart[]}) {
const [orderItems, setOrderItems] = useState<cartCart[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [loading, setLoading] = useState(false);
const [currentStep, setCurrentStep] = useState<number>(1);
const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  country: "",
  province: "",
  zipCode: "",
  shipping_method :"",
  additional_information :"",
});





const [additionalInformation, setAdditionalInformation] = useState<AdditionalInformation>({
  note: "",
});

const [appliedPromo, setAppliedPromo] = useState<string>("SAVE10");
const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);



const [selectedShipping, setSelectedShipping]  = useState<OptionItem>(shippingMethods[0]);

useEffect(() => {
  const loadCheckout = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));
    setOrderItems(userCartData!);
    setIsLoading(false);
  };

  loadCheckout();
}, [userCartData]);



 const user = usePage<SharedData>().props.auth.user;

const calculateSummary = (): CheckoutSummary => {
  // ✅ CRITICAL: Gunakan item.price (dari cart_items table) bukan item.product.price
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price, // ✅ item.price sudah = product.price * quantity
    0
  );
  
  const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
  const shipping = selectedShipping?.price || 0; 
  const tax = (subtotal - discount) * 0.08;
  const total_price = subtotal - discount + shipping + tax;

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total_price,
  };
};

const MINIMUM_USD = 0.50;
const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
  setShippingAddress((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handleAdditionalChange = (field: keyof AdditionalInformation, value: Content) => {
  setAdditionalInformation((prev) => ({
    ...prev,
    [field]: value,
  }));
};




const validateStep = (step: number): boolean => {
  switch (step) {
    case 1:
      return !!(
        shippingAddress.firstName &&
        shippingAddress.lastName &&
        shippingAddress.email &&
        shippingAddress.address &&
        shippingAddress.country &&
        shippingAddress.province &&
        shippingAddress.zipCode
      );
    case 2:
     return !!(
        additionalInformation.note
      );
    case 3:
      return agreeToTerms;
    default:
      return false;
  }
};

const nextStep = () => {
  if (validateStep(currentStep)) {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }
};

const prevStep = () => {
  setCurrentStep((prev) => Math.max(prev - 1, 1));
};

const removePromo = () => {
  setAppliedPromo("");
};

const summary = calculateSummary();







function handlePayment() {
  const summary = calculateSummary();
  

  toast.loading("Setting up payment...", { id: "payment" });
  setLoading(true);

  const data = {
    ...additionalInformation,
    ...shippingAddress,
    ...summary, // ✅ Kirim summary yang sudah dihitung dengan benar
    shipping_method: selectedShipping.value,
  };

  console.log('Payment Data:', data); // ✅ Debug

  router.post(route('checkout.payment'), data, {
    preserveScroll: false,
    preserveState: false,
    onSuccess: (page) => {
      toast.dismiss("payment");
    },
    onError: (errors) => {
      console.error("Checkout error:", errors);
      toast.error(
        `Error: ${Object.values(errors).join(', ')}`,
        { id: "payment" }
      );
      setLoading(false);
    },
    onFinish: () => {
      setLoading(false);
    },
  });
}
const CheckoutSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 flex flex-col gap-6">
      <Card>
        <CardContent className="p-6 flex flex-col gap-5">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    <div className="flex flex-col gap-5">
      <Card>
        <CardContent className="p-4 flex flex-col gap-5">
          <Skeleton className="h-6 w-24" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);



const OrderSummaryCard = () => {
  const appliedShowMore = userCartData.length >= 7
  const [isOpen, setIsOpen] = React.useState(false)
  return(
  <Card className="flex pb-2.5 bg-background shadow-none border-2 border-muted   flex-col rounded-xl gap-5">
    <CardHeader className=" [.border-b]:pb-3 border-b pb-0 pt-0">
      <CardTitle className="font-semibold flex items-center gap-3">
        <ShoppingBag className="h-4 w-4 sr-only" />
        Order Summary
      </CardTitle>
    </CardHeader>
 
    <CardContent className="flex flex-col gap-7">
      {/* Order Items */}
         {appliedShowMore ? (
      
      <Collapsible 
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("flex flex-col gap-6   pt-2 relative     overflow-hidden"

      )}>
   
      
        {userCartData && userCartData.slice(0, 4).map((item ,i) =>  {
   
        return(
 <CartProductsCard key={i} className="   bg-background h-[4em]  [&_#card-content-img]:min-w-15" ProductCart={item}/>
        )})}
           <CollapsibleContent  className=" space-y-6">
        {userCartData && userCartData.slice(4, userCartData.length).map((item ,i) =>  {
   
        return(
 <CartProductsCard key={i} className="   bg-background h-[4em]  [&_#card-content-img]:min-w-15" ProductCart={item}/>
        )})}
           </CollapsibleContent>
             <CollapsibleTrigger  className=" w-full">
          <Button variant="outline" size="default" className="  py-7  justify-between w-full">
           {isOpen == false ?  
           (
            <>
                 <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2   *:data-[slot=avatar]:size-8">
        <Avatar className="">
          <AvatarImage src={`${userCartData[4].product.cover_image}`} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar className="">
          <AvatarImage
      src={`${userCartData[5].product.cover_image}`}
            alt="@maxleiter"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar className="">
          <AvatarImage
        src={`${userCartData[6].product.cover_image}`}
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </div>
      <div className=" text-muted-foreground flex items-center gap-3">
            Show all {userCartData.length - 4} orders

            <ChevronDown />
      </div>
            </>
            ) : 
            (
              <>
              Show Less
                <ChevronUp />
              </>
            
            )
              }
           
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    ) :  (
      <main className={cn("flex flex-col gap-6   pt-2 relative     overflow-hidden"
      )}>
 
   
        {userCartData && userCartData.map((item ,i) =>  {
       
        return(
 <CartProductsCard key={i} className="   bg-background h-[4em]  [&_#card-content-img]:min-w-15" ProductCart={item}/>
        )})}
      </main>
    ) }
      {/* Applied Promo */}
      {appliedPromo && (
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <Percent className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              {appliedPromo}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removePromo}
            className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}{" "}
      {/* Pricing Breakdown */}
      <div className="flex flex-col gap-3 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatUSD(summary.subtotal)}</span>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-sm text-yellow-600">
            <span>Discount</span>
            <span>-{formatUSD(summary.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{formatUSD(summary.shipping || 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>{formatUSD(summary.tax)}</span>
        </div>
      </div>
    </CardContent>
        <CardFooter className="items-center px-6 flex justify-between font-semibold text-lg border-t [.border-t]:py-3 ">
          <span>Total</span>
          <span>
            {formatUSD(summary.total_price)}</span>
        </CardFooter>
  </Card>
)};

if (isLoading) {
  return (
    <div className="w-full min-h-dvh container mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-center gap-5">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </div>
      <CheckoutSkeleton />
    </div>
  );
}
const steps = [
        { step: 1, label: "Shipping", icon: Truck },
        { step: 2, label: "Additional", icon: Notebook },
        { step: 3, label: "Review", icon: ClipboardList },
        { step: 4, label: "Payments", icon: CreditCard },
      ]




return (
  <div className="w-full container mx-auto  py-5 px-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3 flex-col">
        {" "}
        <Link
     
         href="/"
          className={cn( buttonVariants({ variant: "link"}) ,"flex  px-0  has-[>svg]:px-0 items-center gap-1")}
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Checkout
          </h1>
          <p className="text-muted-foreground text-sm">
            Complete your purchase securely
          </p>
        </div>
      </div>
      <Badge variant={"outline"} icon={Shield}  className="md:flex rounded-xl items-center text-xs hidden gap-1 w-fit">
        SSL Secured
      </Badge>
    </div>{" "}
    {/* Progress Steps */}
    <div className="flex w-full px-0   m-auto  items-center justify-between  gap-1.5 sm:gap-6 py-4">
      {steps.map(({ step, label, icon: Icon }, index) => (
        <div key={step} className={cn("flex   items-center  gap-3",

          index !=  steps.length - 1 && 'w-full'
        )}>
          <div className="flex flex-col w-full  gap-1.5">
            <div className=" flex w-full  justify-center  overflow-hidden items-center gap-1">

            <div
              className={cn(
                "flex items-center justify-center size-9 p-2 md:size-11  md:p-3 rounded-full border-2 transition-colors",
                currentStep >= step
                  ? "bg-primary border-primary text-white dark:text-black"
                  : "border-border text-muted-foreground"
              )}
            >
              {currentStep > step ? (
                <Check className="size-9 md:size-10" />
              ) : (
                <Icon className="size-9 md:size-10" />
              )}
            </div>
                {  index !=  steps.length - 1 && (
            <div
              className={cn(
                "w-full  h-0.5 rounded-xl",
                currentStep > step
                  ? "bg-primary"
                  : "bg-border"
              )}
            />
          )}
            </div>
            <span
              className={cn(
                "text-sm   hidden font-medium md:block",
                currentStep >= step
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
      
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Step 1: Shipping Information */}
        {currentStep === 1 && (
          <Card className="flex shadow-none border-2 border-muted  bg-background flex-col gap-6 ">
            <CardHeader className=" [.border-b]:pb-3  border-b ">
              <CardTitle className="lg:text-xl  text-lg font-semibold flex items-center gap-3">
                <MapPin className="h-5 w-5 sr-only " />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="   flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="firstName">First Name *</Label>{" "}
                  <Input
                
                    id="firstName"
                    size="lg"
                    placeholder="John"
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      handleAddressChange("firstName", e.target.value)
                    }
                  
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="lastName">Last Name *</Label>{" "}
                  <Input
                    id="lastName"
                    size="lg"
                    placeholder="Doe"
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      handleAddressChange("lastName", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="email">Email *</Label>{" "}
                  <Input
                    id="email"
                    size="lg"
                    type="email"
                    placeholder="john@example.com"
                    value={shippingAddress.email}
                    onChange={(e) =>
                      handleAddressChange("email", e.target.value)
                    }
                   
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="phone">Phone</Label>{" "}
                  <PhoneInput
  placeholder="Enter phone number"
  id="phone"
  type="tel"
  value={shippingAddress.phone}
  onChange={(value) => handleAddressChange("phone", value ?? "")}
  defaultCountry="ID"
/>

              
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="address">Address *</Label>{" "}
                <Input
                  id="address"
                  size="lg"
                  placeholder="123 Main Street"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    handleAddressChange("address", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="country">Country *</Label>{" "}
                 <CountrySelector
                 
                                   value={shippingAddress.country}
                                   onChange={(e) =>
                      handleAddressChange("country", e)}
                       
                                 />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="province">Province *</Label>
                     <ProvinceSelector
                               value={shippingAddress.province}
                    onChange={(value) =>
                      handleAddressChange("province", value)
                    }
                                    countryName={shippingAddress.country as string}
                              
                                  />
               
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="zipCode">ZIP Code *</Label>{" "}
                  <Input
                    id="zipCode"
                    size="lg"
                    placeholder="10001"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      handleAddressChange("zipCode", e.target.value)
                    }
                  />
                </div>
              </div>{" "}
              <div className="flex flex-col gap-6 border-t pt-7">
                <Label className=" font-medium text-lg">Shipping Method</Label>
                <div className="flex flex-col gap-5">
                  {shippingMethods.map((method , i) => (
                    <div
                      key={i}
                      className={cn(
                        "p-3 border rounded-xl cursor-pointer transition-colors",
                        selectedShipping ===  method
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-accent/10"
                      )}
                      onClick={() => {setSelectedShipping(method)

                          handleAddressChange("shipping_method", method.value)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className=" p-1 rounded-full border-2">

                          <div
                            className={cn(
                              "size-1.5 rounded-full  transition-colors",
                              selectedShipping === method
                                ? "border-primary  border-2  bg-primary"
                                : "border-border"
                            )}
                          />
                          </div>
                          <div>
                            <div className="font-medium">{method.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {method.subLabel}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold">{formatUSD(method.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className=" border-t">
              <Button
                onClick={nextStep}
                disabled={!validateStep(1)}
                className="ml-auto"
                size="lg"
              >
                Continue to Payment
              </Button>
            </CardFooter>
          </Card>
        )}{" "}
        {/* Step 2: Payment Information */}
        {currentStep === 2 && (
          <Card className="flex shadow-none border-2 border-muted  bg-background flex-col gap-6 ">
           <CardHeader className=" [.border-b]:pb-3  border-b ">
              <CardTitle className="lg:text-xl  text-lg font-semibold flex items-center gap-3">
                <CreditCard className="h-5 w-5 sr-only" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Additional Information Selection */}
          <div className="flex flex-col gap-3">
                  <Label htmlFor="note" className=" sr-only">Additional Notes *</Label>{" "}
                  <MinimalTiptapEditor
 value={additionalInformation.note}
                    onChange={(e) =>
                      handleAdditionalChange("note", e)
                    }
      className="w-full"
      editorContentClassName="p-5"
      output="html"
      placeholder="Enter your description..."
      autofocus={true}
      editable={true}
      editorClassName="focus:outline-hidden"
    />
                </div>

          
             
            </CardContent>{" "}
           <CardFooter className=" flex justify-between border-t">
        
              <Button
                variant="outline"
                size="lg"
                onClick={prevStep}
                className="flex items-center gap-3"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!validateStep(2)}
                size="lg"
              >
                Review Order
              </Button>
            </CardFooter>
          </Card>
        )}
        {/* Step 3: Review Order */}
        {currentStep === 3 && (
          <Card className="flex shadow-none border-2 border-muted  bg-background flex-col gap-6 ">
           <CardHeader className=" [.border-b]:pb-3  border-b ">
              <CardTitle className="lg:text-xl  text-lg font-semibold flex items-center gap-3">
                <ClipboardList className="h-5 w-5 sr-only" />
                Review Your Order
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Shipping Address Review */}
              <div className="flex flex-col gap-3 ">
                <h3 className="font-medium">Shipping Address</h3>
                <div className="text-sm text-muted-foreground p-3 bg-input/10 border rounded-xl ">
                  <p>
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                  <p>{shippingAddress.phone}</p>
                  <p>{shippingAddress.address}</p>
                  <p>
                    {shippingAddress.country}, {shippingAddress.province}{" "}
                    {shippingAddress.zipCode}
                  </p>
                  <p>{shippingAddress.email}</p>
                </div>
              </div>{" "}
              {/* Additional Information Review */}
              <div className="flex flex-col gap-3">
                <h3 className="font-medium">Additional Information</h3>
            
                      {/* <p>
                        {additionalInformation.note}
                      </p> */}
             <div 
          className="text-sm text-muted-foreground p-3 bg-input/10 border rounded-xl prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: additionalInformation.note as string || '<p class="text-muted-foreground">No additional notes</p>' 
          }}
        />
                 
      
              </div>{" "}
              {/* Terms and Conditions */}
            </CardContent>{" "}
             <CardFooter className=" [.border-t]:pb-3  gap-6 flex flex-col border-t">
              <div className="flex  items-start gap-3 w-full  ">
                <Checkbox
                  id="agreeTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked === true)
                  }
                />
                <Label
                  htmlFor="agreeTerms"
                  className="  line-clamp-1 text-[15px] leading-relaxed"
                >
                  I agree to the{" "}
                  <Button variant="link" className="p-0  h-auto ">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto ">
                    Privacy Policy
                  </Button>
                </Label>
              </div>
              <div className=" w-full flex justify-between">

              {" "}
              <Button
                variant="outline"
                size="lg"
                disabled={loading}
                onClick={prevStep}
                className="flex items-center gap-3"
              >
              {loading ? <Spinner/> :
                <ChevronLeft className="h-4 w-4" />
                }
                Back
              </Button>{" "}
              <Button
                disabled={!validateStep(3) || loading}
                size="lg"
                onClick={() => handlePayment()}
                className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-3"
              >
                {loading ? <Spinner/> :
         <Lock className="h-4 w-4" />
                }   
                Complete Order 
              </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Order Summary Sidebar */}
      <div className="flex flex-col gap-5">
        <OrderSummaryCard />

        {/* Security Badge */}
        <Card className=" flex shadow-none border-2 border-muted  bg-background flex-col gap-6  ">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5  text-yellow-600" />
              <div>
                <div className="font-medium">Secure & Encrypted</div>
                <div className="text-muted-foreground">
                  Your data is protected with SSL encryption
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);
}

export { Checkout };