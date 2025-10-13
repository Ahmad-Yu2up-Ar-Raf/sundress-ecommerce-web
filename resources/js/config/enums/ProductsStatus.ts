import { OptionItem } from "@/types";
import { CheckCircle, XCircle, Clock } from "lucide-react";

// 🏷️ Enum Type (match dengan backend PHP)
export enum ProductStatus {
  Available = "available",
  Not_Available = "not_available",
  Coming_Soon = "coming_soon",
}

// 🧩 Structured Options for UI
export const ProductStatusOptions: OptionItem[] = [
  {
    value: ProductStatus.Available,
    label: "Available",
    icon: CheckCircle,
    subLabel: "Ready for Purchase",
    description: "Product is in stock and ready to be ordered.",
    image:
      "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=1200&q=80", // warehouse shelves with boxes
  },
  {
    value: ProductStatus.Not_Available,
    label: "Not Available",
    icon: XCircle,
    subLabel: "Out of Stock",
    description: "Product is currently unavailable or out of stock.",
    image:
      "https://images.unsplash.com/photo-1581579184686-1867a8a4b4b9?auto=format&fit=crop&w=1200&q=80", // empty shelves
  },
  {
    value: ProductStatus.Coming_Soon,
    label: "Coming Soon",
    icon: Clock,
    subLabel: "Upcoming Release",
    description: "Product will be available soon — stay tuned.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80", // teaser style photo
  },
];

// Optional: for quick value lists
export const ProductStatusValues: string[] = ProductStatusOptions.map(
  (item) => item.value
);
