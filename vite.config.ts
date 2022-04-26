import { defineConfig } from 'vite'
import * as path from 'path'

const resolve = (dir: string) => path.resolve(__dirname, dir)

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: resolve('./src/index.ts'),
      name: 'waterMark',
      fileName: 'index',
    },
  },
})
