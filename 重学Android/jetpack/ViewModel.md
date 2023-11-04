#  ViewModel的使用

## 简介

介于view和model之间的桥梁，可以使数据和视图分离，也能保持通信

ViewModel的生命周期要比Activity的长很多，所以ViewModel的数据不受Activity的一些瞬态的影响，例如旋转屏幕。当Activity被真正销毁的时候，ViewModel会将资源进行回收。



## 创建ViewModel

```kotlin
val mainViewModel= ViewModelProvider(this).get(MainViewModel::class.java)
//或者可以使用扩展函数
val mainViewModel by viewModels<MainViewModel> ()
```



### ViewModel中使用Context

不要向ViewModel中直接传入Context，因为ViewModel的生命周期要比Activity的长很多，可能会引起内存泄露。如果ViewModel需要使用Context请使用 AndroidViewModel

~~~kotlin
class ContextViewModel(val app: Application) : AndroidViewModel(app) {

    fun show() {
        app.showToast("application")
    }
}
~~~

~~~kotlin
//创建ContextViewModel
val contextViewModel =
            ViewModelProvider(this).get(ContextViewModel::class.java)
            contextViewModel.show()
~~~

## 在Fragment中使用Activity已经创建的ViewMolde

ViewModel 通常也可以作为fragment之间共享数据使用。可以使用Activity创建的ViewMolde，在Fragment中获取Activity已经创建的ViewMolde

~~~kotlin
val mainViewModel=ViewModelProvider(activity).get(MainViewModel::class.java)
//或者可以使用扩展函数
val mainViewModel by activityViewModels<MainViewModel>()
~~~

## 全局ViewModel

可以在Application中创建ViewModel

~~~kotlin
class MyApp : Application() {
    private val appViewModel: AppViewModel by lazy {
        ViewModelProvider.AndroidViewModelFactory.getInstance(this).create(AppViewModel::class.java)
    }

    fun getAppViewModel(): AppViewModel {
        return appViewModel
    }
}
~~~

## 扩展函数 viewModels()和activityViewModels()

以下是viewModels函数的源码

```kotlin
/**
 * 简化在 Fragment 中创建 ViewModel 
 * 该函数接受三个参数：ownerProducer、extrasProducer 和 factoryProducer
 * 1.ownerProducer:ViewModel 对象的拥有者,通常情况下，这个拥有者是 Fragment 或 Activity
 * 2.extrasProducer:用于传递额外的创建 ViewModel 所需信息
 * 3.factoryProducer:于实际创建 ViewModel 实例的工厂
 * 通常这三个函数都不需要传递
 */
public inline fun <reified VM : ViewModel> Fragment.viewModels(
    noinline ownerProducer: () -> ViewModelStoreOwner = { this },
    noinline extrasProducer: (() -> CreationExtras)? = null,
    noinline factoryProducer: (() -> ViewModelProvider.Factory)? = null
): Lazy<VM> {
    val owner by lazy(LazyThreadSafetyMode.NONE) { ownerProducer() }
    return createViewModelLazy(
        VM::class,
        { owner.viewModelStore },
        {
            extrasProducer?.invoke()
                ?: (owner as? HasDefaultViewModelProviderFactory)?.defaultViewModelCreationExtras
                ?: CreationExtras.Empty
        },
        factoryProducer ?: {
            (owner as? HasDefaultViewModelProviderFactory)?.defaultViewModelProviderFactory
                ?: defaultViewModelProviderFactory
        })
}
```

