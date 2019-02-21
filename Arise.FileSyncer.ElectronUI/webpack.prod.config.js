const common = require('./webpack.common.config');
const TerserPlugin = require('terser-webpack-plugin');

const prodConfig = {
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                }
            })
        ]
    }
}

module.exports = [
    Object.assign({}, common.config, common.mainConfig, prodConfig),
    Object.assign({}, common.config, common.rendererConfig, prodConfig)
];
