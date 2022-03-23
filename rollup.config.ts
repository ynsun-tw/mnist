import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets'

export default {
  input: 'src/main.ts',
  output: {
    file: 'bundle.js',
    format: 'es',
    sourcemap: true
  },
  watch: {
    clearScreen: false,
    include: 'src/*'
  },
  plugins: [
    commonjs(),
    nodeResolve({ browser: true, preferBuiltins: true }),
    json(),
    typescript(),
    importMetaAssets()
  ]
}