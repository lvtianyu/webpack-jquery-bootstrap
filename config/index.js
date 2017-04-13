 /*
    //index.js
    //webpack配置文件所需的，基本变量配置文件
    //lv
    //2016/2/5
    //引用来ip,path，debug库。具体信息请看README.md文件，其中有详细针对库的说明喝地址
    //process对象是一个全局对象，在node环境的任何部分得到引用，是EventEmitter的实例
 */
const path = require('path');
const debug = require('debug')('app:config');
const ip = require('ip');

debug('Creating default configuration')

//base Configuration

const config = {
    env : process.env.NODE_ENV || 'development',

    //project structure

    path_base : path.resolve(__dirname,'..'),
    dir_client : 'src',
    dir_dist : 'dist',
    dir_server : 'server',

    //server configuration

    server_host : ip.address(),// 使用'localhost'字符串来防止暴露本地网络 
    server_port : process.env.PORT || 2017,

    //compiler configuration

    compiler_babel :{
        cacheDirectory : true,
        // plugins : ['transform-runtume'],
        presets : ['es2015']
    },
    compiler_devtool : 'source-map',
    compiler_hash_type : 'hash',
    compiler_fail_on_warning : false,
    compiler_quiet : false,
    compiler_public_path : '/',
    compiler_stats : {
        chunks : false,
        chunkModules : false,
        colors : true
    },
    compiler_vendors : [
        'jquery',
    ]
}

//enviroment 环境

//添加全局变量，同时也在.eslintrc文件中设置

config.globals = {
    'process.env' : {
        'NODE_ENV' : JSON.stringify(config.env)
    },
    'NODE_ENV' : config.env,
    '__DEV__' : config.env === 'development',
    '__PROD__' : config.env === 'production',
    '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
}

// 验证安装件依赖

const pkg = require('../package.json')

config.compiler_vendors = config.compiler_vendors
    .filter((dep) => {
        if (pkg.dependencies[dep]) return true

        debug(
              `在npm的package.json依赖包中没有发现 "${dep}"  ` +
      `如果你不需要它.请从 ~/config/index.js中的compiler_vendors配置中移除`
        )
    })

// utilities 实用程序

function base() {
    const args = [config.path_base].concat([].slice.call(arguments))
    return path.resolve.apply(path,args)
}

config.utils_paths={
    base : base,
    client : base.bind(null,config.dir_client),
    dist : base.bind(null,config.dir_dist)
}

//环境配置

debug(`查找重置的NODE_ENV "${config.env}"变量`)
const environments = {

    // 当NODE_ENV === 'development'时，重置
    //这个地方是修改添加到页面上的css和js文件的目录结构的路径

    development: (config) => ({
        compiler_public_path: `http://${config.server_host}:${config.server_port}/`
    }),

    // 当NODE_ENV === 'production'时，重置

    production: (config) => ({
        compiler_public_path: './',
        compiler_hash_type: 'chunkhash',
        compiler_devtool: null,
        compiler_stats: {
            chunks: true,
            chunkModules: true,
            colors: true
        }
    })
}

const overrides = environments[config.env]
console.log(process.env.NODE_ENV)

if (overrides) {
  debug('Found overrides, applying to default configuration.')
  Object.assign(config, overrides(config))
} else {
  debug('No environment overrides found, defaults will be used.')
}

module.exports = config
