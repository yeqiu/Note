

[toc]

# SplashScreen 使用



## 以前的方案

新增闪屏页面，给闪屏页添加单独的主题

~~~kotlin
class SplashActivity :AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        //为了显示效果，延时
        Thread.sleep(2000)
        startActivity(Intent(this,MainActivity::class.java))
        finish()
    }

}
~~~

~~~xml
        <activity
            android:name=".SplashActivity"
            android:theme="@style/splash"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
~~~

~~~xml
    <style name="splash" parent="Theme.MaterialComponents.Light.NoActionBar">

        <item name="android:windowDisablePreview">false</item>
        <item name="android:windowIsTranslucent">false</item>
        <item name="android:windowBackground">@drawable/bg_splash</item>
        <item name="android:windowFullscreen">true</item>

    </style>
~~~



## Android 12

SplashScreen在Android 12上是强制的，即使你什么都不做，你的App在Android 12上也会自动拥有SplashScreen界面。默认情况下，App的Launcher图标会作为SplashScreen界面的中央图标，windowBackground属性指定的颜色会作为SplashScreen界面的背景颜色。

启动画面的出现的场景：

- 开机第一次启动应用

- 用户杀死进程

- 系统回收了应用内存(进程被杀死)。

它们由**窗口背景(4)**、**应用图标(1)(静态动态两种)**、**图标背景(3)** 还有**底部的图片(谷歌不推荐使用)** 组成：

![img](https://img-blog.csdnimg.cn/img_convert/8b042e34f0e9a5b50e9481732b501dcd.png)





### 自定义属性

```xml
<style name="Theme.SccMall.SplashScreen">
    <item name="windowActionBar">false</item>
    <item name="windowNoTitle">true</item>
    <!-- 启动画面背景颜色 -->
    <item name="android:windowSplashScreenBackground">@color/splash_screen_background</item>
    <!-- 启动画面中间显示的图标，默认使用应用图标 -->
    <item name="android:windowSplashScreenAnimatedIcon">@drawable/iv_splash_animation1</item>
    <!-- 启动画面中间显示的图标的背景，如果图标背景不透明则无效 -->
    <item name="android:windowSplashScreenIconBackgroundColor">@color/splash_screen_icon_background</item>
    <!-- 启动画面启动画面底部的图片 -->
    <item name="android:windowSplashScreenBrandingImage">@mipmap/iv_splash_screen_brandingimage</item>
    <!-- 启动画面在关闭之前显示的时长。最长时间为 1000 毫秒。 -->
    <item name="android:windowSplashScreenAnimationDuration">1000</item>
</style>

```

需要注意，这些属性都是在Android 12系统上新增的，所以应该在一个values-v31的专属目录下使用。



### 闪屏延时

```kotlin

private var isReady = false

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    val contentView: View = findViewById(android.R.id.content)
    contentView.viewTreeObserver.addOnPreDrawListener(object : ViewTreeObserver.OnPreDrawListener {
        override fun onPreDraw(): Boolean {
            if (isReady) {
                contentView.viewTreeObserver.removeOnPreDrawListener(this)
            }
            return isReady
        }
    })
    thread {
        //延时2秒
        Thread.sleep(2000)
        isReady = true
    }
}
```





### 退出动画

启动画面动画机制由进入动画和退出动画组成：

- **进入动画**由系统视图到启动画面组成。这由系统控制且**不可自定义**。
- **退出动画由隐藏启动画面的动画运行组成**，可以对其自定义。当动画完成时，需要**手动移除启动画面**。

在代码中指定退出的动画

~~~kotlin
class MainActivity : AppCompatActivity() {

    @Volatile
    private var isReady = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val contentView: View = findViewById(android.R.id.content)
        contentView.viewTreeObserver.addOnPreDrawListener(object : ViewTreeObserver.OnPreDrawListener {
            override fun onPreDraw(): Boolean {
                if (isReady) {
                    contentView.viewTreeObserver.removeOnPreDrawListener(this)
                }
                return isReady
            }
        })
        thread {
            Thread.sleep(2000)
            isReady = true
        }

        splashScreenCloseAnimation()
    }

    private fun splashScreenCloseAnimation() {
        //添加一个回调，当启动画面为应用内容设置动画时调用。
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            splashScreen.setOnExitAnimationListener { splashScreenView: SplashScreenView ->
                val slideUp = ObjectAnimator.ofFloat(
                    splashScreenView,
                    View.TRANSLATION_Y,
                    0f, -splashScreenView.height.toFloat()
                )
                slideUp.interpolator = AnticipateInterpolator()
                slideUp.duration = 2000

                // 在自定义动画结束时调用splashScreenView.remove();
                slideUp.addListener(object : AnimatorListenerAdapter() {
                    override fun onAnimationEnd(animation: Animator) {
                        //移除启动画面
                        splashScreenView.remove()
                    }
                })
                // 启动动画
                slideUp.start()
            }
        }
    }

}
~~~



## SplashScreen 低版本适配

Android 12 是强制使用，如果不设置就使用默认应用图标。所以，如果代码中还保留着过去自己实现的那一套SplashScreen，在Android 12中就会出现双重SplashScreen的现象。

 添加依赖库

~~~groovy
dependencies {
    implementation 'androidx.core:core-splashscreen:1.0.0-alpha02'
}
~~~







## 相关资料

[Android 性能优化之启动优化](https://juejin.cn/post/7020245974962405412)
[Android 12 SplashScreen API快速入门](https://blog.csdn.net/guolin_blog/article/details/120275319?spm=1001.2014.3001.5501)
[Android 12 启动画面-SplashScreen](https://blog.csdn.net/g984160547/article/details/121117959)
