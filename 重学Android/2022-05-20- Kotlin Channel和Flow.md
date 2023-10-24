# Kotlin Channel和Flow



> Android中使用Chnnel和Flow



##  Channel

### Channel就是管道

Channel就是一个管道，发送端在一端发送，接收方在一端接受，管道本身用来传递数据。

```kotlin
fun test41() = runBlocking {

    val channel = Channel<Int>()
    //发送数据
    launch {
        (1..3).forEach {
            channel.send(it)
            "send $it".log()
        }
    }

    //接受数据
    launch {

        for (i in channel) {
            "get $i".log()
        }
    }

    "end".log()

}
```

代码中发送和接收是交替执行的，发送和接收在两个协程中。channel可以跨协程通信。



- 通过 Channel<Int>()创建了一个Channel，用于传递Int类型的数据
- 创建协程使用 channel.send(it) 发送数据
- 创建协程遍历channel获取数据
- 程序执行完并没有退出。程序还处于运行状态

channel是一种协程资源，当使用完channel后不主动关闭就不会结束。需要调用channel.close()



```kotlin
val channel = Channel<Int>()
//发送数据
launch {
    (1..3).forEach {
        channel.send(it)
        "send $it".log()
    }

    //在发送完数据后调用关闭
    channel.close()
}
```



创建 Channel 的源代码



~~~kotlin
public fun <E> Channel(
    capacity: Int = RENDEZVOUS,
    onBufferOverflow: BufferOverflow = BufferOverflow.SUSPEND,
    onUndeliveredElement: ((E) -> Unit)? = null
): Channel<E> {}
~~~

通过顶层函数Channel创建一个Channel，有三个参数

- capacity：容量，代表管道的容量大小
- onBufferOverflow：当容量满了之后的应对策略
- onUndeliveredElement：异常的处理，当管道中的数据没有被成功接受到会回调这个参数



#### capacity

- UNLIMITED：无限容量
- CONFLATED：容量1
- BUFFERED：一定缓存容量，默认是64

~~~kotlin
val channel = Channel<Int>(Channel.Factory.UNLIMITED)
~~~

使用了UNLIMITED，设置管道容量无限大。发送方可以一直发送数据直到所有数据都发送完，接收方才接受数据。这和默认的执行顺序是不一样的。





> Channel()的capacity默认是RENDEZVOUS，就是0。并不是字面上的0，是动态变化的，RENDEZVOUS没有缓冲区，发送方和接收方必须同时准备好，才能传递数据。也可以看成是无限容量，但是需要发送和接收同步处理



对于CONFLATED，发送方也是能一直发送数据，但是接收方只能接受到最后一条数据。



#### onBufferOverflow

- SUSPEND：容量满了直接如果还继续发送就挂起，直到接收了数据，管道中有空位置再回复
- DROP_OLDEST：丢弃最旧的数据，发送新数据
- DROP_LATEST：丢弃最新的数据，其实就是丢弃要准备发送的那条数据



#### onUndeliveredElement

onUndeliveredElement的作用就是一个回调，当发送的数据无法被接受的时候回调。

```kotlin
val channel = Channel<Int>(onUndeliveredElement ={
    "onUndeliveredElement 执行了 $it".log()
})
```

### Channel关闭引发的问题

Channel不调用close()会导致程序无法终止，官方提供了另一种创建Channel的方式，produce{}，自动关闭

```kotlin
fun test41() = runBlocking {

    //使用produce创建channel
    val channel = produce<Int> {
        (1..3).forEach {
            channel.send(it)
            "send $it".log()
        }
    }
    
    launch {
        for (i in channel){
            "get $i".log()
        }

    }
    
    "end".log()

    delay(3000)

}
```

#### channel.receive()

调用channel.receive()会取出管道中的数据，如果使用produce创建flow，当管道中已经没有数据时候还调receive会抛出异常。以为produce自动关闭了管道。如果不关闭管道，无数据时候调用receive会挂起，直到有数据进入管道。

所以直接使用channel.receive()很容易出问题。

Channel 其实还有两个属性：isClosedForReceive、isClosedForSend。对于发送方，我们可以使用“isClosedForSend”来判断当前的 Channel 是否关闭；对于接收方来说，我们可以用“isClosedForReceive”来判断当前的 Channel 是否关闭。

但是当指定了capacity以后这种判断就很不可靠。

关于指定了 capacity 以后判断不可靠的问题，以下来自GPT

~~~txt
当你在 Channel 中指定了容量（capacity）后，`isClosedForReceive` 的判断可能会变得不可靠。这是因为在某些情况下，即使 Channel 已经关闭，`isClosedForReceive` 仍然会返回 false。

这种情况可能发生在以下场景中：

1. 缓冲区未满：当你使用有限容量的 Channel 时，并且该通道的缓冲区还没有完全填满，发送者可以继续将数据发送到 Channel 中，即使 Channel 已关闭。此时，`isClosedForReceive` 会返回 false，因为仍然有数据可以从 Channel 接收。

2. 缓冲区中还有数据：即使 Channel 已关闭，但在 Channel 的缓冲区中仍然有未被接收的数据时，`isClosedForReceive` 会返回 false。这是因为 `isClosedForReceive` 只检查 Channel 是否关闭，而不检查缓冲区中是否有数据可用。

在这些情况下，即使 Channel 已经关闭，`isClosedForReceive` 仍然返回 false，这可能导致在调用 `channel.receive()` 之前误判 Channel 的状态，从而引发异常。

因此，当你为 Channel 指定了容量时，不能完全依赖 `isClosedForReceive` 的判断来确保安全性。相反，你可能需要使用其他机制来通知接收方 Channel 的关闭状态，例如通过协议或其他信号。

总结起来，指定了容量的 Channel 在使用 `isClosedForReceive` 进行判断时可能会变得不可靠，因为它无法检查缓冲区中的数据以及发送者继续发送数据的情况。要确保可靠的关闭通知，你可能需要采用其他方式来处理 Channel 的关闭状态。
~~~

#### channel.consumeEach {}

Kotlin 提供了一个高阶函数：channel.consumeEach {} 用于接受数据

```kotlin
fun test41() = runBlocking {

    //使用produce创建channel
    val channel = produce<Int> {
        (1..3).forEach {
            channel.send(it)
            "send $it".log()
        }
    }
    
    launch{
        //使用consumeEach接收数据
        channel.consumeEach {
            "get $it".log()
        }
    }
    "end".log()
    delay(3000)

}
```



> 在某些特殊场景下，如果必须要自己来调用 channel.receive()，那么可以考虑使用 receiveCatching()，它可以防止异常发生。

### Channel是热流

Channel中不管是否消费数据，发送方都会工作的模式称为热流。

如果管道设置为0，只发送不接受的话代码就被会被挂起，程序无法退出。

#### 弊端

Channel是热流可能会导致

- 可能会导致数据丢失，如果没有接受数据，发送的数据就无法被消费
- 无论是否接受到会发送数据，可能会造成资源浪费
- 没有及时关闭会导致程序挂起，可能导致内存泄漏

## Flow

### Flow就是数据流

Flow和Channel不一样，Flow并不是只有发送和接收，它在中间流淌时数据可以发生改变。

数据的发送方称为 上游

数据的接受方称为 下游

![image-20230706153653566](http://pic-1259520863.cos.ap-beijing.myqcloud.com/uPic/image-20230706153653566.png)



在上游和下游之间有很多中转站，中转站可以对数据进行一些处理。

```kotlin
fun flowTest() = runBlocking {

    flow {
        emit(1)
        emit(2)
        emit(3)
        emit(4)
        emit(5)
    }.filter {
        //筛选大于2
        it > 2
    }.map {
        //映射 +1
        it + 1
    }.collect {
        it.log()
    }
    
    
    delay(3000)
}
```

1.通过函数flow{}创建一个flow，通过emit()往下游发送数据，相当于创建了一个数据流，上游负责创建数据并发送。

2.filter{}、map{} 这些操作符就是中间操作符，可以看成中转站，他们会对数据进行处理。

3.collect{} 终止操作符，它的作用就是终止flow数据流并接受数据，相当于下游。



Flow和List的Api很相似。

~~~kotlin
fun main() = runBlocking {
    flowOf(1, 2, 3, 4, 5).filter { it > 2 }
        .map { it * 2 }
        .take(2)
        .collect {
            println(it)
        }

    listOf(1, 2, 3, 4, 5).filter { it > 2 }
        .map { it * 2 }
        .take(2)
        .forEach {
            println(it)
        }
}
~~~



三种创建Flow的方式

![image-20230706161737891](http://pic-1259520863.cos.ap-beijing.myqcloud.com/uPic/image-20230706161737891.png)

### 中间操作符

多数的中间操作符都和List很相似。

onStart、onCompletion 这两个是比较特殊的。它们是以操作符的形式存在，但实际上的作用，是监听生命周期回调。

~~~kotlin
    flow {
        emit(1)
        emit(2)
        emit(3)
        emit(4)
        emit(5)
    }.filter {
        //筛选大于2
        it > 2
    }.map {
        //映射 +1
        it + 1
    }.onStart {
        "onStart".log()
    }.onCompletion {
        "onCompletion".log()
    }.collect {
        it.log()
    }
~~~

### Flow生命周期

Flow的执行顺序并不是全是按照代码顺序执行的。

上例中onStart在后面，也会先被执行，因为onStart、onCompletion本质上是生命周期的回调。

其他的，filter、map、take 这类操作符，它们的执行顺序是跟它们的代码位置相关的。



onCompletion{} 在面对以下三种情况时都会进行回调：

- 1.Flow 正常执行完毕
- 2.Flow 当中出现异常
- 3.Flow 被取消

### Flow的异常处理

Flow 主要有三个部分：上游、中间操作、下游。Flow 当中的异常，也可以根据这个标准来进行分类，也就是异常发生的位置。

发生在上游、中间操作这两个阶段的异常(包括onStart和onCompletion)，我们可以直接使用 catch 这个操作符来进行捕获和进一步处理

```kotlin
fun flowTest() = runBlocking {

    flow {
        emit(4)
        emit(5)
    }.filter {
        //筛选大于2
        it > 2
    }.map {
        //映射 +1
        it + 1
        throw IllegalStateException()
    }.onStart {
        "onStart".log()
    }.onCompletion {
        "onCompletion".log()
    }.catch {
        "发生了异常".log()
    }.collect {
            it.log()
        }
    delay(3000)
}
```

catch 这个操作符，其实就相当于使用的 try-catch。但是Flow 具有上下游的特性，catch 这个操作符的作用是和它的代码位置强相关的

**catch 的作用域，仅限于 catch 的上游**

针对下游的异常可以直接使用try-catch

```kotlin
flow {
    emit(4)
    emit(5)
}.filter {
    //筛选大于2
    it > 2
}.map {
    //映射 +1
    it + 1
}.catch {
    "发生了异常".log()
}.collect {
    try {
        throw IllegalStateException()
        it.log()
    }catch (e:Exception){
        "collect中发生了异常".log()
    }
}
```

### 切换Context

使用flowOn、launchIn

```kotlin
flow {
    emit(4)
    emit(5)
}.filter {
    //筛选大于2
    it > 2
}.map {
    //映射 +1
    it + 1
    "执行了map".log()
}.catch {
    "发生了异常".log()
}.flowOn(Dispatchers.IO)
    .collect {
        it.log()
    }
```

flowOn 操作符也是和它的位置强相关的。它的作用域跟前面的 catch 类似：**flowOn 仅限于它的上游**。不会影响下游collect中的代码。

针对下游操作，官方提供了另一个操作符，launchIn。

```kotlin
val scope = CoroutineScope(Dispatchers.IO)
flow {
    emit(5)
    emit(6)
}.flowOn(Dispatchers.IO)
    .filter {
        "filter  $it".log()
        it > 2
    }.onEach  {
        "onEach  $it".log()
    }.launchIn(scope)
```

以上代码没有直接使用 collect{}，使用onEach{} 来实现类似 collect{} 的功能。最后使用了 launchIn(scope)，把它上游的代码都分发到指定的线程当中。

launchIn 从严格意义来讲，应该算是一个下游的终止操作符，它本质上是调用了 collect()。

### 下游操作符

下游操作符就是终止操作符，用于终止flow流的操作符。

所以collect 操作符之后无法添加其他的操作符。

最常见的终止操作符就是 collect。还有一些从集合当中抄过来的操作符，也是 Flow 的终止操作符。如 first()、single()、fold{}、reduce{}。

尝试将 Flow 转换成集合的时候，它本身也就意味着 Flow 数据流的终止。比如说，我们前面用过的 toList。

~~~kotlin
    flowOf(1, 2, 3)
        .map {
            it > 2
        }.toList()
~~~

### Flow是冷流

对应Channel是热流，在Flow中不调用终止操作符，整个数据流不会工作。

### Flow是懒流

Flow在数据流中每次操作都会只操作一个数据



### Flow的使用场景

```kotlin
flowOf(data)
    .onStart {
        "开始加载loading"
    }.flowOn(Dispatchers.IO)
    .catch {
        "处理异常"
    }.onEach {
        "更新ui"
    }.onCompletion {
        "隐藏loading"
    }.launchIn(uiScope)
```

通过监听 onStart、onCompletion 的回调事件，就可以实现 Loading 弹窗的显示和隐藏。而对于出现异常的情况，我们也可以在 catch{} 当中调用 emit()，给出一个默认值，这样就可以有效防止 UI 界面出现空白。



