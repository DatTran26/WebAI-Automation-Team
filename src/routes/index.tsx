import { createFileRoute } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import { SuspenseLoader } from '../components/SuspenseLoader';

const DashboardMain = React.lazy(() => import('../features/dashboard/components/DashboardMain'));

export const Route = createFileRoute('/')({
    component: IndexPage,
});

function IndexPage() {
    return (
        <Suspense fallback={<SuspenseLoader />}>
            <DashboardMain />
        </Suspense>
    );
}
