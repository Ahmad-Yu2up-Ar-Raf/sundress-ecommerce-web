import { Courier, CourierOptions } from "@/config/enums/courier";
import { CircleIcon } from "lucide-react";

export function getCourierIcon(courier: Courier) {
  const found = CourierOptions.find((c) => c.value === courier);
  return found?.icon || CircleIcon;
}

export function getCourierLabel(courier: Courier) {
  const found = CourierOptions.find((c) => c.value === courier);
  return found?.label || "Unknown Courier";
}

export function getCourierColor(courier: Courier){
  const found = CourierOptions.find((c) => c.value === courier);
  return found?.color || "text-gray-400";
}
