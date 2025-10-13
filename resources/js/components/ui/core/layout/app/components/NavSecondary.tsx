import * as React from "react"
import {   Search,
  Building2,
  BriefcaseBusiness,
  Settings2, type LucideIcon, 
  Palette} from "lucide-react"
import { ModeToggle } from "@/components/ui/fragments/custom-ui/mode-toggle";
import { useTheme } from "next-themes";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/fragments/shadcn-ui/sidebar"
import { Link } from "@inertiajs/react";
// import { ThemeSelector } from "@/components/ui/core/Theme/theme-selector";
// import { CommandDialogDemo } from "../../siteheader/component/command-search";
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { Button } from "@/components/ui/fragments/shadcn-ui/button";
export function NavSecondary({
  isMobile,
  items,

  ...props
}: {
  isMobile: boolean
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]

} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  
  // const [open, setOpen] = React.useState(false)
  
  // React.useEffect(() => {
  //   const down = (e: KeyboardEvent) => {
  //     if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault()
  //       setOpen((open) => !open)
  //     }
  //   }

  //   document.addEventListener("keydown", down)
  //   return () => document.removeEventListener("keydown", down)
  // }, [])
  
    const { appearance, updateAppearance } = useAppearance();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = appearance === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      if (!document.startViewTransition) {
        updateAppearance(newMode);
        return;
      }

      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        updateAppearance(newMode);
      });
    },
    [appearance, updateAppearance]
  );

  return (
    <>
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu className="relative">
            {/* <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => setOpen(true)}  
                className="cursor-pointer" 
                size="sm" 
                tooltip={"Search"}
              >
                <Search />
                <span>Search</span>
              </SidebarMenuButton>
            </SidebarMenuItem> */}

            {/* <ThemeSelector>
              <SidebarMenuButton 
                tooltip={"Appearance"} 
                className="cursor-pointer w-full"  
                asChild 
                size="sm"
              >
                <div className="w-full">
                  <Palette className="size-4" />
                  <span>Appearance</span>
                </div>
              </SidebarMenuButton>
            </ThemeSelector> */}

            <SidebarMenuItem>
              <SidebarMenuButton 
                className="cursor-pointer"  
                asChild 
                size="sm" 
                tooltip={"Theme"}
              >
                <Button onClick={handleThemeToggle}>
                  <ModeToggle />
                  <span>Tema</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      {/* <CommandDialogDemo 
        theme={theme} 
        modeToggle={handleThemeToggle} 
        setOpen={setOpen} 
        open={open}
 
      /> */}
    </>
  )
}
