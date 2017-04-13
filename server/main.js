
const express = require('express')
const debug = require('debug')('app:server')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('../build/webpack.config')
const config = require('../config')
const app =express()
const customPath = config.utils_paths

//配置webpack 的中间件
//这里使用了express库，用它来和webpack-dev-middleware进行配合，发起服务
if(config.env === 'development') {
    const compiler = webpack(webpackConfig)

    debug('启用webpack dev 和 hmr 中间件')
    app.use(require('webpack-dev-middleware')(compiler,{
        publicPath : webpackConfig.output.publicPath,
        contentBase : customPath.client(),
        hot : true,
        quiet : config.compiler_quiet,
        noInfo : config.compiler_quiet,
        lazy : false,
        stats : config.compiler_stats
    }))
    app.use(require('webpack-hot-middleware')(compiler))
    
    var a = path.resolve(__dirname,'../src')
    app.use(express.static(a))
    // app.use(express.static(customPath.client('static')))

    app.use('/:componentname?',function(req,res,next) {
        var viewname = req.params.componentname?
        req.params.componentname+'.html' : 'index.html'
        //为了实现多页面的效果添加的component name
        const filename = path.join(compiler.outputPath,'icomponentname')
        compiler.outputFileSystem.readFile(filename, (err,result)=>{
            if(err) {
                return next(err)
            }
            res.set('content-type','text/html')
            res.send(result)
            res.end()
        })
    })
}else{
    debug('服务运行在生产环境下，我们将服务编译好的应用包～/dist')
    
    app.use(express.static(path.dist()))
}

module.exports = app