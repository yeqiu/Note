---
layout:     post  
title:      Java Lambda表达式 
subtitle:   Lambda表达式
date:       2019-08-02
author:     小卷子
header-img: 这篇文章标题背景图片
catalog: true
tags:
    - 标签
---

## 前言

`(parameters) -> {doSomething};`

其实还是不习惯这种写法，总感觉这样破坏了原先java的阅读性。不过最近在学习kotlin，有一些相似的写法。感觉还是多做练习适应这种写法。





## 基本语法



~~~java
//不需要参数,返回值为 5
() -> 5 
//接收一个参数(数字类型),返回其2倍的值
x -> 2 * x 
//接受2个参数(数字),并返回他们的差值
(x, y) -> x – y 
//接收2个int型整数,返回他们的和
(int x, int y) -> x + y
//接受一个 string 对象,并在控制台打印,
(String s) -> System.out.print(s)
~~~



## 匿名内部类写法

使用用() -> {}代码块替代了整个匿名类

~~~java
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("阿姆斯特朗回旋加速喷气式阿姆斯特朗炮");
            }

        }).start();
        
        // ()->System.out.println("阿姆斯特朗回旋加速喷气式阿姆斯特朗炮") 
        new Thread(()->System.out.println("阿姆斯特朗回旋加速喷气式阿姆斯特朗炮")).start();

~~~



