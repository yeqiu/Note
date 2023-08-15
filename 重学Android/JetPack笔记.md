##  JetPack笔记



[toc]



### 官网

[官网](https://developer.android.google.cn/jetpack/androidx/explorer?hl=zh-cn)



### Lifecycle

#### 简介

用于共享组件生命生命周期,[Lifecycle文档传送门](https://developer.android.google.cn/jetpack/androidx/releases/lifecycle?hl=zh-cn)

####  使用Lifecycle解耦页面和组件

以下案例是一个自动感知页面Resume和Stop的计时器。

~~~kotlin
class LifecycleChronometer @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : Chronometer(context, attrs, defStyleAttr),DefaultLifecycleObserver {

    private var elapsedTime = 0L

    override fun onResume(owner: LifecycleOwner) {
        super.onResume(owner)
        base = SystemClock.elapsedRealtime()-elapsedTime
        start()
    }


    override fun onStop(owner: LifecycleOwner) {
        super.onStop(owner)
        elapsedTime = SystemClock.elapsedRealtime() - base
        stop()
    }
}
~~~

页面中使用

~~~kotlin
    override fun init() {
        lifecycle.addObserver(viewBind.chronometer)
    }

~~~



#### @OnLifecycleEvent 过时

`@OnLifecycleEvent`已经过时，官方推荐使用 DefaultLifecycleObserver 或者 LifecycleEventObserver 

上例中使用DefaultLifecycleObserver

LifecycleEventObserver：只有一个方法，在任意生命周期触发都会执行

~~~kotlin
public interface LifecycleEventObserver extends LifecycleObserver {
    /**
     * Called when a state transition event happens.
     *
     * @param source The source of the event
     * @param event The event
     */
    void onStateChanged(@NonNull LifecycleOwner source, @NonNull Lifecycle.Event event);
}

~~~



#### 使用LifecycleService接口Service组件

需要添加依赖

~~~groovy
"lifecycleService"  : "androidx.lifecycle:lifecycle-service:2.5.1",
~~~

作用就是让Service可以添加观察者，使用方法和上例一样。以下是一个简单打印日志的例子

~~~kotlin
class TestLifecycleService:LifecycleService() {
    
    init {
        lifecycle.addObserver(LifecycleServiceLog())
    }
    
    class LifecycleServiceLog:LifecycleEventObserver{
        override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
            "TestLifecycleService 生命周期变化：$event".log()
        }
    }
}
~~~

**注意：**一定要添加`lifecycle.addObserver(LifecycleServiceLog())`，否者Lifecycle观察者不生效



#### 使用ProcessLifecycleOwner监听应用生命周期

作用就是让Application可以添加观察者，使用方法差不多

**注意点：**

- 监听整个应用程序的生命周期，与Activity无关
- *ON_CREATE*只会调用一遍，*ON_DESTROY*永远不会调用，*ON_STOP*会在应用退出到后台调用

例

需要添加依赖

~~~groovy
    "lifecycleProcess": "androidx.lifecycle:lifecycle-process:$lifecycle_version",
~~~

~~~kotlin
class App : Application() {

    override fun onCreate() {
        super.onCreate()
        //添加生命周期监听
        ProcessLifecycleOwner
            .get()
            .lifecycle
            .addObserver(AppLifecycleObserver())
    }
    
    class AppLifecycleObserver : LifecycleEventObserver {
        override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
            //ON_DESTROY不会执行
            "Application 生命周期变化：$event".log()
        }
    }
}
~~~



### ViewModel

#### 简介

介于view和model之间的桥梁，可以使数据和视图分离，也能保持通信

ViewModel的生命周期要比Activity的长很多，所以ViewModel的数据不受Activity的一些瞬态的影响，例如旋转屏幕。当Activity被真正销毁的时候，ViewModel会将资源进行回收。





使用示例：

~~~kotlin
    override fun init() {
        //创建 ViewModel
        val testViewModel = ViewModelProvider(this).get(TestViewModel::class.java)
        viewBind.button.text = testViewModel.number.toString()
        viewBind.button.setOnClickListener {
            viewBind.button.text = (++testViewModel.number).toString()
        }
    }
    
    class TestViewModel:ViewModel(){
        var number = 0
    }
~~~

**注意点**

不要像ViewModel中传入Context，因为ViewModel的生命周期要比Activity的长很多，可能会引起内存泄露。如果使用Context请使用 Application

~~~kotlin
    class TestViewModel(app:Application):AndroidViewModel(app){
        var number = 0
    }
~~~

ViewModel 通常也可以作为fragment之间共享数据使用。



### LiveData

#### 简介

LiveData是一种可观察的数据存储器类，它具有生命周期感知能力，可确保LiveData仅更新处于活跃生命周期的应用组件观察者。

LiveData通常和ViewModel配合使用，当数据发生变化，可以通知view更新。

使用示例：

~~~kotlin
    override fun init() {
        val testViewModel = ViewModelProvider(this).get(TestViewModel::class.java)
        //修改LiveData的value
        viewBind.button.setOnClickListener {
            //UI线程可以直接给LiveData的value赋值
            testViewModel.number.value =  testViewModel.number.value?.plus(1)
            //非UI线程需要使用postValue来赋值
           //testViewModel.number.postValue(1)
        }
        //监听LiveData数据的变化
        testViewModel.number.observe(this) { t ->
            viewBind.button.text = t.toString()
        }
    }

    class TestViewModel(app:Application):AndroidViewModel(app){
        val number by lazy {
           val liveData =  MutableLiveData<Int>()
            liveData.value= 0
            liveData
        }
    }
~~~



#### liveData.value 返回值是一个可空类型的，每次使用都需要做非空的判断

在使用 MutableLiveData 时，通过 setValue() 和 postValue() 方法来设置 LiveData 的值，因为可以设置Value所以会是空

但是 LiveDat.value 不同，它没有setValue() 和 postValue() ，在初始化时就可以确定 LiveData 的值不为空。

它们配合就可以在使用时排除非空判断

~~~kotlin
class MyViewModel : ViewModel() {
    private val _userName = MutableLiveData<String>()
    private val _userAge = MutableLiveData<Int>()

    val userName: LiveData<String> = _userName
    val userAge: LiveData<Int> = _userAge

    fun updateUserName(newName: String) {
        _userName.value = newName
    }

    fun updateUserAge(newAge: Int) {
        _userAge.value = newAge
    }
}
~~~

如上所示，可以在 ViewModel 中封装修改 MutableLiveData 的方法，而将 LiveData 作为对外公开的只读属性。这样保证了 LiveData 的不可变性，同时又可以通过 MutableLiveData 修改 LiveData 的值。





### DataBinding

#### 简介

视图双向绑定 [Databinding文档传送门](https://developer.android.google.cn/jetpack/androidx/releases/databinding?hl=zh-cn)

#### 使用示例

1.开启DataBinding，在app modul的build文件中开启

~~~groovy
android {
		 ...
    dataBinding {
        enable = true
    }
}
~~~

2.布局文件中生成模板，根标签使用layout。在控件中使用@{变量名.属性}

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools">
    <data>
        <variable
            name="user"
            type="com.yeqiu.jetpack.DataBindActivity1.User" />
    </data>

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:context=".MainActivity">
        
        <TextView
            android:id="@+id/tv_name"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="50dp"
            android:text="@{user.name}"
            android:textColor="@color/black"
            android:textSize="28sp"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toBottomOf="@+id/iv_img"
            tools:text="姓名" />
      
    </androidx.constraintlayout.widget.ConstraintLayout>
</layout>
~~~

3.创建databinding对象

~~~kotlin
        val dataBinding = ActivityDatabindingBinding.inflate(layoutInflater)
        setContentView(dataBinding.root)
        dataBinding.user = User("亚索","世间万般兵刃，唯有过往伤人最深")
~~~



#### 点击事件

和引用对象差不多

~~~xml
    <data>
        <!--引用对象-->
        <variable
            name="user"
            type="com.yeqiu.jetpack.DataBindActivity1.User" />

        <!--处理点击事件-->
        <variable
            name="onClickListener"
            type="com.yeqiu.jetpack.DataBindActivity1.DataBindClickListener" />
    </data>
~~~

~~~kotlin
  dataBinding.onClickListener=DataBindClickListener()  
	inner class DataBindClickListener {

        fun onButtonClick(view: View) {

            showToast("点击按钮")
        }
    }
~~~



#### 自定义BindingAdapter 加载图片

1.需要先添加 kapt

~~~groovy
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
  	//添加kapt
    id 'kotlin-kapt'
}
~~~

2.设置BindingAdapter

在任意类中新建设置图片的方法，使用注解 `@BindingAdapter(value = ["android:imgUrl"])`

**注意：定义的方法必须是在半生对象内，或者是顶层函数。也就说方法必须是静态的。一定要添加@JvmStatic**

~~~kotlin
        companion object{
            @JvmStatic
            @BindingAdapter(value = ["android:imgUrl"])
            fun setUserPhoto(
                iView: ImageView,
                imageUrl: String
            ) {
                Picasso.get().load(imageUrl)
                    .into(iView)
            }
        }
~~~

 @BindingAdapte的值是可变参数，可以设置多个 

~~~kotlin
@BindingAdapter(
    value = ["android:imgUrl", "android:gender"],
    requireAll = false
)
~~~

`android:imgUr` 这种写法在xml中引用时使用

~~~xml
 android:imgUrl="@{url}"
~~~

也可以不添加android，直接使用

~~~kotlin
@BindingAdapter(
    value = ["imgUrl", "gender"],
    requireAll = false
)
~~~

这种写法在xml中引用时使用

~~~kotlin
app:imgUrl="@{url}"
~~~



#### 双向绑定

使用 BaseObservable

~~~kotlin
    class EditBinding:BaseObservable(){
       @get:Bindable
       var name:String="defName"
        set(value) {
            field = value
          	//通知数据发生变化
            notifyPropertyChanged(BR.name)
            value.log()
        }
    }
~~~
editBinding.name
2.在xml中使用  android:text="@={}"

~~~xml
        <EditText
            android:id="@+id/edit"
            android:layout_width="200dp"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
            android:textSize="20sp"
            android:text="@={editBinding.name}"
            app:layout_constraintLeft_toLeftOf="parent"
            app:layout_constraintRight_toRightOf="parent"
            app:layout_constraintTop_toBottomOf="@+id/btn" />
~~~

3.传入绑定对象

~~~kotlin
        //一定要设置 BaseObservable
        dataBinding.editBinding= EditBinding()
~~~



#### EditText双向绑定demo

Demo：EditText的文字发生变化，显示到TextView上



~~~xml
<?xml version="1.0" encoding="utf-8"?>
<layout
    xmlns:android="http://schemas.android.com/apk/res/android">
    <data>
        <variable
            name="viewModel"
            type="com.yeqiu.jetpack.EditTextBindingActivity.EditViewModel"/>
    </data>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">

        <EditText
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="请输入"
            android:text="@={viewModel.str}"/>

         <TextView
             android:layout_marginTop="20dp"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@{viewModel.str}"/>

    </LinearLayout>
</layout>
~~~



```kotlin
class EditTextBindingActivity:AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityEditBindingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val viewModel = createViewModel<EditViewModel>()
        binding.viewModel = viewModel
        binding.lifecycleOwner =this

        viewModel.apply {
            str.observe(this@EditTextBindingActivity){
                it.log()
            }
        }
        
    }

    class EditViewModel:ViewModel(){
        val str=MutableLiveData("")
    }
}
```

重点是 ` binding.lifecycleOwner =this`，一定要给BindingBinding设置lifecycleOwner。否则就只能监听livedata的变化，无法同步到其他控件上。



#### 转换器

todo

### Room

#### 简介

数据操作，[Room文档传送门](https://developer.android.google.cn/jetpack/androidx/releases/room?hl=zh-cn)

添加依赖：

```groovy
    implementation "androidx.room:room-runtime:$room_version"
    annotationProcessor "androidx.room:room-compiler:$room_version"
```

#### 简单使用

三个关键注解

- @Entity:对应表字段
- @Dao:用于操作表，增删改查
- @Database:数据库标识

1.创建Database，必须是抽象类，指定要创建的表和版本

```kotlin
@Database(entities = [User::class], version = 1)
abstract class TestDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}
```

2.创建Dao，必须是接口，使用注解注明方法是干嘛的，查询使用@Query必须要写sql语句，其他可以直接传入对象操作。不使用对象操作必须要写对应的sql语句

~~~kotlin
    @Dao
    interface UserDao {
        @Query("SELECT * FROM user")
        fun getAll(): List<User>
        @Query("SELECT * FROM user WHERE id = :id")
        fun getById(id:Int):User?
        @Insert
        fun add(vararg user: User)
        @Delete
        fun del(user: User)
        @Update
        fun update(user: User)
    }
~~~

3.创建实体 Entity

```kotlin
@Entity
data class User(
    @ColumnInfo(name = "name") var name: String,
    @ColumnInfo(name = "age") val age: Int,
    @ColumnInfo(name = "gender") val gender: Boolean
){
    //主键，自增
    @PrimaryKey(autoGenerate = true)
    var id: Int = 0
}
```

使用

~~~kotlin
        //创建testDatabase
        testDatabase = Room.databaseBuilder(
            this,
            TestDatabase::class.java, "test_db"
        )
            //允许在主线程执行sql
            .allowMainThreadQueries()
            .build()

        //获取dao
        userDao = testDatabase.userDao()


    fun add() {
        userDao.add(
            User("狗蛋1", 20, true),
            User("狗蛋2", 20, true),
            User("狗蛋3", 20, true),
            User("狗蛋4", 20, true),
            User("狗蛋5", 20, true),
        )
    }

    fun del() {
        userDao.del(list[0])
    }

    fun find() {
        val all = userDao.getAll()
        //更新列表数据
        list.clear()
        list.addAll(all)
        userAdapter.notifyDataSetChanged()
    }

    fun update() {
        val user = list[0]
        user.name = "update"
        userDao.update(user)
    }


~~~

默认情况下，Room 会为实体中定义的每个字段创建一个列。 如果某个实体中有您不想保留的字段，则可以使用 [`@Ignore`](https://developer.android.google.cn/reference/androidx/room/Ignore?hl=zh-cn) 

```kotlin
@Entity
data class User(
    @PrimaryKey val id: Int,
    @Ignore val picture: Bitmap?
)
```

##### 删除全部

不光是删除全部，只要执行的函数没有实体作为参数或者返回值，ide就是提示错误。删除全部可以使用@Query注解

```kotlin
    // 删除表中的所有数据
    @Query("DELETE FROM user")
    fun deleteAll()
```

#### 升级

升级使用 Migration

1.声明一个 Migration 对象，写好升级的sql语句

```kotlin
//从1升级到2
val migration_1_2:Migration by lazy {
   object :Migration(1,2){
       override fun migrate(database: SupportSQLiteDatabase) {
           val sql = "ALTER TABLE User ADD COLUMN phone TEXT NOT NULL DEFAULT ''"
           database.execSQL(sql)

       }
   }
}
```

2.在实体中添加字段

```kotlin
@Entity
data class User(
    @ColumnInfo(name = "name") var name: String,
    @ColumnInfo(name = "age") val age: Int,
    @ColumnInfo(name = "gender") val gender: Boolean,
  	//新增字段 
    @ColumnInfo(name = "phone") val phone: String = ""
) {
    @PrimaryKey(autoGenerate = true)
    var id: Int = 0
}
```

3.修改数据库版本

```kotlin
@Database(entities = [User::class], version = 2)
abstract class TestDatabase : RoomDatabase() {
  ...
}
```

4.创建Database时添加Migration

```kotlin
//创建testDatabase
testDatabase = Room.databaseBuilder(
    this,
    TestDatabase::class.java, "test_db"
)
    .allowMainThreadQueries()
    //添加升级配置
    .addMigrations(TestDatabase.migration_1_2)
    .build()
```

**有个小坑**

我在升级时候一开始的sql语句是`val sql = "ALTER TABLE user ADD COLUMN phone TEXT DEFAULT ''"`已经指定了默认值，但是升级时一直报错，日志显示字段类型不匹配。后来修改为`   val sql = "ALTER TABLE User ADD COLUMN phone TEXT NOT NULL DEFAULT ''"`增加了`NOT NULL`的限制就好了。以下是GPT的回复

~~~kotlin
如果您在添加新字段时已经指定了默认值，那么在新的表格中，该字段将自动填充默认值，因此在这种情况下添加 `NOT NULL` 约束似乎是多余的。然而，在某些情况下，Room 可能不会正确地遵循默认值，并从而引发异常，这种情况下添加 `NOT NULL` 约束可以确保该字段在任何情况下都存在一个非空值。因此，如果您不希望在代码中添加空值检查或不确定是否可以对新字段正确设置默认值，请同时指定 `NOT NULL` 和 `DEFAULT` 约束。

在您的情况下，由于您指定了默认值，从技术上讲添加 "NOT NULL" 约束确实是多余的。但是为了避免潜在的问题，我建议您在上述SQL语句中同时指定 "NOT NULL" 和 "DEFAULT" 约束。

如果您还有其他疑问，欢迎随时询问。
~~~

#### 跨版本升级

升级的Migration一定要保存好，每次升级可能都会用到。Room升级是根据Migration逐个版本升级

例：

从版本1升级到版本3

- 如果有1到3的Migration，Room会直接执行这个
- 没有1到3的Migration，Room会先执行1到2，然后直接2到3

#### 升级的异常处理

升级时候发生异常会抛出`IllegalArgumentException`异常，在创建Database时添加fallbackToDestructiveMigration。会在出现异常时重建表结构，但是会丢失以前的数据。从高版本回到到低版本也会发生异常。

```kotlin
testDatabase = Room.databaseBuilder(
    this,
    TestDatabase::class.java, "test_db"
)
    //允许在主线程执行sql
    .allowMainThreadQueries()
    //添加升级配置
    .addMigrations(TestDatabase.migration_1_2)
    //升级异常，重建表
    .fallbackToDestructiveMigration()
    .build()
```

### Schema文件

数据库在升级时可以导出一个Schema文件，这是一个json文件。包含数据库的基本信息。包含数据库历史变更情况等，主要用于排查错误。

添加配置

```kotlin
//exportSchema默认就是true
@Database(entities = [User::class], version = 2, exportSchema = true)
```

这里我没做测试，以下是GPT对Schema的描述

~~~kotlin
当您使用 Android Studio 自带的 Schema 组件来生成/导出 Room 的 Schema 文件时，默认情况下（在没有额外配置的情况下），这些文件会被保存在您的应用模块（通常是 `app`）的根目录下的 `schemas` 文件夹中。

例如，假设您的应用模块名为 `app`，则 Room 的 Schema 文件默认保存在 `app/schemas` 文件夹中。

如果您想在 Gradle 中进行自定义配置，则可以编辑您应用模块的 `build.gradle` 文件，并在 `room` 字段下设置 `schemaLocation` 属性，以指定 Room 应该将 Schema 文件导出到哪个位置。

例如，如果您想将 Schema 文件保存在 `app/db` 文件夹中，可以将以下代码添加到您应用模块的 `build.gradle` 文件中：

android {
    defaultConfig {
        // ...
    }
     kapt {
        arguments {
            arg("room.schemaLocation", "$projectDir/schemas")
        }
    }
}

在上述代码中，`"$projectDir/app/db"` 指向应用程序的根目录下的 `app/db` 文件夹。

如果您将 `schemaLocation` 属性设置为 `null` 或空字符串，则视为禁用 Schema 导出，即 Room 不会生成 Schema 文件。

希望这些信息能够帮助到您，如果您还有其他问题，请随时向我提问。
~~~



### 销毁和重建

在sqlLite中修改表接口很麻烦，例如变更字段的数据类型。最好采用销毁和重建。

步骤大致为

- 创建一个符合表结构的临时表
- 将旧表的数据复制到临时表
- 删除旧表
- 将临时表重命名为旧表名



这是个纯sql操作，在升级的Migration中写上sql语句。sql可以参照Schema中的sql



### 预填充数据库

Room允许再打包时候将安装包内的数据库文件移植到手机中。

需要预选准备数据库，在创建Database 通过createFromAsset添加

~~~kotlin
        testDatabase = Room.databaseBuilder(
            this,
            TestDatabase::class.java, "test_db"
        )
            //允许在主线程执行sql
            .allowMainThreadQueries()
            //添加升级配置
            .addMigrations(TestDatabase.migration_1_2)
            //升级异常，重建表
            .fallbackToDestructiveMigration()
						//预置数据库
            .createFromAsset("path")
            .build()
~~~



### Navigation

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



### WorkManager

#### 简介

[WorkManager文档传送门](https://developer.android.google.cn/jetpack/androidx/releases/work?hl=zh-cn)

以下的介绍来自GPT

> WorkManager 主要用于管理异步性任务和后台任务，将这些任务与 Android 系统组件（如Activity、Service）解耦合，以便在设备处于睡眠状态下执行。WorkManager 还可以提供更加灵活的任务处理方式，例如，可以在特定时间执行任务、执行一次性任务或定期任务执行等。
>
> 其内部实现使用了 JobScheduler、AlarmManager、BroadcastReceiver 和 Foreground Services 等四种主要技术。
>
> WorkManager 的一些弊端是：
>
> - 由于 WorkManager 任务的执行依赖于系统和设备资源，因此不能保证任务的准确无误地在精确的指定时间执行。
> - 使用 WorkManager 来批量处理短时间任务时，受到 JobScheduler 的限制，监视的最短时间间隔为 15 分钟。

关于WorkManager任务是否一定被执行，和任务的时效性

>使用 WorkManager 定义的任务不一定会立即执行，但是可以确保在设备满足条件时（如设备处于活跃状态，有足够的电量和存储空间等）会尽快地执行。如果您的应用程序被杀死，WorkManager 会在下次启动应用程序时重新安排和执行任务。这样可以确保即使应用程序长时间不活动（如应用程序挂起，设备重启等情况），任务也能够得到执行。
>
>但是，需要注意的是，如果您的应用程序已经被系统完全杀死（或者用户手动杀死了应用程序），WorkManager 将不会自动重新启动任务。因此，WorkManager 并不适用于绝对必须在特定时间或时间范围内执行的实时任务，这种情况最好使用 AlarmManager。同时，如果您的应用程序没有活动组件（例如，没有活动、服务或者是设备处于睡眠状态），则任务可能无法在指定的时间内立即执行，这取决于 Android 系统对于作业执行的限制。

#### 定义任务

大致步骤如下

1.定义任务

2.设置触发条件（非必须）

3.配置任务：一次性，或者周期性

4.提交到 WorkManager

~~~kotlin

    //1.定义任务
    class TestWork(context: Context, workerParameters: WorkerParameters) :
        Worker(context, workerParameters) {

          //代码会运行在子线程
        override fun doWork(): Result {
            SystemClock.sleep(2000)
            "TestWork is doWork".log()
            return Result.success()
        }
    }

        //2.设置触发条件
        val constraints =Constraints.Builder()
                //网络条件 无要求
            .setRequiredNetworkType(NetworkType.NOT_REQUIRED)
            .build()
        //3. 配置任务，一次性任务
        val oneTimeWorkRequest = OneTimeWorkRequest.Builder(TestWork::class.java)
                //设置触发条件
            .setConstraints(constraints)
            //设置延时
            .setInitialDelay(5,TimeUnit.SECONDS)
            .build()
        //4.提交到 WorkManager
        WorkManager.getInstance(this)
            .enqueue(oneTimeWorkRequest)
~~~

#### 指数退避

在配置任务时设置

```kotlin
val oneTimeWorkRequest = OneTimeWorkRequest.Builder(TestWork::class.java)
        //设置触发条件
    .setConstraints(constraints)
    //设置延时
    .setInitialDelay(5,TimeUnit.SECONDS)
        //设置退避指数，在失败后重试的策略
    .setBackoffCriteria(BackoffPolicy.LINEAR, 1,TimeUnit.SECONDS)
    .build()
```

上例中设置了线性指数，失败后更延长每次重试的时间。

#### 观察任务状态

通过LiveData观察任务的状态

```kotlin
WorkManager.getInstance(this).getWorkInfoByIdLiveData(oneTimeWorkRequest.id)
    .observe(this){workInfo:WorkInfo->
        //打印任务信息
        workInfo.toString().log()
    }
```

#### 取消任务

```kotlin
WorkManager.getInstance(this)
    .cancelWorkById(oneTimeWorkRequest.id)
```

#### 传递参数

配置任务时设置参数

```kotlin
val data = Data.Builder()
    .putString("data","这是一个参数")
    .build()

//3. 配置任务，一次性任务
val oneTimeWorkRequest = OneTimeWorkRequest.Builder(TestWork::class.java)
        //设置触发条件
    .setConstraints(constraints)
    //设置延时
    .setInitialDelay(5,TimeUnit.SECONDS)
        //设置退避指数，在失败后重试的策略
    .setBackoffCriteria(BackoffPolicy.LINEAR, 1,TimeUnit.SECONDS)
        //设置参数
    .setInputData(data)
    .build()
```

在Worker中获取参数

```kotlin
override fun doWork(): Result {
    //获取参数
    val data = inputData.getString("data")
    data?.log()
    SystemClock.sleep(2000)
    "TestWork is doWork".log()
    "${Thread.currentThread().name} 当前的线程".log()
    return Result.success()
}
```

#### 周期任务

```kotlin
//周期性任务 间隔时间不能小于15分钟
PeriodicWorkRequest.Builder(TestWork::class.java,15,TimeUnit.MINUTES)
    .build()
```

#### 任务链

```kotlin
var continuation = WorkManager.getInstance(this)
    .beginWith(oneTimeWorkRequest)
    .then(oneTimeWorkRequest)
continuation.enqueue()
```

我的版本是2.8.0。我测试任务链不能传入周期性任务。



### Paging

[Paging文档传送门](https://developer.android.google.cn/jetpack/androidx/releases/paging?hl=zh-cn)

[Jetpack新成员，Paging3从吐槽到真香](https://blog.csdn.net/guolin_blog/article/details/114707250?ops_request_misc=&request_id=e539560cd66546b1b720d91c49f0aa73&biz_id=&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~koosearch~default-1-114707250-null-null.268^v1^control&utm_term=paging&spm=1018.2226.3001.4450)

### Hilt 

[Hilt文档传送门](https://developer.android.google.cn/jetpack/androidx/releases/hilt?hl=zh-cn)



https://juejin.cn/post/6850418118289227783#heading-10

[Jetpack新成员，一篇文章带你玩转Hilt和依赖注入](https://blog.csdn.net/guolin_blog/article/details/109787732)



### APP Startup

https://juejin.cn/post/6898738809895125006

[Jetpack新成员，App Startup一篇就懂](https://blog.csdn.net/guolin_blog/article/details/108026357?ops_request_misc=&request_id=a183f941534f4666beffcee5540ed294&biz_id=&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~koosearch~default-1-108026357-null-null.268^v1^control&utm_term=startup&spm=1018.2226.3001.4450)

### 其他

#### OnBackPressedDispatcher

https://juejin.cn/post/6967039557220958244#heading-3

#### Fragment

https://juejin.cn/post/6970998913754988552





### MVVM

![image-20230626151145749](http://pic-1259520863.cos.ap-beijing.myqcloud.com/uPic/image-20230626151145749.png)