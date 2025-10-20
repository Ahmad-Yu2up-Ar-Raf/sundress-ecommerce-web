import { OptionItem } from "@/types";
import { Truck, Rocket, Zap, Ship, Plane } from "lucide-react";

export enum ShippingMethod {
  STANDARD = "standard",
  EXPRESS = "express",
  OVERNIGHT = "overnight",

}

export const shippingMethods: OptionItem[] = [
  {
    value: ShippingMethod.STANDARD,
    label: "Pengiriman Standar",
    subLabel: "5–7 hari kerja",
    description: "Pilihan hemat untuk pengiriman reguler",
    icon: Truck,
    price: 15000,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
  },
  {
    value: ShippingMethod.EXPRESS,
    label: "Pengiriman Ekspres",
    subLabel: "2–3 hari kerja",
    description: "Lebih cepat sampai dengan biaya sedikit lebih tinggi",
    icon: Rocket,
    price: 30000,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    value: ShippingMethod.OVERNIGHT,
    label: "Pengiriman Kilat (Overnight)",
    subLabel: "1 hari kerja (besok sampai)",
    description: "Pengiriman tercepat untuk kebutuhan mendesak",
    icon: Zap,
    price: 50000,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
 
];
