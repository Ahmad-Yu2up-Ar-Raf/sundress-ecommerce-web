
import { CategoryProductsValues } from "@/config/enum/CategoryProductsStatus";
import { ProductStatusValues } from "@/config/enum/ProducStatus";
import * as z from "zod";


const imageSchema = z.union([
  // File object untuk upload baru
  z.instanceof(File)
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "File size must be less than 2MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/svg+xml", "image/gif"].includes(
          file.type
        ),
      {
        message: "Only JPEG, PNG, SVG, and GIF files are allowed",
      }
    ),
  z.string().min(1, "Picture is required"),
])


export const FileMetadata = z.object({
  name:  z.coerce.string().min(1, "File name is required"),
  size: z.coerce.number().min(1, "File size is required"),
  type: z.coerce.string().min(1, "File type is required"),
});

export const FileWithPreview = z.object({
  file: FileMetadata,
  id: z.coerce.string().min(1, "File ID is required"),
  preview: z.coerce.string().optional(),
  base64Data: z.coerce.string().min(1, "File data is required") // Tambahkan base64Data sebagai required
})

export const whistlistSchemat = z.object({
  id: z.number().optional(),
  product_id: z.number().optional(),
  

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  

});


export const productsSchema = z.object({
    id: z.number().optional(),
  name: z.string().min(4, "Name is required"),
  city: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  main_image: imageSchema,
  thumbnail_image: imageSchema,
  description: z.string().optional(),
  stock: z.coerce.number().min(2, "Harga is required"),
   is_whislisted: z.boolean().optional(),
  category: z.enum(CategoryProductsValues).optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
    reviews_count:  z.number().optional(),
    orders_count:  z.number().optional(),
    reviews_avg_star_rating:  z.number().optional(),
     price: z.coerce.number().min(0.001, "Harga is required"),
   status: z.enum(ProductStatusValues).optional(),

 showcase_images: z
  .array(FileWithPreview)
  .optional(),
});




export const whistlistSchema = z.object({
  id: z.number().optional(),
  product_id: z.number().optional(),
  
  product: productsSchema.optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  

});



export type ProductsSchema = z.infer<typeof productsSchema>;
export type WhistlistSchema = z.infer<typeof whistlistSchema>;