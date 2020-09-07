const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.js');


module.exports = merge(base, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader', // 3. Inject Css into the DOM
          'css-loader', // 2. Translates CSS into CommonJS
          'sass-loader', // 1. Compiles Sass to CSS
        ],
      },
    ],
  },
});