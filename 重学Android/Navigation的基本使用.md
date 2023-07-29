# Navigation的基本使用

## 基本使用

1.创建fragment和导航文件

创建fragment代码就不展示了

创建导航文件

1. 在“Project”窗口中，右键点击 `res` 目录，然后依次选择 **New > Android Resource File**。此时系统会显示 **New Resource File** 对话框。
2. 在 **File name** 字段中输入名称，例如“nav_graph”。
3. 从 **Resource type** 下拉列表中选择 **Navigation**，然后点击 **OK**。

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/nav_main"
    app:startDestination="@id/main">
    <fragment
        android:id="@+id/main"
        android:name="com.yeqiu.navigationapp.MainFragment">
    </fragment>

    <fragment
        android:id="@+id/login"
        android:name="com.yeqiu.navigationapp.LoginFragment">
    </fragment>

    <activity
        android:id="@+id/register"
        android:name="com.yeqiu.navigationapp.RegisterActivity" />
</navigation>
~~~

导航文件中创建了三个目的地，默认展示main



2.Activity设置

activity布局

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/nav_container"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:defaultNavHost="true"
        app:navGraph="@navigation/nav_main" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

`  app:defaultNavHost="true"`表示将返回键交给Navigation处理，请注意，只能有一个默认 `NavHost`。如果同一布局（例如，双窗格布局）中有多个宿主，请务必仅指定一个默认 `NavHost`。

` app:navGraph="@navigation/nav_main" `指定导航图



MainActivity

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        (supportFragmentManager.findFragmentById(R.id.nav_container) as NavHostFragment).navController
    }
}
```

如果xml中使用fragment，可以直接使用

```kotlin
Navigation.findNavController(this,R.id.nav_container)
```

关于 报错does not have a NavController set on 可以看这个 [Android Navigation 报错does not have a NavController set on xxxxx 解决方案](https://blog.csdn.net/linminghuo/article/details/119000601)



3.跳转事件

```kotlin
        binding.btLogin.setOnClickListener {
            findNavController().navigate(R.id.main_to_login)
        }
```



## Fragment添加切换动画

1.在导航图中指定跳转动画

~~~xml
    <fragment
        android:id="@+id/main"
        android:name="com.yeqiu.navigationapp.MainFragment">
        <action
            android:id="@+id/main_to_login"
            app:destination="@+id/login"
            app:enterAnim="@anim/right_in"
            app:exitAnim="@anim/left_out"
            app:popEnterAnim="@anim/right_out"
            app:popExitAnim="@anim/left_in" />
    </fragment>
~~~



2.代码中配置

```kotlin
binding.btLogin.setOnClickListener {
    val navOptions = NavOptions.Builder()
        .setEnterAnim(R.anim.right_in)
        .setExitAnim(R.anim.left_out)
        .setPopEnterAnim(R.anim.right_out)
        .setPopEnterAnim(R.anim.left_in)
        .build()

    findNavController().navigate(
        resId = R.id.main_to_login, 
        args = null,
        navOptions = navOptions
    )
}
```



Fragment无法配置跳转到Activity的动画

## Fragment回退

```kotlin
binding.btBack.setOnClickListener {
    //模拟用户按下返回键，导航回到上一个目的地
    findNavController().navigateUp()
    //一次性返回到特定的目的地，并清除返回路径上的其他目的地
    findNavController().popBackStack()
    
    //返回上一页可使用 navigateUp()
}
```

## popUpTo 和 popUpToInclusive

`popUpTo` 和 `popUpToInclusive` 是用于控制导航回退行为的属性。结合使用，可以定义当用户导航回指定目的地时，应该如何处理导航堆栈。

- `popUpTo`: 指定导航回退到那个目的地。

- `popUpToInclusive`: 默认情况下，`popUpTo` 的值为目标目的地的 ID，而 `popUpToInclusive` 的值为 `false`。当 `popUpToInclusive` 配合popUpToInclusive使用，如果为false 的话，不销毁原的目的地实例，会导致有两个。



## 元素共享

### fragment to fragment

xml布局中设置transitionName，目标页面也需要设置相同的transitionName

```xml
<ImageView
    android:id="@+id/iv_img"
    android:layout_width="50dp"
    android:layout_height="50dp"
    android:transitionName="image"
    android:src="@mipmap/ic_launcher_round"/>
```

代码中设置

```kotlin
binding.btLogin.setOnClickListener {

    //共享元素
    val extras = FragmentNavigatorExtras(binding.ivImg to "image")

    //跳转动画
    val navOptions = NavOptions.Builder()
        .setEnterAnim(R.anim.right_in)
        .setExitAnim(R.anim.left_out)
        .setPopEnterAnim(R.anim.right_out)
        .setPopEnterAnim(R.anim.left_in)
        .build()

    findNavController().navigate(
        resId = R.id.main_to_login,
        args = null,
        navOptions = navOptions,
        navigatorExtras = extras
    )
}
```

目标的fragment中设置

```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    binding.tvName.text = "登录 ${formatCurrentTime()}"


    sharedElementEnterTransition = TransitionInflater.from(requireContext())
        .inflateTransition(R.transition.shared_image)

}
```

### fragment to activity

布局设置同上，代码中构建 ActivityNavigator.Extras

```kotlin
binding.btRegister.setOnClickListener {
    //共享元素
    val activityOptionsCompat = ActivityOptionsCompat.makeSceneTransitionAnimation(
        requireActivity(),
        Pair(binding.ivImg, "image")
    )
    val extras: ActivityNavigator.Extras = ActivityNavigator.Extras.Builder()
        .setActivityOptions(activityOptionsCompat)
        .build()

    findNavController().navigate(
        resId = R.id.main_to_register,
        args = null,
        navOptions = null,
        navigatorExtras = extras
    )
}
```

目标页面无需代码设置，只需要在xml中设置transitionName

## SafeArgs 传参

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

1.目的地添加参数

```xml
<fragment
    android:id="@+id/login"
    android:name="com.yeqiu.navigationapp.LoginFragment">

    <action
        android:id="@+id/login_to_register"
        app:destination="@+id/register" />

    <action
        android:id="@+id/login_to_user"
        app:destination="@+id/user" />

    <argument
        android:name="name"
        android:defaultValue="狗蛋"
        app:argType="string" />
    <argument
        android:name="age"
        android:defaultValue="18"
        app:argType="integer" />
    
</fragment>
```

2.同步代码，通过生成的对象来设置参数

```kotlin
//参数 MainFragmentDirections是生成的类
val mainToLogin = MainFragmentDirections.mainToLogin("这是一个名字", 20)
//跳转动画
val navOptions = NavOptions.Builder()
    .setEnterAnim(R.anim.right_in)
    .setExitAnim(R.anim.left_out)
    .setPopEnterAnim(R.anim.right_out)
    .setPopEnterAnim(R.anim.left_in)
    .build()
//共享元素
val extras = FragmentNavigatorExtras(binding.ivImg to "image")

findNavController().navigate(
    mainToLogin.actionId,
    mainToLogin.arguments,
    navOptions,
    extras
)
//如果不需要其他的，直传递参数可以使用
findNavController().navigate(mainToLogin)
```

3.接受参数

```kotlin
val LoginFragmentArgs by navArgs<LoginFragmentArgs>()
binding.tvData.text = "参数 = ${LoginFragmentArgs.name},${LoginFragmentArgs.age}"
```



## 配合BootomNavigationView

activity 布局中配置

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.fragment.app.FragmentContainerView
        android:id="@+id/wechat_nav_host"
        android:name="androidx.navigation.fragment.NavHostFragment"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        app:defaultNavHost="true"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toTopOf="@id/wechat_bottom_tab"
        app:navGraph="@navigation/nav_wechat" />


    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/wechat_bottom_tab"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:menu="@menu/wechat_menu"
        android:background="@color/white"
        app:layout_constraintTop_toBottomOf="@+id/wechat_nav_host"
        app:layout_constraintBottom_toBottomOf="parent"
        />
    
</androidx.constraintlayout.widget.ConstraintLayout>
```

**注意：menu中item的id一定要和navGraph中的fragment的id一致**

代码中设置

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_wechat)

    val navHostFragment =
        supportFragmentManager.findFragmentById(R.id.wechat_nav_host) as NavHostFragment
    val bottomNavigationView = findViewById<BottomNavigationView>(R.id.wechat_bottom_tab)
    bottomNavigationView.setupWithNavController(navHostFragment.navController)

}
```



## DialogFragment

和普通的fragment用法差不多，只不过在导航图声明时使用dialog标签

```xml
<dialog
    android:id="@+id/dialog"
    android:name="com.yeqiu.navigationapp.SimpleDialogFragment" />
```