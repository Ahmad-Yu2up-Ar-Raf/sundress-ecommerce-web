import React from 'react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/fragments/shadcn-ui/form"
import { Input } from '@/components/ui/fragments/shadcn-ui/input';
import { PasswordInput } from '@/components/ui/fragments/custom-ui/input/password-input';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { LoaderIcon } from 'lucide-react';

interface TaskFormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {

  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;


}



function LoginForms<T extends FieldValues>( {   
isPending,
form,
onSubmit
} : TaskFormProps<T>) {
  return (
 <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7  w-full mx-auto ">
        
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
        
        <FormField
         disabled={isPending}
          control={form.control}
    name={"password" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password </FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormDescription  className=' sr-only '>Enter your password.</FormDescription>
              <FormMessage  className=' '/>
            </FormItem>
          )}
        />
        <FormField
         disabled={isPending}
          control={form.control}
    name={"password_confirmation" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirmation" {...field} />
              </FormControl>
              <FormDescription  className='sr-only '>Enter your password.</FormDescription>
              <FormMessage  className=' '/>
            </FormItem> 
          )}
        />
       
            <Button type="submit" className="mt-4 w-full cursor-pointer"  disabled={isPending}>
                                {isPending && <LoaderIcon className="h-4 w-4 animate-spin" />}
                                Register
                            </Button>
</form>
</Form>
  )
}

export default LoginForms