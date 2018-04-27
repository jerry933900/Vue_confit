const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    devtool: "source-map",
    entry: {
        index: "./back/js/index.js",
        common: "./back/js/common.js"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8080
    },
    module: {
        rules: [{
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: "[name].[ext]",
                        fallback: "url-loader?limit=6000",
                        useRelativePath: true
                    }
                }]
            },
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader",
                }

            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
                    use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap'],
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
                    use: ['css-loader', 'resolve-url-loader']
                })
            },
            // {
            //     test: /\.(png|jpg|gif)$/,
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: 'images/[name].[ext]',
            //             publicPath: './back/images',
            //             outputPath: 'images/'
            //         }
            //     }]
            // }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['./back/dist']),

        // 用来copy文件的
        new CopyWebpackPlugin([{
                from: "./back/lib",
                to: "lib/"
            }
            // , {
            //     from: "./back/sass",
            //     to: "sass/"
            // }
        ]),
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            filename: 'index.html', //生成的html存放路径，相对于path
            template: path.resolve("./back/", "index.html"), //html模板路径
            hash: true, //为静态资源生成hash值
            chunks: ['index', 'manifest'], //需要引入的chunk，不配置就会引入所有页面的资源,
            chunksSortMode: "manual",
            // chunksSortMode: function (chunk1, chunk2) {
            //     var order = ['index', 'manifest'];
            //     var order1 = order.indexOf(chunk1.names[0]);
            //     var order2 = order.indexOf(chunk2.names[0]);
            //     return order1 - order2;
            // },
            minify: { //压缩HTML文件  
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),

        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            filename: 'category/test.html', //生成的html存放路径，相对于path
            template: './back/test.html', //html模板路径
            hash: true, //为静态资源生成hash值
            chunks: ['common'], //需要引入的chunk，不配置就会引入所有页面的资源
            minify: { //压缩HTML文件  
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        }),

        new ExtractTextPlugin({
            // filename: (getPath) => {
            //     return getPath('sass/[name].scss').replace('scss', 'css');
            // },
            filename: "css/[name].css",
        }),

        // new webpack.ProvidePlugin({ //加载jq
        //     $: 'jquery'
        // }),

        // new webpack.DefinePlugin({
        //     'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
        // })

        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
        //     chunks: ['index', 'common'], //提取哪些模块共有的部分
        //     minChunks: 2 // 提取至少3个模块共有的部分
        // }),
    ],
    // 在webpack4.0以上版本用来提取公共的模块
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "manifest",
                    chunks: "all"
                }
            }
        }
    },

    output: {
        filename: "js/[name].min.js",
        path: path.resolve("./back/", "dist"),
        publicPath: '/'
    },
    mode: "development"
}