"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/fragments/shadcn-ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/fragments/shadcn-ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/fragments/shadcn-ui/radio-group"
import { useAppearance } from "@/hooks/use-appearance"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"]),

})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AppearanceFormValues> = {
  theme: "light",
}

export function AppearanceForm() {
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })
  const {  updateAppearance } = useAppearance();
  function onSubmit(data: AppearanceFormValues) {
      updateAppearance(data.theme)
    toast.success("Apperance Updated")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={
                    field.onChange
                  }
                defaultValue={field.value}
                className="grid max-w-md lg:grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary grid">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-xl border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                        <div className="space-y-2 rounded-xl bg-white p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-xl bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-xl bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-xl bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-xl bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-xl bg-white p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-xl bg-[#ecedef]" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Light
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary  grid">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-xl border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                        <div className="space-y-2 rounded-xl bg-slate-800 p-2 shadow-sm">
                          <div className="h-2 w-[80px] rounded-xl bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-xl bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-xl bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-xl bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-xl bg-slate-800 p-2 shadow-sm">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-xl bg-slate-400" />
                        </div>
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Dark
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type="submit">Update preferences</Button>
      </form>
    </Form>
  )
}