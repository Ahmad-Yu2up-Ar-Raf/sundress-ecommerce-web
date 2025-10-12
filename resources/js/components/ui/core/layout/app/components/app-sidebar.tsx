"use client"

import * as React from "react"
import type { SVGProps } from "react"
import {
  AudioWaveform,
  Box,
  BoxIcon,
  Calendar,
  Command,
  GalleryVerticalEnd,
  Heart,
  HomeIcon,
  LayoutDashboardIcon,
  LifeBuoy,
  Send,
  ShoppingBag,
} from "lucide-react"

import { NavMain } from '@/components/ui/core/layout/app/components/nav-main';
import { NavUser } from '@/components/ui/core/layout/app/components/nav-user';
import { TeamSwitcher } from "@/components/ui/core/layout/app/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/fragments/shadcn-ui/sidebar"
import { type SharedData } from '@/types';
import { NavSecondary } from "./NavSecondary";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePage } from "@inertiajs/react";

// Jika lucide-react tidak export type LucideIcon, kita definisikan sendiri:
import type { LucideIcon } from "lucide-react";

export type IconType = LucideIcon;

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

interface SecondaryNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
}

interface DataShape {
  teams: Team[];

  seller: NavItem[];
  buyer: NavItem[];
  navSecondary: SecondaryNavItem[];
}

// Sekarang deklarasikan data dengan tipe yang jelas
const data: DataShape = {
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ],


  seller: [
    { title: "Dashboard", url: "/seller", icon: LayoutDashboardIcon, isActive: false },
    { title: "Products", url: "/seller/Products", icon: BoxIcon, isActive: false },
    { title: "Orders", url: "/seller/Orders", icon: ShoppingBag, isActive: false },

  ],

  buyer: [
    { title: "Dashboard", url: "/buyer", icon: LayoutDashboardIcon, isActive: false },
    { title: "Whistlist", url: "/buyer/whishlist", icon: Heart, isActive: false },
   { title: "Orders", url: "/buyer/Orders", icon: ShoppingBag, isActive: false },
  ],

  navSecondary: [
    { title: "Mendukung", url: "#", icon: LifeBuoy },
    { title: "Masukan", url: "#", icon: Send },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = usePage<SharedData>().props;
  const isMob = useIsMobile();

  // Safety: ambil role pertama, fallback ke 'buyer' kalau undefined
  // Pastikan role yang dikirim backend adalah salah satu 'admin'|'seller'|'buyer'
  const rawRole = (auth?.user?.roles && auth.user.roles[0]) ?? "buyer";
  const UserRole = rawRole as keyof Omit<DataShape, "teams" | "navSecondary">; // 'admin'|'seller'|'buyer'

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher user={auth} teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data[UserRole]} />
        <NavSecondary
          isMobile={isMob}
          items={data.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={auth} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
