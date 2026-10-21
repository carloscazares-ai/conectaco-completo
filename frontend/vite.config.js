import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, las llamadas a /v1 se mandan al backend de Spring Boot (puerto 8080)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/v1': process.env.API_URL || 'http://localhost:8080',
    },
  },
});
