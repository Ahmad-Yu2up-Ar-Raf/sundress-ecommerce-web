import { OptionItem } from "@/types";
import {
  CreditCard,
  Wallet,
  Banknote,
  HandCoins,
  Smartphone,
} from "lucide-react";

// 🏷️ Enum Type (match dengan backend PHP)
export enum PaymentMethod {
  BankTransfer = "bank_transfer",
  EWallet = "e_wallet",
  CreditCard = "credit_card",
  CashOnDelivery = "cash_on_delivery",
}

// 🧩 Structured Options for UI
export const PaymentMethodOptions: OptionItem[] = [
  {
    value: PaymentMethod.BankTransfer,
    label: "Bank Transfer",
    icon: Banknote,
    subLabel: "Manual payment",
    description: "Transfer directly via your bank account.",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: PaymentMethod.EWallet,
    label: "E-Wallet",
    icon: Smartphone,
    subLabel: "Digital Payment",
    description: "Pay easily using your favorite e-wallet app.",
    image:
      "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: PaymentMethod.CreditCard,
    label: "Credit Card",
    icon: CreditCard,
    subLabel: "Card Payment",
    description: "Fast and secure payments using your credit card.",
    image:
      "https://images.unsplash.com/photo-1588776814546-49f61f0ef6c1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: PaymentMethod.CashOnDelivery,
    label: "Cash on Delivery",
    icon: HandCoins,
    subLabel: "Pay on arrival",
    description: "Make payment in cash when your order arrives.",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
  },
];

// Optional quick values list
export const PaymentMethodValues: string[] = PaymentMethodOptions.map(
  (item) => item.value
);
