import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/', // very important for Vercel
  plugins: [
    react(),        // React plugin is required
    tailwindcss(),  // Tailwind (optional if you already have postcss config)
  ],
})
