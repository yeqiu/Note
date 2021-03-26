---
layout:     post  
title:      2021-02-19-LifeCycle 
subtitle:   LifeCycle
date:       2021-02-19
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



[toc]



## LifeCycle介绍

LifeCycle主要用于程序组件之间的解耦，在Andorid开发中，解耦很大程度上表现在系统组件的生命周期和普通组件之间。普通的组件通常都需要依赖系统的生命周期，我们必须在生命周期中对普通组件做处理，**因为普通组件无法感知系统的生命周期**。

理想的的状态是普通组件在系统生命周期发生变化时候也能收到通知，做出对应的处理。

LifeCycle可以帮助我们创建可以感知系统生命周期的组件，方便组件能在内部管理自己的生命周期状态。降低普通组件和系统组件的耦合度，并降低内存泄漏。

例：自定义一个播放器，在页面打开时自动播放，页面离开时停止播放。

按照以往的写法大概是这样的

~~~kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lifecycle)

        videoPlayer = VideoPlayer()
        videoPlayer.init()
    }

    override fun onResume() {
        super.onResume()
        videoPlayer.startPlay()
    }

    override fun onPause() {
        super.onPause()
        videoPlayer.stopPlay()
    }
~~~



## LifeCycle原理

Jetpack中提供了**LifecycleOwner**（被观察者）和**LifecycleObserver**（观察者），AndoirdX中Activity就是一个LifecycleOwner，Activity已经是一个可以被观察生命周期的对象，我们只需要让播放器使用LifecycleObserver来观察Activity的生命周期。

LifeCycle通过注解来回调生命周期。

~~~kotlin
		@OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    fun onActivityCreate() {
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    fun onActivityStart() {
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    fun onActivityStop() {
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun onActivityDestroy() {
    }
    /**
     * 可以感知所有生命周期
     */
    @OnLifecycleEvent(Lifecycle.Event.ON_ANY)
    fun onAnyActivityLife() {
      	//获取当前生命周期
        val msg = "LifecycleActivity执行了${lifecycleife.currentState}"
    }
~~~



## 利用LifeCycle完善播放器

~~~kotlin
class VideoPlayer : LifecycleObserver {

    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    fun init() {
        ToastUtil.show("VideoPlayer初始化")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    fun startPlay() {
        ToastUtil.show("VideoPlayer开始播放")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    fun stopPlay() {
        ToastUtil.show("VideoPlayer停止播放")
    }
    
}
~~~

在Acitivty中还需要关联VideoPlayer

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_lifecycle)

    videoPlayer = VideoPlayer()
    getLifecycle().addObserver(videoPlayer)

}
```

就这样，videoPlayer在内部就可以关联页面的生命周期。在AndoridX中Fragment同样也默认实现了LifecycleOwner接口



## LifecycleService与Service

Service生命周期的监听与Acitivty类似，系统提供了LifecycleService类，该类继承自Service并实现了LifecycleOwner接口。

**创建观察者**

```kotlin
class TestServiceObserver : LifecycleObserver {

    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    private fun onCreate() {
        LogUtil.log("TestServiceObserver.onCreate")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    private fun onDestroy() {
        LogUtil.log("TestServiceObserver.onDestroy")
    }    
}
```

**Service中关联**

```kotlin
class TestService : LifecycleService() {

    private var testServiceObserver: TestServiceObserver = TestServiceObserver()

    init {
     lifecycle.addObserver(testServiceObserver)
    }

}
```

此时TestServiceObserver就具备了监听TestService的生命周期



## ProcessLifecycleOwner 监听App的生命周期

在日常开发中可能会需要这样的需求，需要知道当前的程序处在前台还是后台，或者当程序从后台切回前台。LifeCycle中提供了ProcessLifecycleOwner类，可以实现这种需求。

ProcessLifecycleOwner的用法和LifecycleOwner很相似。

**创建观察者**

```kotlin
class AppObserver : LifecycleObserver {

    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    fun onCreate() {
        LogUtil.log("App.onCreate")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    fun onStart() {
        LogUtil.log("App.onStart")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    fun onResume() {
        LogUtil.log("App.onResume")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    fun onPause() {
        LogUtil.log("App.onPause")
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    fun onStop() {
        LogUtil.log("App.onStop")
    }

    /**
     * 不会调用，系统不会分发app销毁的事件
     */
    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun onDestroy() {
        LogUtil.log("App.onDestroy")
    }
}
```



**在App中关联**

```kotlin
class App : Application() {

 lateinit var appObserver: AppObserver

    override fun onCreate() {
        super.onCreate()
        appObserver = AppObserver()
        ProcessLifecycleOwner.get().lifecycle.addObserver(appObserver)
    }
    
}
```

**注意:**

1.Lifecycle.Event.ON_CREATE只会被调用一次，而Lifecycle.Event.ON_DESTROY永远不会被调用。

2.当App从后台回到前台，或者应用程序被首次打开时，会依次调用Lifecycle.Event.ON_START和Lifecycle.Event.ON_RESUME。

3.当App从前台退到后台（用户按下Home键或任务菜单键），会依次调用Lifecycle.Event.ON_PAUSE和Lifecycle.Event.ON_STOP。需要注意的是，这两个方法的调用会有一定的延后。这是因为系统需要为“屏幕旋转，由于配置发生变化而导致Activity重新创建”的情况预留一些时间。也就是说，系统需要保证当设备出现这种情况时，这两个事件不会被调用。因为当旋转屏幕时，你的应用程序并没有退到后台，它只是进入了横/竖屏模式而已。



## LifeCycle小结

Activity、Fragment、Service和Application都可以使用LifeCycle来感知生命周期的变化。可以通过这个更好的在自定义组件中管理自身的生命周期。





## 相关资料

[“终于懂了“系列：Jetpack AAC完整解析（一）Lifecycle 完全掌握！](https://www.jianshu.com/p/728b2345bf0b)