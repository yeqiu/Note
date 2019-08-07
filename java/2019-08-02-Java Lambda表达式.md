---
layout:     post  
title:      Java Lambda表达式 
subtitle:   Lambda表达式
date:       2019-08-02
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



## 基本语法

`(参数列表)->函数体`

~~~java
//不需要参数,返回值为 5
() -> 5 
//接收一个参数(数字类型),返回其2倍的值
x -> 2 * x 
//接受2个参数(数字),并返回他们的差值
(x, y) -> x – y 
//接收2个int型整数,返回他们的和
(int x, int y) -> x + y
//接受一个 string 对象,并在控制台打印,
(String s) -> System.out.print(s)
~~~



## 匿名内部类写法

使用用() -> {}代码块替代了整个匿名类

~~~java
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("阿姆斯特朗回旋加速喷气式阿姆斯特朗炮");
            }

        }).start();
        
        // ()->System.out.println("阿姆斯特朗回旋加速喷气式阿姆斯特朗炮") 
        new Thread(()->System.out.println("阿姆斯特朗回旋加速喷气式阿姆斯特朗炮")).start();

~~~



## lambda表达式的类型

~~~java
 new Thread(()->System.out.println("阿姆斯特朗回旋加速喷气式阿姆斯特朗炮")).start();
~~~



以上代码中lambda表达式没有名字，那我们怎么知道它的类型呢？答案是通过上下文推导而来的。这里` new Thread`的参数可以接受很多

![](http://ww4.sinaimg.cn/large/006tNc79ly1g5pr49nstyj30gr068749.jpg)

很明显这里`new Thread(()->System.out.println("阿姆斯特朗回旋加速喷气式阿姆斯特朗炮")).start();`这里lambda表达式最后返回的最后是一个Runnable，上图中的第一个参数。

~~~java
        Runnable runnable = () -> tvApplicationDataBreedType.setText("text");

        new Thread(runnable).start();
~~~

~~~java
        View.OnClickListener onClickListener = (View view) -> tvApplicationDataBreedType.setText("test");
        tvApplicationDataBreedType.setOnClickListener(onClickListener);
~~~

以上两段代码lambda表示的类型明显不同，这就意味着同样的lambda表达式在不同的上下文里有不同的类型。



## lambda表达式和内部类

在内部类中使用this代表的是内部类本身，内部类可以获得外部的成员变量，如果有同名的会覆盖外部的成员，引用外部需要使用外部类名.this访问。

lambda表达式不会从外部继承任何变量，lambda表达式的参数及函数体里面的变量和它外部环境的变量具有相同的语义

~~~java
public class LambdaTest {
    
    public static void main(String[] args) {
        new LambdaTest().r1.run();
        new LambdaTest().r2.run();

    }
    
    Runnable r1 = () -> new LambdaTest().println(this);
    
    Runnable r2 = new Runnable() {
        @Override
        public void run() {
            new LambdaTest().println(this);
        }
    };
    
    @Override
    public String toString() {
        return "阿姆斯特朗回旋加速喷气式阿姆斯特朗炮";
    }
    
    public void println(Object object){
        System.out.println(object.toString());
    }

}
~~~

以上代码创建两个Runnable 在run方法中打印this，同时外部类实现了`toString()`，r1 lambda表达式打印this即是外部类的this，r2 普通内部类打印this为内部类的内存地址

输出结果：

![](http://ww1.sinaimg.cn/large/006tNc79ly1g5prnpb65ej30fj037wee.jpg)



