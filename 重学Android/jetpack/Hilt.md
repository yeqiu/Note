# Jetpack Hilt的使用

## 简介

[Hilt文档传送门](https://developer.android.google.cn/jetpack/androidx/releases/hilt?hl=zh-cn)

[Jetpack新成员，一篇文章带你玩转Hilt和依赖注入](https://blog.csdn.net/guolin_blog/article/details/109787732)

## 简单使用(ViewModel中注入Repository)

我主要是在ViewModel中使用Hilt自动注入Repository

1.添加依赖

添加 plugins

```kotlin
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.1.0-rc01" apply false
    id("org.jetbrains.kotlin.android") version "1.8.0" apply false
    id("com.android.library") version "8.1.0-rc01" apply false
    //hilt
    id("com.google.dagger.hilt.android") version "2.46.1" apply false
}
```

添加依赖和kapt

~~~kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
    //hilt
    id("com.google.dagger.hilt.android")
}
~~~

~~~kotlin
    //hilt
    implementation("com.google.dagger:hilt-android:2.46.1")
    kapt("com.google.dagger:hilt-android-compiler:2.46.1")
~~~



2.代码

Repository的构造函数使用@Inject

```kotlin
class MainRepository @Inject constructor(){
    fun getAccount():String{
        val account by MMKV("")
        return account
    }
}
```

ViewModel类使用@HiltViewModel注解，构造函数使用@Inject

```kotlin
@HiltViewModel
class MainViewModel @Inject constructor(val repository: MainRepository) :ViewModel() {
    
    fun getAccount()=repository.getAccount()
    
}
```



在Activity中使用@AndroidEntryPoint注解，正常创建viewModel即可

```kotlin
@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
     val  viewModel: MainViewModel by viewModels()
}
```

**要注意App中也需要添加注解@HiltAndroidApp**

~~~kotlin
@HiltAndroidApp
class App:Application() {

    override fun onCreate() {
        super.onCreate()
    }

}
~~~











