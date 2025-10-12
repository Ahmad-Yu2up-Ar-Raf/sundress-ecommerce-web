// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderIcon } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import TextLink from '@/components/ui/core/layout/app/components/text-link';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import AuthLayoutTemplate from '@/components/ui/core/layout/auth/auth-simple-layout';
import { toast } from 'sonner';


export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});
  const [isExpired, setExpired] = useState<boolean>(false)
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        toast.loading("Mengirim Link ke email anda", {
            id: "verify"
        })

        post(route('verification.send'), 
    {
        
        onSuccess: () => {
  toast.success("Link Telah terkirim ke email" ,
     {
            id: "verify"
        }
  );
        },
        onFinish: () => {
            setExpired(true)
        },
        onError: (error) => {
             console.error("Submit error:", error);
               toast.error(`Error: ${Object.values(error).join(', ')}` ,  {
            id: "verify"
        });
        }
    }
    );
    };
     
   
   
   
    return (
        <AuthLayoutTemplate loading={processing} title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />


                         {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during registration.
                </div>
            )}

 
            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={(processing || isExpired)} className=' w-full' >
                    {processing && <LoaderIcon className="h-4 w-4 animate-spin" />}
                    Resend verification email
                </Button>

                <TextLink  href={route('logout')} disabled={(processing || isExpired)} method="post" className="mx-auto block text-sm">
                    Log out
                </TextLink>
            </form>
        </AuthLayoutTemplate>
    );
}
