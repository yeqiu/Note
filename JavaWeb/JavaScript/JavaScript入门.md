## JavaScript入门

[TOC]

### 页面使用js

和css一样都需要使用标签引入。

![](https://tva1.sinaimg.cn/large/006tNbRwly1gafq1em0zij30oi0axq52.jpg)

**script标签可以在html中的任何位置插入，css只能在head中引用**



### 变量

![](https://tva1.sinaimg.cn/large/006tNbRwly1gafvhr6mvyj30yj0i3t9p.jpg)

**js中是弱数据类型，创建时不需要声明类型。声明变量使用var关键字**





### 调试

![](https://tva1.sinaimg.cn/large/006tNbRwly1gafvlsr4sbj30yf0f975b.jpg)



### 自定义函数

![](https://tva1.sinaimg.cn/large/006tNbRwly1gafvt1am5bj30z60ildhh.jpg)

其实自定义函数就是JAVA中的方法。

~~~javascript
alert(add(1, 2))
function add(x, y) {
    return x + y;
}
~~~

定义函数的时候不用声明参数的类型，直接使用变量名





### 数据类型

![](https://tva1.sinaimg.cn/large/006tNbRwly1gafw5uf4tcj30oz0cvwf9.jpg)

![image-20191231143243979](/Users/yeqiu/Library/Application Support/typora-user-images/image-20191231143243979.png)

**NaN用于判断变量是否是数字类型，类似java中的 instanceof**





####数据类型的转换

![](https://tva1.sinaimg.cn/large/006tNbRwly1gafwrmcb06j30og0dx76s.jpg)



### 变量

变量的作用域

全局变量和局部变量作用域和java一致。局部变量的作用域只能在函数内部。



### 运算符

运算符的用法也和java一致。



![](https://tva1.sinaimg.cn/large/006tNbRwly1gafz2f6q8yj310n0ixmz1.jpg)





### 程序控制语句

程序控制语句大致就是

1.if判断语句

2.switch条件判断语句

3.循环语句

这三种控制语句的用法也和java一致。



### 内置函数

![](https://tva1.sinaimg.cn/large/006tNbRwly1gafzde5cnqj30wi0gz40d.jpg)



#### 字符函数

~~~java
concat()：拼接字符串，也可以拼接数组
~~~

其他的和java一致



#### 日期函数

~~~java
let d = Date();         //获取当前日期
let data = d.getDate(); //当前几号
let day = d.getDay();   //当前是周几 从0开始 周末
let month = d.getMonth();//当前是几月 从0开始 当前月份需要+1
let fullYear = d.getFullYear();//当前是哪一年
 let fullYear = d.getYear();//当前是哪一年 和getFullYear一样，已经被废弃
let hours = d.getHours();   //当前的小时
let minutes = d.getMinutes();//当前的分钟
let seconds = d.getSeconds();//当前是秒数
~~~

格式化时间

![](https://tva1.sinaimg.cn/large/006tNbRwly1gafzwd6ncwj30mv0bsjtf.jpg)





#### 数学函数

数学函数的用法也和java中基本一致



### 数组

#### 创建

```javascript
var array = new Array();    //创建数组 不指定长度
var array = new Array(5);    //创建数组 指定长度
var array = new Array(1,2,3,4,5);    //创建有数据的数组
var array = [1,2,3,4,5];    //隐式创建数据
```

#### 遍历

```javascript
for (var index in array){
    console.log(array[index])
}
```

普通的for循环也可以完成遍历





### 表单元素设置



### DOM和事件总结



