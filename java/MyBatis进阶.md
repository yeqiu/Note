---
layout:     post  
title:      MyBatis进阶  
subtitle:   MyBatis
date:       时间
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



[TOC]

### 动态Sql

动态sql起始就是根据页面的选项动态添加筛选条件。

~~~xml
    <select id="dynamicSQL" parameterType="java.util.Map" resultType="com.imooc.mybatis.entity.Goods">
        select * from t_goods
        <where>
          <if test="categoryId != null">
              and category_id = #{categoryId}
          </if>
          <if test="currentPrice != null">
              and current_price &lt; #{currentPrice}
          </if>
        </where>
    </select>
~~~

<where>标签可以动态判断and是否需要，如果and存在会存在语法错误会自动去掉and关键字

### MyBatis二级缓存

SqlSession会话默认开启一级缓存，当SqlSession关闭缓存也会清楚。

二级缓存需要手动开启，需要在Mapper Namespace中设置

![image-20200325155833213](/Users/yeqiu/Library/Application Support/typora-user-images/image-20200325155833213.png)

#### 开启二级缓存

mapper标签下添加

~~~xml
   <cache eviction="LRU" flushInterval="600000" size="512" readOnly="true"/>
    <!--开启了二级缓存
        eviction是缓存的清除策略,当缓存对象数量达到上限后,自动触发对应算法对缓存对象清除
            1.LRU – 最近最少使用的:移除最长时间不被使用的对象。
            O1 O2 O3 O4 .. O512
            14 99 83 1     893
            2.FIFO – 先进先出:按对象进入缓存的顺序来移除它们。
            3.SOFT – 软引用:移除基于垃圾回收器状态和软引用规则的对象。
            4.WEAK – 弱引用:更积极地移除基于垃圾收集器状态和弱引用规则的对象。

        flushInterval 代表间隔多长时间自动清空缓存,单位毫秒,600000毫秒 = 10分钟
        size 缓存存储上限,用于保存对象或集合(1个集合算1个对象)的数量上限
        readOnly 设置为true ,代表返回只读缓存,每次从缓存取出的是缓存对象本身.这种执行效率较高
                 设置为false , 代表每次取出的是缓存对象的"副本",每一次取出的对象都是不同的,这种安全性较高
    -->
~~~

#### 其他的缓存关键字

~~~xml
 <!-- useCache="false"代表不使用缓存 -->
    <select id="selectAll" resultType="com.imooc.mybatis.entity.Goods" useCache="false">
        select * from t_goods order by goods_id desc limit 10
    </select>
~~~

~~~xml
   <!--flushCache="true"在sql执行后强制清空缓存-->
    <insert id="insert" parameterType="com.imooc.mybatis.entity.Goods" flushCache="true">
        INSERT INTO t_goods(title, sub_title, original_cost, current_price, discount, is_free_delivery, category_id)
        VALUES (#{title} , #{subTitle} , #{originalCost}, #{currentPrice}, #{discount}, #{isFreeDelivery}, #{categoryId})
    </insert>
~~~

### PageHelper分页

![](https://tva1.sinaimg.cn/large/00831rSTly1gd6a7kiy5bj30ox0eaack.jpg)

[MyBatis 分页插件 PageHelper](https://pagehelper.github.io/)

![](https://tva1.sinaimg.cn/large/00831rSTly1gd6a9xkakmj30nw0cm0v4.jpg)

这个库可以自动添加分页的sql

### MyBatis批处理

批处理起始就是在插入或者查询的时候进行多条操作。一般会使用到List

~~~xml
    <!--INSERT INTO table-->
    <!--VALUES ("a" , "a1" , "a2"),("b" , "b1" , "b2"),(....)-->
    <insert id="batchInsert" parameterType="java.util.List">
        INSERT INTO t_goods(title, sub_title, original_cost, current_price, discount, is_free_delivery, category_id)
        VALUES
        <foreach collection="list" item="item" index="index" separator=",">
            (#{item.title},#{item.subTitle}, #{item.originalCost}, #{item.currentPrice}, #{item.discount}, #{item.isFreeDelivery}, #{item.categoryId})
        </foreach>
    </insert>
~~~



~~~xml
<delete id="batchDelete" parameterType="java.util.List">
        DELETE FROM t_goods WHERE goods_id in
        <foreach collection="list" item="item" index="index" open="(" close=")" separator=",">
            #{item}
        </foreach>
    </delete>
~~~



### MyBatis注解开发

使用注解来代替原先xml的代码

![](https://tva1.sinaimg.cn/large/00831rSTly1gd6bfw3ytwj30ng0ciq4x.jpg)



依然还是要创建配置文件，编写必要的配置

配置文件：

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <!--  驼峰命名转换 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>

    <!--设置默认指向的数据库-->
    <environments default="dev">
        <!--配置环境，不同的环境不同的id名字-->
        <environment id="dev">
            <!-- 采用JDBC方式对数据库事务进行commit/rollback -->
            <transactionManager type="JDBC"></transactionManager>
            <!--采用连接池方式管理数据库连接-->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/babytun?useUnicode=true&amp;characterEncoding=UTF-8"/>
                <property name="username" value="root"/>
                <property name="password" value="root"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <!--扫描的包-->
        <package name="com.imooc.mybatis.dao"/>
    </mappers>
</configuration>
~~~



创建Dao接口

~~~java
public interface GoodsDAO {
    @Select("select * from t_goods where current_price between  #{min} and #{max} order by current_price limit 0,#{limt}")
     List<Goods> selectByPriceRange(@Param("min") Float min ,@Param("max") Float max ,@Param("limt") Integer limt);

    @Insert("INSERT INTO t_goods(title, sub_title, original_cost, current_price, discount, is_free_delivery, category_id) VALUES (#{title} , #{subTitle} , #{originalCost}, #{currentPrice}, #{discount}, #{isFreeDelivery}, #{categoryId})")
    //<selectKey>
    @SelectKey(statement = "select last_insert_id()" , before = false , keyProperty = "goodsId" , resultType = Integer.class)
     int insert(Goods goods);

    @Select("select * from t_goods")
    //<resultMap>
    @Results({
            //<id>
          @Result(column = "goods_id" ,property = "goodsId" , id = true) ,
            //<result>
            @Result(column = "title" ,property = "title"),
            @Result(column = "current_price" ,property = "currentPrice")
    })
     List<GoodsDTO> selectAll();
}

~~~





### 其他资料

[mybatis-spring](http://mybatis.org/spring/zh/index.html)

