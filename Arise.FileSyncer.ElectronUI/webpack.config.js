const common = require('./webpack.common.config');

const devConfig = {
    mode: 'development',
    devtool: 'source-map',
}

module.exports = [
    Object.assign({}, common.config, common.mainConfig, devConfig),
    Object.assign({}, common.config, common.rendererConfig, devConfig)
];
