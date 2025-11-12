import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No es necesario usar loadEnv si sigues la convención de prefijos de Vite (VITE_).
// Vite expondrá automáticamente las variables de .env en import.meta.env.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
