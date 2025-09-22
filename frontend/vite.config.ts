import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss' // <-- Import @tailwindcss/postcss

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Add this css object to configure PostCSS
    postcss: {
      plugins: [tailwindcss()],
    },
  },
})