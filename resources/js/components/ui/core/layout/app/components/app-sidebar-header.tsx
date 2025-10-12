import { Breadcrumbs } from '@/components/ui/core/layout/app/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/fragments/shadcn-ui/sidebar';
import { Separator } from '@/components/ui/fragments/shadcn-ui/separator';


export function AppSidebarHeader() {
    return (
     <header 
 
className="flex h-15 sticky md:relative top-0 z-40 w-full items-center gap-2 border-b lg:border-b-foreground/10 bg-background/90
px-4 justify-between">
          <div className="flex   bg-none   md:w-max items-center gap-2  ">
                <SidebarTrigger className="-ml-1" />
                <Separator  orientation="vertical" className=' text-accent-foreground'/>
                <Breadcrumbs  />
            </div>
        </header>
    );
}
