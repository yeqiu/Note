---
layout:     post  
title:      ConstraintLayout使用 
subtitle:   ConstraintLayout
date:       2019-08-27
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---

## 前言

本来不想写这篇文章的，之前看了一些关于ConstraintLayout的介绍。感觉使用上应该没什么问题，真正用起来还是有好多属性记不清。Android的知识很零碎，还是要记录一下



**基本属性**

~~~java
layout_constraintRight_toLeftOf
layout_constraintRight_toRightOf
layout_constraintTop_toTopOf
layout_constraintTop_toBottomOf
layout_constraintBottom_toTopOf
layout_constraintBottom_toBottomOf
layout_constraintBaseline_toBaselineOf
~~~

这些属性和RelativeLayout的属性类似，基本从字面就能理解是什么意思



**宽高属性**

和其他布局一样，可以用l`layout_width`和`layout_height`设置宽高。可以使用`wrap_content` `match_parent` 或者具体的值。这里需要注意的 0dp  

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView
        android:id="@+id/iv1"
        android:layout_width="300dp"
        android:layout_height="0dp"
        android:scaleType="center"
        android:src="@drawable/icon_head_hydra_5"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toTopOf="parent" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~

以上布局指定宽度300，高度0。效果如下

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6n9o4y1f5j309r0iitar.jpg)

以上这种情况0dp会直接充满屏幕，效果=`match_parent` ，但是0dp也是受到条件约束的

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView
        android:id="@+id/iv1"
        android:layout_width="100dp"
        android:layout_height="200dp"
        android:scaleType="centerCrop"
        android:src="@drawable/icon_head_hydra_5"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <ImageView
        android:id="@+id/iv2"
        android:layout_width="100dp"
        android:layout_height="0dp"
        android:layout_marginLeft="10dp"
        android:scaleType="centerCrop"
        android:src="@drawable/icon_head_hydra_4"
        app:layout_constraintBottom_toBottomOf="@+id/iv1"
        app:layout_constraintLeft_toRightOf="@+id/iv1"
        app:layout_constraintTop_toTopOf="parent" />
    
</androidx.constraintlayout.widget.ConstraintLayout>
~~~

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6n9s82hz3j30b007rdg4.jpg)

这里指定的iv1的宽高，iv2的底部和顶部都和iv1对齐。那自然iv2的高度也要和iv1一致



**宽高比**

一般在做banner的会遇到这样的需求

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:scaleType="centerCrop"
        android:src="@drawable/icon_hydra_11"
        app:layout_constraintDimensionRatio="H,16:9"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6nayqv60yj30bi07nt9g.jpg)

宽高指定为0dp，`app:layout_constraintDimensionRatio="H,16:9"`

 layout_constraintDimensionRatio 表示期望的宽高比,不仅可以用来表示宽高比， 也可以用来表示高宽比

app:layout_constraintDimensionRatio的值里面的H和W是什么意思。加上h的意思就是，h之后的比例是以w为基础去设置h，即h = w * ratio。w的意思是，w = h / ratio （因为 ratio = w / h 代表宽高比）

不写H，也不写W的情况下， 表示  宽高比
写了H 和 不写H 效果是一样的，都是 表示  宽高比

**权重**

一般底部的app都是平分宽度，用`LinearLayout`很容易实现

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <TextView
        android:id="@+id/tab1"
        android:layout_width="0dp"
        android:layout_height="50dp"
        android:background="@color/colorPrimary"
        android:gravity="center"
        android:text="Tab1"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toLeftOf="@+id/tab2" />


    <TextView
        android:id="@+id/tab2"
        android:layout_width="0dp"
        android:layout_height="50dp"
        android:background="@color/colorAccent"
        android:gravity="center"
        android:text="Tab2"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toRightOf="@id/tab1"
        app:layout_constraintRight_toLeftOf="@+id/tab3" />


    <TextView
        android:id="@+id/tab3"
        android:layout_width="0dp"
        android:layout_height="50dp"
        android:background="@color/colorPrimaryDark"
        android:gravity="center"
        android:text="Tab3"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toRightOf="@id/tab2"
        app:layout_constraintRight_toRightOf="parent" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~



![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6nb8pebpyj309y036gld.jpg)

这里三个TextView的宽度都是0并且左右相互依赖，这样就平分整个屏幕的宽度

**单独设置比例**

`layout_constraintHorizontal_weight` `layout_constraintVertical_weight`

这两个属性相当于LinearLayout的weight

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6nig3q8c9j30aj02pgld.jpg)



**bias**

bias可以看成一个偏移量，个人感觉实际的应用场景应该不多

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView
        app:layout_constraintHorizontal_bias="0.1"
        app:layout_constraintVertical_bias="0.1"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        android:src="@drawable/icon_head_hydra_5"
        android:layout_width="200dp"
        android:layout_height="200dp" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6nbspszzfj30900huglq.jpg)



原本ImageView应该是处于屏幕居中的

`app:layout_constraintHorizontal_bias="0.1"` 横向偏移1/10的距离（左侧边际的距离）

`app:layout_constraintVertical_bias="0.1"` 水平编译1/10的距离（顶部边际的距离）

这里需要注意的是：
想要设置偏移，必须先将控件设置父布局居中。
偏移的长度，如横向的偏移，是父布局宽度减去ImageView宽度的剩下的10%



**百分比**

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">


    <ImageView
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:scaleType="centerCrop"
        android:src="@drawable/icon_head_hydra_5"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintHeight_percent="0.3"
        app:layout_constraintWidth_percent="0.5" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6nfe4oti4j30900hpt8z.jpg)



` app:layout_constraintHeight_percent="0.3"`  ImageView的高度是屏幕的0.3

`app:layout_constraintWidth_percent="0.5"` ImageView的宽度是屏幕的0.5

百分比默认相对于屏幕，可以通过以下属性改变参照物

`app:layout_constraintWidth_default="percent"` 



**chain**

先看图



![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6ngfouyfuj308m0aa0sk.jpg)



这张图包含了链的三种类型


- `packed`：将view放在一起，没有间距
- `spread`：view均匀分布，间距一直
- `spread_inside` 两端定头没有间距，中间居中

要使用约束链，控件必须先建立约束关系。每个控件之间相互依赖

上图中的代码

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">


    <TextView
        android:id="@+id/packed"
        android:layout_width="100dp"
        android:layout_height="50dp"
        android:layout_marginBottom="20dp"
        android:gravity="center"
        android:text="packed"
        android:textColor="#000"
        android:textSize="18sp"
        android:textStyle="bold"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />


    <TextView
        android:id="@+id/packedtab1"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:background="@color/colorPrimary"
        android:gravity="center"
        android:text="Tab1"
        app:layout_constraintHorizontal_chainStyle="packed"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toLeftOf="@+id/packedtab2"
        app:layout_constraintTop_toBottomOf="@+id/packed" />


    <TextView
        android:id="@+id/packedtab2"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:background="@color/colorAccent"
        android:gravity="center"
        android:text="Tab2"
        app:layout_constraintLeft_toRightOf="@id/packedtab1"
        app:layout_constraintRight_toLeftOf="@+id/packedtab3"
        app:layout_constraintTop_toBottomOf="@+id/packed" />


    <TextView
        android:id="@+id/packedtab3"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:background="@color/colorPrimaryDark"
        android:gravity="center"
        android:text="Tab3"
        app:layout_constraintLeft_toRightOf="@id/packedtab2"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/packed" />


    <TextView
        android:id="@+id/spread"
        android:layout_width="100dp"
        android:layout_height="50dp"
        android:layout_marginTop="20dp"
        android:layout_marginBottom="20dp"
        android:gravity="center"
        android:text="spread"
        android:textColor="#000"
        android:textSize="18sp"
        android:textStyle="bold"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/packedtab3" />


    <TextView
        android:id="@+id/spreadtab1"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:background="@color/colorPrimary"
        android:gravity="center"
        android:text="Tab1"
        app:layout_constraintHorizontal_chainStyle="spread"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toLeftOf="@+id/spreadtab2"
        app:layout_constraintTop_toBottomOf="@+id/spread" />


    <TextView
        android:id="@+id/spreadtab2"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:background="@color/colorAccent"
        android:gravity="center"
        android:text="Tab2"
        app:layout_constraintLeft_toRightOf="@id/spreadtab1"
        app:layout_constraintRight_toLeftOf="@+id/spreadtab3"
        app:layout_constraintTop_toBottomOf="@+id/spread" />


    <TextView
        android:id="@+id/spreadtab3"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:background="@color/colorPrimaryDark"
        android:gravity="center"
        android:text="Tab3"
        app:layout_constraintLeft_toRightOf="@id/spreadtab2"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/spread" />


    <TextView
        android:id="@+id/spread_inside"
        android:layout_width="120dp"
        android:layout_height="50dp"
        android:layout_marginTop="20dp"
        android:layout_marginBottom="20dp"
        android:gravity="center"
        android:text="spread_inside"
        android:textColor="#000"
        android:textSize="18sp"
        android:textStyle="bold"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/spreadtab3" />


    <TextView
        android:id="@+id/spread_inside_tab1"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:background="@color/colorPrimary"
        android:gravity="center"
        android:text="Tab1"
        app:layout_constraintHorizontal_chainStyle="spread_inside"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toLeftOf="@+id/spread_inside_tab2"
        app:layout_constraintTop_toBottomOf="@+id/spread_inside" />


    <TextView
        android:id="@+id/spread_inside_tab2"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:background="@color/colorAccent"
        android:gravity="center"
        android:text="Tab2"
        app:layout_constraintLeft_toRightOf="@id/spread_inside_tab1"
        app:layout_constraintRight_toLeftOf="@+id/spread_inside_tab3"
        app:layout_constraintTop_toBottomOf="@+id/spread_inside" />


    <TextView
        android:id="@+id/spread_inside_tab3"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:background="@color/colorPrimaryDark"
        android:gravity="center"
        android:text="Tab3"
        app:layout_constraintLeft_toRightOf="@id/spread_inside_tab2"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/spread_inside" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~



**辅助线GuideLine**

辅助线有横向的和纵向的，辅助线不会显示到界面上。具体的用法就是在布局中添加辅助线，用辅助线来控制view的位置。



属性：

`android:orientation ` 这个一看就知道是指定方向

`layout_constraintGuide_begin` 距离顶部的位置

`layout_constraintGuide_end` 距离底部的位置

`layout_constraintGuide_percent` 距离顶部距离的百分比



~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">


    <ImageView
        android:layout_width="200dp"
        android:layout_height="200dp"
        android:scaleType="centerCrop"
        android:src="@drawable/icon_head_hydra_5"
        app:layout_constraintLeft_toRightOf="@+id/guidLine"
        app:layout_constraintTop_toTopOf="parent" />


    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guidLine"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        app:layout_constraintGuide_begin="50dp" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~



![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6nh7pwo16j307r05vglp.jpg)

这里创建了一个垂直的辅助线，距离左边屏幕50dp。ImageView在辅助线的右边。这是如果移动辅助线，ImageView也会跟着移动。



**Barrier**

`Barrier`和`Guideline`一样，不会被显示 。`Barrier` 包裹了一些控件，它的宽高由包裹的子控件决定。

效果如下图

![](https://upload-images.jianshu.io/upload_images/9271486-fe21f14dc464d48f.gif)



~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="100dp"
    android:padding="10dp">

    <ImageView
        android:layout_width="100dp"
        android:layout_height="100dp"
        android:scaleType="centerCrop"
        android:src="@drawable/icon_hydra_9"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toRightOf="@+id/barrier"
        app:layout_constraintTop_toTopOf="parent" />


    <TextView
        android:id="@+id/tv_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:text="HailHydra"
        android:textColor="@color/color_black"
        android:textSize="20sp"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/tv_content"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:text="阿姆斯特朗回旋加速喷气式阿姆斯特朗炮"
        android:textColor="@color/color_black"
        android:textSize="16sp"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/tv_name" />

    <androidx.constraintlayout.widget.Barrier
        android:id="@+id/barrier"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        app:barrierDirection="right"
        app:constraint_referenced_ids="tv_name,tv_content" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6nhjphmknj30hy0430sq.jpg)

当右侧文字长度发生变化，左侧的图片位置也会发生变化



**Group**

显示或者隐藏多个控件，一般我都是直接用个大布局把他们包起来。在constraintlayout中可以使用`Group`。用法和`Barrier`差不多。但是`Group`没有宽高的概念，所以无法作为其他view的约束参照物。隐藏的时候直接找到控件指定`Gone`就可以了

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="10dp">


    <TextView
        android:id="@+id/tv_content"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:text="阿姆斯特朗回旋加速喷气式阿姆斯特朗炮"
        android:textColor="@color/color_black"
        android:textSize="16sp"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toBottomOf="@+id/tv_name" />


    <TextView
        android:id="@+id/tv_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:text="HailHydra"
        android:textColor="@color/color_black"
        android:textSize="20sp"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toTopOf="parent" />


    <androidx.constraintlayout.widget.Group
        android:id="@+id/group"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:constraint_referenced_ids="tv_name,tv_content" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~



**Placeholder 占位**

laceholder指的是占位符。在Placeholder中可使用setContent()设置另一个控件的id，使这个控件移动到占位符的位置

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="10dp">

    <androidx.constraintlayout.widget.Placeholder
        android:id="@+id/placeholder"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:content="@+id/textview"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/textview"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:background="#cccccc"
        android:padding="16dp"
        android:text="TextView"
        android:textColor="#000000"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent" />


</androidx.constraintlayout.widget.ConstraintLayout>
~~~



当Placeholder没有指定content的时候

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6nibwrm3kj30au06tjr5.jpg)





当Placeholder指定content的时候

![](https://tva1.sinaimg.cn/large/006y8mN6ly1g6nic3kiu3j30ap06ljr5.jpg)







注意

在constraintlayout尽量不要使用`android:visibility="gone"` 一旦这个view消失，那所有跟它有约束关系的view都会消失。可以使用`invisible`代替







资料

[ConstraintLayout 完全解析 快来优化你的布局吧](https://blog.csdn.net/lmj623565791/article/details/78011599)
[ConstraintLayout使用指南](https://www.jianshu.com/p/958887ed4f5f)
[ConstraintLayout已经2.0了，你不来了解一下吗？](https://mp.weixin.qq.com/s/hPTYUKMROYYV0hI4xbKU3w)