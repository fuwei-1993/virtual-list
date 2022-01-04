import config from './rollup.config';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import os from 'os';

config.plugins = [
  ...config.plugins,
  del({ targets: 'dist/*', hook: 'buildStart' }),
  terser({ numWorkers: os.cpus().length - 1 }),
];

export default config;
