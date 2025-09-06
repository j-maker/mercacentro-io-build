const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'checkout6-custom.js',
    path: path.resolve(__dirname, 'checkout-ui-custom'),
  },
  watch: true, // Observar cambios automáticamente
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000, // Verificar cambios cada segundo
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'checkout6-custom.css',
    }),
  ],
  optimization: {
    minimize: false, // No minimizar en desarrollo para debugging
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  },
  mode: 'development', // Cambiar a development para mejor debugging
};
