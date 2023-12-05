

[toc]

# Android Studio 的一些技巧





## 快捷键



### 打开最近文件

`command`+`E`

### 跳回调用处

`command`+`option`+`left`

### 移动行

`command`+`shift` + 上/下













## 其他

### 导出jar

~~~groovy
    //生成jar包
    task exportJar(type: Copy) {
        delete 'build/outputs/libs/screenRecordingHelper.jar'
        from('build/intermediates/compile_library_classes_jar/release/') //jar文件来源
        into('build/outputs/libs/') //生成路径
        include('classes.jar')
        rename('classes.jar', 'screenRecordingHelper.jar') //命名
    }

    exportJar.dependsOn(build)
~~~

添加命令到 android 下，与defaultConfig，buildTypes 同级。直接运行这个task即可生成。



不同Android Studio版本存放jar的位置不同，我这里使用的是`Android Studio Electric Eel | 2022.1.1 Patch 2`



### 自动打包(sh命令)

app内gradle文件配置密钥，打包参数等

~~~groovy
plugins{
    id 'com.android.application'
}

def cfg = rootProject.ext

android {
    compileSdk cfg.android.compileSdk

    defaultConfig {
        applicationId cfg.applicationid.app
        minSdk cfg.android.minSdk
        targetSdk cfg.android.targetSdk
        versionCode cfg.android.versionCode
        versionName cfg.android.versionName
        flavorDimensions "bszh"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        ndk {
            //选择要添加的对应 cpu 类型的 .so 库。
            abiFilters 'armeabi-v7a'
            // 还可以添加 'x86', 'x86_64', 'mips', 'mips64'
        }
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    viewBinding {
        enabled = true
    }


    signingConfigs {
        release {
            storeFile file("./keystore.jks")
            storePassword "111111"
            keyAlias "key0"
            keyPassword "111111"
        }
    }

    //渠道
    productFlavors {
        bszh {
            signingConfig signingConfigs.release
        }
    }

    //渠道变量名
    productFlavors.all { flavor ->
        flavor.manifestPlaceholders = [CHANNEL_NAME: name]
    }


    applicationVariants.all { variant ->
        variant.outputs.all {

            def buildType = variant.buildType.isDebuggable()?"debug":"release"
//            def fileName = "LearningMachine_${buildType}_v${variant.versionName}_c${variant.versionCode}.apk"
            def fileName = "智学伴学习机_${buildType}_v${variant.versionName}_c${variant.versionCode}.apk"
            outputFileName = fileName
        }
    }
}

//获取当前时间
def getCurrentTime() {
    return new Date().format("yyyy-MM-dd", TimeZone.getTimeZone("UTC"))
}


dependencies {

    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.3'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.4.0'

    implementation project(path: ':lib:bszhLibrary')

    if (!cfg.isDebug){
        implementation project(path: ':core:launcher')
        implementation project(path: ':core:learn')
        implementation project(path: ':core:login')
        implementation project(path: ':core:user')
        implementation project(path: ':core:web')
    }

}
~~~

sh脚本

~~~sh
echo "============================== "
echo "============================== "
echo "============================== "
echo " "
echo "======>  it's about to start build  LearningMachine.apk "
# 打开指定项目
cd /Users/yeqiu/WorkSpace/Bszh/LearningMachine/app || exit
echo "======>  start clear cache"
# 删除之前的文件
rm -r -f build || exit
rm -r -f /Users/yeqiu/Desktop/LearningMachine_APK/App || exit
echo "======>  start packing ..."
echo " "
# 开始打包
gradle assembleRelease || exit
# 创建目标apk目录
mkdir /Users/yeqiu/Desktop/LearningMachine_APK/App || exit
# 复制apk到指定文件夹
cp build/outputs/apk/bszh/release/*.apk /Users/yeqiu/Desktop/LearningMachine_APK//App || exit
# 清除build
rm -r -f build || exit

echo "============================== "
echo "======> pack successfully !!!"
echo "============================== "
echo " "
~~~











https://juejin.cn/post/7020411126022144014
