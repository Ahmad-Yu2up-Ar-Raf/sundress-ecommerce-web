"use client"

import React, { useEffect, useState } from 'react'

import SignUpForm from '../components/signup/ThirdStep'
import { Button, buttonVariants } from '@/components/ui/fragments/shadcn-ui/button'
import { registerCreateSchema } from '@/lib/validations/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import z from 'zod'
import { useOnboardingStore } from '@/hooks/use-store-signup'
import { router  , usePage} from '@inertiajs/react'
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import AuthLayoutTemplate from '../../layout/auth/auth-simple-layout';
import NavStepper from '../../layout/auth/components/NavStepper';

const FormThirdStep = registerCreateSchema.pick({
  country: true,
  province: true,
  phone: true,
})
type FormThirdStepSchema = z.infer<typeof FormThirdStep>;

function ThirdStep() {

  const [isClient, setIsClient] = useState(false);
  const country = useOnboardingStore((state) => state.country); 
  const province = useOnboardingStore((state) => state.province); 
  const phone = useOnboardingStore((state) => state.phone);
    const password = useOnboardingStore((state) => state.password);
    const password_confirmation = useOnboardingStore((state) => state.password_confirmation);
  const useName = useOnboardingStore((state) => state.name);
  const userEmail = useOnboardingStore((state) => state.email);
  const hasHydrated = useOnboardingStore((state) => state._hasHydrated);
  const setData = useOnboardingStore((state) => state.setData);

  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);  
     const pathname = usePage().url;
     React.useEffect(() => {
     setData({
      country: undefined,
      phone: undefined,
      province: undefined,
     })
  }, [pathname]) 



  const form = useForm<FormThirdStepSchema>({
    mode: "onSubmit", 
    defaultValues: {
      country: country || 'Indonesia',
      province: province || '',
      phone: phone || '',
    },
    resolver: zodResolver(FormThirdStep),
  })

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !hasHydrated) return;

    if (!useName || !userEmail || !password || !password_confirmation) {
      router.visit("/register/password");
    }
  }, [isClient, hasHydrated, useName, userEmail, router]);

  function onSubmit(input: FormThirdStepSchema) {
    try {
        toast.loading("loading...", { id: "register"});
      setLoading(true)
      startTransition(async () => { 
        setData(input);
          router.visit("/register/occupasion" , { 
                        preserveScroll: true,
                        preserveState: true,
                        forceFormData: true, 
                        onSuccess: () => {
                  
                          toast.success("Langkah ketiga berhasil", {id: "register"});
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
      toast.error("Failed to submit the form. Please try again." , {id: "register"});
    }
  }

  if (!isClient || !hasHydrated) {
    return (
      <AuthLayoutTemplate
       loading={loading} title='Where Are You From?' description='Fill in your country, province, and phone number.' className=' lg:max-w-none h-dvh '>
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin size-6" />
        </div>
      </AuthLayoutTemplate>
    );
  }

  return (
    <AuthLayoutTemplate loading={loading} title='Where Are You From?' description='Fill in your country, province, and phone number.' className=' lg:max-w-none h-dvh '>
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
          ) :   <ChevronRight className=' ml-2'/>}
        </Button>
 
                       
                <Link
                
                                href={'/register/'}
                                                         className={cn(buttonVariants({ variant: "link"} ,
                                                          
                                                         ), 'w-full  transition-colors')}
                            >
                               {( loading) ? (
                    <Loader className='animate-spin ml-2'/>
                  ) : <ChevronLeft className=' '/>}
                            Back
                        </Link>
               
          </div>
               <NavStepper curentActive={2}/>
      </SignUpForm>
    </AuthLayoutTemplate>
  )
}

export default ThirdStep