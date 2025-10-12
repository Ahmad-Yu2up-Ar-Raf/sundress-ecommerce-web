"use client"

import React, { useEffect, useState } from 'react'

import SignUpFormFirstStep from '../components/signup/FirstStep';
import { Button } from '@/components/ui/fragments/shadcn-ui/button'
import { registerCreateSchema } from '@/lib/validations/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import z from 'zod'
import { useOnboardingStore } from '@/hooks/use-store-signup'
import { router, usePage } from '@inertiajs/react';
import { Loader } from 'lucide-react'
import AuthLayoutTemplate from '../../layout/auth/auth-simple-layout';
import NavStepper from '../../layout/auth/components/NavStepper';


const FormFirstStep = registerCreateSchema.pick({
  name: true,
  email: true,
})
type FormFirstStepSchema = z.infer<typeof FormFirstStep>;


function FirstStep() {
    const name = useOnboardingStore((state) => state.name);
  const email = useOnboardingStore((state) => state.email);

  const [isClient, setIsClient] = useState(false);
     const pathname = usePage();
  const setData = useOnboardingStore((state) => state.setData);
  const hasHydrated = useOnboardingStore((state) => state._hasHydrated);

  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);  
      React.useEffect(() => {
       setData({
        name: undefined,
        email: undefined,
       })
    }, [pathname]) 
  
  const form = useForm<FormFirstStepSchema>({
    mode: "onSubmit", 
    defaultValues: {
      email: email  || "",
      name: name || "",
    },
    resolver: zodResolver(FormFirstStep),
  })

  useEffect(() => {
    setIsClient(true);
  }, []);

  function onSubmit(input: FormFirstStepSchema) {
    try {
             toast.loading("Loading....", {id: "register"});
      setLoading(true)
      startTransition(async () => { 
        setData(input);
        router.visit("/register/password" , { 
                 preserveScroll: true,
                 preserveState: true,
                 forceFormData: true, 
                 onSuccess: () => {
           
                   toast.success("Langkah pertama berhasil", {id: "register"});
                   setLoading(false);
                 },
                 onError: (error) => {
                   console.error("Submit error:", error);
                   toast.error(`Error: ${Object.values(error).join(', ')}` , {id: "register"});
                   setLoading(false);
                    
                 }
               });
      })
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again." ,  {id:" register"});
    } 
  }



  
  if (!isClient || !hasHydrated) {
    return (
      <AuthLayoutTemplate description='Let’s start with your full name and email address.' loading={loading} formType="register" title='What’s your name?' className=' lg:max-w-none h-dvh '>
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin size-6" />
        </div>
      </AuthLayoutTemplate>
    );
  }

  return (
    <AuthLayoutTemplate description='Let’s start with your full name and email address.'  loading={loading} formType="register" title='What’s your name?' className=' lg:max-w-none h-dvh '>
      <SignUpFormFirstStep form={form} isPending={(isPending || loading)} onSubmit={onSubmit}>
        <Button
          disabled={(isPending || loading)}
          type="submit"
          className="w-full  transition-colors"
        >
          Next Step
          {(isPending || loading) && (
            <Loader className='animate-spin ml-2'/>
          )}
        </Button>
          <NavStepper curentActive={0}/>
      </SignUpFormFirstStep>
    </AuthLayoutTemplate>
  )
}

export default FirstStep