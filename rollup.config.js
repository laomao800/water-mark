import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'
import serve from 'rollup-plugin-serve'

const plugins = [typescript()]

if (process.env.serve) {
  plugins.push(
    serve({
      contentBase: './',
      open: true,
    })
  )
}

export default [
  {
    input: './src/index.ts',
    output: {
      file: `dist/index.common.js`,
      format: 'cjs',
      exports: 'default',
    },
    plugins,
  },
  {
    input: './src/index.ts',
    output: {
      file: `dist/index.es.js`,
      format: 'es',
    },
    plugins,
  },
  {
    input: './src/index.ts',
    output: {
      file: `dist/index.umd.js`,
      format: 'umd',
      name: 'waterMark',
    },
    plugins: [...plugins, uglify()],
  },
]
