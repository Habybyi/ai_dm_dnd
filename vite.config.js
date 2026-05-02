import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // ADD THIS SECTION:
  optimizeDeps: {
    exclude: ['hbo-dnsd']
  },
  server: {
    proxy: {
      '/character': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        secure: false,
      },
      '/campaign': {
        target: 'http://localhost:3030',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})