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

import { CountrySelector, ProvinceSelector } from '@/components/ui/fragments/custom-ui/input/location-input';
import { PhoneInput } from '@/components/ui/fragments/custom-ui/input/phone-input';

interface TaskFormProps<T extends FieldValues>
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
}

function SignUpFormThirdStep<T extends FieldValues>({
  form,
  isPending,
  ...props
}: TaskFormProps<T>) {
  // Watch country value to pass to ProvinceSelector
  const countryValue = form.watch("country" as FieldPath<T>)

  // Debug log
  React.useEffect(() => {
    console.log('📍 Form Country Value:', countryValue)
  }, [countryValue])

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(props.onSubmit)} 
        className="overflow-x-hidden space-y-6 "
      >
        <div className=" grid grid-cols-2 gap-4">

        {/* Country Field */}
        <FormField
          control={form.control}
          name={"country" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <CountrySelector
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription className='text-xs sr-only text-muted-foreground'>
                Select your country
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Province Field */}
        <FormField
          control={form.control}
          name={"province" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province / State</FormLabel>
              <FormControl>
                <ProvinceSelector
                  value={field.value}
                  onChange={field.onChange}
                  countryName={countryValue as string}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription className='text-xs sr-only text-muted-foreground'>
                Select your province (if available)
              </FormDescription>
              <FormMessage  className=' sr-only'/>
            </FormItem>
          )}
        />
        </div>

        {/* Phone Field */}
        <FormField
          control={form.control}
          name={"phone" as FieldPath<T>}
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Phone number</FormLabel>
              <FormControl className="w-full">
                <PhoneInput
                  placeholder="Enter phone number"
                  {...field}
                  defaultCountry="ID"
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription className='text-xs sr-only text-muted-foreground'>
                Enter your phone number with country code
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {props.children}
      </form>
    </Form>
  )
}

export default SignUpFormThirdStep