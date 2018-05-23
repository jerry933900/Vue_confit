const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    entry: "./src/main.js",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000,
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: {
                    loader: "vue-loader",
                    options: {
                        cssModules: {
                            localIdentName: '[path][name]---[local]---[hash:base64:5]',
                            camelCase: true
                        },
                        loaders: {
                            scss: ExtractTextPlugin.extract({
                                use: 'css-loader!sass-loader',
                                fallback: 'vue-style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
                            })
                        }
                    }
                }
            },
            // {
            //     test: /\.(ttf|woff|eot|svg|jpg|gif|png)$/,
            //     use: [{
            //         loader: 'url-loader'
            //     }]
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html"
        }),
        new ExtractTextPlugin("[name].css")
    ]
}