---
layout:     post  
title:      Kotlin In Android
subtitle:   Android 
date:       2020-06-07
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---

[toc]





### 变量

Kotlin中声明变量与Java中不同。

~~~kotlin
// in Java
int i;
// in Kotlin
var i
val i
~~~

var：可变的变量类型，可以在赋值之后再改变值。

val：不可变类型，在初始化后就不可以改变值。

在Kotlin中代码结尾不用添加分号。

在声明变量的时候也可以不声明类型，Kotlin可以类型推到，声明变量之后再赋值的时候会自动推到出变量类型。



### 基本数据类型

Kotlin抛弃了Java定义的基本数据类型。Java中的int，long，short等类型在Kotlin中都使用了新的类型。第一个字母大写。

~~~kotlin
//in Java
int,long,double
//in Kotlin
Int,Long,Double
~~~



### 函数

函数就是方法。

kotlin中定义函数的模板

~~~
fun 函数名(变量名: 变量类型): 返回值类型 {
}
~~~

没有返回值类型可以不写。其实没有返回值类型，它的类型是`Unit`，kotlin允许省略不写。

如果函数只有一行代码的时候可以省略大括号直接用`=`连接函数体

~~~kotlin
fun getMax(i1:Int,i2:Int)= i1
~~~



### 条件语句

java中的调用控制有 `if`,`switch`。kotlin中也有`if`，将`switch`升级成了`when`

#### if条件

if条件的用法和java中一样。不过在kotlin中if条件是有返回值的。

~~~kotlin
fun getMax(i1:Int,i2:Int):Int{
    var max = 0
    if (i1>i2){
        max = i1
    }else{
        max = i2
    }
    return max
}
~~~

以上是类似java的用法。可以简写成

~~~kotlin
fun getMax(i1:Int,i2:Int):Int{
    var max = if (i1>i2){
        i1
    }else{
        i1
    }
    return max   
}
~~~

其实max这个变量也是多余的，可以直接省略

~~~kotlin
fun getMax(i1:Int,i2:Int):Int{
   return if (i1>i2){
        i1
    }else{
        i1
    }
}
~~~

#### when条件

用法和java中`switch`类似，但是`swithc`支持的类型很少，`when`支持所有的类型。基本用法如下：

~~~kotlin
fun whenTest(name: String) = when (name) {

    "a" -> 100
    "b" -> 90
    "c" -> 80
    else -> 0

}
~~~

`when`语句中必须添加else，对应`switch`中的`default`。`when`和`if`一样也是有返回值的。`when`语句可以传入一个任意类型的参数，在结构体中定义条件，匹配就可以执行`->`之后的代码。

`when`语句还可以配备类型

~~~kotlin
fun whenTest(number: Number) {
    when (number) {
        is Int -> print("is Int")
        is Double -> print("is Double")
        else -> print("is else")
    }
}
~~~

`is`相当于`instanceof`关键字。`Number`是`kotlin`中定义数字类型的共同父类。



### 循环语句

`kotlin`中也有 `for`,`while`循环。`while`循环的用法和java一样。

`kotlin`对`for`循环做了很大修改，`java`常用的`for-i`循环在`kotlin`中被丢弃，`for-each`循环被加强成了`for-in`循环。

#### 区间

区间是`java`没有的概念，表示两个数字的区间

~~~kotlin
val range = 0..10
~~~

表示0到10的区间（包括10）

~~~kotlin
//不包括10 
val range = 0 until 10
~~~

降序区间

~~~kotlin
//包括10和0
var range = 10 downTo 0
~~~



#### for循环

```kotlin
//正常循环0到9
fun forTest(){
    for (i in 0 until 10){
        println(i)
    }
}
```

```kotlin
//循环1到9 每次循环加2，相当于i=i+2 
fun forTest(){
    for (i in 0 until 10 step 2){
        println(i)
    }
}
```



### 类和对象

创建类的关键字也是使用`class`

~~~kotlin
class Person {
    var name = ""
    var age = 0
    
    fun eat(){
        println("name = "+ name+",age = "+age)
    }
}
~~~

~~~kotlin
//创建Person对象
val person = Person()
~~~

创建对象省略的`new`关键字

对象赋值

~~~kotlin
    val person = Person()
    person.name = "宫本武藏"
    person.age = 18
    person.eat()
~~~



### 继承

关于继承的概念和`Java`完全一样，写法上有些不同。

`Java`中用`extends`关键字，`kotlin`直接使用冒号`:`。

`Java`中被`final`修饰的类不可被继承。`kotlin`中默认给类添加了`final`属性，所有类默认不可以被继承。必须使用`open`关键字解除限制。

~~~kotlin
open class Person {
    var name = ""
    var age = 0

    fun eat(){
        println("name = "+ name+",age = "+age)
    }
}
~~~

~~~kotlin
class Student :Person() {

}
~~~



### 构造函数

#### 主构造函数

`kotlin`的构造函数和`Java`的不一样。在`kotlin`构造函数有主构造函数和次构造函数。

每个类都默认有一个无参的主构造函数，也可以显式的指明参数。主构造函数没有函数体，直接定义在类名后面。

~~~kotlin
open class Person(name:String,age:Int) {
  
}
~~~

在创建对象的时候就必须要传入相应的参数。

主构造函数没有函数体，如果要写逻辑代码可以放到`init`函数中，主构造函数默认调用`init`函数。

~~~kotlin
open class Person(name:String,age:Int) {    
    init {
        println(name)
        println(age)
    }    
}
~~~

**子类默认会调用父类的主构造函数**，所以在继承的时候父类的主构造函数就算没有参数也必须加上`()`

~~~kotlin
class Student :Person() {

}
~~~

当改变`Person`的构造成有参时候，这种继承就会报错了。

~~~kotlin
class Student (name:String,age:Int):Person(name,age) {

}
~~~

当子类不需要这两个参数的时候也可以直接手动赋值给父类

~~~kotlin
class Student ():Person("宫本武藏",18) {

}
~~~



#### 次构造函数

一个类只能有一个主构造函数，可以有无数个次构造函数。次构造函数默认会访问主构造函数。也是有函数体的。

次构造函数使用关键字`constructor`声明

~~~kotlin
class Student (val no:String):Person("宫本武藏",18) {

    constructor():this("927"){

    }
}
~~~

`this`代表访问主构造函数，并要传入对应的参数。



**注意**

还有一种特殊情况，一个类只有次构造函数，没有主构造函数。`kotlin`默认创建一个主构造函数，但是写了次构造函数就不会默认创建主构造函数。

~~~kotlin
class Student :Person {
    constructor( no:String):super("宫本武藏",18){

    }
}
~~~

这种情况`Student`没有主构造函数，那么次构造函数就要调用父类的主构造函数。因为`Student`没有主构造函数继承父类的时候就不需要在父类名后面加上括号了。



### 接口

`kotlin`中的接口和`Java`基本一样。类只能继承一个父类，可以实现多个接口。`Java`使用关键字`implements`，`kotlin`还是使用冒号`:`。

实现接口的时候接口名后面不用加括号，因为接口没有构造函数。

**注意**

`kotlin`中接口可以有默认实现，`Java`在18之后也可以。接口的函数有默认实现，子类可以不重写。



### 权限修饰符

`Java`

~~~java
publice		//公共
private		//私有，仅自身访问
protected	//保护的，自身和子类和同包访问
default		//默认的，自身和同包下访问。可以不写
~~~

`kotlin`

~~~kotlin
public 		//默认的，作用域和java一样
private 	//私有，仅自身访问。和java一样
protected	//保护的，自身和子类访问，同包下不可访问
internal 	//模块内可访问
~~~



### 数据类

在普通类上用`data`关键字修饰就变成了数据类型，数据类型默认会生成

`equals,hashCode,toString`函数



### 单例

`Java`中单例的写法

~~~java
class Singleton {

    private static Singleton instance;

    private Singleton() {
    }

    public synchronized static Singleton getInstance(){
        if (instance == null){
            instance = new Singleton();
        }
        return instance;
    }
}
~~~

`kotlin`中只需要使用`object`关键字就可以实现和上面一行的代码

```kotlin
object Singleton {
    
}
```

调用的时候可以直接使用类名`Singleton`点里面的函数



### 空指针检查

在`kotlin`中所有的对象都默认是非空的。

```kotlin
fun testNull(person:Person){

    person.eat()
}
```

这个函数如果调用的时候参数传递为`null`,编译器会报错。

如果这个函数允许参数为空，需要指定成可空类型，在类型后面加个`?`

~~~kotlin
fun testNull(person:Person?){

    person.eat()
}
~~~

这样在原先调用`eat`函数的代码会报错，必须先做空安全检查。

```kotlin
fun testNull(person:Person?){
    if (person != null) {
        person.eat()
    }
}
```

这种`if X!=nul`的写法过于繁琐，`kotlin`也提供了简写方案

`?.`:这个操作符表示当对象不为空的时候调用后面的代码，如果为空那就什么都不做。

```kotlin
person?.eat()
```

`?:`:这个操作符组左右两边都接受一个表达式，如果左边结果不为空就返回左边的结果，否则返回右边的结果。

```kotlin
val result = a?:b
```

相当于这段代码

~~~kotlin
val result = if (a!=null){
      a
    }else{
      b
    }
~~~

`!!`：强制不为空操作符，有些时候我们知道这个变量不会为空，不用考虑空指针的问题。使用这个操作符编译器就不会再对这个变量进行安全检查。

**注意：只是编译器不检查，这里如果为空还是会出现空指针异常。**

`let`函数，很多时候空安全的操作符都是配合这个函数使用

```kotlin
person.let { 
    print(person.name)
}
```

`let`函数的参数是一个表达式，然后调用这个表达式。let函数的返回值就是表达式的返回值。

一般在多次调用可空对象的时候可以这么写

```kotlin
//表示当person不为空的时候调用let中的函数体
person?.let {
    person.eat()
}
```



### 字符串内嵌表达式，字符串拼接

在字符串内调用对象的属性使用`$`

```kotlin
val str = "person的name= ${person.name}"
```

当单独使用这个对象作为字符串时候可以直接使用

```kotlin
val str = "person的name= $person"
```



### 函数默认值

在定义函数的时候可以给参数设置一个默认值

```kotlin
fun testParams(i:Int=0,str:String="a"){
    
}
```

这个函数在调用的时候可以不传入参数，不写参数会使用默认的参数。传入参数会使用传入的参数。在调用的时候可以指定参数的是哪个参数。

```kotlin
testParams(str="str")
```

上例中指定了`str`的值，而`i`还是使用默认值。

函数默认值可以很大程度上代替函数重载和次构造函数。



### 标准函数和静态函数

#### 标准函数

在Kotlin中的任何地方都可以调用。详见 2020-06-24-Kotlin中常用的标准函数

#### 静态函数

在java中使用``static``关键字标注的方法都是静态方法。

kotlin中没有``static``关键字，对应的功能用伴生对象实现 `companion object`

在类中创建了一个伴生类，伴生类中的字段都可以直接通过类名调用。在一个类中只会存在一个伴生对象。

~~~kotlin
    companion object {

        fun staticMethod() {
          //类似 java的静态方法
        }
    }
~~~

kotlin中并没有定义静态的关键字，但是有伴生对象来支持静态的调用。

**静态函数**

如果需要给java调用静态方法，可以使用注解和顶级函数。

#### @JvmStatic

使用`@JvmStatic`注解的方法，编译会把这个方法编译成真正的静态方法。

**注意：`@JvmStatic`这个注解只能使用在伴生对象里或者单例类中**

#### 顶级函数

顶级函数就是包级函数，没有定义在任何一个类中。写在kotlin文件中的函数。调用的时候也可以直接调用，不需要使用类名。如果是java调用需要使用文件名.函数名。



### 延时初始化

有很多时候需要将变量声明称成员变量，在某个方法中赋值。在使用前可以确保一定是已经赋值过的。但是kotlin的空安全机制要求在声明变量时就必须赋值或者声明称可空类型。

这是可以使用延时初始化来解决空安全限制。

~~~kotlin
    private lateinit var str: String
    fun test() {

        str = "test"
        str.length
        
    }
~~~

使用`lateinit`关键字。这个关键字相对于声明这个变量不需要kotlin对变量进行空安全判断。但是如果使用前没有做初始化配置还是会报错。

~~~kotlin
    private lateinit var str: String
    fun test() {

       if (::str.isLateinit){
           //变量未初始化
       }else{
           //变量已经初始化
       }
    }
~~~

以上代码可以判断变量是否已经进行过初始化。

**注意 `lateinit` 不允许修饰基础类型（基础类型int， double，boolean等）。 **



### 密封类(sealed Class)

密封类就是是子类固定的类，使用sealed修饰

和枚举的区别是：枚举实例固定，密封类是子类固定。

密封类和子类必须写在同一个文件

密封类本身是抽象的，不能直接实例化，构造函数默认是private



### 扩展函数

扩展函数就是在不修改类源码时候，在其他文件为这个类创建函数。

```kotlin
fun String.test(){
    println("调用了test")
    //扩展函数中如果要调用本身其他的函数，可以使用this
    val length = this.length
    println("length = $length")
}

fun main(args: Array<String>) {

    "test".test()
}
```

### 运算符重载

java是不支持运算符重载的，所谓运算符重载就是修改+-*/等运算符的功能。

使用关键字`operator`就可以重载运算符了。

如：user对象的年龄相加

```kotlin
class User(val age: Int) {

    operator fun plus(user: User): Int {
        return age + user.age;
    }
}


fun main(args: Array<String>) {

    val user1=User(1)
    val user2=User(2)

    val i = user1 + user2

    print(i)
}
```