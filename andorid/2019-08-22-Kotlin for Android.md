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

最近看了一下kotlin的基本语法，想着做个项目练练手。新建项目就发现到处都是问题，连最基本的Activity跳转都不知道怎么写。就写个文章记录使用Kotlin 开发 Android 中遇到的问题 



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



关于内部类中使用MainActivity.this改成这种方式`this@MainActivity`



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



# Kotlin 回调

   先看一段java式回调

~~~java
interface CallBackInJava {

    fun onSucceed(data: String)
}

class TestJava {

    fun getData(callBack: CallBackInJava) {
        callBack.onSucceed("TestJava")
    }

}

fun main() {
  
    TestJava().getData(object : CallBackInJava {
        override fun onSucceed(data: String) {
            println(data)
        }
    })   
}
~~~

先定义接口，创建设置接口的方法，接口回调数据。调用时直接传入接口实现类即可。这种写法完全没有问题。

kotlin中有更简便的写法

~~~java
class TestKotlin{
    
    fun getData(listener: (String) -> Unit){
        listener.invoke("TestKotlin")
    }
}

fun main() {
  
    TestKotlin().getData {
        println(it)
    }
}
~~~

不需要在定义接口，原先接受接口的方法参数修改成表达式。调用时候可以直接使用it （it即是回调传入的String）



# 添加kotlin文件夹

1.在 src/main 下新建 kotlin文件夹

2.项目build.gradle添加

~~~java
android {
		......
		sourceSets { main.java.srcDirs += 'src/main/kotlin'}
}

~~~

如无java代码可直接删除java文件夹



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

