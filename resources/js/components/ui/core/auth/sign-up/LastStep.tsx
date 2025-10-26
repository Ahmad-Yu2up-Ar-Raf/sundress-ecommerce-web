"use client"

import React, { useEffect, useState } from 'react'

import SignUpForm from '../components/signup/LastStep'
import { Button, buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { registerCreateSchema} from '@/lib/validations/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import z from 'zod'
import { useOnboardingStore } from '@/hooks/use-store-signup'
import {  router } from '@inertiajs/react'

import { ChevronLeft, ChevronRight, Loader } from 'lucide-react'

import { Link } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import AuthLayoutTemplate from '../../layout/auth/auth-simple-layout';
import NavStepper from '../../layout/auth/components/NavStepper';

const FormLastStep = registerCreateSchema.pick({
  role: true,
})
type FormLastStepSchema = z.infer<typeof FormLastStep>;

function LastStep() {

  const [isClient, setIsClient] = useState(false);

  const name = useOnboardingStore((state) => state.name);
  const email = useOnboardingStore((state) => state.email);
  const password = useOnboardingStore((state) => state.password);
  const password_confirmation = useOnboardingStore((state) => state.password_confirmation);
  const hasHydrated = useOnboardingStore((state) => state._hasHydrated);
    const country = useOnboardingStore((state) => state.country); 
    const province = useOnboardingStore((state) => state.province); 
    const phone = useOnboardingStore((state) => state.phone);
    const occupasion = useOnboardingStore((state) => state.occupasion);
  const setData = useOnboardingStore((state) => state.setData);
  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);  
  
  const form = useForm<FormLastStepSchema>({
    mode: "onSubmit", 
    defaultValues: {
      role: "buyyer"
    },
    resolver: zodResolver(FormLastStep),
  })

  // Client-side check
  useEffect(() => {
    setIsClient(true);
  }, []);

 


  useEffect(() => {
    if (!isClient || !hasHydrated) return;

    if (!name || !email || !password || !password_confirmation || !country || !province || !phone || !occupasion) {
      router.visit("/register");
    }
  }, [isClient, hasHydrated, name, email, password, password_confirmation, router, province, country, phone  , occupasion]);



  






  async function onSubmit(data: FormLastStepSchema) {
    const postBody = {
      ...data,
      name,
      occupasion,
      email,
      password,
      phone,
      country,
      province,
      password_confirmation,
    }

  
    setLoading(true)
    console.log(postBody)
    try {
             toast.loading("Loading...", { id: "register"});
 
      router.post(route('register.store'),  postBody, { 
          preserveScroll: true,
          preserveState: true,
          forceFormData: true, // Penting untuk file upload
          onSuccess: () => {
            form.reset();
          
            toast.success("Register Succes", { id: "register"});
            setLoading(false);
          },
          onError: (error) => {
            console.error("Submit error:" , error);
          toast.error(`Error: ${Object.values(error).join(', ')}` , {id: "register"});
            setLoading(false);
               form.reset();
          }
        });

  
  
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Network error. Please check your connection.");
    } 
  }



  React.useEffect(() => {
      if (!loading && status) {
        form.reset()
      }
    }, [loading, status,  form , router]);
  // Loading state while hydrating
  if (!isClient || !hasHydrated) {
    return (
      <AuthLayoutTemplate loading={loading} title='What are you here for?' description='Shop for items or set up a store — choose one to continue.' className=' lg:max-w-none h-dvh '>
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin size-6" />
        </div>
      </AuthLayoutTemplate>
    );
  }

  return (
    <AuthLayoutTemplate  loading={loading} title='What are you here for?' description='Shop for items or set up a store — choose one to continue.' className=' lg:max-w-none h-dvh '>
      <SignUpForm form={form} isPending={isPending || loading} onSubmit={onSubmit}>
       <div className=" w-full space-y-5">

        <Button
          disabled={isPending || loading}
          type="submit"
          className="w-full  transition-colors"
        >
          Next 
          {(isPending || loading) ? (
            <Loader className='animate-spin ml-2'/>
          ): <ChevronRight className=''/>}
        </Button>
   
                <Link
                      aria-disabled={(isPending || loading)}  tabIndex={!(isPending || loading) ? -1 : undefined} 
                            href={'/register/location'}
                             className={cn(buttonVariants({ variant: "link"} ,
                            
                             ), 'w-full  transition-colors' ,      (isPending || loading) && 'pointer-events-none cursor-none text-foreground/50' ,)}
                            >
                               {( loading) ? (
                    <Loader className='animate-spin ml-2'/>
                  ) : <ChevronLeft className=''/>}
                            Back
                        </Link>
              
        
          </div>
          <NavStepper curentActive={4}/>
      </SignUpForm>
    </AuthLayoutTemplate>
  )
}

export default LastStep