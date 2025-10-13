import { PaymentMethod, PaymentMethodOptions } from "@/config/enums/payment-method";
import { CircleIcon } from "lucide-react";

/**
 * 💳 Get icon for given payment method
 */
export function getPaymentIcon(method: PaymentMethod) {
  const found = PaymentMethodOptions.find((item) => item.value === method);
  return found?.icon || CircleIcon;
}

/**
 * 🏷️ Get readable label
 */
export function getPaymentLabel(method: PaymentMethod): string {
  const found = PaymentMethodOptions.find((item) => item.value === method);
  return found?.label || "Unknown";
}

/**
 * 💬 Get payment method description
 */
export function getPaymentDescription(method: PaymentMethod): string {
  const found = PaymentMethodOptions.find((item) => item.value === method);
  return found?.description || "";
}

/**
 * 🖼️ Get related image or banner
 */
export function getPaymentImage(method: PaymentMethod): string {
  const found = PaymentMethodOptions.find((item) => item.value === method);
  return found?.image || "";
}

/**
 * 🎨 Optional: Color palette mapping for UI badges or icons
 */
export function getPaymentColor(method: PaymentMethod): string {
  const colors: Record<PaymentMethod, string> = {
    [PaymentMethod.BankTransfer]: "text-blue-500",
    [PaymentMethod.EWallet]: "text-purple-500",
    [PaymentMethod.CreditCard]: "text-indigo-500",
    [PaymentMethod.CashOnDelivery]: "text-amber-600",
  };

  return colors[method] || "text-gray-400";
}
