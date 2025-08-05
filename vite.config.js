import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    strictPort: true,
    // 👇 This is the fix for React Router 404s on refresh
    historyApiFallback: true
  }
});
