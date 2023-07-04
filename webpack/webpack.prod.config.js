const path = require('path');
const WebpackMerge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseWebpackConfig = require("./webpack.base.config");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = WebpackMerge.merge(baseWebpackConfig, {
  // 指定构建环境
  mode: "production",
  // 输出位置
  output: {
    filename: "[name].js",
    path: path.join(__dirname, './../dist'),
    chunkFilename: "[chunkhash:8].js"
  },
  // 插件
  plugins: [
    new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   filename: "index.html",
    //   template: "public/index.html",
    //   inject: true, // true：默认值，script标签位于html文件的 body 底部
    //   hash: true, // 在打包的资源插入html会加上hash
    //   minify: {
    //     removeComments: true,               //去注释
    //     collapseWhitespace: true,           //压缩空格
    //     removeAttributeQuotes: true         //去除属性引用
    //   }
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './../public/'),
          to: path.resolve(__dirname, './../dist/'),
        }
      ]
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false, // 不将注释提取到单独文件中
      })
    ]
  },
  performance: {
    //该选项可以控制 webpack 如何通知「资源(asset)和入口起点超过指定文件限制」
    hints: "warning", // 枚举
    // hints: "error", // 性能提示中抛出错误
    // hints: false, // 关闭性能提示
    maxAssetSize: 600000, // 整数类型（以字节为单位）
    maxEntrypointSize: 800000, // 整数类型（以字节为单位）
    assetFilter: function (assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
})