# 发布lib到jitpack

## 1.创建android项目和lib

## 2.lib的build中添加`maven-publish`插件

~~~kotlin
plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
    // 引入 maven 插件
    id("maven-publish")
}
~~~

~~~kotlin
// 发布配置
publishing {
    publications {
        register<MavenPublication>("release") {
            //仅仅只是本地测试使用，jitpack不会使用
            groupId = "com.github.yeqiu"
            artifactId = "jitpackLib"
            version = "1.0.0"
            afterEvaluate { // 在所有的配置都完成之后执行
                // 从当前 module 的 release 包中发布
                from(components["release"])
            }
        }
    }
}
~~~

lib build完整代码

```kotlin
plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
    // 引入 maven 插件
    id("maven-publish")
}

android {
    namespace = "com.yeqiu.lib"
    compileSdk = 33
    defaultConfig {
        minSdk = 24
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles("consumer-rules.pro")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    //这里我使用的是 jdk17
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }
}

dependencies {

    implementation("androidx.core:core-ktx:1.9.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.9.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}

// 发布配置
publishing {
    publications {
        register<MavenPublication>("release") {
            //仅仅只是本地测试使用，jitpack不会使用
            groupId = "com.github.yeqiu"
            artifactId = "jitpackLib"
            version = "1.0.0"
            afterEvaluate { // 在所有的配置都完成之后执行
                // 从当前 module 的 release 包中发布
                from(components["release"])
            }
        }
    }
}
// com.github.yeqiu:jitpackLib:1.0.0
```

## 3.发布到本地测试

通过publishToMavenLocal发布到本地仓库

~~~java
...
> Task :lib:generateMetadataFileForReleasePublication
> Task :lib:publishReleasePublicationToMavenLocal
> Task :lib:publishToMavenLocal

BUILD SUCCESSFUL in 5s
25 actionable tasks: 25 executed
~~~

发布成功后在本地电脑 /Users/用户名/.m2/repository/目录下。

此时可以使用本地仓库测试，在项目settings文件下配置

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        //本地仓库
        mavenLocal()
        //jitpack
        maven { setUrl("https://jitpack.io") }
    }
}
```

在app中添加依赖，测试通过后就可以准备上传代码

## 4.添加jitpack配置文件

项目根目录下添加`jitpack.yml`文件，我这里指定使用jkd17

```yaml
before_install:
  - sdk install java 17.0.3-open
  - sdk use java 17.0.3-open

jdk:
  - openjdk17
```

## 5.上传代码到github，添加Releases

上传代码到github，具体操作参考 https://blog.csdn.net/JKL852qaz/article/details/81204085

## 6.在jitpack上发布

使用github账号登录[jitpack](https://www.jitpack.io/)，找到对应的仓库。当builds标签下指定版本的log loading完成就能使用了。编译时log是会转圈，等到编译是一个绿色的文件图标，如果是红色的表示编译错误。

编译完成后，在需要添加依赖的项目中添加jitpack的仓库，就可以使用了。



[demo传送门](https://github.com/yeqiu/JitpackLib)





