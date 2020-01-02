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



### 表单元素设置，事件监听

js的事件都是以on开头，如 onclick，onchange，onload



![](https://tva1.sinaimg.cn/large/006tNbRwly1gai2tkl69tj30o108aabi.jpg)



**获取元素对象**

![](https://tva1.sinaimg.cn/large/006tNbRwly1gaiba4rditj30yf0hqgo4.jpg)



**按钮点击事件**

~~~html
//指定button的onclick函数是onclick1() 执行多个函数可以用,隔开
<input type="button" id="button" value="button" onclick="onclick1()" />
~~~

~~~javascript
//js中证明onclick1()函数
function onclick1() {
    alert("onclick1")
}
~~~



**获取元素**

~~~javascript
document.getElementById("button")
//这个获取的是数组
document.getElementsByName("button")
~~~



**单选按钮**

~~~html
<input type="radio" name="sex" value="男">男
<input type="radio" name="sex" value="女">女<br>
~~~

~~~javascript
function onLoad() {
    let sex = document.getElementsByName("sex");
    sex[0].checked = true;
}

function onclick1(){
    let sex = document.getElementsByName("sex");
    var sexText ;
    if (sex[0].checked) {
        sexText = sex[0].value;
    }else{
        sexText = sex[1].value;
    }
    alert(sexText)
}
~~~



**列表框**

~~~html
<select name="yyyy" id="yyyy"></select>
<select name="mm" id="mm"></select>
<select name="dd" id="dd"></select>
~~~

~~~javascript
function onLoad() {
    let yyyy = document.getElementById("yyyy");
    let mm = document.getElementById("mm");
    let dd = document.getElementById("dd");
    let date = new Date();
    let yare = parseInt(date.getFullYear());

    for (let i = 2000; i <=yare; i++) {
        yyyy.options.add(new Option(i, i))
    }
    for (let i = 1; i <=12; i++) {
        mm.options.add(new Option(i, i))
    }
    for (let i = 1; i <= 31; i++) {
        dd.options.add(new Option(i, i))
    }
}
~~~

~~~javascript
//列表框设置默认选中，动态删除添加option
//年月日三级联动
var yyyy;
var mm;
var dd;

function onLoad() {
    yyyy = document.getElementById("yyyy");
    mm = document.getElementById("mm");
    dd = document.getElementById("dd");
    //设置默认的年月日
    let date = new Date();
    let year = parseInt(date.getFullYear());

    initSelect(yyyy,2000,year);
    initSelect(mm,1,12);
    initSelect(dd,1,31);
    //年份默认选中居中的位置
    var n=yyyy.length;
    yyyy.selectedIndex=Math.round(n/2);
}


/*给列表框赋值，传递三个参数：表单元素，开始值，结束值*/
function initSelect(obj,start,end){
    for(var i=start;i<=end;i++){
        obj.options.add(new Option(i,i));
    }
}

function onChangeYmd() {
    //清除当前的日，重新赋值
    dd.options.length = 0;
    
    var m=parseInt(mm.value);
    var dayEnd;
    switch (m) {
        case 4:
        case 6:
        case 9:
        case 11:
            dayEnd = 30;
            break
        case 2:
            //闰年判断
            y=parseInt(yyyy.value);
            if((y % 4==0 && y % 100 !=0) || y % 400 ==0){
                dayEnd=29;
            }else{
                dayEnd = 28;
            }
            break
        default:
            dayEnd = 31;
            break
    }
    //重新设置日
    initSelect(dd,1,dayEnd)
}
~~~





**js中添加事件**

~~~html
<input type="button" id="btn" value="按钮" />
~~~

~~~javascript
function onClick() {
    document.getElementById("btn").onclick = function () {
        alert("btn的点击事件")
    }
}
~~~

onClick是自定义函数，函数中获取btn按钮并设置点击事件。

注意：这种方式需要在html的onload调用到这个函数。相当于andorid中在onCreate()注册点击事件。





### DOM和事件总结



![](https://tva1.sinaimg.cn/large/006tNbRwly1gaiba4rditj30yf0hqgo4.jpg)



### 其他操作

