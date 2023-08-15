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

### 关于navigateUp()

navigateUp()并不完全等于返回键

`navigateUp()` 方法的默认行为是尝试返回到上一级目的地，如果没有上一级目的地，则不会执行任何操作。



## popUpTo 和 popUpToInclusive

`popUpTo` 和 `popUpToInclusive` 是用于控制导航回退行为的属性。结合使用，可以定义当用户导航回指定目的地时，应该如何处理导航堆栈。

- `popUpTo`: 指定导航回退到那个目的地。

- `popUpToInclusive`: 默认情况下，`popUpTo` 的值为目标目的地的 ID，而 `popUpToInclusive` 的值为 `false`。当 `popUpToInclusive` 配合popUpToInclusive使用，如果为false 的话，不销毁原的目的地实例，会导致有两个。





## 原理解析

### 导航图是如何被加载的



### 默认启动页如何被加载的



### 为什么fragment切换回导致生命周期重建



