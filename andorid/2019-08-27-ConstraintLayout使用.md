---
layout:     post  
title:      ConstraintLayout使用 
subtitle:   ConstraintLayout
date:       2019-08-27
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---

## 前言

本来不想写这篇文章的，之前看了一些关于ConstraintLayout的介绍。感觉使用上应该没什么问题，真正用起来还是有好多属性记不清。Android的知识很零碎，还是要记录一下



**基本属性**

layout_constraintRight_toLeftOf
layout_constraintRight_toRightOf
layout_constraintTop_toTopOf
layout_constraintTop_toBottomOf
layout_constraintBottom_toTopOf
layout_constraintBottom_toBottomOf
layout_constraintBaseline_toBaselineOf

这些属性和RelativeLayout的属性类似，基本从字面就能理解是什么意思









**一些效果**

两个控件水平或者垂直居中，不用其他父控件包裹

![](http://ww3.sinaimg.cn/large/006y8mN6ly1g6e2308qdoj309e0gnmwy.jpg)



使用Chain Style可实现以上效果

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".navigation.NavigationActivity">

    <TextView
        android:id="@+id/tvActivity"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Activity样式"
        app:layout_constraintBottom_toTopOf="@+id/tvViewPager"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintVertical_chainStyle="packed" />

    <TextView
        android:id="@+id/tvViewPager"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="20dp"
        android:text="ViewPager样式"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/tvActivity" />

</androidx.constraintlayout.widget.ConstraintLayout>
~~~

指定 `app:layout_constraintVertical_chainStyle="packed"` 下面的textview在设置layout_marginTop即可









资料

[ConstraintLayout使用指南](https://www.jianshu.com/p/958887ed4f5f)
[约束布局（ConstraintLayout）1.1.2](https://www.jianshu.com/p/4b23e789befb)
[ConstraintLayout看这一篇就够了](https://www.jianshu.com/p/17ec9bd6ca8a)
[为什么ConstraintLayout代替其他布局?](https://www.jianshu.com/p/32a0a6e0a98a)