

[toc]

# Activity Result API



### `startActivityForResult()`

这个方法在新的appcompat库中已经被标记废弃，官方推荐使用Activity Result API实现在两个Activity之间交换数据。



### 两个`Activity`之间交换数据

使用`startActivityForResult`的写法

```kotlin
    private fun jumpToSecond() {
        val intent = Intent(this, SecondActivity::class.java)
        intent.putExtra("data", "First Activity")
        startActivityForResult(intent, 100)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 100) {
            if (resultCode == RESULT_OK) {
                val msg = data!!.getStringExtra("data")
                Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
            }
        }
    }
```

```kotlin
override fun onClick(view: View) {
    if (view == binding.btBack) {
        val intent = Intent()
        intent.putExtra("data", "back msg")
        setResult(RESULT_OK, intent)
        finish()
    }
}
```



使用Activity Result API的写法，目标页面的写法不需要修改，还是通过`Intent`传递。

首先需要创建`ActivityResultLauncher`实例，重写`onActivityResult`实现获取返回数据的逻辑。

~~~kotlin
    private val resultLauncher:ActivityResultLauncher<Intent> =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == RESULT_OK) {
                val msg = result.data?.getStringExtra("data")
                Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
            }
        }
~~~

跳转页面使用`ActivityResultLauncher.launch`

~~~kotlin
    private fun jumpToSecond() {
        val intent = Intent(this, SecondActivity::class.java)
        intent.putExtra("data", "First Activity")
        resultLauncher.launch(intent)
    }
~~~

**完全移除了`onActivityResult`方法，使用`registerForActivityResult`注册一个监听，内部回调来获取数据结果**



### `registerForActivityResult`

registerForActivityResult()方法接收两个参数，第一个参数是一种Contract类型，由于我们是希望从另外一个Activity中请求数据，因此这里使用了StartActivityForResult这种Contract。第二个参数是一个Lambda表达式，当有结果返回时则会回调到这里，然后我们在这里获取并处理数据即可。

registerForActivityResult()方法的返回值是一个ActivityResultLauncher对象，这个对象当中有一个launch()方法可以用于去启用Intent。这样我们就不需要再调用startActivityForResult()方法了，而是直接调用launch()方法，并把Intent传入即可。

~~~java
//源码节选
    @NonNull
    @Override
    public final <I, O> ActivityResultLauncher<I> registerForActivityResult(
            @NonNull ActivityResultContract<I, O> contract,
            @NonNull ActivityResultCallback<O> callback) {
        return registerForActivityResult(contract, mActivityResultRegistry, callback);
    }

    @NonNull
    @Override
    public final <I, O> ActivityResultLauncher<I> registerForActivityResult(
            @NonNull final ActivityResultContract<I, O> contract,
            @NonNull final ActivityResultRegistry registry,
            @NonNull final ActivityResultCallback<O> callback) {
        return registry.register(
                "activity_rq#" + mNextLocalRequestCode.getAndIncrement(), this, contract, callback);
    }
~~~



### 申请权限

申请权限需要使用 `Contract`的类型是 `ActivityResultContracts.RequestPermission()`

```kotlin
private val permissionLauncher =
    registerForActivityResult(ActivityResultContracts.RequestPermission()){ granted->
        if (granted){
            Toast.makeText(this,"获取权限",Toast.LENGTH_LONG).show()
        }else{
            Toast.makeText(this,"拒绝权限",Toast.LENGTH_LONG).show()
        }
}
```

```kotlin
private fun requestPermission() {
    permissionLauncher.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE)
}
```



### 自定义`Contract`

自定义`contract`需要继承`ActivityResultContract`

~~~java
public abstract class ActivityResultContract<I, O> {

    public abstract @NonNull Intent createIntent(@NonNull Context context, I input);

    public abstract O parseResult(int resultCode, @Nullable Intent intent);
    ...
}
~~~

需要重写 `createIntent`和`parseResult `

自定义页面跳转的`contract`

~~~kotlin
class CustomContract : ActivityResultContract<String, String?>() {

    override fun createIntent(context: Context, input: String?): Intent {

        val intent = Intent(context, SecondActivity::class.java)
        intent.putExtra("data",input)
        return intent
    }

    override fun parseResult(resultCode: Int, intent: Intent?): String? {

        if (resultCode == Activity.RESULT_OK){
            val msg = intent!!.getStringExtra("data")
            return msg
        }
        return null
    }
}
~~~



## 注意

使用`registerForActivityResult`必须在生命周期**STARTED**之前调用，否则会发生异常

