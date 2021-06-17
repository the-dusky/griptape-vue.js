import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'GriptapeVueJs'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
        'vue',
        '@stakeordie/griptape.js'
      ],
      output: {
        sourcemap: true,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'vue': 'Vue',
          '@stakeordie/griptape.js': 'griptapejs'
        }
      }
    }
  }
})
