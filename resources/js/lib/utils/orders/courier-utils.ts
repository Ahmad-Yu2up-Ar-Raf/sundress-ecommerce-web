import { ShippingMethod, shippingMethods } from "@/config/enums/courier";
import { CircleIcon } from "lucide-react";

export function getShippingMethodIcon(courier: ShippingMethod) {
  const found = shippingMethods.find((c) => c.value === courier);
  return found?.icon || CircleIcon;
}

export function getShippingMethodLabel(courier: ShippingMethod) {
  const found = shippingMethods.find((c) => c.value === courier);
  return found?.label || "Unknown Shipping Method";
}

export function getShippingMethodColor(courier: ShippingMethod) {
  const found = shippingMethods.find((c) => c.value === courier);
  return found?.color || "text-gray-400";
}

export function getShippingMethodBg(courier: ShippingMethod) {
  const found = shippingMethods.find((c) => c.value === courier);
  return found?.bgColor || "bg-gray-100";
}
