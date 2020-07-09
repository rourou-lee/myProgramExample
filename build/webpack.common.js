const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const {CleanWebpackPlugin}=require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack=require('webpack');
module.exports={  
    context: path.resolve(__dirname, ''),                                                    
    entry:{
        main:'../src/main.js'
    },
    output:{
        filename:'static/js/[name].[hash].js',
        path:path.resolve(__dirname,'../dist')
    },
    module:{
        rules:[
            {
                test:/\.(jpeg|jpg|png|gif)$/i,
                use:[
                    {
                        loader:'file-loader',
                        options:{
                            name:'[name].[hash].[ext]',
                            outputPath:'static/images',
                            limit:10240,
                            esModule: false
                        }
                    }
                ]
            },{
                test:/\.(css)$/i,
                use: [
                    {
                        loader:MiniCssExtractPlugin.loader, 
                        options:{
                            hmr: process.env.NODE_ENV === 'development',
                            reloadAll: true,
                            esModule: true
                        }
                    },
                    'css-loader'
                ],
            },{
                test: /\.js$/, 
                exclude: /node_modules|outerComponents/, 
                loader: "babel-loader?cacheDirectory=true" ,
            },
            {
                test: /\.vue$/, 
                loader: "vue-loader" 
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                loader: 'file-loader?limit=8192',
                options:{
                    name:'[name].[hash].[ext]',
                    outputPath: 'static/fonts'
                }
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/i,
                    chunks: 'all',
                    enforce: true,
                }
            }
        }
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'../index.html',
            filename: 'creation.html',
            inject: true
        }),
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        // new webpack.ProvidePlugin({
        //     $:'jquery',
        //     jQuery:'jquery',
        //     'window.jQuery':'jquery'
        // }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[hash].css',
            chunkFilename: 'static/css/[id].[hash].css',
            ignoreOrder: false
        })
    ],
    resolve: {
        extensions: ['.vue', '.js', '.css'],
        alias: {
            'root': path.resolve(__dirname, '../src')
        }
    }
}