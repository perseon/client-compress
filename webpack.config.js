const path = require('path');
const webpack = require("webpack")

module.exports = {
   entry: path.resolve(__dirname, 'src', 'Compress.js'),
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: "Compress",
      libraryTarget: "umd"
   },
   resolve: {
      extensions: ['.js']
   },
   module: {
      rules: [
         {
             test: /\.js$/,
             exclude: /node_modules/,
            loader: 'babel-loader'
         }
      ]
   }
};
