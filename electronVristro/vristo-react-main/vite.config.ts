import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    define: {
        'process.env': {}, // Add this line to allow access to process
        __dirname: JSON.stringify(path.resolve()) // Expose __dirname
    },
    build: {
        // Ensure that Vite builds for Electron by setting the target
        outDir: 'dist',
        rollupOptions: {
          external: ['electron'], // Exclude Electron from the bundle
        },
        chunkSizeWarningLimit: 600, // or any value you prefer

    },
    base: './', // Use relative paths for assets

});
