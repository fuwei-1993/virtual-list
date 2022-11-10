import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: [
        'react',
        {
          react: [
            'lazy',
            'memo',
            'createElement',
            'cloneElement',
            'isValidElement',
          ],
        },
      ],
      dts: `./typings/auto-imports.d.ts`,
      eslintrc: {
        enabled: true, // Default `false`
        filepath: `./.eslintrc-auto-import.json`, // Default `./.eslintrc-auto-import.json`
      },
      resolvers: [() => null],
    }),
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    host: true,
    port: 10001,
  },
})
