# hs

> A Vue.js project

项目启动默认是http://localhost:8082

可以在`config/index.js`里修改端口`port: process.env.PORT || 8082`

index.js

```js
dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8082,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {}
      }
    },
```

## 项目截图

**登录**

 ![登录](http://omux103p0.bkt.clouddn.com/%E7%99%BB%E5%BD%95.gif)

**用户管理**

 ![用户管理](http://omux103p0.bkt.clouddn.com/%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86.gif)

**角色管理**

 ![角色管理](http://omux103p0.bkt.clouddn.com/%E8%A7%92%E8%89%B2%E7%AE%A1%E7%90%86.gif)

**权限管理**

 ![权限管理](http://omux103p0.bkt.clouddn.com/%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86.gif)

**菜单管理**

 ![菜单管理](http://omux103p0.bkt.clouddn.com/%E8%8F%9C%E5%8D%95%E7%AE%A1%E7%90%86.gif)



## Build Setup

``` bash
# install dependencies
# 安装依赖
npm install

# serve with hot reload at localhost:8080
# 本地开发环境运行
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).