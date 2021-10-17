import typescript from '@rollup/plugin-typescript'

const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'build/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'build/index.esm.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
  external: [
    ...Object.keys(pkg.dependencies),
    'crypto',
    'fs',
    'path',
    'child_process',
  ],
}
