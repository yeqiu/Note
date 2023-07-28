# 将 build 配置从 Groovy 迁移到 KTS

对kts不熟悉的话可以使用最新预览版的AndoriStudio创建一个工程，选择使用KotlinDLS构建。

这里直接贴代码

### settings.gradle.kts

~~~kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "KtsDemo"
include(":app")

~~~



### build.gradle.kts

~~~kotlin
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.1.0-rc01" apply false
    id("org.jetbrains.kotlin.android") version "1.8.0" apply false
}
~~~



### app下build.gradle.kts

~~~kotlin
//配置各个module共用的参数
//plugin在这里无效了，必须放到各个模块中声明
//apply plugin: 'kotlin-android'
//apply plugin: 'kotlin-kapt'

android {
    compileSdk 33

    defaultConfig {
        minSdk 24
        targetSdkVersion 33
        versionCode 1
        versionName "1.1.1"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles "consumer-rules.pro"


    }

    buildTypes {
        release {
            minifyEnabled false //混淆与否
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            //混淆脚本
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    buildFeatures {
        viewBinding = true
    }

}

dependencies {

    implementation("androidx.core:core-ktx:1.9.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.8.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.6.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.1")
    implementation("androidx.navigation:navigation-fragment-ktx:2.5.3")
    implementation("androidx.navigation:navigation-ui-ktx:2.5.3")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    implementation("com.google.code.gson:gson:2.10.1")


}
~~~



### 创建全局变量

以往在gradle中创建全局变量，可以在项目根目录下的build中使用ext也可以直接创建一个新文件。

~~~groovy
ext {
    android = [
            compileSdk               : 33,
            minSdk                   : 24,
            targetSdk                : 33,
            versionCode              : 1,
            versionName              : "1.0.0",
    ]
}
~~~

在kts中可以使用buildSrc

在项目根目录下创建buildSrc文件夹，在创建一个build.gradle.kts

~~~kotlin
plugins {
    `kotlin-dsl`
}
~~~

然后创建src目录，选择kotlin。就可以创建kotlin文件了

~~~kotlin
object Version {
    val versionCode = 1
    val versionName = "1.0"
}
~~~

这里创建了单例的Version，内部有两个变量。可以在kts的文件中使用

```kotlin
defaultConfig {
    applicationId = "com.yeqiu.ktsdemo"
    minSdk = 24
    targetSdk = 33
    //这里引用了全局变量
    versionCode = Version.versionCode
    versionName = Version.versionName
    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
}
```



### 关于通用的build文件

一般的商业项目中很创建很多module，通常会将多个module打包到一个app中。每个module都有自己的build文件，内部的配置大多也都差不多。这里可以直接创建一个通用的build，然后各个module引用这个文件。

使用kts我没有找到很好的办法。

 commonConfig.gradle 

~~~groovy
//这是一个gradle 文件
//配置各个module共用的参数
apply plugin: 'kotlin-android'
apply plugin: 'kotlin-kapt'



android {
    compileSdk 33

    defaultConfig {
        minSdk 24
        targetSdkVersion 33
        versionCode 1
        versionName "1.1.1"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles "consumer-rules.pro"


    }

    buildTypes {
        release {
            minifyEnabled false //混淆与否
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            //混淆脚本
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    buildFeatures {
        viewBinding = true
    }

}

dependencies {

    implementation("androidx.core:core-ktx:1.9.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.8.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.6.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.1")
    implementation("androidx.navigation:navigation-fragment-ktx:2.5.3")
    implementation("androidx.navigation:navigation-ui-ktx:2.5.3")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    implementation("com.google.code.gson:gson:2.10.1")
}
~~~

配置后可以在app或者其他的module中引用

app中引用公共配置，build里最终代码是这样的

~~~kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
}
apply(from = rootProject.file("commonConfig.gradle"))

android {
    namespace = "com.yeqiu.ktsdemo"

    defaultConfig {
        applicationId = "com.yeqiu.ktsdemo"
    }

}

dependencies {
}
~~~

