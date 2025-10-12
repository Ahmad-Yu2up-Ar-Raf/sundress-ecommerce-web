"use client"



import SvgAppStoreComponent from '@/components/ui/fragments/svg/AppleLink'
import MediaItem from '@/components/ui/fragments/custom-ui/MediaItem'
import SvgPlayStoreComponent from '@/components/ui/fragments/svg/PlayStore'
import { Link } from '@inertiajs/react'







type componentsProps = {
title?: string
label?: string
href?: string
linkLabel?: string


}


function AppSponsor() {

  

  return (
    <section  className=' max-w-[1190px] bg  px-4 container  space-y-7'> 
   <div className=" rounded-lg pt-6 pb-12  space-y-4 px-8 bg-primary/20 sm:py-12 h-full w-full">


    <MediaItem webViewLink='https://koro.imgix.net/media/10/21/17/1741705996/2025_03_KoRo_App_HP_EN.png?w=400&auto=format,compress&fit=max&cs=srgb'  className='  min-h-[20.1em] transition-all duration-300 ease-out  sm:sr-only   w-full  '/>

    <div className="  space-y-3 text-center">

    <header>
        <h1 className=' md:text-2xl text-xl font-extrabold '>
            Download the tastiest app out there
        </h1>
    </header>
    <p className=' font-semibold  md:text-base  text-sm'>Explore our range, get exclusive discounts & order faster than ever!</p>
<div className="flex mt-5 gap-2 items-center justify-center">
  <Link href="/" className="group rounded-lg overflow-hidden bg-background relative px-0">
    <SvgAppStoreComponent className="h-[40px] w-auto" />
  </Link>

  <Link href="/" className="group rounded-lg overflow-hidden bg-background relative px-0">
    <SvgPlayStoreComponent className="h-[40px] w-auto" />
  </Link>
</div>

    </div>
   </div>
   
    </section>
  )
}

export default AppSponsor




