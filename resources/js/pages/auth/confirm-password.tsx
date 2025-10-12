// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderIcon } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/ui/core/layout/app/components/input-error';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Input } from '@/components/ui/fragments/shadcn-ui/input';
import { Label } from '@/components/ui/fragments/shadcn-ui/label';
import AuthLayoutTemplate from '@/components/ui/core/layout/auth/auth-simple-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayoutTemplate
        loading={processing}
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <form onSubmit={submit}>
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderIcon className="h-4 w-4 animate-spin" />}
                            Confirm password
                        </Button>
                    </div>
                </div>
            </form>
        </AuthLayoutTemplate>
    );
}
