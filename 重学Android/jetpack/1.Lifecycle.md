# Jetpack Lifecycle的使用



#### 简介

用于共享组件生命生命周期,[Lifecycle文档传送门](https://developer.android.google.cn/jetpack/androidx/releases/lifecycle?hl=zh-cn)

####  使用Lifecycle解耦页面和组件

以下案例是一个自动感知页面Resume和Stop的计时器。

~~~kotlin
class LifecycleChronometer @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : Chronometer(context, attrs, defStyleAttr),DefaultLifecycleObserver {

    private var elapsedTime = 0L

    override fun onResume(owner: LifecycleOwner) {
        super.onResume(owner)
        base = SystemClock.elapsedRealtime()-elapsedTime
        start()
    }


    override fun onStop(owner: LifecycleOwner) {
        super.onStop(owner)
        elapsedTime = SystemClock.elapsedRealtime() - base
        stop()
    }
}
~~~

页面中使用

~~~kotlin
    override fun init() {
        lifecycle.addObserver(viewBind.chronometer)
    }

~~~



#### @OnLifecycleEvent 过时

`@OnLifecycleEvent`已经过时，官方推荐使用 DefaultLifecycleObserver 或者 LifecycleEventObserver 

上例中使用DefaultLifecycleObserver

LifecycleEventObserver：只有一个方法，在任意生命周期触发都会执行

~~~kotlin
public interface LifecycleEventObserver extends LifecycleObserver {
    /**
     * Called when a state transition event happens.
     *
     * @param source The source of the event
     * @param event The event
     */
    void onStateChanged(@NonNull LifecycleOwner source, @NonNull Lifecycle.Event event);
}

~~~



#### 使用LifecycleService接口Service组件

需要添加依赖

~~~groovy
"lifecycleService"  : "androidx.lifecycle:lifecycle-service:2.5.1",
~~~

作用就是让Service可以添加观察者，使用方法和上例一样。以下是一个简单打印日志的例子

~~~kotlin
class TestLifecycleService:LifecycleService() {
    
    init {
        lifecycle.addObserver(LifecycleServiceLog())
    }
    
    class LifecycleServiceLog:LifecycleEventObserver{
        override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
            "TestLifecycleService 生命周期变化：$event".log()
        }
    }
}
~~~

**注意：**一定要添加`lifecycle.addObserver(LifecycleServiceLog())`，否者Lifecycle观察者不生效



#### 使用ProcessLifecycleOwner监听应用生命周期

作用就是让Application可以添加观察者，使用方法差不多

**注意点：**

- 监听整个应用程序的生命周期，与Activity无关
- *ON_CREATE*只会调用一遍，*ON_DESTROY*永远不会调用，*ON_STOP*会在应用退出到后台调用

例

需要添加依赖

~~~groovy
    "lifecycleProcess": "androidx.lifecycle:lifecycle-process:$lifecycle_version",
~~~

~~~kotlin
class App : Application() {

    override fun onCreate() {
        super.onCreate()
        //添加生命周期监听
        ProcessLifecycleOwner
            .get()
            .lifecycle
            .addObserver(AppLifecycleObserver())
    }
    
    class AppLifecycleObserver : LifecycleEventObserver {
        override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
            //ON_DESTROY不会执行
            "Application 生命周期变化：$event".log()
        }
    }
}
~~~









