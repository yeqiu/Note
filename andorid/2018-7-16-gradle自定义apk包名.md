---
layout:     post  
title:      gradle自定义apk包名 
subtitle:   gradle自定义apk包名
date:       2018-7-16
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



在  `signingConfigs`  `release`节点下配置

~~~JAVA
  //打包名设置
            applicationVariants.all{variant->
                variant.outputs.each{output->
                    if(variant.buildType.name.equals('release')) {
                        def fileName = "xbzd_v${variant.versionName}"+"_${variant.flavorName}"+"_"+releaseTime();
                        def outputFile = output.outputFile
                        output.packageApplication.outputFile = new File(outputFile.parent, fileName)
                    }
                }
            }
~~~





![截图](https://ws3.sinaimg.cn/large/006tKfTcly1ftbnaud21mj31kw0lc0wk.jpg)



最终生成的akp名：`xbzd_v1.1.0_anzhi_20180716`  



releaseTime的配置

~~~java
def releaseTime() {
   return new Date().format("yyyyMMdd", TimeZone.getTimeZone("UTC"))
}
~~~

