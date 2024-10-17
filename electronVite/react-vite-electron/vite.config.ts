import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Ensure that Vite builds for Electron by setting the target
    outDir: 'dist',
    rollupOptions: {
      external: ['electron'], // Exclude Electron from the bundle
    },
  },
  base: './', // Use relative paths for assets

});
