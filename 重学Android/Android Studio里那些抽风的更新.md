# Androd Studio 里那些抽风的更新



### git不显示git修改过的文件列表了

设置：`File | Settings | Version Control | Commit` 

去掉 user non-modal commit interface 前面的勾



https://weiku.co/article/634/



### 模拟器在新窗口打开

这个设置可以在`Preferences`-〉`Tools`-〉`Emulator`中找到。在那里你会发现一个名为`Launch in a tool window`的复选框。你需要取消选中它。下次你运行模拟器时，它会在Android Studio之外打开一个新窗口，但这个新窗口属于Android Studio

https://www.saoniuhuo.com/question/detail-2231684.html



### kapt报错

报错信息

~~~kotlin
'kaptGenerateStubsDebugKotlin' task (current target is 17) jvm target compat
~~~

新版的配置中kotlinOptions无效了

替换为

~~~groovy
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
//    kotlinOptions {
//        jvmTarget = '1.8'
//    }
    kotlin {
        jvmToolchain(8)
    }
~~~

https://blog.csdn.net/niuzhucedenglu/article/details/130542999

### 不生成BuildConfig

新版Androd Studio默认不生成BuildConfig



~~~kotlin
    buildFeatures{
        dataBinding = true
      	//生成BuildConfig
        buildConfig = true
    }
~~~

另外必须要使用jdk17

~~~kotlin
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
~~~

