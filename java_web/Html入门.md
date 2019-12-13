#### Html入门

### 基本结构

html文件的基本结构由如下

~~~html
<html>
<head>
    <title>first.html</title>
</head>
<body>
</body>
</html>
~~~

有html，head，body三个标签。



### 常用标签

| 标签 | 格式            |
| :--: | :-------------- |
| 段落 | <p>..</p>       |
| 标题 | <h1~6>..<h1~6>  |
| 注释 | <!--注释正文--> |
| 换行 | `<br>`          |

#### 图标标签

~~~html
<img src="../img/img.jpg" alt="not find img">
~~~

src：图片的路径 

alt：图片路径发生错误的时候显示的文案



#### 超链接

~~~html
<a href="welcome.html">欢迎页</a> <br>
<a href="https://www.baidu.com">去百度</a> <br>
<a href="welcome.html" target="_blank">在新标签打开欢迎页</a><br>
~~~

使用<a></a>标签 href属性指定要跳转的连接，可以使别的html文件，也可以是网站。target属性指定在当前页打开还是新建页面打开



#### 锚点

锚点也是超链接的一种，预先在指定位置上设置锚点，然后可以打开这个锚点。实现一个位置跳转，可以是在本文件也可以其他文件。

锚点需要先标记在使用

1.使用a标签声明锚点

~~~html
  <a name="锚点1"> 锚点1:阿姆斯特朗回旋加速喷气式阿姆斯特朗炮</a>
~~~

2.使用锚点

~~~html
<a href="#锚点1">锚点1</a> <br>
//跳转到其他文件的锚点
<a href="HtmlTest.html#锚点1">上一页锚点1</a>
~~~



### 列表

#### 无序列表

无需列表并不是真的无需，它的样式是在文字前加上一个点，例

- 无序列表1
- 无序列表2
- 无序列表3

~~~html
<ul>
    <li>无序列表1</li>
    <li>无序列表2</li>
    <li>无序列表3</li>
</ul>
~~~

使用ul标签，内部每个item使用li标签



#### 有序列表

有序列表就是在文字前加上序号，例

1. 有序列表1
2. 有序列表2
3. 有序列表3

~~~html
<ol>
    <li>有序列表1</li>
    <li>有序列表2</li>
    <li>有序列表3</li>
</ol>
~~~

和无需列表很类似，只是父标签使用ol，内部itme还是使用li标签



### 表格

~~~html
<table border="1" width="400px">
    <tr>
        <td>星期</td>
        <td>星期1</td>
        <td>星期2</td>
        <td>星期3</td>
        <td>星期4</td>
        <td>星期5</td>
    </tr>
</table>
~~~

table：表格

tr：行

td：列

border：表格边框

width：表格宽度

在编写表格时候时，可以先写出一行的数量，然后复制指定的列数。一行一行的写。

**关于表格的一些属性**

![](https://tva1.sinaimg.cn/large/006tNbRwly1g9tz9t5vunj30x30av0ur.jpg)





### 表单

表单用于搜集用户输入信息，是一个不可见的标签

#### 表单的常用控件

~~~html
<form action="" method="">
    <!--普通输入框-->
    <label>请输入姓名：</label>
    <input type="text" name="" id=""> <br>
    <label>请输入密码：</label>
    <input type="password" name="" id=""> <br>
    <label>请重复密码：</label>
    <input type="password" name="" id=""> <br>

    <!--单选框-->
    <label>性别</label>
    <input type="radio" name="sex" id="" value="男"> 男
    <input type="radio" name="sex" id="" value="女"> 女 <br>

    <!--多选框-->
    <label>兴趣爱好</label>
    <input type="checkbox" name="" id="" value="1"> 看书
    <input type="checkbox" name="" id="" value="2"> 游泳
    <input type="checkbox" name="" id="" value="3"> 吃鸡
    <input type="checkbox" name="" id="" value="4"> 王者荣耀 <br>

    <!--下拉框-->
    <label>生日：</label>
    <select>
        <option value="1990">1990</option>
        <option value="1991">1991</option>
        <option value="1992">1992</option>
        <option value="1993" selected="selected">1993</option>
        <option value="1994">1994</option>
        <option value="1995">1995</option>
    </select>年
    <select>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4" selected="selected">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
    </select>月
    <select>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4" selected="selected">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
    </select>日 <br>

    <label>头像</label>
    <img src="../img/img.jpg" width="30px" height="30px">
    <select>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
    </select> <br>

    <!--普通按钮-->
    <input type="button" value="普通按钮"> <br>
    <!--提交按钮-->
    <input type="submit" value="提交按钮"> <br>

    <!--多行文本框-->
    <textarea rows="10" cols="100" name="" id="">这是个大文本框</textarea> <br>

    <!--文件选择-->
    <input type="file"> <br>

    <!--隐藏文本框-->
    隐藏文本框前。。。<input type="hidden">隐藏文本框后 <br>

    <!--列表框-->
    <select size="4">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
    </select> <br>
  
</form>
~~~



