import React from 'react'
import { Input } from '../shadcn-ui/input'
import { Button } from '../shadcn-ui/button'
import MediaItem from './MediaItem'
import { Link } from '@inertiajs/react'

function Neslatter() {
  return (
    <div className=" px-5  py-20">

<div className="w-full max-w-[1155px] grid lg:grid-cols-2  rounded-xl bg-primary/20 relative  m-auto   ">
    {/* <MediaItem webViewLink='https://koro.imgix.net/media/5b/07/fc/1687174556/Newsletter-Background-Image.jpg'
    className=' absolute w-full h-full '
    /> */}
      <div className="flex items-center   md:py-15 py-13 col-span-2 px-4.5">
        <div className="relative grid m-auto md:text-center max-w-[540px] gap-8">
          <div className="grid gap-3 ">
            <h1 className="text-4xl leading-9 font-bold">
          Make Your Inbox Tasty
            </h1>
            <p className="text-balance text-xs   font-medium   text-black">
            Never Miss Out Again! Stay up to date with our newsletter from now on.
            </p>
          </div>
          <form  className="grid gap-8">
            <div className="flex w-full max-w-xs md:max-w-md md:m-auto items-center space-x-2">
              <Input
                type="email"
                placeholder="Emailaddres.@gmail.com"
                name="email"
                required
                className=' bg-white w-full   placeholder:text-xs'
              />
              <Button type="submit" className=' text-xs '>Subscribe</Button>
            </div>
            <p className="text-[10.5px] text-accent-foreground/80">
  You hereby agree to receive our newsletter. Consent can be revoked at any time using, for example, the unsubscribe link in the newsletter. Find more information in our 
  
  
  <Link
  href={'/'}
  className='  text-black underline'
  >
   {" "}  data protection information.
  </Link>
            </p>
          </form>
          {/* Display the alert based on alertVisible state */}
        
        </div>
      </div>

    </div>
    </div>
  
  )
}

export default Neslatter
