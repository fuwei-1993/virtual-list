import config from './rollup.config'
import template from 'rollup-plugin-generate-html-template'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const filename = 'example-dist'

config.input = ['./example/index.tsx']
config.watch = {
  include: ['src/**', 'example/**'],
}
config.external = []
config.plugins = [
  ...config.plugins,
  template({
    template: './index.html',
    target: `./${filename}/index.html`,
  }),
  serve(filename, {
    contentBase: filename,
  }),
  livereload(filename),
]
config.output = [
  {
    file: `./${filename}/index.umd.js`,
    format: 'umd',
    inlineDynamicImports: true,
    name: 'VVirtualList',
    sourcemap: 'inline',
  },
]

export default config
