#  Jetpack DataBinding的使用

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



#### Livedata 可读写封装

Livedata的数据只读，不可变的。如果使用MutableLiveData会增加外部修改的风险。可以结合使用

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











