/* global require module __dirname */

const packageDetails = require('./package.json');

const sourceDir = 'src';
const outputDir = 'build';

const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const clean = new CleanWebpackPlugin([outputDir]);
const copy = new CopyWebpackPlugin([
    {
        from: sourceDir + '/manifest.json',
        transform: function (content, path) {
            return content.toString()
                .replace(/#version#/g, packageDetails.version)
                .replace(/#description#/g, packageDetails.description);
        }
    },
    {
        from: sourceDir + '/icons',
        to: 'icons'
    }
]);
const extractCSS = new ExtractTextPlugin('styles/styles.css');
const html = new HtmlWebpackPlugin({
    template: sourceDir + '/index.html'
});

module.exports = {
    mode: 'development',
    entry: {
        app: './' + sourceDir + '/scripts/app.js'
    },
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]',
                            publicPath: '../'
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]',
                            publicPath: '../'
                        }
                    }
                ]
            },
            {
                test: /\.(less|css)$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'eslint-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            'babel-preset-env'
                        ]
                    }
                }
            },
            {
                test: /.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        clean,
        copy,
        extractCSS,
        html
    ],
    output: {
        filename: 'scripts/[name].js',
        path: path.resolve(__dirname, outputDir),
        publicPath: ''
    }
};
