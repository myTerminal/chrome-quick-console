/* global require module */

const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const commonConfig = require('./webpack.common.js');

module.exports = WebpackMerge(
    commonConfig,
    {
        mode: 'production',
        plugins: [
            new UglifyJSPlugin()
        ]
    }
);
