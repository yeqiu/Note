---
layout:     post  
title:      2021-02-25-Navigation 
subtitle:   Navigation
date:       2021-02-25
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



[toc]



## Navigation介绍

Navigation是一个用于Fragment之间跳转的路由框架。具备可视化导航页面，页面传递参数，支持DeepLink



## 主要元素

1.Navigation Graph：导航图，Xml文件，其中包含应用程序所有的页面，以及页面间的关系。

2.NavHostFragment：这是一个特殊的Fragment，你可以认为它是其他Fragment的“容器”，Navigation Graph中的Fragment正是通过NavHostFragment进行展示的。

3.NavController：完成具体的页面切换工作。

**当你想切换Fragment时，使用NavController对象，告诉它你想要去NavigationGraph中的哪个Fragment，NavController会将你想去的Fragment展示在NavHostFragment中。**



## 简单使用

1.在res下创建NavigationGraph文件

![](https://tva1.sinaimg.cn/large/008eGmZEly1go0p482twjj31oh0u07ga.jpg)



2.创建Fragment文件和布局。



3.在Activity布局中直接引用NavHostFragment

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <fragment
        android:id="@+id/fragment_nav_host"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:defaultNavHost="true"
        app:navGraph="@navigation/app_navigation" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

`   android:name="androidx.navigation.fragment.NavHostFragment"`声明这是一个NavHostFragment。

` app:defaultNavHost="true"`让系统自动处理Fragment的返回键

`  app:navGraph="@navigation/app_navigation"`指定导航图



4.指定action和destination

在NavigationGraph文件中通过new destination来添加fragment

![](https://tva1.sinaimg.cn/large/008eGmZEly1go0qs90a19j31rk0u0djk.jpg)

单击前一个Fragment，用鼠标选中其右侧的圆圈，并拖拽至右边的destination Fragment，松开鼠标就会有一条连接线。完成后xml文件中会生成一个action

```xml
<action
    android:id="@+id/action_userFragment_to_orderFragment"
    app:destination="@id/orderFragment" />
```



5.使用NavController完成跳转

要实现Fragment的跳转需要使用到NavController，在代码中创建NavController对象。

```kotlin
class UserFragment : Fragment() {
    
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_user, container, false)
        view.findViewById<Button>(R.id.btOrder).setOnClickListener {
            Navigation.findNavController(it)
                .navigate(R.id.action_userFragment_to_orderFragment)
        }
        return view
    }

}
```

`navigate(R.id.action_userFragment_to_orderFragment)`这里指定的是导航图中的action



6.添加切换动画

新建动画文件，点击导航图中的箭头，在右侧中选择对应的动画

![](https://tva1.sinaimg.cn/large/008eGmZEly1go0qyysrg8j31i40twq5c.jpg)



## NavigationGraph导航文件详解

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/app_navigation"
    指定根页面 
    app:startDestination="@id/userFragment">
    
    
    
    <fragment
        根页面
        android:id="@+id/userFragment"
        android:name="com.yeqiu.jetpack.navigation.UserFragment"
        android:label="UserFragment"
        tools:layout="@layout/fragment_user">
        action 跳转动作
        <action
            android:id="@+id/action_userFragment_to_orderFragment"
            目标页面
            app:destination="@id/orderFragment"
            跳转动画
            app:enterAnim="@anim/slide_right_to_left_in"
            app:exitAnim="@anim/slide_right_to_left_out"
            app:popEnterAnim="@anim/slide_left_to_right_in"
            app:popExitAnim="@anim/slide_left_to_right_out" />
    </fragment>

    <fragment
        其他待跳转页面
        android:id="@+id/orderFragment"
        android:name="com.yeqiu.jetpack.navigation.OrderFragment"
        android:label="OrderFragment"
        tools:layout="@layout/fragment_order" />

</navigation>
```

## DeepLink

通过URL可以通过一个连接直接打开App的某个页面。直接在导航中为Fragment添加

```xml
<fragment
    android:id="@+id/orderFragment"
    android:name="com.yeqiu.jetpack.navigation.OrderFragment"
    android:label="OrderFragment"
    tools:layout="@layout/fragment_order" >

    <deepLink app:uri="www.yeqiu.com"/>

</fragment>
```



