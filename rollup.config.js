// rollup.config.js
//import flowEntry from 'rollup-plugin-flow-entry';
//import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const config = {
    input: 'src/jpath.js',
    output: {
        name: 'jPath',
        file: 'dist/jpath.js',
        name: 'jPath',
        format: 'iife',
        //sourcemap: 'inline'
    },
    plugins: [
        //flowEntry(),
        //typescript(),
        commonjs()
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.output.file = 'dist/jpath.min.js';
    config.plugins.push(terser());
}

export default config;