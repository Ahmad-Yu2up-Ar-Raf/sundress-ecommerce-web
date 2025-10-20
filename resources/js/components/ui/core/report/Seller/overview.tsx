"use client";
import React from "react";
import { SectionCards } from "@/components/ui/fragments/custom-ui/section-card";
import {
  Calendar,
  CircleFadingArrowUp,
  Package,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import { DataCard, PagePropsSellerOverview } from "@/types";
import { ChartPie } from "@/components/ui/fragments/custom-ui/charts/chart-pie-donut";
import { ChartAreaInteractive } from "@/components/ui/fragments/custom-ui/charts/chart-area-interactive";
import { ChartBarActive } from "@/components/ui/fragments/custom-ui/charts/chart-bar-active";
import { formatIDR } from "@/hooks/use-money-format";

function MainSection({ data }: { data: PagePropsSellerOverview }) {
  const reports = data.reports;
const revenue = formatIDR(reports.totalPendapatan)
const dataCards: DataCard[] = [
  {
    title: "Total Products",
    description: "Total jumlah produk kamu",
    value: reports.totalProducts,
    icon: Package,
    label: "+12.5%",
  },
  {
    title: "Total Orders",
    description: "Total seluruh pesanan",
    value: reports.totalOrders,
    icon: ShoppingBag,
    label: "+12.5%",
  },
    {
    title: "Total Pendapatan",
    description: "Total seluruh pendapatan dari ",
    value: revenue, // pastikan field ini dikirim dari backend
    icon: Wallet, // bisa pakai ikon lain: Coins, Banknote, atau DollarSign dari lucide-react
    label: "+12.5%",
  },
  {
    title: "Approved Orders",
    description: "Total pesanan yang diterima",
    value: reports.totalOrdersDiterima,
    icon: CircleFadingArrowUp,
    label: "+12.5%",
  },

];

  return (
    <>
      <section className="space-y-4">
        <div className="@container/main flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-4 md:gap-6">
            <SectionCards dataCards={dataCards} />
          </div>

          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs gap-y-4 md:gap-x-4 @5xl/main:grid-cols-3">
            {/* Grafik tren harian */}
            <ChartAreaInteractive
              className="col-span-3 "
              chartData={reports.countsByDate}
            />

            {/* Pie chart status produk */}
          

            {/* Pie chart status pesanan */}

              <ChartPie
              showFooter
              className="col-span-2 lg:col-span-1"
              title="Products Distribution - Status"
              footerDeskripcion="Distribusi produk berdasarkan status"
              description="Jumlah produk berdasarkan status"
              data={reports.ProductsstatusCount}
              nameKey="Products"
            />
            <ChartBarActive
  data={reports.topProducts.slice(0, 5)} // ambil top 5 saja
  title="Top 5 Best-Selling Products"
  description="Displaying your top 5 products with the highest sales"
  footerText="Data based on your products"
  subFooter="Showing top 5 products with the most expensive orderItem"
  
  className="your-custom-class"
/>
            <ChartPie
              showFooter
              className="col-span-2 lg:col-span-1"
              title="Orders Distribution - Status"
              footerDeskripcion="Distribusi pesanan berdasarkan status"
              description="Jumlah pesanan berdasarkan status"
              data={reports.StatusOrdersCount}
              nameKey="Orders"
            />

            {/* Pie chart kategori produk */}
            {/* <ChartPie
              showFooter
              className="col-span-2 lg:col-span-1"
              title="Products Distribution - Category"
              footerDeskripcion="Distribusi produk berdasarkan kategori"
              description="Jumlah produk berdasarkan kategori"
              data={reports.ProductscategoryCount}
              nameKey="Category"
            /> */}
          </div>
        </div>
      </section>
    </>
  );
}

export default MainSection;
