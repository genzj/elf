const _ = require('lodash')
const {
  resolveApp,
  resolveOwn
} = require('./resolve.js')
const {
  getPlugins
} = require('./plugins.js')
const allConfig = require('../config/index.js')

const NODE_ENV = process.env.NODE_ENV || ''
const config = _.merge({}, allConfig, allConfig[NODE_ENV.toUpperCase()])

const zeptoPath = require.resolve('zepto')

const baseConfig = {
  output: _.merge({}, config.output, {
    path: resolveApp(config.output.path)
  }),
  resolve: {
    extensions: ['.js', '.css', '.scss', '.less', '.styl'],
    alias: {
      src: resolveApp('src')
    }
  },
  resolveLoader: {
    // moduleExtensions: ['-loader'],
    modules: [resolveOwn('node_modules')]
  },
  module: {
    rules: [{
      test: zeptoPath,
      use: [{
        loader: 'exports-loader',
        options: 'window.$'
      }, 'script-loader']
    }, {
      test: /\.(mp3|mp4|webm|mov|ogg|ogv)(\?\S*)?$/,
      use: [{
        loader: 'file-loader',
        options: config.audioLoaderQuery
      }]
    }, {
      test: /\.html$/,
      use: ['html-loader']
    }, {
        // Skip any files outside of your project's `src` directory
        include: /src/,
        exclude: /node_modules/,

        // Only run `.js` and `.jsx` files through Babel
        test: /\.jsx?$/,

        use: [{
          loader: "babel-loader",

          // Options to configure babel with
          options: {
            plugins: ['babel-plugin-transform-runtime'].map(require.resolve),
            presets: ['babel-preset-es2015', 'babel-preset-stage-0'].map(require.resolve),
          }
        }]
    }]
  },
  plugins: getPlugins(config),
  externals: config.externals || {}
}

module.exports = baseConfig
