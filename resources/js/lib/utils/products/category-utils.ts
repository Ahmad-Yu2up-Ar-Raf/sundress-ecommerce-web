import {
    CategoryProductsStatus,
    CategoryProductsOptions,
  } from  "@/config/enums/CategoryProductsStatus";
  import { CircleIcon } from "lucide-react";
  
  /**
   * 🧩 Dapatkan icon Lucide untuk kategori produk tertentu.
   */
  export function getCategoryIcon(category: CategoryProductsStatus) {
    const found = CategoryProductsOptions.find(
      (item) => item.value === category
    );
    return found?.icon || CircleIcon;
  }
  
  /**
   * 🏷️ Dapatkan label kategori (misalnya "Electronics", "Fashion", dst.)
   */
  export function getCategoryLabel(category: CategoryProductsStatus): string {
    const found = CategoryProductsOptions.find(
      (item) => item.value === category
    );
    return found?.label || "Unknown";
  }
  
  /**
   * 💬 Dapatkan deskripsi singkat untuk kategori produk.
   */
  export function getCategoryDescription(category: CategoryProductsStatus): string {
    const found = CategoryProductsOptions.find(
      (item) => item.value === category
    );
    return found?.description || "";
  }
  
  /**
   * 🖼️ Dapatkan gambar hero kategori (misalnya untuk card/banner).
   */
  export function getCategoryImage(category: CategoryProductsStatus): string {
    const found = CategoryProductsOptions.find(
      (item) => item.value === category
    );
    return found?.image || "";
  }
  
  /**
   * 🎨 (Opsional) Dapatkan warna default untuk kategori (misalnya untuk badge).
   * Kamu bisa ubah mapping warna sesuai tema.
   */
  export function getCategoryColor(category: CategoryProductsStatus): string {
    const colors: Record<CategoryProductsStatus, string> = {
      [CategoryProductsStatus.Electronics]: "text-blue-500",
      [CategoryProductsStatus.Fashion]: "text-pink-500",
      [CategoryProductsStatus.Food]: "text-orange-500",
      [CategoryProductsStatus.Books]: "text-amber-600",
      [CategoryProductsStatus.Home]: "text-emerald-500",
      [CategoryProductsStatus.Beauty]: "text-rose-400",
      [CategoryProductsStatus.Sports]: "text-green-500",
      [CategoryProductsStatus.Toys]: "text-yellow-500",
      [CategoryProductsStatus.Health]: "text-teal-500",
      [CategoryProductsStatus.Accessories]: "text-violet-500",
    };
  
    return colors[category] || "text-gray-400";
  }
  