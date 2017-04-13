## 用webpack实现多页面开发打包

很多人多很迷惑怎么用webpack实现多页面打包，尤其是使用jquery框架的你，这个框架可以给你一个更完整的配置；其中配置的细节和容易出错的地方已经有中文注释；首先声明用webpack最好是用单页面，如果你的兼容要求高（<＝IE8 ）更好的选择还是grunt｜gulp；

本框架在打包完成后在IE8浏览器上报错，原因是IE8不支持jquery插件中的define( "jquery", [], function () { return jQuery; } );部分则是在jquery最后一行抛出的；这就话是为了支持amd；

在此我的部分配置引用了React Starter Kit脚手架；这个脚手架非常稳定，是react开发中比较好的脚手架；建议喜欢react的人可以去看看：https://github.com/bodyno/react-starter-kit.git

## 需求配置
* node `^4.5.0`
* npm `^3.0.0`

## 开始

确认好你的环境配置，然后就可以开始以下步骤。

```bash
$ git clone https://github.com/lvtianyu/webpack-jquery-bootstrap
$ cd webpack-jquery-bootstrap
$ npm install                   # Install project dependencies
$ npm start                     # Compile and launch
```
如果你的终端没有报错，请在浏览器中访问 http://localhost:2017/index.html

开发过程中，你用`npm start`，`npm compile`但是这里还有很多其它的处理：

|`start`|服务启动在3000端口，代码热替换开启。|
|`compile`|编译程序到dist目录下（默认目录~/dist）。|

## 程序目录

```
.
├── bin                      # 启动脚本
├── build                    # 所有打包配置项
│   └── webpack              # webpack的指定环境配置文件
├── config                   # 项目配置文件
├── server                   # Express 程序 (使用 webpack 中间件)
│   └── main.js              # 服务端程序入口文件
├── src                      # 程序源文件
│   ├── components           # 所有的页面
│   │   ├── index            # 以index命名的页面(用于展示，你所有的页面都在这近展示)
│   │   ├── pugin            # 以pugin命名的页面
│   │   └── pugin1           # 以pugin1命名的页面
│   ├── static               # 静态文件(不要到处imported源文件)
│   ├── styles               # 程序样式
│   └── utils                # 公共的js文件

```
## 样式

所有的css和sass都支持会被预处理。

## 服务端

这个项目的服务端使用Koa。需要注意的是，只有一个目的那就是提供了`webpack-dev-middleware` 和 `webpack-hot-middleware`（代码热替换）。使用自定义的Koa程序替换[webpack-dev-server](https://github.com/webpack/webpack-dev-server)，让它更容易实现universal 渲染和为了不使这个包过于庞大。
github.com/features/mastering-markdown/).

