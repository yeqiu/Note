# Android中使用kotlin协程



> 本文仅针对协程在Android中的使用



## 协程的基础介绍

### 协程的开启方式

1. `runBlocking：T` 启动一个新的协程并阻塞调用它的线程，直到里面的代码执行完毕,返回值是泛型`T`，就是你协程体中最后一行是什么类型，最终返回的是什么类型`T`就是什么类型。
2. `launch：Job` 启动一个协程但不会阻塞调用线程,必须要在协程作用域(`CoroutineScope`)中才能调用,返回值是一个Job。
3. `async:Deferred<T>` 启动一个协程但不会阻塞调用线程,必须要在协程作用域(`CoroutineScope`)中才能调用。以`Deferred`对象的形式返回协程任务。返回值泛型`T`同`runBlocking`类似都是协程体最后一行的类型。



#### 协程的基本要素

1.挂起函数
2.Continuation
3.协程上下文

#### 如何实现挂起和恢复
通过Continuation，挂起函数实际是需要一个Continuation对象。只是编译器自动传递的。
所以挂起函数只能在挂起函数或者协程中调用。

#### 回调转为挂起函数

使用suspendCoroutine 获取挂起函数的Continuation



#### Job

Job是携程的一个句柄,可以通过Jbo来获取协程的状态。通过isActive`、`isCompleted`、`isCancelled来获取Job的状态。

### 协程的生命周期

| **State**    | isActive | isCompleted | isCancelled |
| ------------ | -------- | ----------- | ----------- |
| *New*        | `false`  | `false`     | `false`     |
| *Active*     | `true`   | `false`     | `false`     |
| *Completing* | `true`   | `false`     | `false`     |
| *Cancelling* | `false`  | `false`     | `true`      |
| *Cancelled*  | `false`  | `true`      | `true`      |
| *Completed*  | `false`  | `true`      | `false`     |



### Deferred

Deferred是Job的子类,可以获取到协程的返回值

~~~kotlin
public interface Deferred<out T> : Job {
    //返回结果值，或者如果延迟被取消，则抛出相应的异常
    public suspend fun await(): T  
    public val onAwait: SelectClause1<T>
    public fun getCompleted(): T
    public fun getCompletionExceptionOrNull(): Throwable?
}

~~~

## 协程的基础用法

### 启动协程

```kotlin
private fun startTest() {

    GlobalScope.launch {
        "GlobalScope launch 启动协程".log()
    }

    GlobalScope.async {
        "GlobalScope async 启动协程".log()
    }

    runBlocking {
        "runBlocking 启动协程".log()
    }
}
```



#### 返回值

- runBlocking：返回协程体内的最后一行的结果
- launch ：launch源码返回Job对象
- async：返回Deferred对象



## 协程的关键知识点

### 协程调度器

调度器：CoroutineDispatcher

调度器来决定这个协程运行在那个线程上

#### 四个调度器

1. `Dispatchers.Default`：它适用于 CPU 密集型任务，比如排序、解析 JSON 等。它使用共享的后台线程池来执行协程，并提供合理的并发度。
2. `Dispatchers.IO`：它适用于 IO 密集型任务，比如进行网络请求、读写文件等。它使用专门的 IO 线程池来执行协程，避免阻塞主线程。
3. `Dispatchers.Main`：它是 Android 开发中最常用的调度器，用于在主线程上执行协程。它通常用于 UI 更新、界面交互等需要在主线程执行的操作。
4. `Dispatchers.Unconfined`：它并不绑定到任何特定的线程，而是在恢复执行时继续使用之前的线程。它在某些情况下可能会导致协程的执行线程不可预测，因此需要谨慎使用。

 Android 开发中会使用这些调度器来适配不同类型的任务。例如，在进行网络请求时，我们可以使用 `Dispatchers.IO` 来执行协程，确保它在后台线程中执行，避免阻塞主线程。而在更新 UI 或处理用户交互时，我们则需要切换到 `Dispatchers.Main` 调度器，以确保在主线程中执行。

Android中经常需要使用`Dispatchers.IO` 切换到到IO线程来进行耗时操作，而更新UI需要使用`Dispatchers.Main`切换主线程中操作。

#### 协程中切换线程

在协程中可以使用`withContext`来改变协程的上下文。

例：

```kotlin
//启动一个IO协程
GlobalScope.launch (Dispatchers.IO){ 
    
    val name = getName()
    //切换到主线程更新UI
    withContext(Dispatchers.Main){
        tvName.text = name
    }
    
}
```



### 协程上下文

协程上下文中主要包括 

1. `Job`：协程的执行任务。它可以在协程执行完毕或取消时进行管理。
2. `Dispatcher`：指定协程运行的线程环境。
3. `CoroutineExceptionHandler`：处理协程内部产生的异常情况，可以自定义异常处理逻辑。
4. `CoroutineName`：为协程指定一个可选的名称，有助于调试和日志记录。
5. `ContinuationInterceptor`：协程拦截器，可以对协程进行修改

### 协程启动模式

协程启动有4种：

- `DEFAULT`    默认启动模式，我们可以称之为饿汉启动模式，因为协程创建后立即开始调度，虽然是立即调度，单不是立即执行，有可能在执行前被取消。
- `LAZY`    懒汉启动模式，启动后并不会有任何调度行为，直到我们需要它执行的时候才会产生调度。也就是说只有我们主动的调用`Job`的`start`、`join`或者`await`等函数时才会开始调度。
- `ATOMIC`  一样也是在协程创建后立即开始调度，但是它和`DEFAULT`模式有一点不一样，通过`ATOMIC`模式启动的协程执行到第一个挂起点之前是不响应`cancel `取消操作的，`ATOMIC`一定要涉及到协程挂起后`cancel `取消操作的时候才有意义。
- `UNDISPATCHED` 协程在这种模式下会直接开始在当前线程下执行，直到运行到第一个挂起点。这听起来有点像 `ATOMIC`，不同之处在于`UNDISPATCHED`是不经过任何调度器就开始执行的。当然遇到挂起点之后的执行，将取决于挂起点本身的逻辑和协程上下文中的调度器。

### 协程作用域

协程作用域指协程作用范围，它管理有关协程的生命周期和取消操作。

父协程中包含的子协程会继承父协程的上下文。如果子协程抛出异常，也会把异常传递给父协程。父协程被取消子协程也会取消。任何一个子协程异常都会导致整体退出。

#### supervisorScope`和`SupervisorJob

supervisorScope和SupervisorJob可以实现一些特殊的管理。

`supervisorScope` 是一个协程作用域构建器，作用域下的子协程会受到监督，其中子协程发生异常不会其他子协程。`supervisorScope` 所产生的异常不会自动向上传播，而是在作用域内部进行处理。

`SupervisorJob` 是一种特殊的 `Job` 类型，作用和`supervisorScope` 一样。





使用supervisorScope`和`SupervisorJob，子协程的异常不会导致父协程取消。

当在 `supervisorScope` 中启动子协程时，如果子协程抛出异常并未被捕获处理，则该子协程会被取消，但这不会影响父协程或其他兄弟子协程。父协程会继续正常执行，而其他兄弟子协程也会继续运行，不受异常的影响。

```kotlin
supervisorScope {

    val job1 = launch {
        delay(2000)
        throw NullPointerException("空指针")
    }

    val job2 = launch {
        delay(2000)
        println("job2")
    }
    //job1的异常不会影响job2
    job1.join()
    job2.join()
}
```

### 挂起函数

使用`suspend`关键字修饰的函数叫作`挂起函数`，`挂起函数`只能在协程体内，或着在其他`挂起函数`内调用

挂起函数实际需要一个`Continuation`接口参数，只不过这个参数是编译器传递的。所以挂起函数只能在挂起函数和协程中调用。

##### 挂起点

挂起点是在挂起函数内部协程被暂停的地方。

```kotlin
suspend fun testSuspend(){
    println("testSuspend")
    //这里就是一个挂起点
    delay(1000)
}
```



## 协程的异常处理

异常分为两大类

- 取消异常 CancellationException
- 其他异常

在处理异常时候 CancellationException 需要单独处理



在协程结构化并发时候如果取消了父协程，子协程也会被取消。

#### 协程无法取消

##### cancel() 不被响应

~~~kotlin

// 代码段1

fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        var i = 0
        while (true) {
            Thread.sleep(500L)
            i ++
            println("i = $i")
        }
    }

    delay(2000L)

    job.cancel()
    job.join()

    println("End")
}

/*
输出结果

i = 1
i = 2
i = 3
i = 4
i = 5
// 永远停不下来
*/
~~~



协程是互相协作的程序，在外部取消后再内部需要判断是否取消。可以添加状态判断解决这个问题

~~~kotlin

// 代码段2

fun main() = runBlocking {
    val job = launch(Dispatchers.Default) {
        var i = 0
        // 变化在这里
        while (isActive) {
            Thread.sleep(500L)
            i ++
            println("i = $i")
        }
    }

    delay(2000L)

    job.cancel()
    job.join()

    println("End")
}
~~~

##### CancellationException

协程在取消时候会抛出CancellationException，如果捕获了CancellationException，需要在抛出来。







#### try-catch 不起作用

~~~kotlin
fun main() = runBlocking {
    try {
        launch {
            delay(100L)
            1 / 0 // 故意制造异常
        }
    } catch (e: ArithmeticException) {
        println("Catch: $e")
    }

    delay(500L)
    println("End")
}

/*
输出结果：
崩溃
Exception in thread "main" ArithmeticException: / by zero
*/
~~~



#### CoroutineExceptionHandler

```kotlin
fun test4() = runBlocking {
    val coroutineExceptionHandler = CoroutineExceptionHandler { context: CoroutineContext, throwable: Throwable ->
        println("捕获到了异常 throwable = $throwable")
    }

    //创建一个CoroutineScope使用coroutineExceptionHandler
    val scope = CoroutineScope(coroutineExceptionHandler)
    scope.launch() {
        println("start")
        // 触发一个异常
        1 / 0
    }

    delay(1000L)
    println("End")
}
```



以下是一个错误的用法

~~~kotlin
fun test4() = runBlocking {
    val coroutineExceptionHandler = CoroutineExceptionHandler { context: CoroutineContext, throwable: Throwable ->
        println("捕获到了异常 throwable = $throwable")
    }

    //直接把coroutineExceptionHandler传给可能异常的协程
   launch(coroutineExceptionHandler) {
        println("start")
        // 触发一个异常
        1 / 0
    }

    delay(1000L)
    println("End")
}
~~~

**上面这种使用CoroutineExceptionHandler的方法是错误的**

当子协程发生异常会上报给父协程，又父协程来调用CoroutineExceptionHandler，所以只有CoroutineExceptionHandler定义在顶层的协程中才能处理整个协程的异常。

#### 异常的传播

当协程发生异常，子协程会将异常传播到父级，父级会取消其他的子协程，同时取消自身。这是默认的异常传播规则。

但是实际使用时候可能需要子协程互补干扰，就算失败了也不要印象其他协程。这时就需要使用supervisorScope`或者`SupervisorJob。



使用supervisorScope其实就是使用SupervisorJob

~~~kotlin
fun test5() = runBlocking {

    val exceptionHandler = CoroutineExceptionHandler { coroutineContext, throwable ->
        println("捕获到了异常 throwable = $throwable")
    }

    launch(exceptionHandler) {
        supervisorScope() {
            launch {
                delay(2000)
                println("launch1")
            }
            launch {
                delay(1000)
                //这里会触发异常
                1 / 0
            }
            launch {
                delay(2000)
                println("launch3")
            }
        }

    }

    delay(5000L)
    println("End")
}
~~~





## 协程在Android中的基础应用

### Android使用kotlin协程

kotlin提供了一个默认在主线程运行的协程 MainScope

MainScope的创建默认使用了SupervisorJob`和` Dispatchers.Main。可以在MainScope中来处理UI操作,内部使用的是SupervisorJob,子协程之间异常不会导致MainScope取消。在最后页面销毁时也可以直接取消MainScope

~~~kotlin
    private val mainScope = MainScope()
    private fun startCoroutine() {
        mainScope.launch {

            launch {
                try {
                    throw IllegalArgumentException("这是一个异常")
                } catch (e: Exception) {
                    e.printStackTrace()
                }

            }
            delay(1000)
            val data = withContext(Dispatchers.IO) {
                "网络请求"
            }
            tvResult.text = data
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        mainScope.cancel()
    }
~~~

#### Activity与Framgent中使用协程

可是使用lifecycleScope。

它和MainScope一样，同时结合了lifecycle，实现onDestroy时自动关闭的协程，它可以自动获取生命周期。它是`LifecycleOwner` 的扩展函数，在Activity中使用无需创建，也不必关心关闭。

源码：

~~~kotlin
public abstract class LifecycleCoroutineScope internal constructor() : CoroutineScope {
    internal abstract val lifecycle: Lifecycle
    public fun launchWhenCreated(block: suspend CoroutineScope.() -> Unit): Job = launch {
        lifecycle.whenCreated(block)
    }
    public fun launchWhenStarted(block: suspend CoroutineScope.() -> Unit): Job = launch {
        lifecycle.whenStarted(block)
    }
    public fun launchWhenResumed(block: suspend CoroutineScope.() -> Unit): Job = launch {
        lifecycle.whenResumed(block)
    }
}


internal class LifecycleCoroutineScopeImpl(
    override val lifecycle: Lifecycle,
    override val coroutineContext: CoroutineContext
) : LifecycleCoroutineScope(), LifecycleEventObserver {
    init {
        if (lifecycle.currentState == Lifecycle.State.DESTROYED) {
            coroutineContext.cancel()
        }
    }

    fun register() {
        launch(Dispatchers.Main.immediate) {
            if (lifecycle.currentState >= Lifecycle.State.INITIALIZED) {
                lifecycle.addObserver(this@LifecycleCoroutineScopeImpl)
            } else {
                coroutineContext.cancel()
            }
        }
    }

    override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
        if (lifecycle.currentState <= Lifecycle.State.DESTROYED) {
            lifecycle.removeObserver(this)
            coroutineContext.cancel()
        }
    }
}

~~~

可以通过`launchWhenCreated`、`launchWhenStarted`、`launchWhenResumed`来启动协程，等到`lifecycle`处于对应状态时自动触发此处创建的协程。

#### 异常处理

启动一个协程如果不添加异常处理，就会崩溃。但是每次启动协程都添加处理器就很麻烦。这里可以通过kotlin的扩展函数来优化

1.先创建一个异常处理器

```kotlin
class GlobalCoroutineExceptionHandler(
    private val code: Int, private val msg: String = "",
) : CoroutineExceptionHandler {
    override val key: CoroutineContext.Key<*>
        get() = CoroutineExceptionHandler
    override fun handleException(context: CoroutineContext, exception: Throwable) {
        "发生异常了，code = $code,msg = $msg".log()
    }
}
```

2.给AppCompatActivity创建一些扩展函数，用来快速启动启程，并添加默认的异常处理

```kotlin
inline fun AppCompatActivity.requestMain(
    code: Int = 0,
    msg: String = "",
    noinline block: suspend CoroutineScope.() -> Unit
) {
    lifecycleScope.launch(GlobalCoroutineExceptionHandler(code, msg)) {
        block.invoke(this)
    }
}

inline fun AppCompatActivity.requestIo(
    code: Int = 0,
    msg: String = "",
    noinline block: suspend CoroutineScope.() -> Unit
) {
    lifecycleScope.launch(Dispatchers.IO+GlobalCoroutineExceptionHandler(code, msg)) {
        block.invoke(this)
    }
}

inline fun AppCompatActivity.delayMain(
    code: Int = 0,
    msg: String = "",
    delay:Long,
    noinline block: suspend CoroutineScope.() -> Unit
) {
    lifecycleScope.launch(GlobalCoroutineExceptionHandler(code, msg)) {
        withContext(Dispatchers.IO){
            delay(delay)
        }
        block.invoke(this)
    }
}
```

3.使用

```kotlin
private fun startCoroutine() {

    requestMain {
        "${Thread.currentThread().name} requestMain开启了一个协程".log()
    }

    requestMain {
       throw NullPointerException("这是一个异常")
    }

    requestIo {
        "${Thread.currentThread().name} requestIo开启了一个协程".log()
    }

    delayMain(delay = 1000){
        "${Thread.currentThread().name} delayMain开启了一个协程".log()
    }


}
```



#### ViewModel中使用协程

使用`viewModelScope`，和`lifecycleScope`的用法类似

```kotlin
class TestViewModel:ViewModel(){
    init {
        viewModelScope.launch { 
            "使用viewModelScope开启了一个协程".log()
        }
    }
}
```

也可以针对ViewModel添加一些扩展方法简便使用。

#### 其他环境下使用协程

在其他的Service`、`Dialog`、`PopWindow等环境下使用协程，可以优先使用MainScope。如果需要协作作用域需要自定手动创建CoroutineScope。



- [史上最详Android版kotlin协程入门进阶实战(四) -> 使用kotlin协程开发Android的应用](https://juejin.cn/post/6956115368578383902)

## Channel和Flow

[Kotlin Channel和Flow](./Kotlin Channel和Flow.md)



## Android中使用Flow

### 代替LiveData

demo场景，点击按钮获取数据，更新到textview中

~~~kotlin
    class TestViewModel : ViewModel() {
        private val _data = MutableLiveData("")
        val data: LiveData<String>
            get() = _data
        fun getData(){
            val response = "这是一条来自LiveData模拟数据"
            _data.value = response
        }
    }
~~~

~~~kotlin
 val testViewModel:TestViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_coroutine_1)

        testViewModel.data.observe(this){
            tvData.text = it
        }

        findViewById<Button>(R.id.bt_start).setOnClickListener {
            testViewModel.getData()
        }
    }
~~~



使用StateFlow实现

~~~kotlin
    class StateFlowViewModel : ViewModel() {
        
        private  val _data = MutableStateFlow("")
        val data :StateFlow<String>
            get() = _data

        fun getData(){
            viewModelScope.launch {
                val response = "这是一个来自StateFlow模拟数据"
                _data.emit(response)
            }
        }
    }

~~~

~~~kotlin
  val stateFlowViewModel: StateFlowViewModel by viewModels()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_coroutine_1)
        findViewById<Button>(R.id.bt_start).setOnClickListener {
            lifecycleScope.launch {
                stateFlowViewModel.data.collect{
                    tvData.text =it
                }
            }
            stateFlowViewModel.getData()
        }
    }
~~~

### 使用Flow+LiveData实现多状态返回

案例效果：

使用jetpack组件，实现一个简单mvvm。数据加载使用flow实现，获取数据中提供状态

~~~kotlin
class MainActivity : AppCompatActivity() {

    private val binding by lazy {
        ActivityMainBinding.inflate(layoutInflater)
    }

    private val mainViewModel by viewModels<MainViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        binding.lifecycleOwner = this
        binding.mainViewModel = mainViewModel
        
    }
    
    data class Result(val status: Int, val data: String) {
        companion object {
            val loading = 1
            val success = 2
            val error = 3
        }
    }

    class MainViewModel : ViewModel() {

        private val mainRepository by lazy { MainRepository() }

        private val _data: MutableLiveData<Result> = MutableLiveData()
        val data: LiveData<Result>
            get() = _data

        fun getData(success: Boolean) {
            viewModelScope.launch {
                _data.value = Result(Result.loading, "正在加载")
                try {
                    delay(2000)
                    mainRepository.getData(success).collect {
                        _data.value = it
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    _data.value = Result(Result.error, "发生了错误")
                }
            }
        }

    }

    class MainRepository {

        fun getData(success: Boolean): Flow<Result> = flow {

            val response = if (success) "这是一条成功的数据" else "这是一条失败的数据"
            if (success) {
                emit(Result(Result.success, response))
            } else {
                emit(Result(Result.error, response))
            }
        }
    }

}
~~~

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools">

    <data>
        <variable
            name="mainViewModel"
            type="com.fastmvvm.sample.MainActivity.MainViewModel" />

    </data>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        tools:context=".MainActivity">

        <TextView
            android:id="@+id/tv_info"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_margin="20dp"
            android:layout_weight="1"
            android:text="@{mainViewModel.data.toString()}" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="100dp"
            android:orientation="horizontal"
            android:padding="20dp">

            <Button
                android:id="@+id/bt_success"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:onClick="@{()->mainViewModel.getData(true)}"
                android:text="成功" />

            <Button
                android:id="@+id/bt_error"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_marginLeft="30dp"
                android:layout_weight="1"
                android:onClick="@{()->mainViewModel.getData(false)}"
                android:text="失败" />


        </LinearLayout>


    </LinearLayout>
</layout>
~~~

