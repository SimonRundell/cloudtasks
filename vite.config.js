import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

/**
 * Vite and Vitest configuration.
 * base './' lets the build run from a sub-folder on shared hosting.
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
