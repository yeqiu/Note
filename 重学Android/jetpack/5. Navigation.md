# Jetpack  Navigation的使用



#### 简介

[Navigation文档传送门](https://developer.android.google.cn/jetpack/androidx/releases/navigation?hl=zh-cn)

#### 主要元素

- Navigation Graph 导航图：xml资源文件，包含所有的页面，以及页面之间的跳转关机
- `NavHostFragment`：Fragmen容器，用来加载其他的Fragment。
- `NavController`：管理器，代码中使用完成导航图具体的切换工作。

三者之间的关系：

切换Fragment时，使用NavController，指定要跳转的Action。NavHostFragment根据导航图的关系切换Fragment。



#### 简单使用

1.创建对应的Fragment

2.创建导航图Navigation Graph，设定跳转关系

3.在Activity中添加NavHostFragment，就是一个普通的fragment，name指定为`androidx.navigation.fragment.NavHostFragment`

4.在Activity中使用导航

5.使用Navigation处理Fragment中的跳转



添加依赖：

```groovy
//navigation
"navigationFragment"            : "androidx.navigation:navigation-fragment-ktx:$nav_version",
"navigationUi"                  : "androidx.navigation:navigation-ui-ktx:$nav_version",
```



Navigation Graph 代码

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/test_navigation"
    app:startDestination="@id/homeFragment">

    <fragment
        android:id="@+id/homeFragment"
        android:name="com.yeqiu.jetpack.HomeFragment"
        android:label="fragment_home"
        tools:layout="@layout/fragment_home">
        <!--跳转导航-->
        <action
            android:id="@+id/action_homeFragment_to_secondFragment"
            app:destination="@id/secondFragment" />
    </fragment>

    <fragment
        android:id="@+id/secondFragment"
        android:name="com.yeqiu.jetpack.SecondFragment"
        android:label="fragment_second"
        tools:layout="@layout/fragment_second">
        <!--跳转导航-->
        <action
            android:id="@+id/action_secondFragment_to_homeFragment"
            app:destination="@id/homeFragment" />
    </fragment>

</navigation>
~~~

Activity 布局代码，

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent">


    <fragment
        android:id="@+id/nav_container"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:defaultNavHost="true"
        app:navGraph="@navigation/test_navigation" />

</androidx.constraintlayout.widget.ConstraintLayout>
~~~

请注意以下几点：

- `android:name` 一定要指定为androidx.navigation.fragment.NavHostFragment，或者它的子类。
- `app:navGraph` 属性将 `NavHostFragment` 与导航图相关联。导航图会在此 `NavHostFragment` 中指定用户可以导航到的所有目的地。
- `app:defaultNavHost="true"` 属性确保您的 `NavHostFragment` 会拦截系统返回按钮。请注意，只能有一个默认 `NavHost`。如果同一布局（例如，双窗格布局）中有多个宿主，请务必仅指定一个默认 `NavHost`。

Fragment跳转的关键代码

```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    view.findViewById<Button>(R.id.to_second).setOnClickListener {
        val navController = Navigation.findNavController(it)
        navController.navigate(R.id.action_homeFragment_to_secondFragment)
    }
}
```

在Fragment中获取NavController可以通过以下方式

```kotlin
val navController = findNavController()
//或者  val navController = NavHostFragment.findNavController(this)
navController.navigate(actionHomeFragmentToSecondFragment)
```



Activity中的代码

其实Activity中不需要添加任何代码，只需要指定`setContentView(R.layout.activity_navigation)`

如果需要兼容顶部导航栏的返回事件需要添加以下代码

```kotlin
class NavigationActivity1:AppCompatActivity() {

    lateinit var navController:NavController
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_navigation)

        navController = Navigation.findNavController(this, R.id.nav_container)
        NavigationUI.setupActionBarWithNavController(this,navController)

    }

    //导航栏事件交给 navController
    override fun onSupportNavigateUp(): Boolean {

        return navController.navigateUp()
    }
}
```

#### 动画效果

可以在导航图的action添加动画

~~~xml
    <action
            android:id="@+id/action_homeFragment_to_secondFragment"
            app:destination="@id/secondFragment"
            app:enterAnim="@anim/nav_default_enter_anim"
            app:exitAnim="@anim/nav_default_exit_anim"
            app:popEnterAnim="@anim/nav_default_pop_enter_anim"
            app:popExitAnim="@anim/nav_default_pop_exit_anim" />
~~~



#### 使用 Safe Args 传参

普通的传参就是通过Bundle

其实就是通过插件给传递的参数生成一些方法，减少参数写错的概率。

添加插件

在顶层 `build.gradle` 文件中包含以下 `classpath`

```groovy
// Top-level build file where you can add configuration options common to all sub-projects/modules.
//safe args
buildscript {
    dependencies {
        def nav_version = "2.5.3"
        classpath "androidx.navigation:navigation-safe-args-gradle-plugin:$nav_version"
    }
}

plugins {
    id 'com.android.application' version '7.4.1' apply false
    id 'com.android.library' version '7.4.1' apply false
    id 'org.jetbrains.kotlin.android' version '1.8.0' apply false
}
```

**应用或模块**的 `build.gradle` 文件中

```groovy
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'kotlin-kapt'
  	//safe args
    id 'androidx.navigation.safeargs.kotlin'
}
```

在导航图中添加参数，参数添加在需要参数的fragment标签中

~~~xml
    <fragment
        android:id="@+id/secondFragment"
        android:name="com.yeqiu.jetpack.SecondFragment"
        android:label="fragment_second"
        tools:layout="@layout/fragment_second">
        <!--跳转导航-->
        <action
            android:id="@+id/action_secondFragment_to_homeFragment"
            app:destination="@id/homeFragment" />
        <argument
            android:name="name"
            android:defaultValue="狗蛋"
            app:argType="string" />
        <argument
            android:name="age"
            android:defaultValue="18"
            app:argType="integer" />
    </fragment>
~~~

插件会自动代码，在传参时候调用

```kotlin
            val actionHomeFragmentToSecondFragment =
                HomeFragmentDirections.actionHomeFragmentToSecondFragment(
                    name = "李狗蛋",
                    age = 20
                )
            val navController = Navigation.findNavController(it)
//            navController.navigate(R.id.action_homeFragment_to_secondFragment)
            //直接把actionHomeFragmentToSecondFragment传给navigate
            navController.navigate(actionHomeFragmentToSecondFragment)
```

获取参数

~~~kotlin
        val args:SecondFragmentArgs by navArgs()
        args.name.log()
        args.age.toString().log()
~~~

具体文档参见官网 [传送门](https://developer.android.google.cn/guide/navigation/navigation-pass-data?hl=zh-cn#Safe-args)



#### PendingIntent跳转

创建通知通过PendingIntent跳转到fragment

```kotlin
private fun createNotification() {

    val channelId = "jetpack"
    val channelName = "jetpack"

    if (Build.VERSION.SDK_INT>=Build.VERSION_CODES.O){
        val notificationChannel = NotificationChannel(
            channelId,
            channelName,
            NotificationManager.IMPORTANCE_DEFAULT
        ).apply {
            description = "这是一个通知"
        }
        val notificationManager = requireActivity().getSystemService(NotificationManager::class.java)
        notificationManager.createNotificationChannel(notificationChannel)
    }
    
    val notification = NotificationCompat.Builder(requireActivity(), channelId)
        .setSmallIcon(R.mipmap.ic_launcher)
        .setContentTitle("点击跳转")
        .setContentText("点击跳转")
        .setPriority(NotificationManager.IMPORTANCE_DEFAULT)
        .setContentIntent(getPendingIntent())
        .build()

    val notificationManagerCompat = NotificationManagerCompat.from(requireActivity())
    if (ActivityCompat.checkSelfPermission(
            requireActivity(),
            Manifest.permission.POST_NOTIFICATIONS
        ) != PackageManager.PERMISSION_GRANTED
    ) {
        "请先开启通知权限".log()
        return
    }
    notificationManagerCompat.notify(1,notification)
}

private fun getPendingIntent(): PendingIntent {
    
    val navController = findNavController()
    return navController
        .createDeepLink()
        .setGraph(R.navigation.test_navigation)
        .setDestination(R.id.secondFragment)
        .createPendingIntent()

}
```

#### DeepLink跳转

1.在导航图中添加

```xml
<fragment
    android:id="@+id/secondFragment"
    android:name="com.yeqiu.jetpack.SecondFragment"
    android:label="fragment_second"
    tools:layout="@layout/fragment_second">
    <!--跳转导航-->
    <action
        android:id="@+id/action_secondFragment_to_homeFragment"
        app:destination="@id/homeFragment" />
    <argument
        android:name="name"
        android:defaultValue="狗蛋"
        app:argType="string" />
    <argument
        android:name="age"
        android:defaultValue="18"
        app:argType="integer" />
    <!--DeepLink配置-->
    <deepLink app:uri="https://github.com/yeqiu/" />
</fragment>
```

2.activity的清单文件配置

```xml
<activity android:name="com.yeqiu.jetpack.NavigationActivity1"
    android:exported="true">
    <nav-graph android:value="@navigation/test_navigation"/>
</activity>
```

[相关博客](https://blog.csdn.net/qq_26460841/article/details/124531340)









