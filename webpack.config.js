const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //devtool: "inline-source-map",
    //output: {
    //   pathinfo: true
    //},
    entry: './src/ts/index.ts',
    devServer: {
        hot: true,
        contentBase: path.join(__dirname, 'dist'),
        publicPath: '/',
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '2048',
            template: path.join(__dirname, 'src', 'index.html')
        }),
        //new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
        // new webpack.HotModuleReplacementPlugin(),
       // new webpack.NamedModulesPlugin(),
        //  new webpack.NoEmitOnErrorsPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                include: path.join(__dirname, 'src', 'css'),
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
                                    'postcss-custom-properties',
                                ]
                            }
                            //plugins: () => [
                             //   require("postcss-import")({
                                    //If you are using postcss-import v8.2.0 & postcss-loader v1.0.0 or later, this is unnecessary.
                                    //addDependencyTo: webpack // Must be first item in list
                             //   }),
                             //   require("postcss-nesting")(), // Following CSS Nesting Module Level 3: http://tabatkins.github.io/specs/css-nesting/
                             //   require("postcss-custom-properties")({
                             //       preserve: false
                             //   }),
                             //   require("autoprefixer")()
                           // ]
                        }
                    }
                ]
            },
           /* {
                test: /\.css$/i,
                exclude: [/node_modules/],
                include: path.join(__dirname, 'src'),
                use: [
                    {
                        loader: "style-loader"
                    },
                    'css-modules-typescript-loader',
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            localsConvention: 'camelCase',
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins:  [
                                   
                                ]
                            }
                        }
                    }
                ]
            },*/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};