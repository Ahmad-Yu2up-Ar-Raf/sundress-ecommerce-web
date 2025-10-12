



import { Sun, Moon } from "lucide-react";





export function ModeToggle() {
 
  return (
 
    <span
    className="  relative    "
    
    
  >
    <Sun className="size-4 rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
    <Moon className="absolute top-0 size-4 rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0" />
    <span className="sr-only">Switch Theme</span>
  </span>
    
  );
}