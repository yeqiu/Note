---
layout:     post  
title:      Kotlin for Android 
subtitle:   Kotlin for Android
date:       2019-08-22
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---

## 前言

最近看了一下kotlin的基本语法，想着做个项目练练手。新建项目就发现到处都是问题，连最基本的Activity跳转都不知道怎么写。这边文章仅记录使用Kotlin 开发 Android 中遇到的问题 



# startActivity

~~~java
        //in java
        Intent intent = new Intent(context,MainActivity.class);
        //in kotlin
        Intent(this, Main2Activity.class)
        Intent(MainActivity.this, Main2Activity.class)
~~~

没错，就是简单的页面跳转。不过上面两行kotlin代码都会报错。在kotlin中不能使用MainActivity.this和SecondActivity.class这样的语法。

new Intent(context,MainActivity.class);需要的参数是1.上下文 2.class文件

`MainActivity::class`得到的是一个KClass（kotlin的class文件），需要转转成javaClass

可以写成下面这样

~~~java
        val intent1 = Intent(MainActivity@this, Main2Activity::class.java)
        val intent2 = Intent(this@MainActivity , Main2Activity::class.java)
        val intent3 = Intent(this, Main2Activity::class.java)
~~~



# findViewById

`findViewById`这玩意现在可以直接省略。

studio 3.0以上会自动添加相关的依赖，开启自动导包后直接在代码中使用view的id即可。

原理：

[Kotlin 不再使用 findViewById 的原理](https://blog.csdn.net/hust_twj/article/details/80290362)





# 关于set和get

  可以直接使用属性，无需再调用set和get方法

~~~java
        //setText
        message.text = ""
        //getText
        val text = message.text
~~~



# 标题

​       

# 标题

​       

# 标题

​       

# 标题

​       

# 标题

​       

# 标题

​       

# 标题

​       

