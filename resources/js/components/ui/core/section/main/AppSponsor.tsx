"use client"



import SvgAppStoreComponent from '@/components/ui/fragments/svg/AppleLink'
import MediaItem from '@/components/ui/fragments/custom-ui/MediaItem'
import SvgPlayStoreComponent from '@/components/ui/fragments/svg/PlayStore'
import { Link } from '@inertiajs/react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/fragments/shadcn-ui/card'







type componentsProps = {
title?: string
label?: string
href?: string
linkLabel?: string


}


function AppSponsor() {

  

  return (
    <section  className='  container   sm:px-10 px-5   space-y-7'> 
   <Card className=" rounded-xl pt-6 pb-12  space-y-4 px-8 bg-primary/20 sm:py-12 h-full w-full">



    <CardContent className=" p-0  space-y-8 sm:space-y-4 text-center">
      <div className=" max-h-[19em] rounded-xl  sm:sr-only  overflow-hidden">

    <MediaItem webViewLink='https://koro.imgix.net/media/10/21/17/1741705996/2025_03_KoRo_App_HP_EN.png?w=400&auto=format,compress&fit=max&cs=srgb'  className=' min-h-[20.1em] transition-all duration-300 ease-out justify-center items-center  max-w-xs m-auto    w-full   '/>
      </div>
<CardHeader className=' max-w-md m-auto p-0'>

    <CardTitle>
        <h1 className=' tracking-tighter  text-2xl font-extrabold '>
            Download the tastiest app out there
        </h1>
    </CardTitle>
    <CardDescription className='  font-medium md:text-base  text-sm'>Explore our range, get exclusive discounts & order faster than ever!</CardDescription>
</CardHeader>
<CardFooter className="flex mt-5 gap-2 items-center justify-center">
  <CardAction>

  <Link href="/" className="group rounded-xl overflow-hidden bg-background relative px-0">
    <SvgAppStoreComponent className="h-[40px] w-auto" />
  </Link>
  </CardAction>
  <CardAction>

  <Link href="/" className="group rounded-xl overflow-hidden bg-background relative px-0">
    <SvgPlayStoreComponent className="h-[40px] w-auto" />
  </Link>
  </CardAction>
</CardFooter>

    </CardContent>
   </Card>
   
    </section>
  )
}

export default AppSponsor




