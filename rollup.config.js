import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js';
import strip from 'rollup-plugin-strip';


export default {
  entry: 'src/index.js',
  external: ['clappr'],
  globals: {'clappr': 'Clappr'},
  plugins: [
    nodeResolve({
      jsnext: true,
      browser: true,
    }),
    strip({debugger: true, sourceMap: false}),
    commonjs(),
    babel(),
    uglify({}, minify),
  ],
  targets: [
    {dest: 'dist/clappr-video360.min.js', format: 'umd', moduleName: 'Video360'},
  ],
};
