## css入门



[TOC]



### 基础

**标签选择器**

~~~css
        p {
            background-color: #105cb6;
            font-size: 30px;
        }
~~~

以上就是一个样式选择器，选择所有p标签的内容，做背景颜色和字体大小的设置。内部样式在<head>标签内添加<style>标签。

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style type="text/css">
        p {
            background-color: #105cb6;
            font-size: 30px;
        }
    </style>
</head>
<body>
<p>
    阿姆斯特朗回旋加速喷气式阿姆斯特朗炮
</p>

<p>
    “参加过多场星际战争，取得过多次胜利，威力强大。但由于外形过于猥琐，所以坏评不断，不得已只能退出。”<br>
    “天人曾用它轰掉天守阁，强行打开江户大门的决定性兵器。”<br>
    “在巴尔干战役中被称作“活动天雷”，是引起悲剧『烈火七日』的罪魁祸首，地狱之兵器。”<br>
    “与在采桑星和客香星的大战中，采桑星用来取胜的方程炮相反，是一直被扔在仓库中的可悲的兵器。 ”<br>
    “被称作一副傻样，一看就是不中用的炮。”
</p>
这不是阿姆斯特朗回旋加速喷气式阿姆斯特朗炮吗？还原度真高啊
</body>
</html>
~~~



### css基本使用

#### css选择器

选择器是用来选择需要添加样式的位置，常用的有标签选择器，类选择器。

标签选择器就是已标签分类，设置所有该标签的样式

~~~html
<p class="p1">
    “参加过多场星际战争，取得过多次胜利，威力强大。但由于外形过于猥琐，所以坏评不断，不得已只能退出。”<br>
    “天人曾用它轰掉天守阁，强行打开江户大门的决定性兵器。”<br>
    “在巴尔干战役中被称作“活动天雷”，是引起悲剧『烈火七日』的罪魁祸首，地狱之兵器。”<br>
    “与在采桑星和客香星的大战中，采桑星用来取胜的方程炮相反，是一直被扔在仓库中的可悲的兵器。 ”<br>
    “被称作一副傻样，一看就是不中用的炮。”
</p>
~~~

以上给标签p添加了一个类 p1。

类选择器在设置样式时要以点开头

~~~html
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style type="text/css">
        p {
            background-color: #105cb6;
            font-size: 30px;
        }
        .p1{
            font-family: 楷体,cursive;
        }
    </style>
</head>
~~~



#### 背景样式设置

![](https://tva1.sinaimg.cn/large/006tNbRwly1g9ykx8xg0lj30zy0hr0w3.jpg)

![](https://tva1.sinaimg.cn/large/006tNbRwly1g9ykxvz31ej30xn0hswgr.jpg)



#### 外部样式表

外部样式表就是将html和css分离。在html内部中引用css文件。

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga7ta19r64j30t70f6myy.jpg)

将内部样式的css写入到一个css文件中，在html的head标签中使用link标签引用css

```html
<link rel="stylesheet" type="text/css" href="Index.css">
```





### 文本样式类

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga7tofuqa2j30v90hugmt.jpg)

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga7toqo1e3j30zf0ifjtf.jpg)

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga7u3jkb4rj310k0h7mzl.jpg)

```css
p {
    background-color: yellow;
    font-size: 30px;
    color: #105cb6;
    direction: ltr;
    letter-spacing: 10px;
    line-height: 50px;
    text-align: justify;
    text-decoration: line-through;
    text-shadow: 5px 5px 5px red;
    text-transform: uppercase;
    /* text-indent: 2em;*/
    text-indent: 30px;
}
```



#### 列表样式

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga7u6wa4sqj310b0gotb7.jpg)

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga7u7843w7j30wv0jtdht.jpg)

```css
ul{
    /*list-style-type: circle;
    list-style-position: outside;
    list-style-image: url("image/headLogo/1.gif");*/
    list-style: outside url("../../img/1.gif");
}
ol{
    list-style-type: lower-latin;
}
```



#### 伪类和伪元素

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga902pf9gaj30wo0iggnp.jpg)





#####状态伪类

当标签的状态发生改变的样式

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga9034cwmej30w40hdgni.jpg)

```css
a:link{
   /*  默认样式  */
    color:red;
}
a:visited{
  /*  已访问  */
    color: green;
}
a:hover{
  /*  鼠标悬停  */
    color: yellow;
    font-size: 30px;
}
a:active{
  /*  鼠标点击  */
    color:blue;
}
input:focus{
   /*  获取焦点  */
    background-color: yellow;
}
```



##### 结构伪类

根据子元素的位置改变样式

![image-20191225154328905](/Users/yeqiu/Library/Application Support/typora-user-images/image-20191225154328905.png)



#### 伪元素选择器

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga90n4j9s2j30yo0j1tak.jpg)

注意：是双冒号

~~~css

p::before{
  /*  段落之前添加  */
	content: "终于找到你，";
}
body::after{
  /*  段落之后添加  */
	content: "依依不舍离开你，";
}
p::first-line{
  /*  段落第一行添加  */
	background-color: yellow;
}
p::first-letter{
  /*  段落第一个添加  */
	font-size: 30px;
}
p::selection{
  /*  段落中被用户选中的内容  */
	background-color: red;
}
~~~



#### css的其他选择器

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga91qntyhmj30wi0ivac2.jpg)



~~~css
p {
    /* 标签选择器	*/
   color:red;
}

.p1{
   /* 类选择器	*/
    color:red;
}

#name1{
  /* id选择器	*/
    color:red;
    background-color: yellow;
}

*{
  /* *选择器 选择所有元素	*/
    font-size: 20px;
}

#name1,#name2,p{
  /* 逗号选择器 连接多个选择器	*/
    color:red;
    background-color: yellow;
}

#div1 p{
  /* 子孙（空格） 选择器 选择div1里的所有p标签	*/
	color: red;
}

#div1>p{
  /* 子选择器 选择div1里的p标签 不包含子标签的	*/
	color:red;
}

div1+p{
  /* 兄弟选择器 选择和div1统计的p标签	*/
	color: red;
}

p[class="p1"]{
  /* 属性选择器 class=p1的p标签	*/
	color:red;
}
~~~



#### 选择器的优先级

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga936hoe9hj30gf0i90tt.jpg)

选择范围越小的优先级越高