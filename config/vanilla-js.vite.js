import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  root: 'examples/vanilla-js',
  resolve: {
    alias: {
      '/styles': path.resolve(__dirname, '../examples/styles')
    }
  }
})
