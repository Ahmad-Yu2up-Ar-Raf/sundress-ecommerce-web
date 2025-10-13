"use client";


import * as React from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/fragments/shadcn-ui/form";
import { Input } from "@/components/ui/fragments/shadcn-ui/input";

import { cn } from "@/lib/utils";





import { Textarea } from "@/components/ui/fragments/shadcn-ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/fragments/shadcn-ui/select"
import PictureImageInput  from "@/components/ui/fragments/custom-ui/input/picture-input";

import { ProductsSchema as ProductsSchema } from "@/lib/validations/index.t";
import { CountrySelector, ProvinceSelector } from "@/components/ui/fragments/custom-ui/input/location-input";
import MoneyInput from "@/components/ui/fragments/custom-ui/input/curency-input";
import FormFileUpload from "@/components/ui/fragments/custom-ui/input/files-input";
import { FileWithPreview } from "@/hooks/use-files-upload";
import { ProductStatusOptions } from "@/config/enums/ProductsStatus";
import { Switch } from "@/components/ui/fragments/shadcn-ui/switch";
import { CategoryProductsOptions } from "@/config/enums/CategoryProductsStatus";


interface TaskFormProps<T extends FieldValues, >
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isPending: boolean;
   curentProduct?: ProductsSchema
   initialFiles?: FileWithPreview[] | undefined
}

export function ProductForm<T extends FieldValues, >({
  form,
  onSubmit,
 curentProduct,
  children,
  initialFiles,
  isPending,
}: TaskFormProps<T>) {





   
const countryValue = form.watch("country" as FieldPath<T>)

  // Debug log
  React.useEffect(() => {
    console.log('📍 Form Country Value:', countryValue)
  }, [countryValue])
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex overflow-y-scroll pt-6 md:pt-0 md:overflow-y-clip flex-col gap-4 px-0"
      >
        <main className="space-y-6 mb-6">
          <section className="space-y-10 border-b pb-8 pt-2 px-4 sm:px-6" >


            
            <FormField
              control={form.control}
              name={"name" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={`Product title`}
                      type="text"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=" sr-only">{`Your Product title.`}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
    
<MoneyInput
          form={form}
          disable={isPending}
          label="Price"
          name="price"
          placeholder={`Products Price `}
        />

          
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
       

        
<FormField
  disabled={isPending}
  control={form.control}
  name={"cover_image" as FieldPath<T>}
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel className={cn(isPending && "text-muted-foreground")}>
        Cover Image
      </FormLabel>
      <FormControl>
        <PictureImageInput
          disabled={isPending}
          value={field.value}
          onChange={(file) => {
            field.onChange(file)
          }}
          defaultValue={curentProduct?.cover_image || undefined}
          error={fieldState.error?.message}
        />
      </FormControl>
      <FormDescription  className=" sr-only">
        Upload gambar cover_image (SVG, PNG, JPG, GIF - max 2MB)
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>






<FormField
              control={form.control}
              name={"stock" as FieldPath<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(isPending && "text-muted-foreground")}>stock</FormLabel>
                  <FormControl>
                    <Input 
                
                      placeholder={`stock`}
                      type="number"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className=" sr-only">{`stock`}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />




<FormField
          control={form.control}
          name={"category" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CategoryProductsOptions.map((item,i ) => (

                  <SelectItem key={i} value={item.value}>{item.label}</SelectItem>
                  ))}
                  
                </SelectContent>
              </Select>
                <FormDescription className=" sr-only">You can manage email addresses in your email settings.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />




<FormField 

          control={form.control}
          name={"status" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ProductStatusOptions.map((item,i ) => (

                  <SelectItem key={i} value={item.value}>{item.label}</SelectItem>
                  ))}
                  
                </SelectContent>
              </Select>
                <FormDescription className=" sr-only">You can manage email addresses in your email settings.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />




          </section>
          
          <section className="space-y-10 px-4 sm:px-6">
            <header>
              <h1 className="text-lg font-semibold">Optional Fields</h1>
              <p className="text-sm text-muted-foreground">These are columns that do not need any value</p>
            </header>
            
            <section className="space-y-10">
         


            <FormField
          control={form.control}
          name={"showcase_images" as FieldPath<T>}
          render={( { field}) => (
            <FormItem className=" ">
              <FormLabel className="">Showcase Image</FormLabel>
              <FormControl>
                <FormFileUpload 
                  {...field}
                  initialFiles={initialFiles}
                  
                  control={form.control}
                  name="showcase_images"
                  maxSizeMB={5}
                  maxFiles={6}
               
                  isLoading={isPending}
                  isPending={isPending}
                />
              </FormControl>
              <FormDescription className="sr-only">Upload showcase images for your products</FormDescription>
              <FormMessage className=" sr-only" />
            </FormItem>
          )}
        />

            <FormField
                control={form.control}
                name={"description" as FieldPath<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(isPending && "text-muted-foreground")}>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="description"
                        className="resize-none"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="sr-only">{`Product description`}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
     


     <FormField
              control={form.control}
              name={"free_shipping" as FieldPath<T>}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Free Shipping</FormLabel>
                    <FormDescription >Receive emails about new products, features, and more.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />






            </section>
          </section>
        </main>
       
        {children}
      </form>
    </Form>
  );
}