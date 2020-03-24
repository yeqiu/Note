### 获取

一开始我使用的是免费的社区版，我是做Android开发的。社区版的设置和studio几乎一样，我也觉得社区版挺好的。大佬都建议使用旗舰版。

从官网下载安装包，正常安装。打开后会提示激活，选择第二项输入激活码。

[点击这里获取激活码](http://idea.medeming.com/jet/),这个激活码是有时间限制的。当激活过期后再去这个网站获取新的激活码。所有idea的产品都可以使用这个方法激活。





### 导入项目报错

首先检查是否安装jdk。

#### 指定jdk的版本

打开idea进行下面的步骤

![这里写图片描述](https://img-blog.csdn.net/20170827153140415?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvb2FtcFp1bzEyMzQ1/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![这里写图片描述](https://img-blog.csdn.net/20170827153203793?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvb2FtcFp1bzEyMzQ1/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![这里写图片描述](https://img-blog.csdn.net/20170827153222273?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvb2FtcFp1bzEyMzQ1/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![这里写图片描述](https://img-blog.csdn.net/20170827153237228?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvb2FtcFp1bzEyMzQ1/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



还有指定编码方式

![](https://tva1.sinaimg.cn/large/00831rSTly1gcde1bl38qj30on0d0jsp.jpg)



#### 指定maven阿里云代理

maven的下载速度，不用我多说。

在Pom.xml右键找到然后选择“open settings.xml”或者 “create settings.xml”

![](https://tva1.sinaimg.cn/large/00831rSTly1gcde2wcm7kj30qu0iv7a7.jpg)

复制下面的代码，然后重启idea

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <mirrors>
        <!-- mirror
          Specifies a repository mirror site to use instead of a given repository. The repository that
          this mirror serves has an ID that matches the mirrorOf element of this mirror. IDs are used
          for inheritance and direct lookup purposes, and must be unique across the set of mirrors.
        <mirror>
          <id>mirrorId</id>
          <mirrorOf>repositoryId</mirrorOf>
          <name>Human Readable Name for this Mirror.</name>
          <url>http://my.repository.com/repo/path</url>
        </mirror>
         -->

        <mirror>
            <id>alimaven</id>
            <name>aliyun maven</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
            <mirrorOf>central</mirrorOf>
        </mirror>

        <mirror>
            <id>uk</id>
            <mirrorOf>central</mirrorOf>
            <name>Human Readable Name for this Mirror.</name>
            <url>http://uk.maven.org/maven2/</url>
        </mirror>

        <mirror>
            <id>CN</id>
            <name>OSChina Central</name>
            <url>http://maven.oschina.net/content/groups/public/</url>
            <mirrorOf>central</mirrorOf>
        </mirror>

        <mirror>
            <id>nexus</id>
            <name>internal nexus repository</name>
            <!-- <url>http://192.168.1.100:8081/nexus/content/groups/public/</url>-->
            <url>http://repo.maven.apache.org/maven2</url>
            <mirrorOf>central</mirrorOf>
        </mirror>

    </mirrors>

</settings>

~~~



### 一些技巧

