## css浮动



[TOC]

### Div

div可以看成是一块区域，将页面分割成独立的部分。可以添加id等标记，便于添加样式。

```css
#div2{
    background-color: #105cb6;
    width: 200px;
    height: 200px;
    top: 100px;
    left: 100px;
    position: absolute;
}
```



###div溢出效果处理

div可以看成是一个矩形的块，可以设置高度宽度。超出这个范围的内容就称为溢出

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga9wz57eigj30oi0b9aap.jpg)

```css
#div2{
    background-color: #105cb6;
    width: 200px;
    height: 200px;
    top: 200px;
    left: 200px;
    position: absolute;
    overflow: auto;
}
```



### div的边框轮廓

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga9x9iuuo3j30ny0df0ue.jpg)

```css
#div2{
    background-color: #105cb6;
    width: 200px;
    height: 200px;
    top: 200px;
    left: 200px;
    position: absolute;
    overflow: auto;
    /* 设置虚线 */
    outline: dashed;
}
```



![](https://tva1.sinaimg.cn/large/006tNbRwly1ga9xe8xk66j30o40e9jt8.jpg)

```css
#div2{
    background-color: #105cb6;
    width: 200px;
    height: 200px;
    top: 200px;
    left: 200px;
    position: absolute;
    overflow: auto;
    /* 设置虚线 */
    outline: dashed;
    /*设置下边框*/
    border-bottom: double;
}
```



![](https://tva1.sinaimg.cn/large/006tNbRwly1ga9xjxqhn4j30dq02dt8m.jpg)

```css
input{
    border:none;
    border-bottom: solid;
    outline: none;
}
```





### 盒子模型

所有矩形的显示区域都可以使用盒子模型

![](https://tva1.sinaimg.cn/large/006tNbRwly1ga9xr9liioj30zb0ib774.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1ga9xs7ad4oj30v00i9tbo.jpg)



### 浮动

![](https://tva1.sinaimg.cn/large/006tNbRwly1gaa46dpt1pj30nq07swfa.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1gaa46ohfbjj30lm08jmxu.jpg)



#### 定位机制

针对块级元素

![](https://tva1.sinaimg.cn/large/006tNbRwly1gaa4sf69m4j30wp0ft0to.jpg)

自动换行是块级元素的特点，让多个块级元素显示在同一行就是拖标流



#### 浮动

![](https://tva1.sinaimg.cn/large/006tNbRwly1gaa4xfdrgmj30wx0e0gmg.jpg)

```html
<body>
<div id="div1">第一个</div>
<div id="div2">第二个</div>
<div id="div3">第三个</div>
</body>
```

```css
div{
    width: 200px;
    height: 200px;
}

#div1{
    background-color: #105cb6;
}
#div2{
    background-color: #444444;
}
#div3{
    background-color: #b3d4fc;
}
```

效果

![](https://tva1.sinaimg.cn/large/006tNbRwly1gaa51mhvecj30720h6jr6.jpg)



```css
#div1{
    background-color: #105cb6;
    float: left;
}
#div2{
    background-color: #444444;
    float: left;
}
#div3{
    background-color: #b3d4fc;
    float: left;
}
```

![](https://tva1.sinaimg.cn/large/006tNbRwly1gaa590bzbxj30hj06ugle.jpg)

设置float属性使元素拖标，div1拖标相当于从原先的列表中移除，浮动到另一个图层。div2就会顶上去，占用原先dev1的位置。当三个元素都拖标后，就会沿着拖标的方向排列



#### float崩溃

**崩溃：**父级块元素的高度发生了破坏

块级的高度默认是内部内容的高度，如果没有元素就是0。宽度默认是父级元素的宽度。

```html
<div id="div1">
    <div id="div2"></div>
    <div id="div3"></div>
</div>
```

```css
#div1{
    background-color: red;
}

#div2{
    background-color: green;
    height: 100px;
    width: 200px;
}

#div3{
    background-color: blue;
    height: 120px;
}
```

效果

![](https://tva1.sinaimg.cn/large/006tNbRwly1gaa5ql7anxj31h506swe9.jpg)

这里div1是2和3的父级，并没有设置高度和宽度。采用默认的，高度就是2和3加在一起的高度。宽度是父级的宽度，这里是body全屏的。div2的宽度设置200，小于div1的宽度。所有div1被显示出来。div3没有设置宽度，默认和div1是一样的，所以div1被遮挡。

**float属性具备破坏性，当div2和3拖标之后就不属于原先的文档流，父级的div1高度也会被破坏，恢复到不包含2和3的高度，这里是0**

![](https://tva1.sinaimg.cn/large/006tNbRwly1gaa5usibkjj30sn04hgld.jpg)

红色消失不见，上图中给div3也添加了宽度，因为div3原先没有设置宽度，拖标之后变成默认宽度。



#### 浮动清除

![](https://tva1.sinaimg.cn/large/006tNbRwly1gaa82jidsej30i309nt9r.jpg)

1.

~~~css
#div4{
	background-color: black;
	width: 240px;
	height: 240px;
	clear: both;
}
~~~

2.新增一个div并设置clear



3.

~~~css
#clearDiv::after{
	content: "";
	visibility: hidden;
	height: 0px;
	display: block;
	clear: both;
}
~~~

clear 属性可选参数值为left 、 right 、 both、 none、 inherit