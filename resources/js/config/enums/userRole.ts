import { OptionItem } from "@/types";
import { ShoppingCart, Store } from "lucide-react";

/**
 * NOTE:
 * - Using value "buyer" (correct English spelling).
 * - Adjust wording to sound natural for an English onboarding UI.
 */

export const UserRoleOptions: OptionItem[] = [
  {
    value: "buyer",
    label: "Shop Now",
    icon: ShoppingCart,
    subLabel: "Buy as a customer",
    description: "Discover, compare, and purchase products — perfect if you just want to shop.",
  },
  {
    value: "seller",
    label: "Open a Store",
    icon: Store,
    subLabel: "Register your shop",
    description: "Sell your products to many customers. Ideal if you want to build and manage your own store.",
  },
];

export const UserRoleValues: string[] = UserRoleOptions.map((item) => item.value);
