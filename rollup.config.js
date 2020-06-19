import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'app/main.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/dist/bundle.js'
    },
    plugins: [
        svelte({
            dev: !production,
            css: (css) => css.write('public/dist/bundle.css')
        }),

        resolve({
            browser: true,
            dedupe: ['svelte']
        }),

        commonjs(),

        copy({
            verbose: true,
            targets: [
                { src: 'node_modules/bootstrap/dist/css/bootstrap.min.css*',
                  dest: 'public/dist/bootstrap' }
            ]
        }),

        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};
