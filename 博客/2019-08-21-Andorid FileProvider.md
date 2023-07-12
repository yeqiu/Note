---
layout:     post  
title:      Andorid FileProvider 
subtitle:   FileProvider
date:       2019-08-21
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---

## 前言

最近在做下载PDF文件用Intent打开的功能，遇到FileProvider适配的问题。之前做下载升级的时候对这块就迷迷糊糊的，正好这次弄清楚这个



## 异常

~~~java
    private void open(String path) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setDataAndType(Uri.fromFile(new File(path)), "application/pdf");
        startActivity(intent);
    }

~~~

以上这段代码在7.0以上的系统运行会直接崩溃。

异常信息

~~~java
 Caused by: android.os.FileUriExposedException: file:///storage/emulated/0/%E9%87%91%E6%A1%94%E4%BA%91%E5%88%9B(%E5%90%88%E5%90%8C)/aa.pdf exposed beyond app through Intent.getData() 
~~~

对于面向 Android 7.0 的应用，Android 框架执行的 StrictMode API 政策禁止在您的应用外部公开 file:// URI。如果一项包含文件 URI 的 intent 离开您的应用，则应用出现故障，并出现 FileUriExposedException 异常。
以上代码中`Uri.fromFile(new File(path)`就会生成一个file://...的链接。



## 解决

官网给出的解决方案：

> 要在应用间共享文件，您应发送一项 content:// URI，并授予 URI 临时访问权限。进行此授权的最简单方式是使用 FileProvider 类。如需了解有关权限和共享文件的详细信息，请参阅共享文件。 
> https://developer.android.com/about/versions/nougat/android-7.0-changes.html#accessibility



FileProvider实际上是ContentProvider的一个子类，它的作用也比较明显了，`file:///Uri`不能用，那么换个Uri为`content://`来替代



1.声明注册provider

在清单文件中加入

~~~xml
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.provider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/provider_paths"/>
        </provider>
~~~

FileProvider的包可能是android.support.v4.content.FileProvider ，根据里你导入的appcompat的包



2.编写resource xml file

以上meta-data中的provider_paths需要放到res/xml（如果没有xml文件夹就新建一个）

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <root-path name="root" path="" />
    <files-path name="files" path="" />
    <cache-path name="cache" path="" />
    <external-path name="external" path="" />
    <external-files-path name="name" path="path" />
    <external-cache-path name="name" path="path" />
</paths>
~~~

<root-path/> 代表设备的根目录new File("/");
<files-path/> 代表context.getFilesDir()
<cache-path/> 代表context.getCacheDir()
<external-path/> 代表Environment.getExternalStorageDirectory()
<external-files-path>代表context.getExternalFilesDirs()
<external-cache-path>代表getExternalCacheDirs()



path即为代表目录下的子目录，比如：
<external-path
        name="external"
        path="pics" />

代表的目录即为：`Environment.getExternalStorageDirectory()/pics`。



3.使用FileProvider API

~~~java
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            File file = new File(path);
            String authority = getApplicationContext().getPackageName() + ".provider";
            Uri uri = FileProvider.getUriForFile(this, authority, file);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.setDataAndType(uri, "application/pdf");
        } else {
            intent.setDataAndType(Uri.fromFile(new File(path)), "application/pdf");
        }
        startActivity(intent);
~~~

核心代码

~~~java
            File file = new File(path);
            String authority = getApplicationContext().getPackageName() + ".provider";
            Uri uri = FileProvider.getUriForFile(this, authority, file);
~~~

这里的authority和配置在provider必须要一致

这里获取到的uri：`content://com.example.test.provider/test/%E9%87%91%E6%A1%94%E4%BA%91%E5%88%9B(%E5%90%88%E5%90%8C)/aa.pdf`

以上的格式就是这样的 `content://authorities/定义的name属性/文件的相对路径`



这里如果清单文件中没有配置或者配置错了` android:authorities="${applicationId}.provider"`

那么`Uri uri = FileProvider.getUriForFile(this, authority, file);`这句会直接报出空指针异常



[代码传送门](https://github.com/yeqiu/HailHydra/blob/master/hydra/src/main/java/com/yeqiu/hydra/utils/FileProviderUtils.java)



附上搜集了一些intent

~~~java
//打开图片文件
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setDataAndType(uri, "image/*");
//打开PDF文件
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setDataAndType(uri, "application/pdf");
//打开文本文件
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setDataAndType(uri, "text/plain");
//打开音频文件
intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
intent.putExtra("oneshot", 0);
intent.putExtra("configchange", 0);
intent.setDataAndType(uri, "audio/*");
//打开视频文件
intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
intent.putExtra("oneshot", 0);
intent.putExtra("configchange", 0);
intent.setDataAndType(uri, "video/*");
//打开CHM文件
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setDataAndType(uri, "application/x-chm");
//打开apk文件
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setDataAndType(uri, "application/vnd.android.package-archive");
//打开PPT文件
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setDataAndType(uri, "application/vnd.ms-powerpoint");
//打开Excel文件
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setDataAndType(uri, "application/vnd.ms-excel");
//打开Word文件
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setDataAndType(uri, "application/msword");
~~~





资料：

[Android 7.0 行为变更 通过FileProvider在应用间共享文件吧](https://blog.csdn.net/lmj623565791/article/details/72859156)

[Android使用文件管理器打开指定文件夹，浏览里面的内容](https://www.cnblogs.com/zhujiabin/p/9204951.html)

