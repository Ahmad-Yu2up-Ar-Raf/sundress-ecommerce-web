

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/fragments/shadcn-ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/fragments/shadcn-ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/fragments/shadcn-ui/sidebar"
import { SharedData } from "@/types"
import { useInitials } from "@/hooks/use-initials"
import { Link, router } from "@inertiajs/react"
import { useMobileNavigation } from "@/hooks/use-mobile-navigation"
import { EllipsisVertical, LogOut, Settings } from "lucide-react"

export function NavUser({
  user,
}: {
  user: SharedData["auth"]
}) {
  const { isMobile } = useSidebar()
    const getInitials = useInitials();
        const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.user.avatar} alt={user.user.name} />
                <AvatarFallback className="rounded-lg"> {getInitials(user.user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.user.email}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.user.avatar} alt={user.user.name} />
                  <AvatarFallback className="rounded-lg"> {getInitials(user.user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <Link  className=" w-full" href={'/settings/profile'} as="button" >
            <DropdownMenuItem>
              <Settings/>
              Settings
            </DropdownMenuItem>
              </Link>
           
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
              <Link method="post" className=" w-full" href={route('logout')} as="button" onClick={handleLogout}>
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
              </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}