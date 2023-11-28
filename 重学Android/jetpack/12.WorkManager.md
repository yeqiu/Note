# Jetpack WorkManager的使用

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









