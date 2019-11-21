---
layout:     post  
title:      2019-11-11-GithubApp开发笔记 
subtitle:   GithubApp
date:       2019-11-11
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



[TOC]



### mvp框架开发

####mvp简介

常规的Android开发就是MVC，如下图

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8whatdtoij30dt08m0sl.jpg)

controller：逻辑的处理（Activity）

view：视图展示（Activity）

model：数据管理

这里的controller和view都是Activity导致耦合度非常高，复杂的逻辑会导致Activity的代码越来越长。修改UI也会变得很困难。



MVP；

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8widbwc7yj30lx06h3yd.jpg)

在mvp架构中 presenter 分割了view和model，view中的所有数据都来自presenter，与model解耦，这样把Activity解放出来，逻辑基本都在presenter。view和presenter通过接口互相持有对方的引用。view和presenter需要做一个绑定关系

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g8wih6noo9j30h70dcglr.jpg)

view（Activity）由系统创建，它有对应的生命周期方法，我们需要在view中初始化presenter并完成绑定。