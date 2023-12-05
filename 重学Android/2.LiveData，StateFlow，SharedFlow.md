# 关于LiveData，StateFlow，SharedFlow

> StateFlow和SharedFlow都是Flow中的热流



## LiveData

LiveData是可以感知页面生命周期的，可观察的数据持有者。

特点：

- 观察者的回调发生在主线程，不必考虑切换线程
- 仅持有当前最新的数据
- 页面生命周期自动取消订阅
- 有可读写和只读两个版本
- 可以配合DataBinding实现数据绑定

~~~kotlin
    private val _livedData = MutableLiveData<String>()
    val liveData:LiveData<String> = _livedData
~~~

一些缺点：

- LiveData的数据是可空类型的，可能会引发空指针
- LiveData的数据是粘性事件，会触发数据倒灌的情况
- LiveData的数据是不防抖的
- LiveData设置数据要区分是在主线程还是子线程，调用的方法不同



> 粘性事件：在注册观察者之后，不仅仅会收到后续时间，即使在被注册之前的时间也能收到。LiveData中的粘性，是存储最新的值，当添加观察者之后，理解将这个值发送。所以即使先设置了值，后设置观察者，依然一个接受到最新的值。livedata的粘性只会收到最新的一次数据，不会收到历史。
>
> 防抖：指在特定时间内只相应最后一次触发的事件。比如监听输入框输入文字，请求网络。如果希望在输入停止后一定时间内再去请求网络，这里个停止输入一段时间的时间就是防抖。LiveData是不防抖的。





## StateFlow

和 LiveData的相同点：

- 有可读写和只读两个版本
- 会把最新值返回给订阅者
- 可以被多个订阅者订阅
- 子线程多次发送数据可能会丢失

和 LiveData的不同点：

- 必须传入初始值，保证空安全
- 可以防抖，多次传入相同的值，不会触发订阅回调
- 不能自动响应生命周期



## SharedFlow

和 StateFlow的不同点：

- SharedFlow可以不传入初始值
- SharedFlow可以保留历史数据，新的订阅者可以获取之前的历史数据
- SharedFlow可以获取历史数据，但是默认不会发送历史
- SharedFlow在子线程中多次修改数据不会丢失数据

## 简单使用

~~~kotlin
class MainViewModel : ViewModel() {
    var count = 0

    private val _livedData = MutableLiveData<String>()
    val liveData:LiveData<String> = _livedData
    
    private val _stateFlow = MutableStateFlow<String>("")
    val stateFlow:StateFlow<String> = _stateFlow

    private val _sharedFlow = MutableSharedFlow<String>()
    val sharedFlow:SharedFlow<String> = _sharedFlow


    fun onLiveDataClick() {
        _livedData.value = "onLiveDataClick"
    }
    
    fun onStateFlowClick() {

      viewModelScope.launch {
//          _stateFlow.emit("onStateFlowClick")
          _stateFlow.emit(count++.toString())
      }
    }

    fun onSharedFlowClick() {
        viewModelScope.launch {
            _sharedFlow.emit("onSharedFlowClick")
        }
    }
    
}
~~~

订阅者

~~~kotlin
   viewModel.liveData.observe(this) {
            "liveData发生变化 $it".log()
        }
        
        lifecycleScope.launch {

            //stateFlow是防抖的，本次数据和上次一样，不会触发回调
            viewModel.stateFlow.collect {
                "stateFlow发生变化 $it".log()
            }
        }

        lifecycleScope.launch {
            viewModel.sharedFlow.collect {
                "sharedFlow发生变化 $it".log()
            }
        }
~~~







## 状态（State）与事件（Event）

对于UI而言，状态始终是有一个默认值的。当添加了新的订阅者，这个新的订阅者应该需要知道当前的最新状态。即 粘性。

事件只有在满足一些条件时才会触发，不需要默认值。





### 资料

[不做跟风党，LiveData，StateFlow，SharedFlow 使用场景对比](https://juejin.cn/post/7007602776502960165?searchId=20230819160221C159305A136E7A55C0DC#heading-20)
[Kotlin协程之一文看懂StateFlow和SharedFlow](https://juejin.cn/post/7169843775240405022?searchId=20230818110255A0FEE9656B62B283C6B1#heading-0)



