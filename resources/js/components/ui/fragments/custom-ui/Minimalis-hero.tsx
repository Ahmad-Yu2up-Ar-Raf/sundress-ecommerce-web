import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/fragments/shadcn-ui/drawer";
import { Logo } from '../svg/logo';
import { Link, router, usePage } from '@inertiajs/react';
import { Button, buttonVariants } from '../shadcn-ui/button';
// Define the props interface for type safety and reusability
interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks: { icon: LucideIcon; href: string }[];
  locationText: string;
  className?: string;
}

// Helper component for navigation links
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

// Helper component for social media icons
const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/60 transition-colors hover:text-foreground">
    <Icon className="h-5 w-5" />
  </a>
);
import { User as profile, type SharedData } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
// The main reusable Hero Section component
export const MinimalistHero = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
}: MinimalistHeroProps) => {
  const TopMenu = [


    { name: "Trends", href: "/trend" },
    { name: "Explore", href: "/products" },
    { name: "Blog", href: "/blog" },
  ];
  const isMobile = useIsMobile()
    const onClick = () => router.visit('/login');
      const user = usePage<SharedData>().props.auth.user;
  return (
    <div
      className={cn(
        'relative flex   space-y-20 min-h-dvh w-full flex-col items-center justify-between overflow-hidden bg-background p-8  md:p-12',
        className
      )}
    >
      {/* Header */}
      <header className="z-30  flex w-full container items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold tracking-wider"
        >
          {logoText}
        </motion.div>
        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </div>
        {isMobile && (

        <Drawer>
              <div className="flex gap-3 items-center">
                {/* <Suspense>
                  <ModeToggle />
                </Suspense> */}
                <DrawerTrigger asChild>
                <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-1.5 md:hidden"
          aria-label="Open menu"
        >
          <span className="block h-0.5 w-6 bg-foreground"></span>
          <span className="block h-0.5 w-6 bg-foreground"></span>
          <span className="block h-0.5 w-5 bg-foreground"></span>
        </motion.button>
                </DrawerTrigger>
              </div>
              <DrawerContent
               
                className="pb-5  px-4"
              >
                   <DrawerHeader className="   sm:px-7 space-y-1 bg-background     p-4 border-b   pb-3 justify-center items-center mb-6 ">
           <DrawerTitle>
                  Sundress.
                  </DrawerTitle>

        
              <DrawerDescription className=" sr-only hidden text-sm">
                             Fill in the details below to create a new task
                       </DrawerDescription>
          
        </DrawerHeader>
                <div className="flex flex-col overflow-y-auto">
                  {TopMenu.map((menu, idx) =>
                      <Link
                        key={idx}
                        href={menu.href}
                        className="py-3 px-1 font-medium text-base border-b border-border/40 flex items-center"
                      >
                        {menu.name}
                      </Link>
                   
                  )}
                </div>
                <DrawerFooter className="border-t  px-0 pt-3 mt-6">
                    {user != null ? ( 

              <Link href={user.roles ? '/dashboard' : '/my-shop'} className={buttonVariants({ variant: "default" })}>
                Dasboard
                </Link>
            ) : (

             <div className="mt-2 flex flex-col gap-2">
                    
            
                  <Button 
                  onClick={onClick}
                  >
                    Login
                  </Button>
             
                    <Link
                      href="/register"
                      className={buttonVariants({ variant: "outline"})}
                    >
                      Get Started
                    </Link>
                  </div>
            )}
                  
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
        )}
       
      </header>

      {/* Main Content Area */}
      <div className="relative gap-30 md:gap-0 grid w-full max-w-[70em] flex-grow grid-cols-1 items-center md:grid-cols-3">
        {/* Left Text Content */}
        {!isMobile && (

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20   md:text-accent-foreground    order-2 md:order-1 text-center md:text-left"
        >
          <p className="mx-auto max-w-xs text-sm leading-relaxed    md:mx-0">{mainText}</p>
          <a href={readMoreLink} className="mt-3 inline-block text-sm font-medium text-foreground underline decoration-from-font">
            Read More
          </a>
        </motion.div>
        )}

        {/* Center Image with Circle */}
        <div className="relative order-1 md:order-2 flex justify-center items-center h-full">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="absolute z-0 h-[300px] w-[300px] rounded-full bg-yellow-400/90 md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
            ></motion.div>
            <motion.img
                src={imageSrc}
                alt={imageAlt}
                className="relative z-10 h-auto w-[12em] object-cover md:w-[35dvw] scale-150 lg:w-[20dvw]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/400x600/eab308/ffffff?text=Image+Not+Found`;
                }}
            />
        </div>

        {/* Right Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="z-20 order-3 flex items-center justify-center text-center md:justify-start"
        >
          <h1 className="text-7xl  font-extrabold text-foreground md:text-8xl lg:text-9xl">
            {overlayText.part1}
            <br />
            {overlayText.part2}
          </h1>
        </motion.div>
      </div>

      {/* Footer Elements */}

    </div>
  );
};
