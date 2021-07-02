---
layout:     post  
title:      2021-06-03-WorkManger
subtitle:   WorkManger
date:        2021-06-03
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



## WorkManger简介

大部分的应用都需要再后台运行任务，Andoird有很多后台运行的解决方案，如JobScheduler、Service等。但是这些方式都会消耗大量的电量，WorkManger为后台提供一个统一的解决方案。

## WorkManger的特点

1.针对不需要及时完成的任务。

例如，发送日志，同步程序数据等。

2.保证任务一定会被执行。

WorkManger能保证任务一定会被执行，即使程序当前未运行，甚至当设备重启后。WorkManger有内置的数据库来保存任务信息。

3.兼容性强

WorkManager最低能兼容API Level 14，并且不需要你的设备安装Google PlayServices。因此，不用过于担心兼容性问题，因为API Level 14已经能够兼容几乎100%的设备。

4.并不能保证任务能立即被执行。



