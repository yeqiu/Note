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

是否使用ESLint代码规范，建议不添加 n

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



### cli-ui

从cli3开始就可以使用ui页面创建项目

使用命令 

~~~cmd
vue ui
~~~

![](https://tva1.sinaimg.cn/large/00831rSTly1gcc668w43sj30dv0610sx.jpg)

打开http://localhost:8000/ 进入图形化的页面

![](https://tva1.sinaimg.cn/large/00831rSTly1gcc686vu0dj30lc0es0su.jpg)

进入创建，选择需要创建项目位置。接下来创建项目都是图形化的选项。

完成后会出现这个页面

![](https://tva1.sinaimg.cn/large/00831rSTly1gcc6c4v008j310z0j4q5d.jpg)

可以在这里查看项目的依赖，项目的配置。

在任务页面可以运行或者编译项目

![](https://tva1.sinaimg.cn/large/00831rSTly1gcc6e2t4yej30fh0df3zg.jpg)



![](https://tva1.sinaimg.cn/large/00831rSTly1gcc6evf6ecj31280ksdjs.jpg)



编译完成之后选择输出选项卡就可以看到和窗口一样的命令输出。打开http://localhost:8080/#/就可以预览项目。

### 初识Vue-Cli

#### 项目结构

项目结构以cli 3 为例

![image-20200228160831348](/Users/yeqiu/Library/Application Support/typora-user-images/image-20200228160831348.png)

public 中存放的都是公共资源

src中是项目的源码

node_modules是前端依赖，这个文件夹是自动生成的，不要去改动这个文件里的文件。

在index.htim是项目的入口，里面声明了一个id为app的div

~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
~~~

在main.js中创建了vue对象并绑定到了这个div

~~~javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
~~~

这里还引用了router，store。这两个是在创建项目的时候选择的

router用于组件之间的跳转，store是vuex 用户管理组件之间的状态。

![src目录](https://tva1.sinaimg.cn/large/00831rSTly1gcc6spgzc9j308v07xq31.jpg)

assets中存放资源

components vue的组件

views即是页面

vue常见的套路就是view中使用components组件。就像Android中Activity使用Fragment Dialog一样。

~~~javascript
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
~~~

在Home.vue文件中引用了components中的HelloWorld组件。

在项目的根目录下有个package.json文件。这个文件保存了项目的所有依赖 配置。类似Android中的Gradle依赖文件。

~~~json
{
  项目的基本信息 版本等
  "name": "vue-demo",
  "version": "0.1.0",
  "private": true,
  这里是num的命令 使用 num run 加上serve/build/lint 可以执行对应的命令操作
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
项目的依赖信息
  "dependencies": {
    "core-js": "^3.6.4",
    "vue": "^2.6.11",
    "vue-router": "^3.1.5",
    "vuex": "^3.1.2"
  },
项目的开发依赖
  "devDependencies": {
    "@vue/cli-plugin-babel": "^4.2.0",
    "@vue/cli-plugin-eslint": "^4.2.0",
    "@vue/cli-service": "^4.2.0",
    "@vue/eslint-config-standard": "^5.1.0",
    "babel-eslint": "^10.0.3",
    "eslint": "^6.7.2",
    "eslint-plugin-import": "^2.20.1",
    "eslint-plugin-node": "^11.0.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-standard": "^4.0.0",
    "eslint-plugin-vue": "^6.1.2",
    "sass": "^1.25.0",
    "sass-loader": "^8.0.2",
    "vue-template-compiler": "^2.6.11"
  }
}
~~~

#### 组件化思想

一个组件是一个独立视图，可以在不同的页面中复用。

组件化可以实现功能模块的复用。

**组件拆分原则：**

1.300行原则，文件代码尽量不要超过300行

2.重复使用

3.业务复杂度

**组件化的问题：**

1.组件状态管理（vuex）

2.多组件的混合使用，组件的跳转（router）

3.组件之间通讯（props，bus）

#### vue代码规范

代码规范的重要性不言而喻，[这里是官方的代码风格指南](https://cn.vuejs.org/v2/style-guide/)

![](https://tva1.sinaimg.cn/large/00831rSTly1gcc8q791ukj309u0fcmyh.jpg)



#### router的介绍

router用于组件之间的切换，页面跳转

在项目的router目录下的index.js文件就是router的路由文件

~~~javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

~~~

使用router的步骤

1.创建组件，即vue文件

2.在router下的index.js文件中导入

~~~javascript
import Home from '../views/Home.vue'
~~~

3.在 const routes的数组中加入组件的地址和别名

~~~javascript
  {
    path: '/',
    name: 'Home',
    component: Home
  }
~~~

path：定义url的地址

name：随意起的名字，在使用的时候用到

component：必须和上面导入的名字一致

或者2.3两个步骤可以一起进行

~~~javascript
  {
    path: '/about',
    name: 'About',
    component: () => import( '../views/About.vue')
  }
~~~

4.在要点击跳转的地方使用

~~~html
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
~~~

除了使用标签跳转还可以在代码中使用Router的实例加载组件

同样还是需要在index.js文件中声明，然后在需要加载地方

~~~javascript
router.push('/welcome')
~~~



#### vuex的介绍

**单向数据流**

用户在页面上的操作会引起页面状态的变化，状态的变化又会带来一些视图的更新。

![](https://tva1.sinaimg.cn/large/00831rSTly1gcdivzyy6hj30av08at95.jpg)



vuex是为vue开发的状态管理模式，可以对组件的状态集中管理。组件状态的改变遵循统一的原则。

store文件夹下的index.js就是vuex的管理文件。

~~~javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    
  },
  mutations: {

  },
  actions: {

  },
  modules: {

  }
})
~~~

state：存放一些状态值，可以被多个组件读取

mutations：定义方法来改变state的值



**使用vuex**

1.定义store.js文件，这个在配置时选择添加vuex会自动生成。

2.state中定义需要改变的值

~~~javascript
  state: {
    count: 0
  }
~~~

3.在mutations定义函数

~~~javas
  mutations: {
    addCount () {
      this.state.count++
    }
  }
~~~

4.在需要改变状态的页面中引入store的引用，改变state的时候调用函数

~~~javascript
//引用store @表示src目录
import store from '@/store'
//调用mutations中声明的函数，调用store的commit函数，参数是mutations中定义的函数名
store.commit('addCount')
~~~

如果其他页面需要获取state中的值

1.导入store的引用

2.直接获取state中变量名

~~~javascript
//引用
import store from '@/store'
//获取state中的变量
store.state.count
~~~



例：

新建Info.vue

~~~html
<template>
  <div class="Info">
    <h1>This is info</h1>
    <button @click="add">add</button>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    name: 'Info',
    store,
    methods: {
      add () {
        store.commit('addCount')
      }
    }
  }
</script>

<style scoped>

</style>

~~~

store 的index.js文件

~~~javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    addCount () {
      this.state.count++
    }
  },
  actions: {
    
  },
  modules: {
    
  }
})
~~~

About.vue文件中获取count的值

~~~html
<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{data}}
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    name: 'About',
    store,
    data(){
      return{
        data:store.state.count
      }
    }
  }
</script>
~~~

### 模板语法

#### 使用变量

 在vue中获取变量最简单的就是{{变量名}}，用双大括号包裹变量名，在data函数中声明变量

~~~javascript
{{data}}

data(){
  	return{
      data:"欧力给"
    }
~~~

双括号中不仅可以使用变量，还可以进行变量的计算

~~~javascript
{{data+1}}
~~~

#### v-bind

用于绑定数据和元素属性。

~~~javascript
 <a v-bind:href="baidu" target="_blank"> 百度</a>
    data(){
      return{
        baidu:"https://www.baidu.com/"
      }
~~~

V-bind+属性名="变量名"，绑定之后值要去data的数据里面找。同样还可以绑定img的src，class的值等。v-bind可以缩写成：

~~~javascript
<a :href="baidu" target="_blank"> 百度</a>
~~~



### 计算属性和侦听器

计算属性：computed

侦听器：watch

这两个都是监听变量发生变化的

~~~javascript
  export default {
    name: 'About',
    store,
    data () {
      return {
        msg: 'msg',
        data:"data"
      }
    },
    watch: {
      msg: function (newVal, oldVal) {
        console.log('newVal = ' + newVal + ',oldVal = ' + oldVal)
      }
    },
    computed: {
      result: function () {
        return 'computed ' + this.msg
      }
    }
  }
~~~

watch只能监听指定的值(msg)发生变化，computed可以监听函数体内任意一个值发生变化。computed的结果(result)不可以定义在data函数中，如果定义会报错，因为computed作为计算属性定义并返回的结果不可别重新定义和赋值，这个变量只能由computed中指定的函数赋值。

watch使用在异步数据监听上

computed：一般用于一个属性是由其他多个属性计算得来。



### 条件渲染，列表渲染

#### 条件渲染

在满足特定条件的时候才显示某个组件

**v-if，v-else，v-else-if：**

其实就是if else条件语句

~~~html
    <div v-if="booleanValue">
       booleanValue = true
    </div>
    <div v-else>
      booleanValue = flase
    </div>
~~~

这里如果booleanValue是true就会显示booleanValue = true，否者显示booleanValue = flase。v-else-if只是多加了一个判断，这个没啥好说的。这里v-if=后面跟的可以是一个boolean结果的表达式，比如val==0。

**v-show：**

v-show=后面跟的也是一个boolean的表达式，条件成立就显示渲染

**v-if和v-show的区别**

共同点：都能实现元素的显示隐藏

v-show只是简单的控制元素的display属性，而v-if才是条件渲染，if(true)元素被渲染否则元素销毁。v-show由更高的渲染开销，v-if由更高的切换开销。v-if有v-else-if 和v-else组合，v-show只能单独使用。



#### 列表渲染

类似Andorid中的ListView，列表展示

**v-for**

~~~html
<div v-for="item in list" :key="item">
      {{item}}
</div>
~~~

~~~javascript
    data () {
      return {
        list: [1, 2, 3, 4, 5],
      }
    }
~~~

循环获取对象里的值

~~~html
<div v-for="item in data" :key="item">
      {{item.name}}
</div>
~~~

~~~javascript
    data () {
      return {
        data:[
          {
            name:"狗蛋",
            age:18
          },
          {
            name:"柱子",
            age:18
          },{
            name:"二蛋",
            age:18
          }
        ]
      }
~~~



#### 删除地址栏的#

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

从cli3开始创建项目时可以直接选择使用history模式

### vue的生命周期

**beforeCreate：**

组件刚创建，元素dom和数据还没初始化。并不能再这个函数中操作数据。

**created：**

数据已经初始化完成，自定义的函数也可以调用。但是dom未渲染。可以在这个周期中进行网络数据的异步请求。

**beforeMount：**

dom未完成挂载，数据的双向绑定还未完成，还是显示{{}}

**mounted：**

数据和dom已经完成挂载，这个周期适合执行初始化需要操作dom的函数。

**beforeUpdate：**

只要是页面的数据改变都会触发。请求赋值一个数据的时候就会执行这个周期，没有数据改变不执行。

**updated：**

数据更新完毕，beforeUpdate和updated要慎用，因为页面更新数据就会触发，这里操作数据很影响性能。

**beforeDestroy：**

组件销毁之前执行，这个周期里是无法阻止路由跳转的，但是可以做一些路由离开时的操作。这个周期里还可以使用数据和函数。可以做类似清楚计时器之类的操作。

**destroyed：**

页面销毁后调用

![](https://tva1.sinaimg.cn/large/00831rSTly1gceqp4pkbnj30k01en45k.jpg)





### vue中的数据，事件和方法

**数据：**

vue实例中的data属性中管理挂载dom中的所有数据。在data中声明的数据，在html模板中可以直接使用{{变量名}}直接使用。

{{}}也可以使用v-text代替。

**事件：**

在元素中使用v-on模板

~~~html
<div v-on:click="click">点击</div>
~~~

在methods属性中填写click函数，即绑定了点击事件。v-on:click可以使用@click简写。v-on的简写方式是@，同样之前说的v-bind的简写是:

**方法：**

方法是指写下methods属性中的代码。

~~~javascript
    methods: {
      add () {
        store.commit('addCount')
      },
      click(){
        console.log("click")
      }
    }
~~~

上面的两个函数都可以被html模板中的事件直接调用。



### vue数据双向绑定

使用{{}}这种差值表达式实现的只是数据的单向绑定。页面的展示根据数据的改变，但是页面的改变却不能影响数据。input这样的标签可以显示数据也可以改变数据，我们使用差值表达式仅仅只能改变input默认显示的数据，当inpu的数据发生改变，如果想要数据源也发生改变就要使用双向绑定

**v-model：**

~~~html
<input v-model="msg"/>
~~~

~~~javascript
    data () {
      return {
        msg:"msg"
      }
    }
~~~





### vue与其他框架

我并没有接触过其他框架，但是原生js或者jquery中如果要改变页面显示的数据，就必须找到这个dom元素，操作这个元素来设置数据。但是在vue中不要去操作dom，直接改变数据，vue会直接帮我们更新dom。vue更像是面向数据编程。







### axios在vue中的使用

[axios在vue中的使用](https://www.imooc.com/view/1152)









### 整合Element-ui

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

4.webstorm运行Vue项目

导入vue项目后默认是无法直接运行的，需进行配置





![](https://tva1.sinaimg.cn/large/006tNbRwly1gawgthtuaej307g05wjrb.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1gawgut694xj30gh0dlaab.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1gawgvaje8fj30m806qglm.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1gawgwqhefwj30h207k0sl.jpg)

**cli3选择对应的命令即可**

5.关闭eslint

eslint真是个烦人的小妖精

在.eslintrc.js文件中找到@vue/standard并注释掉

~~~javascript
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    //注释这一样
    // '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}

~~~

