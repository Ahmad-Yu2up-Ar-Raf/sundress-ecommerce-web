"use client"

import React, { useEffect, useState } from 'react'

import SignUpForm from '../components/signup/SecondStep'
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

const FormSecondStep = registerCreateSchema.pick({
  password: true,
  password_confirmation: true,
})
type FormSecondStepSchema = z.infer<typeof FormSecondStep>;

function SecondStep() {

  const [isClient, setIsClient] = useState(false);
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
      password: undefined,
      password_confirmation: undefined,
     })
  }, [pathname]) 



  const form = useForm<FormSecondStepSchema>({
    mode: "onSubmit", 
    defaultValues: {
      password: password || '',
      password_confirmation: password_confirmation || '',
    },
    resolver: zodResolver(FormSecondStep),
  })

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !hasHydrated) return;

    if (!useName || !userEmail) {
      router.visit("/register");
    }
  }, [isClient, hasHydrated, useName, userEmail, router]);

  function onSubmit(input: FormSecondStepSchema) {
    try {
        toast.loading("loading...", { id: "register"});
      setLoading(true)
      startTransition(async () => { 
        setData(input);
          router.visit("/register/location" , { 
                        preserveScroll: true,
                        preserveState: true,
                        forceFormData: true, 
                        onSuccess: () => {
                  
                          toast.success("Langkah kedua berhasil", {id: "register"});
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
       loading={loading} title='Create your password' description='Make a strong password - to protect your account' className=' lg:max-w-none h-dvh '>
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin size-6" />
        </div>
      </AuthLayoutTemplate>
    );
  }

  return (
    <AuthLayoutTemplate loading={loading} title='Create your password' description='Make a strong password - to protect your account' className=' lg:max-w-none h-dvh '>
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
                                                          aria-disabled={loading}
                                                                                                                          tabIndex={!loading ? -1 : undefined}
                                                                                                                          className={cn( buttonVariants({ variant: "link"}),
                                                                                                                            "text-secondary-foreground m-auto  flex justify-center capitalize font-medium underline",
                                                                                                                            loading ? 'pointer-events-none cursor-none text-foreground/50' : ''
                                                                                                                          )}
                            >
                               {( loading) ? (
                    <Loader className='animate-spin ml-2'/>
                  ) : <ChevronLeft className=' '/>}
                            Back
                        </Link>
               
          </div>
               <NavStepper curentActive={1}/>
      </SignUpForm>
    </AuthLayoutTemplate>
  )
}

export default SecondStep