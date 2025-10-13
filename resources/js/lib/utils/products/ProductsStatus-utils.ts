import { ProductStatus, ProductStatusOptions } from "@/config/enums/ProductsStatus";
import {
  CheckCircle2,
  CircleIcon,
  CircleX,
  Clock,
} from "lucide-react";

// 🧩 Return icon based on product status
  export function getProductStatusIcon(status?: ProductStatus) {
        const found = ProductStatusOptions.find((s) => s.value === status);
        return found?.icon || CircleIcon;
      }

export function getProductStatusColor(status: ProductStatus): string {
  const statusColors: Record<ProductStatus, string> = {
    [ProductStatus.Available]: "text-yellow-500",
    [ProductStatus.Not_Available]: "text-red-500",
    [ProductStatus.Coming_Soon]: "text-yellow-500",
  };

  return statusColors[status] || "text-gray-400";
}

// 🏷️ Optional: human-readable label mapping
export function getProductStatusLabel(status: ProductStatus): string {
  const statusLabels: Record<ProductStatus, string> = {
    [ProductStatus.Available]: "Available",
    [ProductStatus.Not_Available]: "Not Available",
    [ProductStatus.Coming_Soon]: "Coming Soon",
  };

  return statusLabels[status] || "Unknown";
}
