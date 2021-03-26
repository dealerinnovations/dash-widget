import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import dotenv from 'dotenv';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const config = {
  input: 'src/index.js',
  output: {
    file: process.env.NODE_ENV === 'production' ? 'lib/index.min.js' : 'lib/index.dev.min.js',
    format: 'umd',
    exports: 'named',
  },
  external: ['react', 'react-dom'],
  plugins: [
    injectProcessEnv({
      DASH_PUBLIC_API: process.env.DASH_PUBLIC_API,
      DEV_URL: process.env.NODE_ENV === 'production' ? '' : process.env.DEV_URL,
    }),
    resolve(),
    babel({
      exclude: /node_modules/,
    }),
    commonjs({
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType', 'isContextConsumer'],
        'node_modules/react-dom/index.js': ['unstable_batchedUpdates'],
      },
    }),
    copy({
      targets: [{ src: 'src/DatePicker.css', dest: 'lib' }],
    }),
    terser(),
  ],
};

export default config;
