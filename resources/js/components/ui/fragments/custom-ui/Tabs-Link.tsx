"use client"
import { cn } from '@/lib/utils'
import { tabsLinktype } from '@/types'
import { Link } from '@inertiajs/react'
import {usePage} from '@inertiajs/react'






type componentProps = {
    Tabslink : tabsLinktype[]
}

function TabsLink({Tabslink} : componentProps) {
   const paths = usePage().url
  return (
       <div className='bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]' >
        {Tabslink.map((tabs, i) => 
        {

          const active = paths == tabs.link 
        return(

          <Link key={i} className={cn(' focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring   text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none  '
,
  active && 'bg-background dark:text-foreground dark:border-input dark:bg-input/30  shadow-sm'

          )}  href={tabs.link} >

           {tabs.name}
          </Link>
        )})}


 
        </div>
  )
}

export default TabsLink