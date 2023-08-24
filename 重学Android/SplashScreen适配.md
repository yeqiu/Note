# SplashScreen适配

## Android12以上

可以直接使用

### 新建values-v31文件夹，创建主题

~~~xml
    <style name="Theme.App.Starting" parent="Theme.SplashScreen.IconBackground">
        <!--界面的背景颜色-->
        <item name="android:windowSplashScreenBackground">@color/white</item>
        <!--中间图标-->
        <item name="android:windowSplashScreenAnimatedIcon">@drawable/ic_launcher_foreground</item>
        <!--「启动画面」中心图标后面设置背景-->
        <item name="android:windowSplashScreenIconBackgroundColor">@color/green</item>
        <!--「启动画面」中心图标动画的持续时间，这个属性不会对屏幕显示的实际时间产生任何影响-->
        <item name="android:windowSplashScreenAnimationDuration">1000</item>
        <!--「启动画面」底部显示的品牌图标-->
        <item name="android:windowSplashScreenBrandingImage">@drawable/ic_brand</item>
        <!-- 当SplashScreen结束时，恢复到app主题-->
        <item name="postSplashScreenTheme">@style/Theme.App</item>
    </style>
~~~

主题要继承自`Theme.SplashScreen.IconBackground`

### 创建一个启动页Activity

**注意：Activity需要继承ComponentActivity**

```kotlin
class SplashScreenActivity : ComponentActivity(), SplashScreen.OnExitAnimationListener {
    
    private var isReady = false
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val splashScreen = installSplashScreen()
        val content = findViewById<View>(android.R.id.content)
      	//静态的无需处理
        splashScreen.setOnExitAnimationListener(this)
        //这里是为了延时
        content.viewTreeObserver.addOnPreDrawListener(object : ViewTreeObserver.OnPreDrawListener {
            override fun onPreDraw(): Boolean {
                if (isReady) {
                    content.viewTreeObserver.removeOnPreDrawListener(this)
                    startActivity(Intent(this@SplashScreenActivity, MainActivity::class.java))
                    finish()
                }
                return isReady
            }
        })

        //模拟延时
        thread {
            Thread.sleep(3000)
            isReady = true
        }
    }

    /**
     * 闪屏结束后，处理动画，没有动画可以不处理
     * @param splashScreenViewProvider SplashScreenViewProvider
     */
    override fun onSplashScreenExit(splashScreenViewProvider: SplashScreenViewProvider) {
  
        //如果在themes.xml中配置了：静态背景, 改成true看效果
        val flag = false
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R || flag) {
            // 使用alpha透明度动画过渡
            val splashScreenView = splashScreenViewProvider.view
            val endAlpha = if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) 0F else -2F
            val alphaObjectAnimator =
                ObjectAnimator.ofFloat(splashScreenView, View.ALPHA, 1F, endAlpha)
            alphaObjectAnimator.duration = 500L
            alphaObjectAnimator.interpolator = FastOutLinearInInterpolator()
            alphaObjectAnimator.doOnEnd {
                splashScreenViewProvider.remove()
            }
            alphaObjectAnimator.start()
            return
        }

        //下面是所有使用动态背景的，我们让中心图标做一个动画然后离开
        val splashScreenView = splashScreenViewProvider.view
        val iconView = splashScreenViewProvider.iconView
        val isCompatVersion = Build.VERSION.SDK_INT < Build.VERSION_CODES.R
        val slideUp = ObjectAnimator.ofFloat(
            iconView,
            View.TRANSLATION_Y,
            0f,
            -splashScreenView.height.toFloat()
        )
        slideUp.interpolator = AnticipateInterpolator()
        slideUp.duration = if (isCompatVersion) 1000L else 200L
        slideUp.doOnEnd {
            splashScreenViewProvider.remove()
        }
        if (isCompatVersion) {
            //低版本的系统，图标动画完成后关闭
            waitForAnimatedIconToFinish(splashScreenViewProvider, splashScreenView, slideUp)
        } else {
            slideUp.start()
        }
    }

    private fun waitForAnimatedIconToFinish(
        splashScreenViewProvider: SplashScreenViewProvider,
        view: View,
        animator: Animator
    ) {
        val delayMillis: Long = (
                splashScreenViewProvider.iconAnimationStartMillis +
                        splashScreenViewProvider.iconAnimationDurationMillis
                ) - System.currentTimeMillis()
        view.postDelayed(delayMillis) {
            animator.start()
        }
    }   
}
```

### 应用主题

```xml
<activity
    android:name=".SplashScreenActivity"
    android:theme="@style/Theme.App.Starting"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

## android5.0 ~ android11

低版本的需要使用兼容库

### 添加依赖

```kotlin
implementation("androidx.core:core-splashscreen:1.1.0-alpha01")
```

### 创建启动图

这里最好使用一张静态图片

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android"
    android:opacity="opaque">

    <item android:drawable="@color/white"/>    
    <item
        android:width="100dp"
        android:height="100dp"
        android:drawable="@drawable/ic_launcher_foreground"
        android:gravity="center"/>
    <item
        android:top="200dp"
        android:width="100dp"
        android:height="100dp"
        android:drawable="@drawable/ic_brand"
        android:gravity="bottom|center"
        android:bottom="50dp"/>
</layer-list>
```

### 创建主题

```xml
<!--android5.0 ~ android11-->
<style name="Theme.App.Starting" parent="Theme.SplashScreen.IconBackground">
    <!--这里主要是针对6.0以下设备，让导航栏能看清楚-->
    <item name="android:navigationBarColor">@color/white</item>
    <!--给父主题设置窗口背景-->
    <item name="android:windowBackground">@drawable/ic_splash_screen_window_bg</item>
    <!--使用透明的drawable替换中心图标，如果不替换在部分旧系统会展示一个机器人-->
    <item name="windowSplashScreenAnimatedIcon">@drawable/ic_transparent_svg</item>
    <!--需要配置，不配置的话，启动页消失到主页显示的时候，有个过渡动画，会闪这个颜色的背景色-->
    <item name="windowSplashScreenBackground">@color/white</item>
    <item name="windowSplashScreenAnimationDuration">200</item>
    <item name="postSplashScreenTheme">@style/Theme.App</item>
</style>
```

### 创建启动页Activity并配置主题

这个步骤和上面Android12是一样的



## 添加广告

- 可以在onSplashScreenExit中创建一个广告的view，添加到splashScreenViewProvider中

~~~kotlin
    override fun onSplashScreenExit(splashScreenViewProvider: SplashScreenViewProvider) {
        
        if (splashScreenViewProvider.view is ViewGroup) {
            val adView = layoutInflater.inflate(R.layout.layout_ad, null, false)
            adView.findViewById<Button>(R.id.bt_skip).setOnClickListener {
                splashScreenViewProvider.remove()
                startActivity(Intent(this@SplashScreenActivity, MainActivity::class.java))
                finish()
            }
            (splashScreenViewProvider.view as ViewGroup).addView(adView)
            return
        }
    }
~~~

- 也可以根据逻辑直接跳转到广告的Activity中



## 关于图标裁剪变形

使用`windowSplashScreenAnimatedIcon`如果发现图标变形，可能是因为没有做图标的适配。具体看这篇博客[Android应用图标微技巧，8.0系统中应用图标的适配](https://guolin.blog.csdn.net/article/details/79417483)







## 相关资源

[正确实践Jetpack SplashScreen API —— 在所有Android系统上使用总结，内含原理分析](https://juejin.cn/post/7019839767441309733#heading-15)
[从 Jetpack SplashScreen 深度探讨 App 启动画面的前世今生～](https://juejin.cn/post/7044713406774902820)
