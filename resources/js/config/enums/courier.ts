import { OptionItem } from "@/types";
import { Truck, Rocket, Zap } from "lucide-react";

export enum ShippingMethod {
  STANDARD = "standard",
  EXPRESS = "express",
  OVERNIGHT = "overnight",
}

export const shippingMethods: OptionItem[] = [
  {
    value: ShippingMethod.STANDARD,
    label: "Standard Shipping",
    subLabel: "5–7 business days",
    description: "Budget-friendly option for regular delivery.",
    icon: Truck,
    price: 2.99,    // USD
    currency: "USD",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
  },
  {
    value: ShippingMethod.EXPRESS,
    label: "Express Shipping",
    subLabel: "2–3 business days",
    description: "Faster delivery for a modest additional fee.",
    icon: Rocket,
    price: 6.99,    // USD
    currency: "USD",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    value: ShippingMethod.OVERNIGHT,
    label: "Overnight Shipping",
    subLabel: "1 business day (arrives next day)",
    description: "Fastest option for urgent needs.",
    icon: Zap,
    price: 14.99,   // USD
    currency: "USD",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
];
