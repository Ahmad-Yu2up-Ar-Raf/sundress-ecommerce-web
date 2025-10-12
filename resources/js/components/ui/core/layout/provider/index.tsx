'use client';

import { Toaster } from '@/components/ui/fragments/shadcn-ui/sonner';

import { AnimatePresence } from 'framer-motion';
import SiteFooter from '../header/SiteFooter';
import { SiteHeader } from '../header/SiteHeader';
import ReactLenis from 'lenis/react'




import { cn } from '@/lib/utils';


import { TooltipProvider } from '@/components/ui/fragments/animate-ui/base/tooltip';
;
import { ModalProvider } from './ContextProvider';
import Neslatter from '@/components/ui/fragments/custom-ui/Neslatter';



const Providers = ({ children }: { children: React.ReactNode  }) => {

const disable = [ '/seller' , '/settings',  '/dashboard' , '/login'  , '/register']
const currentPath = window.location.pathname;

   const isDisabled = disable.some(prefix => currentPath.startsWith(prefix))

    return (


        <ReactLenis root>
            <ModalProvider>


                <AnimatePresence mode='wait'>
                 <TooltipProvider>
{/* 
      <SignInModal/> */}
                {  !isDisabled  &&  (

                       <SiteHeader 
           
                        key="nav-content-header" 
                       />
                )}

               
                    <div 
                        key="main-content" 
                        className={cn("relative  min-h-dvh w-full overflow-hidden  content-center" ,

                            !isDisabled  && '  py-5 '
                        )}
                    >
                        <div className={cn("mx-auto flex flex-col gap-13   lg:gap-20   h-full w-full", 



                        ) }>
                    
            {children}
              
                
                        </div>
                    </div>
                    
                           </TooltipProvider>
                </AnimatePresence>
    
                { !isDisabled  && (
<>

<Neslatter/>
   <SiteFooter/>
</>
                )}
             
          
            </ModalProvider>
        </ReactLenis>

    );
};

export default Providers;