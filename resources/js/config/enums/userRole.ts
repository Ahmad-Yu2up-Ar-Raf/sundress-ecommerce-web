import { OptionItem } from "@/types";
import { ShoppingCart, Store } from "lucide-react";

/**
 * NOTE:
 * - Saya pakai value "buyyer" sesuai permintaanmu.
 * - Saya sangat menyarankan mempertimbangkan "buyer" (ejaan umum) agar konsisten
 *   dengan konvensi dan kemungkinan nama route / role di backend.
 */

export const UserRoleOptions: OptionItem[] = [
  {
    value: "buyer", // sesuai permintaan; pertimbangkan 'buyer' sebagai alternatif
    label: "Mau Jajan",
    icon: ShoppingCart,
    subLabel: "Beli sebagai pembeli",
    description: "Cari, bandingkan, dan beli produk — cocok kalau kamu mau belanja saja.",
    // price atau properti lain bisa ditambahkan bila diperlukan
  },
  {
    value: "seller",
    label: "Buka Toko",
    icon: Store,
    subLabel: "Daftarkan tokomu",
    description: "Jual produkmu ke banyak pembeli. Cocok jika kamu ingin membuat dan mengelola toko.",
  },
];

export const UserRoleValues: string[] = UserRoleOptions.map((item) => item.value);
