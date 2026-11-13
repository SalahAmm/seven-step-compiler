import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset URLs keep the build portable, including GitHub Pages project sites.
  base: './',
  plugins: [react()],
})
