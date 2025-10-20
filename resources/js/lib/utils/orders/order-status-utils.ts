import { OrderStatus, OrderStatusOptions } from "@/config/enums/order-status";
import { CircleIcon } from "lucide-react";

export function getOrderStatusIcon(status: OrderStatus) {
  const found = OrderStatusOptions.find((s) => s.value === status);
  return found?.icon || CircleIcon;
}

export function getOrderStatusLabel(status: OrderStatus){
  const found = OrderStatusOptions.find((s) => s.value === status);
  return found?.label || "Unknown";
}

// utils/orders/order-status-utils.ts
export function getOrderStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Pending:
      return {
        text: "text-gray-600",
        bg: "bg-gray-100/5",
        outline: "outline-gray-400",
        progress: "[&_#progres]:bg-gray-400",
        accent: "bg-gray-500",
        fill: "[&_svg]:fill-gray-500", // ✅ ikon fill
      };
    case OrderStatus.Processing:
      return {
        text: "text-yellow-600",
        bg: "bg-yellow-100/5",
        outline: "outline-yellow-400",
        progress: "[&_#progres]:bg-yellow-400",
        accent: "bg-yellow-500",
        fill: "[&_svg]:fill-yellow-500", // ✅ ikon fill
      };
    case OrderStatus.Shipped:
      return {
        text: "text-blue-600",
        bg: "bg-blue-100/5",
        outline: "outline-blue-400",
        progress: "[&_#progres]:bg-blue-400",
        accent: "bg-blue-500",
        fill: "[&_svg]:fill-blue-500", // ✅ ikon fill
      };
    case OrderStatus.Delivered:
      return {
        text: "text-green-600",
        bg: "bg-green-100/5",
        outline: "outline-green-400",
        progress: "[&_#progres]:bg-green-400",
        accent: "bg-green-500",
        fill: "[&_svg]:fill-green-500", // ✅ ikon fill
      };
    case OrderStatus.Cancelled:
      return {
        text: "text-red-600",
        bg: "bg-red-100/5",
        outline: "outline-red-400",
        progress: "[&_#progres]:bg-red-400",
        accent: "bg-red-500",
        fill: "[&_svg]:fill-red-500", // ✅ ikon fill
      };
    default:
      return {
        text: "text-muted-foreground",
        bg: "bg-background",
        outline: "outline-border",
        progress: "[&_#progres]:bg-border",
        accent: "bg-border",
        fill: "[&_svg]:fill-muted-foreground/40", // ✅ fallback fill
      };
  }
}


export function getOrderStatusBg(status: OrderStatus){
  const found = OrderStatusOptions.find((s) => s.value === status);
  return found?.bgColor ;
}

export function getOrderStatusDescription(status: OrderStatus){
  const found = OrderStatusOptions.find((s) => s.value === status);
  return found?.description || "";
}

