 /*
    //webpack.config.js
    //webpack配置环境
    //lv
    //2016/2/5
    //引用来webpack,cssnano,html-webpack-pligin,debug库。具体信息请看README.md文件，其中有详细针对库的说明喝地址
    //process对象是一个全局对象，在node环境的任何部分得到引用，是EventEmitter的实例
 */
const webpack =require('webpack')

const HtmlWebpackPlugin= require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')
const debug = require('debug')('app:webpack:config')
const glob = require('glob')//实现多页面模式
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const customPath = config.utils_paths
const __DEV__ = config.globals__DEV__
const __PROD__ = config.globals__PROD__

debug('创建配置')
const webpackConfig = {
    name : 'loverCloud',
    target : 'web',
    devtool : config.compiler_devtool,
    resolve : {
        root : customPath.client(),
        extensions : ['','.js','.json']
    },
    entry : {},
    module : {}
}


// 捆绑输出

webpackConfig.output={
    filename : `[name].js`,
    chunkFilename : '[chunkhash].js',
    path : customPath.dist(),
    publicPath : config.compiler_public_path
}

//插件配置

webpackConfig.plugins = [
    new webpack.DefinePlugin(config.globals),
    new webpack.optimize.CommonsChunkPlugin({
        names : ['vendor']
    })
]

// 根据开发环境和生产环境 重置插件配置

if(__DEV__){
    debug('开发环境启用的插件')
    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
         new webpack.ProvidePlugin({   
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery'
    })
    )
}else if (__PROD__) {
    debug('生产环境启用的插件')
    webpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress : {
                unused : true,
                dead_code : true,
                warnings : false
            }
        })
    )
}

// loaders 

//javascript loaders

webpackConfig.module.loaders = [{
    test : /\.(js)$/,
    exclude : /node_modules/,
    loader : 'babel',
    query : config.compiler_babel
}]

//style loaders css-loader进行压缩工作


webpackConfig.module.loaders.push({
    test : /\.css$/,
    exclude : /node_modules/,
    loader : ExtractTextPlugin.extract('style-loader','css?minimize')
})

webpackConfig.module.loaders.push({
    test : /\.scss$/,
    exclude : /node_modules/,
    loader : ExtractTextPlugin.extract('style-loader','css-loader?minimize!sass-loader')
})

//配置图片的，字体转换缩小

webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[hash:base64:20].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg|gif)$/, loader: 'url?prefix=fonts/&name=[hash:base64:20].[ext]&limit=8192' }
)


  webpackConfig.plugins.push(
    new ExtractTextPlugin('[contenthash].css', {
      allChunks: true
    })

  )



// 性能

webpackConfig.performance = {
  hints: "error"
}

// 实现多页面配置，修改entry，HtmlWebpackPlugin部分

function overrideEntries(globPath) {
    var files = glob.sync(globPath),
    entries = {}

    files.forEach(function(filepath){
        var split = filepath.split('/');
        var name = split[split.length-2]
        entries[name] = './' + filepath
    })

    return entries
}

var entries = overrideEntries('src/component/**/*.js')


Object.keys(entries).forEach(function(name){
    const isDev=__DEV__ ?
        [entries[name]].concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
        :[entries[name]]

    const page = entries[name].replace('.js','.html')

// 修改entry部分 

    webpackConfig.entry[name] = isDev

    const plugin = new HtmlWebpackPlugin({
        filename : name+'.html',
        inject : true,
        chunks : [name],
        template : page,
         minify: {
            collapseWhitespace: true
        }
    })

// 修改HtmlWebpackPlugin部分

    webpackConfig.plugins.push(plugin)

})

module.exports = webpackConfig