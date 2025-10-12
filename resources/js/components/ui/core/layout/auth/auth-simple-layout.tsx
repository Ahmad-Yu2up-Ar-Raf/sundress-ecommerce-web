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
    <div className="h-full flex items-center justify-center">
      {/* FIXED: Removed overflow-hidden from main container */}
      <div className={cn(
        "w-full relative max-w-lg lg:max-w-none flex flex-col h-full lg:flex-row shadow-xl min-h-dvh",
        className
      )}>
        <div className="w-full sr-only lg:not-sr-only h-full z-2 absolute bg-linear-to-t from-transparent to-accent-foreground"></div>
        
        <div className="lg:flex hidden absolute z-2 h-full backdrop-blur-2xl pointer-events-none">
          <div className="h-full z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30"></div>
          {Array.from({ length: numberOfIterations || 50 }, (_, index) => ( 
            <div key={index} className="h-full z-2 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30"></div>
          ))}
        </div>
        
        <div className="w-[15rem] h-[15rem] bg-primary absolute z-1 rounded-full bottom-0 animate-pulse pointer-events-none"></div>
        <div className="w-[8rem] h-[5rem] bg-background absolute z-1 rounded-full bottom-0 animate-pulse pointer-events-none"></div>
 
        <div className="bg-accent-foreground lg:flex hidden text-accent p-8 lg:p-12 lg:w-1/2 relative rounded-bl-3xl">
          <h1 className="text-2xl lg:text-3xl max-w-md font-medium leading-tight z-10 tracking-tight relative">
            {quote}
          </h1>
        </div>
 
        {/* FIXED: Removed overflow-hidden, added overflow-visible for form area */}
        <main className={cn(
          "p-8 lg:w-1/2 justify-center items-center min-h-dvh h-full content-center relative bg-background z-[100] text-secondary-foreground overflow-visible"
        )}>
          <div className="justify-center max-w-sm flex m-auto flex-col h-full">
            <div className="flex flex-col items-left mb-8">
              <div className={cn("relative mb-4")}>
                <LogoWhiter className="absolute top-0 size-12 opacity-100 transition-transform ease-in-out duration-500 dark:opacity-0" />
                <LogoDark className="size-12 opacity-0 transition-transform ease-in-out duration-500 dark:opacity-100" />
              </div>
              
              <h2 className="text-3xl font-medium mb-2 tracking-tight">
                {title}
              </h2>
              <p className="text-left opacity-80">
                {description}
              </p>
            </div>
 
            {/* Form content area */}
            {props.children}
            
            {formType && (
              <div className="text-center mt-4 text-muted-foreground text-sm">
                {formType == 'register' ? `Already have account? ` : 'dont have an account yet? '}
                <Link
                  aria-disabled={loading}
                  tabIndex={!loading ? -1 : undefined}
                  href={`/${formTypeReverse}`}
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