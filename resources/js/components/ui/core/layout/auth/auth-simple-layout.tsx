"use client";

import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import * as React from "react"
import { Logo, LogoDark, LogoWhiter } from "@/components/ui/fragments/svg/logo";

type AuthLayoutProps = { 
    children?: React.ReactNode;
    title?: string;
    description?: string;
    quote?: string;
    loading?: boolean;
    className?: string
    numberOfIterations?: number
    formType?: "login" | "register";
}

const AuthLayoutTemplate = ({
  formType,
  numberOfIterations,
  className,
  loading = false,
  title = `Welcome to sundress`,
  quote = `Design and dev partner for startups and founders.`,
  description = `Welcome to Sundress — Let's get started`,
  ...props
}: AuthLayoutProps) => {
  const formTypeReverse = formType == 'register' ? 'login' : 'register'
  
  return (
    <div className="   h-full flex items-center justify-center overflow-hidden ">
    <div className={cn("  w-full relative max-w-lg  overflow-hidden flex flex-col  lg:flex-row shadow-xl lg:max-w-none h-dvh" , className)}>
      <div className="w-full h-full z-2 absolute bg-linear-to-t from-transparent to-black"></div>
      <div className="flex absolute z-2  h-full overflow-hidden backdrop-blur-2xl ">
        <div className="h-full z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30 overflow-hidden"></div>
          {Array.from({ length: numberOfIterations || 10}, (_, index) => ( 

        <div key={index} className="h-full z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30]  opacity-30 overflow-hidden"></div>
          ))}
    
      </div>
      <div className="w-[15rem] h-[15rem] bg-primary absolute z-1 rounded-full bottom-0 animate-pulse pointer-events-none"></div>
        <div className="w-[8rem] h-[5rem] bg-background absolute z-1 rounded-full bottom-0 animate-pulse pointer-events-none"></div>
        <div className="w-[8rem] h-[5rem] bg-background absolute z-1 rounded-full bottom-0 animate-pulse pointer-events-none"></div>
 
      <div className="bg-black  hidden lg:inline text-white p-8 lg:p-12 lg:w-1/2 relative rounded-bl-3xl  overflow-hidden">
        <h1 className="text-2xl max-w-sm  lg:text-3xl font-medium leading-tight z-10 tracking-tight relative">
          {quote}
        </h1>
      </div>

      <main className={cn("p-8 lg:w-1/2 justify-center items-center  h-full content-center relative bg-background z-[100] text-secondary-foreground overflow-visible " )}>
          <div className="justify-center max-w-sm flex m-auto flex-col h-full">
            <div className="flex flex-col items-left mb-8">
              <div className={cn("relative mb-4")}>
                <LogoWhiter className="absolute top-0 size-10 sm:size-12 opacity-100 transition-transform ease-in-out duration-500 dark:opacity-0" />
                <LogoDark className="sm:size-12 size-10 opacity-0 transition-transform ease-in-out duration-500 dark:opacity-100" />
              </div>
              
              <h2 className="sm:text-3xl text-2xl font-medium mb-2 tracking-tight">
                {title}
              </h2>
              <p className="text-left sm:text-base text-sm opacity-80">
                {description}
              </p>
            </div>
 
            {/* Form content area */}
            {props.children}
            
            {formType && (
              <div className="text-center mt-4 text-muted-foreground text-sm">
                {formType == 'register' ? `Already have account? ` : 'dont have an account yet? '}
                <Link
                  href={`/${formTypeReverse}`}
                  aria-disabled={loading}
                  tabIndex={!loading ? -1 : undefined}
                  className={cn(
                    "text-secondary-foreground capitalize font-medium underline",
                    loading ? 'pointer-events-none cursor-none text-foreground/50' : ''
                  )}
                >
                  {formTypeReverse}
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayoutTemplate