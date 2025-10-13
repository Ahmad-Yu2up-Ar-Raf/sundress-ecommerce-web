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
import { LogoDark, LogoWhiter } from "@/components/ui/fragments/svg/logo"

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
              <div className="bg-sidebar-primary text-accent flex aspect-square size-8 items-center justify-center rounded-xl">
              <div className={cn(" relative" )} >
                             <LogoWhiter className=" size-5 opacity-0 stransition-transform ease-in-out duration-500 dark:opacity-100" />
                             <LogoDark className="  absolute top-0 size-5 opacity-100  transition-transform ease-in-out duration-500 dark:opacity-0  " />
                           
                           </div>
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
