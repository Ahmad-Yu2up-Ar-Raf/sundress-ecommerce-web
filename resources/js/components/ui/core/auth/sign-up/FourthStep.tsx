"use client"

import React, { useEffect, useState } from 'react'

import SignUpForm from '../components/signup/FourthStep'
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

const FormFourthStep = registerCreateSchema.pick({
  occupasion: true,
})
type FormFourthStepSchema = z.infer<typeof FormFourthStep>;

function FourthStep() {

  const [isClient, setIsClient] = useState(false);

  const name = useOnboardingStore((state) => state.name);
  const email = useOnboardingStore((state) => state.email);
  const password = useOnboardingStore((state) => state.password);
  const password_confirmation = useOnboardingStore((state) => state.password_confirmation);
  const hasHydrated = useOnboardingStore((state) => state._hasHydrated);
    const country = useOnboardingStore((state) => state.country); 
    const province = useOnboardingStore((state) => state.province); 
    const phone = useOnboardingStore((state) => state.phone);
  const setData = useOnboardingStore((state) => state.setData);
  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);  
  
  const form = useForm<FormFourthStepSchema>({
    mode: "onSubmit", 
    defaultValues: {
      occupasion: "voter"
    },
    resolver: zodResolver(FormFourthStep),
  })

  // Client-side check
  useEffect(() => {
    setIsClient(true);
  }, []);

 


  useEffect(() => {
    if (!isClient || !hasHydrated) return;

    if (!name || !email || !password || !password_confirmation || !country || !province || !phone) {
      router.visit("/register");
    }
  }, [isClient, hasHydrated, name, email, password, password_confirmation, router, province, country, phone ]);



  






  async function onSubmit(data: FormFourthStepSchema) {

  
    setLoading(true)
    
    try {
             toast.loading("Loading...", { id: "register"});
 
     startTransition(async () => { 
           setData(data);
             router.visit("/register/role" , { 
                           preserveScroll: true,
                           preserveState: true,
                           forceFormData: true, 
                           onSuccess: () => {
                     
                             toast.success("Langkah ke Empat berhasil", {id: "register"});
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
      <AuthLayoutTemplate loading={loading} title='What do you do?' description='Select whether you’re a student or already working.' className=' lg:max-w-none h-dvh '>
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin size-6" />
        </div>
      </AuthLayoutTemplate>
    );
  }

  return (
    <AuthLayoutTemplate  loading={loading} title='What do you do?' description='Select whether you’re a student or already working.' className=' lg:max-w-none h-dvh '>
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
          <NavStepper curentActive={3}/>
      </SignUpForm>
    </AuthLayoutTemplate>
  )
}

export default FourthStep