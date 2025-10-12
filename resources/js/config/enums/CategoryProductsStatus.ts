import { OptionItem } from "@/types";
import {
  LucideIcon,
  Laptop,
  Shirt,
  Utensils,
  BookOpen,
  Home,
  Sparkles,
  Dumbbell,
  Gamepad2,
  HeartPulse,
  Watch,
} from "lucide-react";



// 🏷️ Enum Type (match dengan backend PHP)
export enum CategoryProductsStatus {
  Electronics = "electronics",
  Fashion = "fashion",
  Food = "food",
  Books = "books",
  Home = "home",
  Beauty = "beauty",
  Sports = "sports",
  Toys = "toys",
  Health = "health",
  Accessories = "accessories",
}
// 🧩 Structured Options for UI
export const CategoryProductsOptions: OptionItem[] = [
  {
    value: CategoryProductsStatus.Electronics,
    label: "Electronics",
    icon: Laptop,
    subLabel: "Tech & Gadgets",
    description: "Latest electronics including phones, laptops, and accessories.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: CategoryProductsStatus.Fashion,
    label: "Fashion",
    icon: Shirt,
    subLabel: "Style & Apparel",
    description: "Trendy clothing, shoes, and accessories for all seasons.",
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: CategoryProductsStatus.Food,
    label: "Food",
    icon: Utensils,
    subLabel: "Culinary & Snacks",
    description: "Delicious foods, drinks, and gourmet ingredients.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: CategoryProductsStatus.Books,
    label: "Books",
    icon: BookOpen,
    subLabel: "Literature & Knowledge",
    description: "Books across genres: fiction, non-fiction, and educational.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: CategoryProductsStatus.Home,
    label: "Home",
    icon: Home,
    subLabel: "Living & Furniture",
    description: "Furniture, decor, and home improvement essentials.",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: CategoryProductsStatus.Beauty,
    label: "Beauty",
    icon: Sparkles,
    subLabel: "Skincare & Cosmetics",
    description: "Beauty products, skincare, and grooming essentials.",
    image:
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: CategoryProductsStatus.Sports,
    label: "Sports",
    icon: Dumbbell,
    subLabel: "Active & Outdoor",
    description: "Gear and accessories for sports, fitness, and outdoor life.",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    value: CategoryProductsStatus.Toys,
    label: "Toys",
    icon: Gamepad2,
    subLabel: "Kids & Hobbies",
    description: "Fun and educational toys for children of all ages.",
    image:
      "https://plus.unsplash.com/premium_photo-1664303228186-a61e7dc91597?q=80&w=692&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    value: CategoryProductsStatus.Health,
    label: "Health",
    icon: HeartPulse,
    subLabel: "Wellness & Medical",
    description: "Vitamins, supplements, and healthcare essentials.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // pills + stethoscope
  },
  {
    value: CategoryProductsStatus.Accessories,
    label: "Accessories",
    icon: Watch,
    subLabel: "Wearables & Gadgets",
    description: "Smartwatches, bags, chargers, and more.",
    image:
      "https://plus.unsplash.com/premium_photo-1681276170683-706111cf496e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // watch & accessories
  },
];

// Optional: for quick value lists
export const CategoryProductsValues: string[] = CategoryProductsOptions.map(
  (item) => item.value
);
