## Ajax入门

[TOC]

### 使用流程



![](https://tva1.sinaimg.cn/large/006tNbRwly1gauqo6lfnaj30fp0dht9a.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1gaur4nxfrlj30w30dwabe.jpg)



![](https://tva1.sinaimg.cn/large/006tNbRwly1gaur4237ezj30ye0fdmys.jpg)

~~~javascript
    //1.创建XmlHttpRequest对象
    let ajax = new XMLHttpRequest();
    //2. 发送Ajax请求 参数：请求方法，请求地址，是否是异步
    ajax.open("GET", "http://localhost:8088/factoring/test", true);
    ajax.send();
    //3. 处理服务器响应
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            //请求成功
            let response = ajax.responseText;
            console.log(response)
        } else {
            alert("请求失败");
        }
    }
~~~





### JQuery对Ajax的支持

![](https://tva1.sinaimg.cn/large/006tNbRwly1gauwthadl5j30mq0cmmxt.jpg)

![](https://tva1.sinaimg.cn/large/006tNbRwly1gauwtrt616j30u70i6tav.jpg)

~~~javascript
		$.ajax({
			"url" : "/ajax/news_list",
			"type" : "get" ,
			"data" : {"t":"pypl" , "abc":"123" , "uu":"777"},
			//"data" : "t=pypl&abc=123&uu=777" , 
			"dataType" : "json" ,
			"success" : function(json){
				console.log(json);
			},
			"error" : function(xmlhttp , errorText){
				console.log(xmlhttp);
				console.log(errorText);
			}	
		})
~~~

