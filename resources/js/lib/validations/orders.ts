// resources/js/types/orders.ts
import * as z from "zod";
import { productsSchema } from "./index.t";

/**
 * NOTE:
 * - Orders model fields taken from Orders.php (fillable + casts).
 * - OrderItems model fields taken from OrderItems.php.
 * - PaymentMethod & OrderStatus enums not found in uploads, so we provide
 *   placeholder arrays below — replace with real enum values from backend.
 *
 * See: Orders.php, OrderItems.php, CheckoutStore.php. :contentReference[oaicite:3]{index=3}:contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}
 */

/* =========================
   Replace these with real values from your backend enums
   (App\Enums\OrderStatus, App\Enums\PaymentMethod)
   ========================= */
export const OrderStatusValues = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "refunded",
] as const; // <-- replace with real backend values

export const PaymentMethodValues = [
  "card",
  "bank_transfer",
  "cash_on_delivery",
  "ewallet",
] as const; // <-- replace with real backend values

/* zod enums (change to z.nativeEnum if you export TS enums) */
export const orderStatusEnum = z.enum([...OrderStatusValues]);
export const paymentMethodEnum = z.enum([...PaymentMethodValues]);

export const orderItemSchema = z.object({
  id: z.number().optional(),
  vendor_id: z.coerce.number().min(1, "vendor_id is required"),
  order_id: z.number().optional(),
  product_id: z.coerce.number().min(1, "product_id is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  seller_amount: z.coerce.number().min(0, "seller_amount must be >= 0"),
  platform_commission: z.coerce.number().min(0).optional().default(0),
  price: z.coerce.number().min(0, "price must be >= 0"),
  // optional status if present on OrderItems
  status: orderStatusEnum.optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  product: productsSchema.optional()
});

export type OrderItemType = z.infer<typeof orderItemSchema>;


export const orderSchema = z.object({
  id: z.number().optional(),

  // relations
  user_id: z.coerce.number().min(1, "user_id is required"),
  order_items: z.array(orderItemSchema).optional(),

  // Buyer / shipping info (from $fillable / CheckoutStore rules)
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Email must be valid"),
  phone: z.string().min(3, "Phone is required"),
  address: z.string().max(1000).optional().nullable(),
  country: z.string().min(1, "Country is required"),
  province: z.string().min(1, "Province is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  shipping_method: z.string().min(1, "Shipping method is required"),

  // payment fields



  // totals & meta
  subtotal: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).optional().nullable(),
  shipping: z.coerce.number().min(0).optional().nullable(),
  tax: z.coerce.number().min(0).optional().nullable(),
  total_price: z.coerce.number().min(0, "total_price must be >= 0"),

  // notes, status, paid_at
  notes: z.string().max(1000).optional().nullable(),
  status: orderStatusEnum.optional(),
  paid_at: z.preprocess((v) => {
    // accept ISO strings or Date objects
    if (typeof v === "string" && v.length) return new Date(v);
    if (v instanceof Date) return v;
    return undefined;
  }, z.date().optional()),

  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type OrderType = z.infer<typeof orderSchema>;


export const checkoutPayloadSchema = z.object({
  // required shipping
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  address: z.string().min(1),
  country: z.string().min(1),
  province: z.string().min(1),
  zipCode: z.string().min(1),
  shipping_method: z.string().min(1),

  // payment and card fields (some conditional in UI)
  payment_method: paymentMethodEnum,
  nameOfCard: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryMonth: z.coerce.number().optional(),
  expiryYear: z.coerce.number().optional(),
  cvv: z.string().optional(),

  // summary fields (from your calculateSummary)
  subtotal: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).optional(),
  shipping: z.coerce.number().min(0),
  tax: z.coerce.number().min(0),
  total_price: z.coerce.number().min(100, "Total minimal Rp100"),
});

/* export types for usage in frontend forms */
export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
