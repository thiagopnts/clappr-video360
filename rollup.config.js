import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import strip from 'rollup-plugin-strip';


export default {
  entry: 'src/index.js',
  external: ['clappr'],
  globals: {'clappr': 'Clappr'},
  acorn: {
    allowReserved: true,
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      browser: true,
    }),
    strip({debugger: true, sourceMap: false}),
    commonjs(),
    babel(),
  ],
  output: {
    file: 'dist/clappr-video360.js', format: 'umd', name: 'Video360'
  },
};
