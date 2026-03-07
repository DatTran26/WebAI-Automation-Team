import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        TanStackRouterVite({ routesDirectory: './src/routes', generatedRouteTree: './src/routeTree.gen.ts' }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '~components': path.resolve(__dirname, './src/components'),
            '~features': path.resolve(__dirname, './src/features'),
            '~types': path.resolve(__dirname, './src/types'),
        },
    },
});
