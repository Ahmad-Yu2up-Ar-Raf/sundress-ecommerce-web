import React from 'react'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/fragments/shadcn-ui/form"
import {
    FieldPath,
    FieldValues,
  UseFormReturn
} from "react-hook-form"

import { Input } from '@/components/ui/fragments/shadcn-ui/input';
interface TaskFormProps<T extends FieldValues, >
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
  
}

function SignUpFormFirstStep<T extends FieldValues, >({
    form,
    isPending,
...props
}: TaskFormProps<T>) {
  return (
   <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className=" space-y-6 *:
      
      
  [&_input]:text-sm [&_input]:w-full [&_input]:py-2 [&_input]:px-3 [&_input]:border [&_input]:rounded-xl [&_input]:focus:outline-none [&_input]:focus:ring-1 [&_input]:bg-background [&_input]:text-accent-foreground [&_input]:focus:ring-primary
      ">
      

      <FormField
        disabled={isPending}
          control={form.control}
           name={"name" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                placeholder="name"
                
                type="text"
                {...field} />
              </FormControl>
              <FormDescription className=' sr-only '>This is your public display name.</FormDescription>
              <FormMessage  className=' '/>
            </FormItem>
          )}
        />
        
        <FormField
        disabled={isPending}
          control={form.control}
           name={"email" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                placeholder="email"
                
                type="email"
                {...field} />
              </FormControl>
              <FormDescription  className='  sr-only'>This is your email address.</FormDescription>
              <FormMessage  className=' '/>
            </FormItem>
          )}
        />
        
   

        {props.children}
        </form>
    </Form>
  )
}

export default SignUpFormFirstStep


