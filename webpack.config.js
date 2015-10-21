var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  externals: {
    clappr: 'Clappr',
    'three.js': 'THREE',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
            compact: true,
        }
      },
      {
        test: /\.css/,
        loaders: ['style', 'css'],
      },
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  output: {
    filename: 'playback360.js',
    library: 'Playback360',
    libraryTarget: 'umd',
  },
};
