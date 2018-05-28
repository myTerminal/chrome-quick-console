/* global require module */

const outputDir = 'public';

const WebpackMerge = require('webpack-merge');
const devConfig = require('./webpack.dev.js');

module.exports = WebpackMerge(devConfig, {
    devServer: {
        contentBase: './' + outputDir
    }
});
