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
;
import { PasswordInput } from '@/components/ui/fragments/custom-ui/input/password-input';

interface TaskFormProps<T extends FieldValues, >
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
  
}

function SignUpFormSecondStep<T extends FieldValues, >({
    form,
    isPending,
...props
}: TaskFormProps<T>) {
  return (
   <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className=" space-y-6 *:
      
      

      ">
      

     
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

        {props.children}
        </form>
    </Form>
  )
}

export default SignUpFormSecondStep


