// resources/js/Pages/Auth/VerifyEmail.tsx  (atau path yang kamu pakai)
import { Head, useForm } from '@inertiajs/react';
import { LoaderIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

import TextLink from '@/components/ui/core/layout/app/components/text-link';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import AuthLayoutTemplate from '@/components/ui/core/layout/auth/auth-simple-layout';
import { toast } from 'sonner';

type Props = {
  status?: string;
  // seconds (server TTL in seconds) — e.g. config('auth.verification.expire') * 60
  verificationTtl?: number | null;
  // ISO timestamp string when link was sent (UTC) OR null
  verificationSentAt?: string | null;
  // optionally server may pass computed remaining seconds
  verificationRemaining?: number | null;
};

export default function VerifyEmail({
  status,
  verificationTtl,
  verificationSentAt,
  verificationRemaining,
}: Props) {
  const { post, processing } = useForm({});
  const [remaining, setRemaining] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Helper: format seconds to mm:ss
  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Compute initial remaining seconds:
  useEffect(() => {
    // priority: server-provided remaining -> server-provided sentAt + ttl -> fallback 0
    if (typeof verificationRemaining === 'number' && verificationRemaining > 0) {
      setRemaining(Math.max(0, Math.floor(verificationRemaining)));
      return;
    }

    if (verificationSentAt && verificationTtl) {
      try {
        const sent = new Date(verificationSentAt).getTime(); // ms
        const expiresAt = sent + (verificationTtl * 1000);
        const now = Date.now();
        const remainingSec = Math.max(0, Math.ceil((expiresAt - now) / 1000));
        setRemaining(remainingSec);
        return;
      } catch (err) {
        // invalid date -> ignore and fallback
      }
    }
    // default: nothing pending
    setRemaining(0);
  }, [verificationRemaining, verificationSentAt, verificationTtl]);

  // Start/stop timer whenever remaining changes
  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (remaining > 0) {
      timerRef.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            // stop timer when reaches 0
            if (timerRef.current) {
              window.clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remaining]);

  // Submit handler
  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    toast.loading('Sending verification link to your email...', { id: 'verify' });

    post(route('verification.send'), {
      onSuccess: (page) => {
        // Try to read remaining info from server response (if provided)
        // Inertia's onSuccess receives page object in some setups. We defensively handle.
        // If backend returns nothing, we fallback to verificationTtl (start timer locally).
        toast.success('Verification link sent to your email.', { id: 'verify' });

        // If backend returned a flash/props with remaining or sentAt, Inertia page props may be updated.
        try {
          // page?.props might exist depending on inertia version
          const props: any = (page && page.props) || (window as any).__INITIAL_PAGE__?.props;
          const remainingFromServer = props?.verificationRemaining ?? null;
          const sentAtFromServer = props?.verificationSentAt ?? null;
          const ttlFromServer = props?.verificationTtl ?? verificationTtl;

          if (typeof remainingFromServer === 'number' && remainingFromServer > 0) {
            setRemaining(Math.max(0, Math.floor(remainingFromServer)));
            return;
          }

          if (sentAtFromServer && ttlFromServer) {
            const sent = new Date(sentAtFromServer).getTime();
            const expiresAt = sent + (ttlFromServer * 1000);
            const now = Date.now();
            const rem = Math.max(0, Math.ceil((expiresAt - now) / 1000));
            setRemaining(rem);
            return;
          }
        } catch (err) {
          // ignore - fallback to ttl start
        }

        // Fallback: if server gave TTL prop in initial page, start countdown with that TTL
        if (verificationTtl && verificationTtl > 0) {
          setRemaining(verificationTtl);
        } else {
          // final fallback: disable for 60s to prevent spam
          setRemaining(60);
        }
      },
      onError: (error) => {
        console.error('Submit error:', error);
        toast.error(`Error: ${Object.values(error).join(', ')}`, { id: 'verify' });
      },
    });
  };

  const isDisabled = processing || remaining > 0;

  return (
    <AuthLayoutTemplate
      loading={processing}
      title="Verify email"
      className=' min-h-dvh'
      description="Please verify your email address by clicking on the link we just emailed to you."
    >
      <Head title="Email verification" />

      {status === 'verification-link-sent' && (
        <div className="mb-4 text-center text-sm font-medium text-yellow-600">
          A new verification link has been sent to the email address you provided during
          registration.
        </div>
      )}

      <form onSubmit={submit} className="space-y-6 text-center">
        <Button disabled={isDisabled} className="w-full" type="submit">
          {processing && <LoaderIcon className="h-4 w-4 animate-spin mr-2" />}
          {remaining > 0 ? (
            <>
              Resend verification email ({formatTime(remaining)})
            </>
          ) : (
            <>Send verification email</>
          )}
        </Button>

        <TextLink
          href={route('logout')}
          disabled={isDisabled}
          method="post"
          className="mx-auto block text-sm"
        >
          Log out
        </TextLink>
      </form>
    </AuthLayoutTemplate>
  );
}
