import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Box } from '@mui/material';
import { CustomAppBar } from '../components/CustomAppBar';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const Route = createRootRoute({
    component: RootLayout,
});

function RootLayout() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CustomAppBar />
            <Box component="main" sx={{ flex: 1, p: 3, mt: 8 }}>
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </Box>
        </Box>
    );
}
