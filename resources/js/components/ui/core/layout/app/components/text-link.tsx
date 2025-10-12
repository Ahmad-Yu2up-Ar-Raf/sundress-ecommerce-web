import { buttonVariants } from '@/components/ui/fragments/shadcn-ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof Link>;

export default function TextLink({ className = '', children, ...props }: LinkProps) {
    const disabled = props.disabled
    return (
        <Link
         aria-disabled={disabled}  tabIndex={!disabled ? -1 : undefined} 
            className={cn(
  buttonVariants({variant: "link"}),
                 disabled && 'pointer-events-none cursor-none text-foreground/50' ,
                className,
              
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
