import { Head } from '@inertiajs/react';
import { AppearanceForm } from '@/components/ui/core/layout/app/components/appearance-tabs';
import HeadingSmall from '@/components/ui/core/layout/app/components/heading-small';

import AppLayout from '@/components/ui/core/layout/app/app-layout';
import SettingsLayout from '@/components/ui/core/layout/app/settings/layout';


export default function Appearance() {
    return (
    <AppLayout>
                 <SettingsLayout>
            <Head title="Appearance settings" />


                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                
      <AppearanceForm />
                </div>
   
         </SettingsLayout>
             
           </AppLayout>
    );
}
