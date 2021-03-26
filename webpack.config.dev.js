const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DotEnv = require('dotenv-webpack')
const { doesNotMatch } = require('assert')
/** @type {import('webpack').Configuration} */

module.exports = {
  entry: './src/index.js', // especificar el archivo raiz que controlara toda nuestra aplicacion
  output: {
    // especificar la salida de nuestros archivos generados
    filename: '[name].[contenthash].js', // para ver el hash de la operacion generada por webpack, o en otras palabras identifica el build o el id de la operacion que se realizo, si no se deteca ningun cambio el hash seguira siendo igual, caso contrario se tendra un hash diferente
    path: path.resolve(__dirname, 'dist'), // usar el module path que viene incluido en la instalacion de node para poder identificar la ubicacion del proyecto y la carpeta dist
    assetModuleFilename: 'assets/images/[hash][ext][query]', // para especificar la carpeta de salida de nuestos assets generados que en este proyecto serian las imagenes
  },
  watch: true,
  mode: 'development',
  resolve: {
    extensions: ['.js'],
    alias: {
      // los alias nos sirven para crear variables que guarden alguna ruta especifica que regularmente sea un poco larga o complicada de recordar de esta manera podemos utilizar esta variable en lugar de especificar la ruta completa
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@templates': path.resolve(__dirname, 'src/templates/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
    },
  },
  module: {
    // configurar los loaders necesarios para procesar los diferentes formatos de archivos con los que trabajaremos y sus respectivos loaders y de ser el caso las opciones
    rules: [
      {
        test: /\.m?js$/, // .mjs estension de modulos de js
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.png$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
            name: '[name].[contenthash].[ext]',
            outputPath: './assets/fonts/',
            publicPath: '../assets/fonts',
            esModule: false,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, // injectar el codigo de index.js, seteado true by default
      template: './public/index.html', // src del html que deseamos usar, puede ser preprocesadores como pug
      filename: './index.html', // el nombr que tendra nuestro archivo de salida en la carpeta dist
    }),
    new MiniCssExtractPlugin({
      filename: './assets/[name].[contenthash].css',
    }), // extraer el css del codigo boundled, en nuestro caso el main.js
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'src', 'assets/images'),
    //       to: 'assets/images',
    //     },
    //   ],
    // }),
    new DotEnv(),
  ],
}

// use the copy plugin to copy the files you want in th output dist directory, it is useful for images, but since we are working with webpack, we have to do the webpack way, wich is importing the images, and using the built-in loader assets/resource that let us import images into js and use them as variables
