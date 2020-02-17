## JQuery入门

[TOC]

### 下载地址

[JQuery](https://jquery.com/)



###引用JQuery

~~~html
<script type="text/javascript" src="../js/jquery-3.4.1.js"></script>
~~~





### 选择器

![](https://tva1.sinaimg.cn/large/006tNbRwly1garb83dz3nj30po0c23yx.jpg)



**JQurery选择器有两种写法**

1.jQuery(选择器表达式)

2.$(选择器表达式)

这两种写法的效果是一样的

~~~javascript
function onLoad() {
    document.getElementById("btnSelect").onclick = function () {
        let txtSelector = document.getElementById("txtSelector").value;
        //删除之前的样式
        $("*").removeClass("highlight");
        $(txtSelector).addClass("highlight");

    }
}
~~~







#### 基本选择器

![](https://tva1.sinaimg.cn/large/006tNbRwly1garbc6ewgsj30th0fqac9.jpg)



#### 层叠选择器

![](https://tva1.sinaimg.cn/large/006tNbRwly1gargx952h5j30w50ehjsz.jpg)

后代选择器是选择标签中所有的子标签，包括隔代的子标签。

子选择器是选择标签中直接的子标签，不包括隔代子标签。

兄弟选择器选与标签同级并处于选中标签之后的同级标签。





####属性选择器

![](https://tva1.sinaimg.cn/large/006tNbRwly1garhijiwxsj30mc0bkmy6.jpg)



#### 位置选择器

![](https://tva1.sinaimg.cn/large/006tNbRwly1garhqvt7v2j30mw0bkwfk.jpg)



#### 表单选择器

![](https://tva1.sinaimg.cn/large/006tNbRwly1garhrvyvplj30ml0bsdgr.jpg)





### 操作元素属性

![](https://tva1.sinaimg.cn/large/006tNbRwly1garim3bmr5j30j209oq3v.jpg)



~~~javascript
    //获取页面上元素是超链接并且链接地址包含163的元素并获取它的完成链接地址
    let attr = $("a[href*='163']").attr("href");

    //将超链接包含163的超链接地址改为其他地址
    $("a[href*='163']").attr("href","https://www.hao123.com/");
    
    //移除163的超链接属性
    $("a[href*='163']").removeAttr("href");
~~~

**注意：如果选择的条件中有多个元素匹配只会返回第一个匹配的元素，例：**

~~~javascript
let attr = $("a[href*='163']").attr("href");
//如果页面上有多个超链接的地址包含163，只会返回第一个符合条件的超链接
~~~

**但是修改元素时如果存才多个匹配的元素会将所有符合条件的元素都进行修改**





### 操作元素的CSS属性

![](https://tva1.sinaimg.cn/large/006tNbRwly1garjmie4shj30lg09sgmu.jpg)



~~~javascript
    //a标签的字体颜色改成红色
    $("a").css("color" , "red");
    //设置多个样式 属性和值使用json格式
    $("a").css({"color" : "green" , "font-weight" : "bold" , "font-style" : "italic"});
    //添加指定的样式 样式需在html中声明 多个样式类用空格隔开
    $("li").addClass("highlight myclass");
    //删除样式
    $("p").removeClass("myclass");
    //获取元素样式属性的值
    var color = $("a").css("color");
~~~



### 设置元素内容

![](https://tva1.sinaimg.cn/large/006tNbRwly1garkpvkr8cj30f20a73zc.jpg)

~~~javascript
    //将name属性是uname的input标签的值修改成administrator
    $("input[name='uname']").val("administrator");
    //获取name属性是uname的input的值
    let v = $("input[name='uname']").val();
    
    //修改使用myclass的span标签的文本
    $("span.myclass").text("<b>锄禾日当午，汗滴禾下土</b>");
    $("span.myclass").html("<b>锄禾日当午，汗滴禾下土</b>");
    //text与html方法最大的区别在于对于文本中的html标签是否进行转义
    
    //获取span的文本
    var vspan = $("span.myclass").text();
~~~





### 处理事件

![](https://tva1.sinaimg.cn/large/006tNbRwly1garky4jnabj30ko0b0dh2.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1garl094fkmj30lf0aimxl.jpg)

~~~javascript
   //设置点击事件
    $("p.myclass").on("click" , function(){
        //$(this)是指当前事件产生的对象
        $(this).css("background-color" , "yellow");
    });
    
    //简化点击事件
    $("span.myclass").click(function(){
        $(this).css("background-color" , "lightgreen");
    })

    //键盘按下事件
    $("input[name='uname']").keypress(function(event){
        console.log(event);
        if(event.keyCode == 32){
            $(this).css("color" , "red");
        }else{
            $(this).css("color" , "black");
        }
    })
~~~

