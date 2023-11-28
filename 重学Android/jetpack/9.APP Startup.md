# Jetpack App Startup的使用



## 简介

[Android Jetpack 开发套件](https://juejin.cn/post/6898738809895125006)

[Jetpack新成员，App Startup一篇就懂](https://blog.csdn.net/guolin_blog/article/details/108026357?ops_request_misc=&request_id=a183f941534f4666beffcee5540ed294&biz_id=&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~koosearch~default-1-108026357-null-null.268^v1^control&utm_term=startup&spm=1018.2226.3001.4450)

## 简单使用

主要适用于依赖库内部自动初始化，内部使用ContentProvider来实现。

1.实现App Startup库的Initializer接口

~~~kotlin
class EasyAndroidInitializer:Initializer<Unit> {

    override fun create(context: Context) {
        EasyAndroid.init(context)
    }

    override fun dependencies(): List<Class<out Initializer<*>>> {
        return emptyList()
    }
}
~~~

dependencies()方法表示，是否还依赖于其他的初始化，如果有的话，就在这里进行配置，App Startup会保证先初始化依赖的Initializer，然后才会初始化当前的EasyAndroidInitializer。不需要的话直接返回一个emptyList()。



2.配置到AndroidManifest.xml当中

~~~xml
    <application>

        <provider
            android:name="androidx.startup.InitializationProvider"
            android:authorities="${applicationId}.androidx-startup"
            android:exported="false"
            tools:node="merge">
            <meta-data
                android:name="com.yeqiu.easyandroid.init.EasyAndroidInitializer"
                android:value="androidx.startup" />
        </provider>
        
    </application>
~~~

上述配置，我们能修改的地方并不多，只有meta-data中的android:name部分我们需要指定成我们自定义的Initializer的全路径类名，其他部分都是不能修改的。

当App启动的时候会自动执行App Startup库中内置的ContentProvider，并在它的ContentProvider中会搜寻所有注册的Initializer，然后逐个调用它们的create()方法来进行初始化操作。

## 延时初始化

在app的清单文件中

~~~xml
<application ...>

	<provider
		android:name="androidx.startup.InitializationProvider"
		android:authorities="${applicationId}.androidx-startup"
		android:exported="false"
		tools:node="merge">
		<meta-data
			android:name="com.yeqiu.easyandroid.init.EasyAndroidInitializer"
			tools:node="remove" />
	</provider>
	
</application>

~~~

仅仅在的meta-data当中加入了一个tools:node="remove"的标记。这样打包后appstartup机会忽略EasyAndroidInitializer，之后需要手动初始化调用

~~~kotlin
   AppInitializer.getInstance(this)
            .initializeComponent(EasyAndroidInitializer::class.java)
~~~

### 







