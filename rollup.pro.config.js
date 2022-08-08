import config from './rollup.config'
import del from 'rollup-plugin-delete'
import { terser } from 'rollup-plugin-terser'
import ttypescript from 'ttypescript'
import typescript from 'rollup-plugin-typescript2'
import os from 'os'

const typescriptPluginName = 'rpt2'
const tsconfigOverride = {
  exclude: ['example/*'],
}

config.plugins = config.plugins.reduceRight(
  (result, curr) => {
    return curr.name === typescriptPluginName
      ? [
          typescript({
            tsconfig: './tsconfig.json',
            tsconfigOverride,
            typescript: ttypescript,
          }),
          ...result,
        ]
      : [curr, ...result]
  },
  [
    del({ targets: 'dist/*', hook: 'buildStart' }),
    terser({
      numWorkers: os.cpus().length - 1,
      format: {
        comments: false,
      },
    }),
  ],
)

export default config
