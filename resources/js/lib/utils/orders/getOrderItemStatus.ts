import {
  OrderItemStatus,
  OrderItemStatusOptions,
} from "@/config/enums/OrderItemStatus";
import { CircleIcon } from "lucide-react";

// 🧩 Return icon based on order item status
export function getOrderItemStatusIcon(status?: OrderItemStatus) {
  const found = OrderItemStatusOptions.find((s) => s.value === status);
  return found?.icon || CircleIcon;
}

// 🎨 Return text color for badges / indicators
export function getOrderItemStatusColor(status: OrderItemStatus): string {
  const statusColors: Record<OrderItemStatus, string> = {
    [OrderItemStatus.Pending]: "text-yellow-500",
    [OrderItemStatus.Approve]: "text-green-500",
    [OrderItemStatus.Cancel]: "text-red-500",
  };

  return statusColors[status] || "text-gray-400";
}

// 🏷️ Optional: human-readable label mapping
export function getOrderItemStatusLabel(status: OrderItemStatus): string {
  const statusLabels: Record<OrderItemStatus, string> = {
    [OrderItemStatus.Pending]: "Pending",
    [OrderItemStatus.Approve]: "Approved",
    [OrderItemStatus.Cancel]: "Cancelled",
  };

  return statusLabels[status] || "Unknown";
}
