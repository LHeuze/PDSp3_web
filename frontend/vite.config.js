import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/public',  // Change this to the path of your Rails `public/` folder
    assetsDir: 'vite-assets',     // Optional subdirectory inside `public/`
    emptyOutDir: true,
  },
});