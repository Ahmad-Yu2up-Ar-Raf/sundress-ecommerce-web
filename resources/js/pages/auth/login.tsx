import { Head, router,} from '@inertiajs/react';

import React from 'react';





import { loginSchema, LoginSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import LoginForms from '@/components/ui/core/auth/login-form';
import AuthLayoutTemplate from '@/components/ui/core/layout/auth/auth-simple-layout';



interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    // const { data, setData, post, loading, errors, reset } = useForm<Required<LoginForm>>({
    //     email: '',
    //     password: '',
    //     remember: false,
    // });
  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);  
 const form = useForm<LoginSchema> ({
        mode: "onSubmit", 
    defaultValues: {
       email: "",
       password: "",
       remember_token: false
      },
    resolver: zodResolver(loginSchema),
  })


  function onSubmit(input: LoginSchema ) {
    try {
          toast.loading("Login....", {id: "login"});
                setLoading(true)
        startTransition(async () => { 
     router.post(route('login.store'),  input, { 
         preserveScroll: true,
         preserveState: true,
         forceFormData: true, 
         onSuccess: () => {
           form.reset();
         
           toast.success("Login Succes", {id: "login"});
           setLoading(false);
         },
         onError: (error) => {
           console.error("Submit error:", error);
           toast.error(`Error: ${Object.values(error).join(', ')}` , {id: "login"});
           setLoading(false);
              form.reset();
         }
       });
        })
 
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }


return (
     <>
      <AuthLayoutTemplate formType="login" loading={loading} title="Log in to your account" className='lg:max-w-none h-dvh' description="Enter your email and password below to log in" >
         
  <LoginForms  form={form} onSubmit={onSubmit} isPending={loading}/>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayoutTemplate>
     </>
)

}