var path = require('path');
var webpack = require('webpack');
var css = require("!raw!sass!./file.scss");

module.exports = {
  module: {
    loaders: [
      { test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        loader: "babel-loader",
        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, "src"),
        ],
        test: /\.jsx?$/,
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react'],
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js'
  },
  entry: [
    './src/index.js'
  ]
};
