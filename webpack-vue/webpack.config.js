const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 用来防止缓存的
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require("webpack");

var ExtractTextPlugin = require("extract-text-webpack-plugin");

// 配置生成压缩版的css
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = env => {
    if (!env) {
        env = {};
    }
    let plugins = [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './app/views/index.html'
        }),
    ]

    if (env.production) {
        plugins.push(new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: "production"
                }
            }),
            new ExtractTextPlugin("style.css"),
        )
    }

    return {
        entry: {
            // 入口文件路径
            app: "./app/js/main.js",
        },
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            compress: true,
            port: 8080
        },
        module: {
            // npm安装解析器是这样写的:npm install html-loader -D 安装html依赖
            // 配置解析器，为不同的文件配置不同的解析器 
            rules: [{
                test: /\.html$/,
                use: ['html-loader']
            }, {
                test: /\.vue$/,
                use: [{
                    loader: "vue-loader",
                    options: {
                        cssModules: {
                            localIdentName: '[path][name]---[local]---[hash:base64:5]',
                            camelCase: true
                        },
                        loaders: env.production ? {
                            css: ExtractTextPlugin.extract({
                                use: 'css-loader?minimize=true!px2rem-loader?remUni=75&remPrecision=8',
                                fallback: 'vue-style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
                            }),
                            scss: ExtractTextPlugin.extract({
                                use: 'css-loader?minimize=true!px2rem-loader?remUni=75&remPrecision=8!sass-loader',
                                fallback: 'vue-style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
                            })
                        } : {
                            css: "vue-style-loader!css-loader?minimize=true!px2rem-loader?remUni=75&remPrecision=8",
                            scss: "vue-style-loader!css-loader?minimize=true!px2rem-loader?remUni=75&remPrecision=8!sass-loader"
                        }
                    }
                }]
            }, {
                test: /\.scss$/,
                // 解析是从右到左的，即先用sass规则解析scss，然后再交给css解析，最后交给style解析
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }
                ]
            }]
        },
        plugins: plugins,
        output: {
            filename: '[name].min.js',
            // path是nodejs提供的一个内置环境变量   
            // __dirname是一个node提供的环境变量，表示当前目录
            // 这句话的意思是在当前目录下创建一个dist文件夹，保存fillname的文件
            path: path.resolve(__dirname, 'dist')
        },
        resolve: {
            // 在引入文件时可以省略后缀名
            extensions: [".js", ".json", ".vue"],
            alias: {
                'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'
            }
        },

        // mode: 'production'
    }
}