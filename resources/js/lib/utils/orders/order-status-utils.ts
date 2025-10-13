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

export function getOrderStatusColor(status: OrderStatus){
  const found = OrderStatusOptions.find((s) => s.value === status);
  return found?.color || "text-gray-400";
}

export function getOrderStatusBg(status: OrderStatus){
  const found = OrderStatusOptions.find((s) => s.value === status);
  return found?.bgColor || "bg-gray-100";
}

export function getOrderStatusDescription(status: OrderStatus){
  const found = OrderStatusOptions.find((s) => s.value === status);
  return found?.description || "";
}
