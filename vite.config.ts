import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
// base './' makes the build work under any GitHub Pages path (user.github.io/<repo>/) with no config.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})
