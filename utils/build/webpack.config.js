const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const srcPath = path.join(__dirname, '../../src');
const outPath = path.join(__dirname, '../../dist');

const config = {
  module: {
    loaders: [{
      test: /\.css/,
      loaders: ['style', 'css'],
    }, {
      test: /\.js/,
      exclude: [/node_modules/],
      loader: 'babel',
    }, {
      test: /\.png/,
      loader: 'file',
    }, {
      test: /\.json/,
      loader: 'json',
    }],
  },

  entry: {
    main: path.join(srcPath, '/index.js'),
  },

  output: {
    path: outPath,
    filename: '[name].js',
    publicPath: '/',
  },

  resolve: {},

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html',
      inject: 'body',
      chunks: ['main'],
    }),
  ],

  externals: [],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        unsafe: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        collapse_vars: true,
        negate_iife: true,
        pure_getters: true,
        drop_console: true,
        keep_fargs: false,
      },
      'screw-ie8': true,
      mangle: true,
      stats: true,
    })
  );
}

module.exports = config;
