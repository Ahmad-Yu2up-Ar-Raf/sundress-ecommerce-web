import { OptionItem } from "@/types";
import { Truck, Rocket, Zap } from "lucide-react"; // lucide icons untuk tampilan yang kontekstual

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
  },
  {
    value: ShippingMethod.EXPRESS,
    label: "Pengiriman Ekspres",
    subLabel: "2–3 hari kerja",
    description: "Lebih cepat sampai dengan biaya sedikit lebih tinggi",
    icon: Rocket,
    price: 30000,
  },
  {
    value: ShippingMethod.OVERNIGHT,
    label: "Pengiriman Kilat (Overnight)",
    subLabel: "1 hari kerja (besok sampai)",
    description: "Pengiriman tercepat untuk kebutuhan mendesak",
    icon: Zap,
    price: 50000,
  },
];
