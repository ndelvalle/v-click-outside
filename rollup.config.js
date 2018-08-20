import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'

const pkg = require('./package.json')

const banner = `/**
 * Vue directive to react on clicks outside the current element
 *
 * @version: ${pkg.version}
 * @author: ${pkg.author}
 */`

export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/v-click-outside.min.js',
    format: 'umd',
  },
  moduleId: 'v-click-outside',
  name: 'v-click-outside',
  banner,
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    babel({
      babelrc: false, // jest makes use of .babelrc
      presets: ['es2015-rollup'],
    }),
    uglify(),
    filesize(),
  ],
}
