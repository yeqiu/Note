# kotlin中的一些解惑

## kotlin中inline`、`noinline`和`crossinline

- inline：将函数编译后内联到调用处，而不是通过函数调用的方式。可以减少函数开销，有一定程度性能优化。适用于函数体较小调用频繁的场景。

- noinline：标志某个函数参数在函数体内不应该被内联，默认编译器会将所有的lambda表达式参数内联。

  大多数情况下不需要使用noinline。如果希望保留Lambda的引用，或者传递给其他的函数就需要使用noinline。见代码

  ~~~kotlin
  inline fun inlineFun( block: () -> Unit) {
      //内部调用test函数传递了block，编译器会报错
      //如果需要传递block，那么block必须使用noinline
      test { block }
  }
  
   fun test( inline: (Int) -> Unit){
  
  }
  ~~~

  

  

- crossinline：表示Lambda表达式中的`return`语句不能从它所在的函数中返回。默认Lambda表达式可以使用return，允许返回函数。但有时候有歧义。例如只想return Lambda表达式，但是使用return会返回整个函数。

~~~kotlin
fun main() {
    testCrossInline {
        // 使用 return@testCrossInline 跳出 Lambda 表达式而不是跳出整个函数
        if (it == 3) {
            //直接写 return 会报错
            return@testCrossInline
        }
        println(it)
    }
    
}

inline fun testCrossInline(crossinline block:(Int)->Unit){

    val data = listOf(1, 2, 3, 4, 5)
    data.forEach { number ->
        block(number)
    }
}
~~~

## let`、`also`、`apply`、`with`和`run各自的使用场景

- let：接受调用者为参数，内部使用it代表调用者。

  返回值：最后一行

  使用场景：常用语对一个可空对象做非空判断，或者一系列连续处理并返回结果。

  ~~~kotlin
  val result = someObject?.let { obj ->
      // 在此处对 obj 进行操作或转换
      // 并返回最后一个表达式的值作为 result
      obj.doSomething()
      obj.calculate()
  }
  ~~~

  

- also：接受调用者为参数，内部使用it代表调用者。

  返回值：调用者本身

  使用场景：修改自身的一些数据，并希望链式调用其他函数

  ~~~kotlin
  someObject.also { obj ->
      // 在此处对 obj 进行操作
      obj.setData("data")
  }.doSomething()
  ~~~

- apply：接受调用者为参数，内部使用this代表调用者。

  返回值：调用者本身

  使用场景：用户对自身属性需要进行修改，并返回对象本身

  ~~~kotlin
  val view = TextView(context).apply {
      text = "Hello"
      textSize = 18
      setOnClickListener { /* 点击事件处理 */ }
  }
  ~~~

  

- with：作用和apply相似，但是不是扩展函数。它不可以被其他对象对用，可以直接调用。它需要一个参数，内部可以调用参数的函数。

  返回值：最后一行

  使用场景：用于对一个对象进行多次处理，并返回表达式结果

  ~~~kotlin
  val result = with(someObject) {
      // 在此处对 someObject 进行操作或转换
      doSomething()
      calculate()
  }

- run：是let和with的结合体。调用者在内部使用this

  返回值：最后一行

  使用场景：用于对一个对象进行多次处理，并返回表达式结果

