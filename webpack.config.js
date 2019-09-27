var path = require('path');
require('webpack');

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/, exclude: /node_modules/, use: ["babel-loader"],
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        sourceMap: true,
                        modules: true,
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: [path.resolve(__dirname, './client/dist/resources/styles')]
                    }
                }]
            }
        ]
    },

    entry: './client/source/scripts/app.js',
    output: {
        path: path.resolve(__dirname, './client/dist/resources/scripts'),
        filename: 'app.bundle.js'
    }
};