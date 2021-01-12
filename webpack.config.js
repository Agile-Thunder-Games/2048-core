const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: "inline-source-map",
    entry: path.join(__dirname, 'src', 'index.ts'),
    devServer: {
        hot: true,
        contentBase: path.join(__dirname, 'dist'),
        publicPath: '/',
        compress: true,
        port: 9000,
    },
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html')
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'autoprefixer',
                                    'postcss-import',
                                    'postcss-nesting',
                                    'postcss-custom-properties',
                                ]
                            }
                        }
                    },
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};