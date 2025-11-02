"use client"

import * as React from "react"
import { ChevronsUpDown, LucideIcon, Plus } from "lucide-react"


import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/fragments/shadcn-ui/sidebar"
import { Auth } from "@/types"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/fragments/svg/logo"


export function TeamSwitcher({
  teams,
  user,
}: {
  teams: {
    name: string
    logo: LucideIcon
    plan: string
  }[]
    user: Auth
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className=" bg-primary-foreground flex aspect-square size-8 items-center justify-center rounded-xl">
       <Logo className="size-5"/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Sundress</span>
                <span className="truncate text-xs">{user.user.roles}</span>
              </div>
            
            </SidebarMenuButton>
     
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
