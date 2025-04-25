/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'path'; // 👈 si no lo tienes

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react(), legacy()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 👈 esto hace que @ sea igual a /src
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },});