# Moshi的基本使用

## Gson

```kotlin
val  json = """
    {
    "name":null,
    "age":20,
    "sex":true
    }
""".trimIndent()


data class User(val name: String, val age: Int, val sex: Boolean)
```

~~~kotlin
        val user = Gson().fromJson(json, User::class.java)
        user.log()
        user.name.log()
~~~

以上的代码会在最后一行崩溃

~~~kotlin
    Caused by: java.lang.NullPointerException: Parameter specified as non-null is null: method com.yeqiu.jsontest.MainActivity.log, parameter <this>
~~~



Kotlin的类型中会严格区分可空和不可空，User的声明中各个字段都是不可空的类型。

DataClass编译后没有无参构造，Gson会通过Unsafe来实现User的实例化。但是生成的对象是不安全的。

Gson在构建对象是没有使用构造函数，绕过了Kotlin的Null检查，所以在构建对象时不会报错。

但是使用时触发了kotlin的类型检测，就抛出了空指针异常。





#### 默认参数失效

针对以上的空指针报错，使用可空类型就可以解决。

```kotlin
data class User(val name: String? = "test", val age: Int, val sex: Boolean)
```

以上代码将name字段修改为可空类型并添加默认值，但是使用Gson解析DataClass，默认值不会生效

日志结果

~~~kotlin
10:37:26.503  I  User(name=null, age=20, sex=true)
~~~

Gson没有通过构造参数生成对象，所以默认值就不会生效。



解决方案 

- 使用普通类，提供默认的无参构造
- 添加`@JvmOverloads` 注解，实际也是通过提供无参构造

## Moshi依赖

```groovy
implementation:"com.squareup.moshi:moshi:1.15.0",
 //添加编译代码，非必须
kapt:"com.squareup.moshi:moshi-kotlin-codegen:1.15.0",
```



## 基本使用

```kotlin
    fun moshiTest(){
        val moshi = Moshi.Builder()
            .addLast(KotlinJsonAdapterFactory())
            .build()
        //获取的对象是可空类型的
        val user = moshi.adapter(User::class.java).fromJson(json)
        user?.log()
    }
```

**注意如果声明的字段是不可空的，实际json是null，会直接在转换时候报错**

**就算使用了默认参数，如果json的数据是null，默认参数依然不会生效。如果json中没有这个字段，会使用默认参数**



### json反序列化

如果json是空字符串，gson反序列化可以成功。但是得到是一个null对象。

```kotlin
//空json 这行代码不会报错。类型显示得到的 user! 实际是null
val user = Gson().fromJson(json, User::class.java)
```

#### 风险项

java中没有不可空类型，所有类型都是可空类型。kotlin调用java获取的对象都应该看成可空类型。

kotlin在平衡和java类型的互通时，加入了平台类型，即引用java获取对象时，可以看成可空，也可以看成不可空。编译器不要求对该对象进行null check。然鹅这样会很容易写出空指针代码。

**java代码返回的对象尽可能的做非空检查**

## Moshi工具类

使用了kapt编译代码

```kotlin
object MoshiUtil {

     val moshi:Moshi = Moshi.Builder()
        .addLast(KotlinJsonAdapterFactory())
        .build()


    fun <T> fromJson(json:String,type:Type):T?{
        val adapter: JsonAdapter<T> = moshi.adapter(type)
        return adapter.fromJson(json)
    }

    fun <T> toJson(t:T,type:Type):String{
        val adapter: JsonAdapter<T> = moshi.adapter(type)
        return adapter.toJson(t)
    }


    inline fun <reified T>fromJson(json:String):T?{

        val adapter:JsonAdapter<T> = moshi.adapter(T::class.java)
        return adapter.fromJson(json)
    }


    fun toJson(data: Any): String {
        val adapter: JsonAdapter<Any> = moshi.adapter(data.javaClass)
        return adapter.toJson(data)
    }

}
```