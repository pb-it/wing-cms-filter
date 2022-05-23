// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const config = {
    input: 'src/jpath.js',
    output: {
        file: 'dist/jpath.js',
        name: 'jPath',
        format: 'iife'
    },
    plugins: [commonjs()]
};

if (process.env.NODE_ENV === 'production') {
    config.output.file = 'dist/jpath.min.js';
    config.plugins.push(terser());
}

export default config;