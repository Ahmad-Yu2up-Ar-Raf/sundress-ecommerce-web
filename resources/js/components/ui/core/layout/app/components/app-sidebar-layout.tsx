import { AppContent } from '@/components/ui/core/layout/app/components/app-content';
import { AppShell } from '@/components/ui/core/layout/app/components/app-shell';
import { AppSidebar } from '@/components/ui/core/layout/app/components/app-sidebar';
import { AppSidebarHeader } from '@/components/ui/core/layout/app/components/app-sidebar-header';

import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children,}: PropsWithChildren<{  }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader />
                {children}
            </AppContent>
        </AppShell>
    );
}
