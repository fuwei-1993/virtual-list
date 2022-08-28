import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import alias from '@rollup/plugin-alias'
import autoprefixer from 'autoprefixer'
import nested from 'postcss-nested'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'
import jsx from 'acorn-jsx'
import ttypescript from 'ttypescript'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import AutoImport from 'unplugin-auto-import/rollup'

const config = {
  input: ['./src/index.tsx'],
  acornInjectPlugins: [jsx()],
  plugins: [
    AutoImport({
      imports: [
        'react',
        {
          react: ['lazy', 'memo', 'createElement', 'cloneElement'],
        },
      ],
      dts: `./typings/auto-imports.d.ts`,
      eslintrc: {
        enabled: true, // Default `false`
        filepath: `./.eslintrc-auto-import.json`, // Default `./.eslintrc-auto-import.json`
      },
      resolvers: [() => null],
    }),
    alias({
      entries: [
        { find: '@src', replacement: path.resolve(__dirname, 'src') },
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
        {
          find: '@components',
          replacement: path.resolve(__dirname, 'src/components'),
        },
        {
          find: '@constants',
          replacement: path.resolve(__dirname, 'src/constants'),
        },
        {
          find: '@hooks',
          replacement: path.resolve(__dirname, 'src/hooks'),
        },
      ],
      resolve: ['.jsx', '.js', '.ts', '.tsx'],
    }),

    postcss({
      plugins: [nested(), autoprefixer()],
      extensions: ['.css', '.less'],
      autoModules: true,
      minimize: false,
    }),
    typescript({ tsconfig: './tsconfig.json', typescript: ttypescript }),
    babel({
      exclude: 'node_modules/**',
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
      babelHelpers: 'runtime',
    }),
    resolve({
      browser: true,
      moduleDirectories: ['node_modules'],
    }),
    json(),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
      ignoreGlobal: true,
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
    }),
  ],
  output: [
    {
      file: pkg.main,
      format: 'es',
      sourcemap: process.env.NODE_ENV !== 'production',
      exports: 'named',
    },
  ],
}

export default config
