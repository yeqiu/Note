---
layout:     post  
title:    	Kotlin for Android 入门
subtitle:   Kotlin入门
date:       2019-09-10
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



[TOC]



## 前言

最近看了kotlin，顺便再做一些kotlin的练习。然鹅练习过程遇到好多问题。






## 开发中的一些问题


###startActivity

```java
        //in java
        Intent intent = new Intent(context,MainActivity.class);
        //in kotlin
        Intent(this, Main2Activity.class)
        Intent(MainActivity.this, Main2Activity.class)
```

没错，就是简单的页面跳转。不过上面两行kotlin代码都会报错。在kotlin中不能使用MainActivity.this和SecondActivity.class这样的语法。

new Intent(context,MainActivity.class);需要的参数是1.上下文 2.class文件

`MainActivity::class`得到的是一个KClass（kotlin的class文件），需要转成javaClass

可以写成下面这样

```java
        val intent1 = Intent(MainActivity@this, Main2Activity::class.java)
        val intent2 = Intent(this@MainActivity , Main2Activity::class.java)
        val intent3 = Intent(this, Main2Activity::class.java)
```



关于内部类中使用MainActivity.this改成这种方式`this@MainActivity`



### findViewById

`findViewById`这玩意现在可以直接省略。

studio 3.0以上会自动添加相关的依赖，开启自动导包后直接在代码中使用view的id即可。

原理：

[Kotlin 不再使用 findViewById 的原理](https://blog.csdn.net/hust_twj/article/details/80290362)



### 关于set和get

  可以直接使用属性，无需再调用set和get方法。其实内部还是会调用set get方法

```java
        //setText
        message.text = ""
        //getText
        val text = message.text
```



### Kotlin 回调

   先看一段回调

```java
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
```

先定义接口，创建设置接口的方法，接口回调数据。调用时直接传入接口实现类即可。

以上这种很java式的写法也完全没有问题。

但kotlin中有更简便的写法

```java
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
```

不需要在定义接口，原先接受接口的方法参数修改成表达式。调用时候可以直接使用it （it即是回调传入的String）



### 添加kotlin文件夹

1.在 src/main 下新建 kotlin文件夹

2.项目build.gradle添加

```java
android {
		......
		sourceSets { main.java.srcDirs += 'src/main/kotlin'}
}

```

如无java代码可直接删除java文件夹









## 一些其他的问题

### 以下的代码代表什么

```kotlin
activity as? NewActivity
activity as NewActivity?
activity as? NewActivity?
```

其实关键在于理解可空类型和不可空类型。
对于as和as?来说，as是在强转失败时会抛出异常，但是as?不会。
有个细节在于如果activity是null的时候，用as去强转，肯定会抛出异常，但是用as?则不会。
1.activity as? NewActivity 这种情况，不会抛出异常。虽然你as?后面期望转换为NewActivity类型(不可空类型)，但是要注意的是由于是as?，所以转换的结果是可空的，必须用NewActivity?类型变量去接收。这种情况比较特殊，一般用在Java调用kotlin中的一个方法，虽然你在kotlin中声明接收一个非空参数，但是java可能给你传入个null，你使用as?转换会比较安全。
2.activity as NewActivity? 这种情况，activity为null时，强转失败，会抛出异常。如果顺利强转，由于你as后面的类型是可空的，所以转换的结果必须用NewActivity?类型变量去接收
3.activity as? NewActivity? 这种情况activity为null时也不会抛出异常，无论是因为强转失败还是由于as?的类型声明，转换的结果都必须用NewActivity?类型变量去接收

