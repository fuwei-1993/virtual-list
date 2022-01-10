import config from './rollup.config'
import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'
import ttypescript from 'ttypescript'
import typescript from 'rollup-plugin-typescript2'
import os from 'os'

config.plugins.splice(
  2,
  1,
  typescript({
    tsconfig: './tsconfig.json',
    exclude: './example/*',
    typescript: ttypescript,
  }),
)
config.plugins = [
  ...config.plugins,
  del({ targets: 'dist/*', hook: 'buildStart' }),
  terser({ numWorkers: os.cpus().length - 1 }),
]

export default config
