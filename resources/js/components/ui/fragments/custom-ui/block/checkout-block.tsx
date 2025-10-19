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
User,
Mail,
Phone,
Lock,
Calendar,
ShoppingBag,
Check,
ChevronLeft,
Percent,
X,
Tag,
Wallet,
Smartphone,
Building2,
Clock,
ClipboardList,
File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/fragments/shadcn-ui/select";
import { PaymentMethodOptions } from "@/config/enums/payment-method";
import { cartCart, CheckoutResponse, OptionItem } from "@/types";
import { CountrySelector, ProvinceSelector } from "../input/location-input";
import { User as profile, type SharedData } from '@/types';
import { Link, router, usePage } from "@inertiajs/react";
import { formatIDR } from "@/hooks/use-money-format";
import CartProductsCard from "@/components/ui/core/main/cart-product-card";
import { ShippingMethod, shippingMethods } from "@/config/enums/courier";
import { toast } from "sonner";
import { Spinner } from "../../shadcn-ui/spinner";
import { PhoneInput } from "../input/phone-input";
interface OrderItem {
id: string;
name: string;
price: number;
originalPrice?: number;
image: string;
quantity: number;
discount?: number;
}

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
payment_method: string;
}

interface PaymentMethod {
cardNumber: string;
expiryMonth: string;
expiryYear: string;
cvv: string;
nameOfCard: string;
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
  payment_method :"",
});
const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  nameOfCard: "",
});
const [selectedPaymentType, setSelectedPaymentType] =
useState<OptionItem>(PaymentMethodOptions[0]);
const [sameAsShipping, setSameAsShipping] = useState<boolean>(true);
const [savePaymentMethod, setSavePaymentMethod] = useState<boolean>(false);
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
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
  const shipping = selectedShipping?.price! ; 
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


const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
  setShippingAddress((prev) => ({
    ...prev,
    [field]: value,
  }));
};

const handlePaymentChange = (field: keyof PaymentMethod, value: string) => {
  setPaymentMethod((prev) => ({
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
      if (selectedPaymentType.value === "bank_transfer") {
        return !!(
          paymentMethod.cardNumber &&
          paymentMethod.expiryMonth &&
          paymentMethod.expiryYear &&
          paymentMethod.cvv &&
          paymentMethod.nameOfCard
        );
      }
      // For other payment methods, we just need them to be selected
      return !!selectedPaymentType;
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





const data = {
  ...paymentMethod,
  ...shippingAddress,
  ...summary,
  shipping_method: selectedShipping.value,
  payment_method: selectedPaymentType.value,
  expiryMonth: parseInt(paymentMethod.expiryMonth)
}

  const [isPending, startTransition] = React.useTransition();

function handlePayment() {
   
    
    
console.log(data)
    toast.loading("loading....", {
      id: "payment"
    });
    
  startTransition(() => {
    setLoading(true);

    // Prepare data dengan struktur yang benar



    router.post(route(`checkout.payment`), data, { 
      preserveScroll: true,
      preserveState: true,

      onSuccess: () => {

       
        toast.success("successfully", {
          id: "payment"
        });
        setLoading(false);
      },
      onError: (error) => {
        console.error("Submit error:", error);
        toast.error(`Error: ${Object.values(error).join(', ')}`, {
          id: "payment"
        });
        setLoading(false);
      },
      onFinish: () => {
        setLoading(false);
 
      }
    });
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
const isShowMore = userCartData.length >3 


const handleShowAll = () => {

  setLoading(true);

  router.get(
    route('checkout.index'), 
    { perPage: 'all' },
    {
      preserveScroll: true,
      preserveState: true,
      onError: (error) => {
        console.error('Submit error:', error);
        toast.error(`Error: ${Object.values(error).join(', ')}`, {
          id: 'showMore',
        });
     ;
        setLoading(false);
      },
      onFinish: () => {
        setLoading(false);
      },
    }
  );
};

  return(
  <Card className="flex pb-2.5   flex-col rounded-xl gap-5">
    <CardHeader className=" [.border-b]:pb-3 border-b pb-0 pt-0">
      <CardTitle className="font-semibold flex items-center gap-3">
        <ShoppingBag className="h-4 w-4" />
        Order Summary
      </CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-7">
      {/* Order Items */}
      <main className={cn("flex flex-col gap-6   pt-2 relative     overflow-hidden"
,

!isShowMore &&  'max-h-[40dvh]  '
      )}>
        {!isShowMore && (

        <div className='pointer-events-none absolute inset-x-0 bottom-0 h-[35dvh]  bg-gradient-to-t z-50 from-white dark:from-black'>
        </div>
        )}
        {!isShowMore && (

        <div className="absolute w-full bottom-0 z-50 items-center flex justify-center ">
 <div
              className={cn(
                "w-1/2  h-[0.5px] rounded-xl bg-accent-foreground/30"
              )}
            />
        <Button 
         size={"sm"}
         disabled={loading}
        onClick={() => handleShowAll()}
        variant="outline" className=" text-xs  py-0 rounded-full px-5  right-1/2 left-1/2  font-medium text-accent-foreground ">
          Show All {
            loading && <Spinner/>
          }
        </Button>
         <div
              className={cn(
                "w-1/2  h-[0.5px] rounded-xl bg-accent-foreground/30"
              )}
            />
        </div>
        )}
        {userCartData && userCartData.map((item ,i) =>  {
          const Product = item.product
          const price = formatIDR(item.sub_total)
        return(
 <CartProductsCard key={i} className="  bg-white dark:bg-black h-[4em]  [&_#card-content-img]:min-w-15" ProductCart={item}/>
        )})}
      </main>
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
          <span>{formatIDR(parseInt(summary.subtotal.toFixed(2)))}</span>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-sm text-yellow-600">
            <span>Discount</span>
            <span>-{formatIDR(parseInt(summary.discount.toFixed(2)))}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{formatIDR(parseInt(summary?.shipping!.toFixed(2)))}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>{formatIDR(parseInt(summary.tax.toFixed(2)))}</span>
        </div>
      </div>
    </CardContent>
        <CardFooter className="items-center px-6 flex justify-between font-semibold text-lg border-t [.border-t]:py-3 ">
          <span>Total</span>
          <span>
            {formatIDR(parseInt(summary.total_price.toFixed(2)))}</span>
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
        { step: 2, label: "Payment", icon: CreditCard },
        { step: 3, label: "Review", icon: ClipboardList },
        { step: 4, label: "Validation", icon: File },
      ]




return (
  <div className="w-full container mx-auto  py-5 px-4 flex flex-col gap-3">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-5 flex-col">
        {" "}
        <Link
     
         href="/"
          className={cn( buttonVariants({ variant: "link"}) ,"flex  px-0  has-[>svg]:px-0 items-center gap-1")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Checkout
          </h1>
          <p className="text-muted-foreground text-sm">
            Complete your purchase securely
          </p>
        </div>
      </div>
      <Badge  className="flex rounded-xl items-center gap-1">
        <Shield className="h-3 w-3" />
        SSL Secured
      </Badge>
    </div>{" "}
    {/* Progress Steps */}
    <div className="flex w-full px-0   m-auto  items-center justify-between  gap-2 sm:gap-6 py-4">
      {steps.map(({ step, label, icon: Icon }, index) => (
        <div key={step} className={cn("flex   items-center  gap-3",

          index !=  steps.length - 1 && 'w-full'
        )}>
          <div className="flex flex-col w-full  gap-2">
            <div className=" flex w-full  overflow-hidden items-center gap-2">

            <div
              className={cn(
                "flex items-center justify-center size-8 p-1.5 md:size-11  md:p-3 rounded-full border-2 transition-colors",
                currentStep >= step
                  ? "bg-primary border-primary text-white dark:text-black"
                  : "border-border text-muted-foreground"
              )}
            >
              {currentStep > step ? (
                <Check className="size-8 md:size-10" />
              ) : (
                <Icon className="size-8 md:size-10" />
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
                "text-[12px] md:text-base font-medium block",
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
          <Card className="flex flex-col gap-6 ">
            <CardHeader className=" [.border-b]:pb-3  border-b ">
              <CardTitle className="lg:text-xl  text-lg font-semibold flex items-center gap-3">
                <MapPin className="h-5 w-5" />
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
                    leftIcon={<User className="h-4 w-4" />}
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
                    leftIcon={<Mail className="h-4 w-4" />}
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
  disabled={isPending}
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
                  {/* <Select
                  
                  >
                    <SelectTrigger className="text-sm " size={"lg"}>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select> */}
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
                        <div className="font-semibold">{formatIDR(method.price)}</div>
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
          <Card className="flex flex-col gap-6 ">
           <CardHeader className=" [.border-b]:pb-3  border-b ">
              <CardTitle className="lg:text-xl  text-lg font-semibold flex items-center gap-3">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Payment Method Selection */}
              <div className="flex flex-col gap-5">
                <Label className="text-base sr-only font-medium">
                  Choose Payment Method
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2  gap-3">
                 {PaymentMethodOptions.map((Item , i ) => (

                  <Button
                  key={i}
                  variant={"ghost"}
                  size={"lg"}
                    type="button"
                    onClick={() => {
                      setSelectedPaymentType(Item)
                    
                            handleAddressChange("payment_method", Item.value)
                    }}
                    className={cn(
                      "flex overflow-hidden justify-between items-center  gap-3 px-4 py-10 border-2 rounded-xl transition-colors ",
                      selectedPaymentType.value ===  Item.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="  text-left overflow-hidden    max-w-xs  flex items-center   gap-3  ">
                    <Item.icon className="size-5 text-primary" />
                    <div className=" w-full">

                      <div className="font-medium">{Item.label}</div>
                      <div className="text-xs line-clamp-1 text-muted-foreground">
                        {Item.description}
                      </div>
                    </div>
                    </div>
                    
                            <div className=" w-fit mr-0 p-1 rounded-full border-2">

                          <div
                            className={cn(
                              "size-1.5 rounded-full  transition-colors",
                            selectedPaymentType.value ===  Item.value
                                ? "border-primary  border-2  bg-primary"
                                : "border-border"
                            )}
                          />
                          </div>
                  </Button>
                 ))}

         
                </div>
              </div>

              {/* Credit Card Form - Only show when card is selected */}
              {selectedPaymentType.value === "bank_transfer" ? (
                <div className="flex flex-col gap-5 border-t pt-6">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="nameOfCard">Name on Card *</Label>{" "}
                    <Input
                      id="nameOfCard"
                      size="lg"
                      placeholder="John Doe"
                      value={paymentMethod.nameOfCard}
                      onChange={(e) =>
                        handlePaymentChange("nameOfCard", e.target.value)
                      }
                      leftIcon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="cardNumber">Card Number *</Label>{" "}
                    <Input
                      id="cardNumber"
                      size="lg"
                      placeholder="1234 5678 9012 3456"
                      value={paymentMethod.cardNumber}
                      onChange={(e) =>
                        handlePaymentChange("cardNumber", e.target.value)
                      }
                      leftIcon={<CreditCard className="h-4 w-4" />}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-5">
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="expiryMonth">Month *</Label>
                      <Select
                        value={paymentMethod.expiryMonth}
                        onValueChange={(value) =>
                          handlePaymentChange("expiryMonth", value)
                        }
                      >
                        <SelectTrigger className="text-sm" size={"lg"}>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem
                              key={i + 1}
                              value={String(i + 1).padStart(2, "0")}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="expiryYear">Year *</Label>
                      <Select
                        value={paymentMethod.expiryYear}
                        onValueChange={(value) =>
                          handlePaymentChange("expiryYear", value)
                        }
                      >
                        <SelectTrigger className="text-sm" size={"lg"}>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => (
                            <SelectItem
                              key={2024 + i}
                              value={String(2024 + i)}
                            >
                              {2024 + i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="cvv">CVV *</Label>{" "}
                      <Input
                        id="cvv"
                        size="lg"
                        placeholder="123"
                        maxLength={4}
                        value={paymentMethod.cvv}
                        onChange={(e) =>
                          handlePaymentChange("cvv", e.target.value)
                        }
                        leftIcon={<Lock className="h-4 w-4" />}
                      />
                    </div>
                  </div>
                </div>
              ) : (
   <div className="border-t pt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <selectedPaymentType.icon className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">
                          {selectedPaymentType.label}
                        </h4>
                        <p className="text-sm text-yellow-700 mt-1">
                        {selectedPaymentType.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

             
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
          <Card className="flex  flex-col gap-6">
           <CardHeader className=" [.border-b]:pb-3  border-b ">
              <CardTitle className="lg:text-xl  text-lg font-semibold flex items-center gap-3">
                <ClipboardList className="h-5 w-5" />
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
              {/* Payment Method Review */}
              <div className="flex flex-col gap-3">
                <h3 className="font-medium">Payment Method</h3>
                <div className="text-sm text-muted-foreground p-3 bg-input/10 border rounded-xl ">
                  {selectedPaymentType.value === "bank_transfer" ? (
                    <>
                      <p>
                        **** **** **** {paymentMethod.cardNumber.slice(-4)}
                      </p>
                      <p>{paymentMethod.nameOfCard}</p>
                    </>
                  ) : (
<div className="flex items-center gap-3">
                      <selectedPaymentType.icon className="h-4 w-4 text-yellow-600" />
                      <span>{selectedPaymentType.label}</span>
                    </div>
                  )}
                 
                </div>
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
        <Card className=" ">
          <CardContent className="px-4 py-0">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-yellow-600" />
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