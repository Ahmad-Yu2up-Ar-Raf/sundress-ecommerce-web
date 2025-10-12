import { ChartConfig } from "@/components/ui/fragments/shadcn-ui/chart"

export const chartConfig = {
  count: {
    label: "Status Count",
  },

  electronics: {
    label: "Electronics",
    color: "var(--chart-1)",
  },
  fashion: {
    label: "Fashion",
    color: "var(--chart-2)",
  },
  food: {
    label: "Food",
    color: "var(--chart-3)",
  },
  books: {
    label: "Books",
    color: "var(--chart-4)",
  },
  home: {
    label: "Home",
    color: "var(--chart-5)",
  },
  beauty: {
    label: "Beauty",
    color: "var(--chart-2)", // ulang dari chart-2 biar variasi tetap seimbang
  },
  sports: {
    label: "Sports",
    color: "var(--chart-3)",
  },
  toys: {
    label: "Toys",
    color: "var(--chart-4)",
  },
  health: {
    label: "Health",
    color: "var(--chart-5)",
  },
  accessories: {
    label: "Accessories",
    color: "var(--chart-1)",
  },
  
  pending: {
    label: "Pending",
    color: "var(--chart-3)",
  },
  paid: {
    label: "Paid",
    color: "var(--chart-1)",
  },
  unpaid: {
    label: "Unpaid",
    color: "var(--chart-5)",
  },
  processing: {
    label: "Processing",
    color: "var(--chart-2)",
  },
  shipped: {
    label: "Shipped",
    color: "var(--chart-4)",
  },
  delivered: {
    label: "Delivered",
    color: "var(--chart-1)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--chart-5)",
  },
  refunded: {
    label: "Refunded",
    color: "var(--chart-2)",
  },
    available: {
    label: "Available",
    color: "var(--chart-1)",
  },
  not_available: {
    label: "Not Available",
    color: "var(--chart-5)",
  },
  coming_soon: {
    label: "Coming Soon",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig
