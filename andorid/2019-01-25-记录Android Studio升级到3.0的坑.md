---
layout:     post  
title:      记录Android Studio升级到3.0的坑 
subtitle:   记录Android Studio升级到3.0的坑 
date:       2019-01-25
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---




## AAPT2 error: check logs for details

日志如下：

~~~java
AGPBI: {"kind":"error","text":"error: style attribute \u0027@android:attr/windowEnterAnimation\u0027 not found.","sources":[{"file":"/Users/yeqiu/WorkSpace/AndroidProject/yeqiu/demo/app/build/intermediates/incremental/mergeDebugResources/merged.dir/values/values.xml","position":{"startLine":3548}}],"original":"","tool":"AAPT"}
AGPBI: {"kind":"error","text":"error: style attribute \u0027@android:attr/windowExitAnimation\u0027 not found.","sources":[{"file":"/Users/yeqiu/WorkSpace/AndroidProject/yeqiu/demo/app/build/intermediates/incremental/mergeDebugResources/merged.dir/values/values.xml","position":{"startLine":3550}}],"original":"","tool":"AAPT"}
~~~





看起来是windowEnterAnimation和windowExitAnimation没有这两个属性。这是个老项目，在2.3是可以用的。

这两个属相调用的地方

~~~xml
 <style name="sheet_dialog" parent="android:style/Theme.Dialog">
        <item name="android:windowBackground">@android:color/transparent</item>
        <item name="android:windowContentOverlay">@null</item>
        <item name="android:windowIsFloating">true</item>
        <item name="android:windowFrame">@null</item>
        <item name="android:backgroundDimEnabled">true</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowIsTranslucent">true</item>
        <item name="android:windowAnimationStyle">@style/sheet_dialog_anim</item>
    </style>

    <style name="sheet_dialog_anim" parent="@android:style/Animation.Dialog">
        <!-- 进入时的动画 -->
        <item name="@android:windowEnterAnimation">@anim/sheet_dialog_enter</item>
        <!-- 退出时的动画 -->
        <item name="@android:windowExitAnimation">@anim/sheet_dialog_exit</item>
    </style>

~~~



解决办法：

去掉@符，修改为

~~~xml
 <style name="sheet_dialog_anim" parent="@android:style/Animation.Dialog">
        <!-- 进入时的动画 -->
        <item name="android:windowEnterAnimation">@anim/sheet_dialog_enter</item>
        <!-- 退出时的动画 -->
        <item name="android:windowExitAnimation">@anim/sheet_dialog_exit</item>
    </style>
~~~





# cannot access xxx

网上有人说这是idea的bug，重启一下就好了。

我这里的情况是继承了一个库里的抽象类。这个抽象类有继承了另一个库的的类。

![](https://ws4.sinaimg.cn/large/006tNc79ly1fzio6rpu15j30ta0m2415.jpg)



我试了重启并没有解决问题。最后猜想应该是和依赖方式有关。

尝试将库的引用从compile改成了api，解决问题（将我引用的库引用其他的库的方式改成api，并不是修改app库的方式）。关于引用的方式可以看看这里[Android Studio3.0之前的6种依赖方式和3.0之后新增的两种依赖方式](https://blog.csdn.net/nzfxx/article/details/79830596#13-apk)



## 导入本地依赖库

3.0之前导入本地库之后在Project Strucure里可以看到直接添加依赖，3.0之后需要在settings.gradle中手动添加库名才能在Project Strucure中显示

~~~xml
include ':app', ':hydrautils'
~~~





相关资料：

[Android Studio3.0之前的6种依赖方式和3.0之后新增的两种依赖方式](https://blog.csdn.net/nzfxx/article/details/79830596#13-apk)

[AS升级3.0依赖方式的改变，implement、api 和compile区别](https://www.jianshu.com/p/ccf351dff7f7)

[Android Studio3.0更新之路（遇坑必入）](https://www.jianshu.com/p/15afb8234d19)



