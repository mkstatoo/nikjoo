import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix: __dirname is not available in ESM environment.
// We derive it from import.meta.url using fileURLToPath and path.dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          genai: ['@google/genai']
        }
      }
    }
  },
  resolve: {
    alias: {
      // Fix: Use the manually defined __dirname for the alias path resolution.
      '@': path.resolve(__dirname, './'),
    },
  },
});
