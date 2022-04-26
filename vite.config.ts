import * as path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const resolve = (dir: string) => path.resolve(__dirname, dir)

export default defineConfig({
  plugins: [svelte({})],
  build: {
    minify: false,
    lib: {
      entry: resolve('./src/index.ts'),
      name: 'waterMark',
      fileName: 'index',
    },
  },
})
