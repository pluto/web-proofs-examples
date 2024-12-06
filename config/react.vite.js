import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  root: mode === 'advanced' ? 'examples/react/advanced' : 'examples/react',
  plugins: [react()]
}))
