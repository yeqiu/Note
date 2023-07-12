---
layout:     post  
title:      记录Android Studio坑 
subtitle:   记录Android Studio坑 
date:       2019-01-25
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---




#### AAPT2 error: check logs for details

studio 2的项目使用3打开基本就会遇到这个问题

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



#### cannot access xxx

网上有人说这是idea的bug，重启一下就好了。

我这里的情况是继承了一个库里的抽象类。这个抽象类有继承了另一个库的的类。

![](https://ws4.sinaimg.cn/large/006tNc79ly1fzio6rpu15j30ta0m2415.jpg)



我试了重启并没有解决问题。最后猜想应该是和依赖方式有关。

尝试将库的引用从compile改成了api，解决问题（将我引用的库引用其他的库的方式改成api，并不是修改app库的方式）。关于引用的方式可以看看这里[Android Studio3.0之前的6种依赖方式和3.0之后新增的两种依赖方式](https://blog.csdn.net/nzfxx/article/details/79830596#13-apk)





####JKS 密钥库使用专用格式



![](https://tva1.sinaimg.cn/large/006y8mN6ly1g7xn1nf5wrj30ax06twej.jpg)



`JKS 密钥库使用专用格式。建议使用 "keytool -importkeystore -srckeystore XXX -destkeystore XXX -deststoretype pkcs12" 迁移到行业标准格式 PKCS12。`

这里虽然报错了关闭窗口之后还是会生成key文件，但是似乎不能用。

这个问题我也没找到好的办法，只能按照提示执行一遍命令

~~~java
keytool -importkeystore -srckeystore key.jks -destkeystore key.jks -deststoretype pkcs12
~~~

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g7xn3y9zjgj30ug0710su.jpg)

会生成一个新的key文件，旧的key会被重命名备份。以后使用新的key就可以。





#### 多渠道打包

以前我都是直接在项目下面的 build.gradle中添加

~~~java
    productFlavors {
        anzhi {}
        baidu {}
        xiaomi {}
        qihu360 {}
        huawei {}
        oppo {}
        yingyongbao {}
        wandoujia {}
        vivo {}
        sougou {}
        meizu {}
        chexixi {}
    }
~~~

之后再打包的时候可以选择debug和release。全选需要的渠道就可以打出来。然后更新到3之后打包的页面变成你了这样

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g7xn7p5xnlj30gl0blmxb.jpg)

不在区分debug和release。这样就很难受。最后我选择了使用360加固多渠道打包（是时候学习多渠道打包了）









相关资料：

[Android Studio3.0之前的6种依赖方式和3.0之后新增的两种依赖方式](https://blog.csdn.net/nzfxx/article/details/79830596#13-apk)

[AS升级3.0依赖方式的改变，implement、api 和compile区别](https://www.jianshu.com/p/ccf351dff7f7)

[Android Studio3.0更新之路（遇坑必入）](https://www.jianshu.com/p/15afb8234d19)



