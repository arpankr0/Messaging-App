import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import daisyui from 'daisyui'

export default defineConfig({
  plugins: [
    tailwindcss(),daisyui,
    // add your framework plugin here (e.g., react(), vue())
  ],
})   