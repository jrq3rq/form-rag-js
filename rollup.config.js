// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const ignoreCss = () => ({
  name: 'ignore-css',
  load(id) {
    if (id.endsWith('.css')) {
      return 'export default {}';
    }
  }
});

export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/form-rag-js.min.js',
    format: 'iife',
    name: 'FormRAG',
    sourcemap: false,
    inlineDynamicImports: true
  },
  plugins: [
    resolve(),
    commonjs(),
    ignoreCss(),
    terser()
  ]
};