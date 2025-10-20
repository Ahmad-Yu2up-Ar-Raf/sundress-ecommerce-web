import { OptionItem } from "@/types";
import { Clock, CheckCircle, XCircle } from "lucide-react";

// 🏷️ Enum Type (match dengan backend PHP)
export enum OrderItemStatus {
  Pending = "pending",
  Approve = "approve",
  Cancel = "cancel",
}

// 🧩 Structured Options for UI
export const OrderItemStatusOptions: OptionItem[] = [
  {
    value: OrderItemStatus.Pending,
    label: "Pending",
    icon: Clock,
    subLabel: "Waiting for Approval",
    description:
      "Order item is awaiting seller's approval before processing continues.",
    image:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1200&q=80", // waiting desk / clock
  },
  {
    value: OrderItemStatus.Approve,
    label: "Approved",
    icon: CheckCircle,
    subLabel: "Approved by Seller",
    description:
      "Seller has approved this order item. It will now proceed to processing.",
    image:
      "https://images.unsplash.com/photo-1556742400-b5e7b2e0f1f8?auto=format&fit=crop&w=1200&q=80", // success / confirmed image
  },
  {
    value: OrderItemStatus.Cancel,
    label: "Cancelled",
    icon: XCircle,
    subLabel: "Rejected or Cancelled",
    description:
      "This order item was cancelled or rejected by the seller.",
    image:
      "https://images.unsplash.com/photo-1581091012184-7e0cdfbb6791?auto=format&fit=crop&w=1200&q=80", // cancellation
  },
];

// Optional: for quick value lists
export const OrderItemStatusValues: string[] = OrderItemStatusOptions.map(
  (item) => item.value
);
