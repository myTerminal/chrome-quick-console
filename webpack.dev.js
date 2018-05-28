/* global require module */

const WebpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = WebpackMerge(commonConfig, {
    devtool: 'inline-source-map'
});
