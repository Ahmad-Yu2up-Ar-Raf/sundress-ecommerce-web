import { OptionItem } from "@/types";
import {
  Truck,
  Package,
  Plane,
  Rocket,
  Navigation,
  Globe,
  Boxes,
  Ship,
  Send,
  Building2,
  Landmark,
} from "lucide-react";

export enum Courier {
  JNE = "jne",
  JNT = "jnt",
  SICEPAT = "sicepat",
  TIKI = "tiki",
  POS_INDONESIA = "pos_indonesia",
  NINJAVAN = "ninjavan",
  SHOPEE_EXPRESS = "shopee_express",
  LION_PARCEL = "lion_parcel",
  DHL = "dhl",
  FEDEX = "fedex",
  UPS = "ups",
  LOCAL_COURIER = "local_courier",
  PICKUP = "pickup",
  OTHER = "other",
}

export const CourierOptions: OptionItem[] = [
  { value: Courier.JNE, label: "JNE", icon: Truck, color: "text-blue-500" },
  { value: Courier.JNT, label: "J&T Express", icon: Rocket, color: "text-red-500" },
  { value: Courier.SICEPAT, label: "SiCepat", icon: Package, color: "text-pink-500" },
  { value: Courier.TIKI, label: "TIKI", icon: Send, color: "text-indigo-500" },
  { value: Courier.POS_INDONESIA, label: "POS Indonesia", icon: Landmark, color: "text-orange-500" },
  { value: Courier.NINJAVAN, label: "Ninja Van", icon: Plane, color: "text-rose-500" },
  { value: Courier.SHOPEE_EXPRESS, label: "Shopee Express", icon: Boxes, color: "text-amber-500" },
  { value: Courier.LION_PARCEL, label: "Lion Parcel", icon: Navigation, color: "text-rose-400" },
  { value: Courier.DHL, label: "DHL", icon: Globe, color: "text-yellow-500" },
  { value: Courier.FEDEX, label: "FedEx", icon: Ship, color: "text-purple-500" },
  { value: Courier.UPS, label: "UPS", icon: Building2, color: "text-brown-600" },
  { value: Courier.LOCAL_COURIER, label: "Local Courier", icon: Truck, color: "text-yellow-600" },
  { value: Courier.PICKUP, label: "Pickup", icon: Package, color: "text-teal-600" },
  { value: Courier.OTHER, label: "Other", icon: Globe, color: "text-gray-500" },
];
