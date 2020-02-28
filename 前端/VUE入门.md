## VUE入门

[TOC]

### 环境配置

我的电脑是mac，所以以下的环境配置都是在mac下的

1.安装brew [brew官网](https://brew.sh/index_zh-cn.html)

~~~cmd
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
~~~



2.安装node.js

~~~cmd
brew install nodejs
~~~

也可以用node的官网下载安装包安装

**npm和cnpm**

npm：nodeJs中的管理包的工具

cnpm：因为npm的下载地址在国外的服务器，可能会出现异常。淘宝团队分享了国内的镜像代替国外服务器。一般国内都会使用cnpm

npm和cnpm的命令一样，只是下载的地址不同



3.安装cnpm

~~~cmd
npm install -g cnpm --registry=https://registry.npm.taobao.org
~~~



4.安装vue-cli2

~~~cmd
cnpm install -gd vue-cli 
~~~



下载完成后使用 `vue -V`查看版本来检查是否安装成功。



### 创建vue-cli2项目

先在终端中进入需要创建项目的目录

~~~cmd
vue init webpack 项目名（不能出现大写字母）
~~~

创建过程需要配置的地方:

**1.Project name (vue-demo)**

项目名字，可直接回车默认

**2.Project description (A Vue.js project)**

项目描述，可直接回车默认

**3.Author**

作者，可直接回车默认

**4.Runtime + Compiler: recommended for most users**

运行和编译是否同步进行，回车默认即可

**5.Install vue-router? (Y/n) **

是否安装路由，一般选择Y

**6.Use ESLint to lint your code? (Y/n) **

是否使用ESLint代码规范，暂时不添加 n

接下来还有一些单元测试之类的选择，一律回车默认即可。

之后就是漫长的等待，知道窗口提示创建成功。

~~~cms
To get started:

  cd vue-demo
  npm run dev
  
Documentation can be found at https://vuejs-templates.github.io/webpack
~~~

出现这个提示的时候就说明创建成功，可以直接使用

~~~cdm
cd vue-demo
npm run dev
~~~

这两个命令来运行项目

创建出现

~~~cmd
 I  Your application is running here: http://localhost:8080
~~~

运行成功，浏览器打开`http://localhost:8080`就可以看到项目了。初始化的项目页面

![](https://tva1.sinaimg.cn/large/006tNbRwly1gavvkk0v1oj30p80lm74n.jpg)



### 修改默认首页

在`src/components `文件夹下存放的都是组件，`src/router`中都是路由。在components中新增一个新的vue文件。HelloVue

~~~vue
<template>
  <div>
    HelloVue
  </div>
</template>

<script>
</script>

<style scoped>

</style>

~~~

在路由index.js中引入HelloVue并修改为默认首页

~~~javascript
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HelloVue from '@/components/HelloVue'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
    {
      path: '/',
      name: 'HelloVue',
      component: HelloVue
    }
  ]
})

~~~

启动服务打开页面

![](https://tva1.sinaimg.cn/large/006tNbRwly1gavwsmfpd5j30m70h9aa1.jpg)

此时页面已被修改。



### router实现页面跳转

在首页中通过连接进入 a b两个页面（组件）

新增页面A 和B，在首页使用超链接

~~~html
<template>
  <div>
    <router-link to="/A"> to A</router-link>
    <router-link to="/B"> to B</router-link>
  </div>
</template>
~~~

在router中的index.js引入新增的页面

~~~javascript
import Vue from 'vue'
import Router from 'vue-router'
import HelloVue from '@/components/HelloVue'
import A from '@/components/A'
import B from '@/components/B'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloVue',
      component: HelloVue
    },
    {
      path: '/A',
      name: 'A',
      component: A
    },
    {
      path: '/B',
      name: 'B',
      component: B
    }
  ]
})

~~~



### 删除#

默认的项目在运行后打开页面会在地址栏上添加#，添加#号是为了减少后台通讯的频率。但是在有些场合(如微信支付)#不能出现。而且地址栏出现#也不美观。切换为history模式

修改index.js路由文件，添加`mode: 'history'`

~~~js
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloVue',
      component: HelloVue
    },
    {
      path: '/A',
      name: 'A',
      component: A
    },
    {
      path: '/B',
      name: 'B',
      component: B
    }
  ]
})
~~~



### App.vue

来捋一下文件的引用关系。

在`src/components `文件夹下存放的都是组件，组件被路由引用

`src/router`中`index.js`是路由。路由在App.vue中被加载

~~~html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>
<!-- router-view就是加载路由 -->
~~~

这种加载路由会默认加载主页面，也就是`path: '/'`的组件。在template的div标签下第一个是img，这个是vue的图标。这种以挂载路由的方式，显示路由上面的元素。在这里就是所有的页面都会显示vue的图标，在图标下面才是每个组件自己的页面。

App.vue的完整代码

```vue
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

可以看到这里有html标签，css样式，和script代码。这里加载的样式就是全局样式，选中了id为app的div，设置了颜色，文本居等样式。



### 安装vue-cli3

安装vue-cli3之前要先卸载vue-cli2

~~~cmd
npm uninstall vue-cli -g 
//如果卸载失败就使用 cnpm uninstall vue-cli -g 再次执行
~~~

安装vue-cli3

~~~cmd
npm install -g @vue/cli@3.11.0 
~~~



### 创建cli3项目

cli3项目的创建和cli2的命令不一样。

1.创建项目

~~~cmd
vue create 项目名
~~~



~~~cmd
Vue CLI v3.11.0
┌───────────────────────────┐
│  Update available: 4.1.2  │
└───────────────────────────┘
? Please pick a preset: (Use arrow keys)
❯ default (babel, eslint) 
  Manually select features
~~~

选择安装模式，这里选择第二个 手动安装

3.

~~~cmd
? Please pick a preset: Manually select features
? Check the features needed for your project: (Press <space> to select, <a> to toggle all, <i> to in
vert selection)
❯◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◯ Router
 ◯ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing

~~~

选择安装的插件，使用空格确认。这里只选择 Babel 和Router

4.

~~~cmd
? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n)
~~~

router是否使用history模式，选择使用 输入Y

5.

~~~cmd
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? (Use arrow keys)
❯ In dedicated config files 
  In package.json
~~~

项目配置，选择第二项 

6.

~~~cmd
? Save this as a preset for future projects? (y/N) 
~~~

保存刚才的选择作为模板，以后可以直接使用。这个选项就随意了

后面可能还有一些选项，直接回车默认就可以。

7.

~~~cmd
33 packages are looking for funding
  run `npm fund` for details

⚓  Running completion hooks...

📄  Generating README.md...

🎉  Successfully created project vue_cli3_demo.
👉  Get started with the following commands:

 $ cd vue_cli3_demo
 $ npm run serve
~~~

出现这个页面就已经创建成功了，可以打开项目后运行

**cli3和cli2的运行命令不一样，cli3使用`npm run serve`**

8.

~~~cmd
 DONE  Compiled successfully in 1852ms      


  App running at:
  - Local:   http://localhost:8080/ 
  - Network: http://192.168.151.69:8080/

  Note that the development build is not optimized.
  To create a production build, run npm run build.

~~~

运行成功后会输出项目的地址



### webstorm运行Vue项目

导入vue项目后默认是无法直接运行的，需进行配置





![](https://tva1.sinaimg.cn/large/006tNbRwly1gawgthtuaej307g05wjrb.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1gawgut694xj30gh0dlaab.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1gawgvaje8fj30m806qglm.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1gawgwqhefwj30h207k0sl.jpg)

**cli3选择对应的命令即可**



### 认识cli















### 模板语法











###整合Element-ui

todo





### 相关的问题

1.我也不知道怎么操作的，卸载cli报错，安装也报错，查看版本提示没有安装vue

[npm ERR](https://www.jianshu.com/p/830d9b34779d)



2.经历了几次cli的安装和卸载，中间突然报错了。根据1中的结果，修复了卸载报错，重新安装。然后安装提示成功之后运行vue提示

~~~cmd
command not found: vue
~~~

查询了一些资料都说是环境变量的问题

[Mac下安装vue时报错：bash: vue: command not found](https://blog.csdn.net/weixin_43843044/article/details/87872365)

修改完文件后运行文件才能生效，执行`source .bash_profile`

我在首次添加环境变量后，运行vue可以识别。然而关闭终端窗口再次打开又无法识别命令。又试过多次安装卸载，搞了一下午。最后索性把node卸载了，重新安装，终于搞定了。记录一下卸载的命令。

卸载vue的命令见上文，卸载完成后最好在使用cnpm命令再执行一次。

node我是通过homebrew安装的，卸载直接使用`brew uninstall node`，安装包安装的可以参见[Mac下如何把node和npm卸载干净](https://blog.csdn.net/caseywei/article/details/82659049)



3.安装指定版本的vue

直接使用`npm install -g @vue/cli  `默认安装的最新版。可以使用这个命令安装指定版本

`npm install -g @vue/cli@3.11.0`。附查询vue版本的命令`npm view @vue/cli versions --json`



3.npm ERR! code ELIFECYCLE webpack-dev-server --inline --progress --config build/webpack.dev.conf.js

具体的报错信息可能不是像标题那样，导入项目之后无法运行多半都是因为node_modules里的文件被修改了导致依赖库不完整。解决办法：删除项目下node_modules文件夹，在项目下执行 cnpm install。重新生成node_modules，之后再执行cnpm run build重新编译，不报错的话应该就可以运行了。





