---
layout:     post  
title:      MyBatis入门 
subtitle:   MyBatis
date:       时间
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



[TOC]



### MyBatis简介

MyBatis是一个DAO框架，使用XML将sql与程序解耦，是JDBC的一种延伸。

[官网](https://mybatis.org/mybatis-3/)

### MyBatis基本使用

####  环境配置

依赖

~~~xml
<dependency>  <groupId>org.mybatis</groupId>
 <artifactId>mybatis</artifactId>
 <version>3.5.1</version>
</dependency>
~~~



#### 创建配置文件

resources目录下创建配置文件

![](https://tva1.sinaimg.cn/large/00831rSTly1gd50onv1kcj30ma0d3aam.jpg)

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  
    <!--设置默认指向的数据库-->
    <environments default="dev">
        <!--配置环境，不同的环境不同的id名字-->
        <environment id="dev">
            <!-- 采用JDBC方式对数据库事务进行commit/rollback -->
            <transactionManager type="JDBC"></transactionManager>
            <!--采用连接池方式管理数据库连接-->
            <!--<dataSource type="POOLED">-->
            <dataSource type="com.test.mybatis.datasource.C3P0DataSourceFactory">
                <property name="driverClass" value="com.mysql.jdbc.Driver"/>
                <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/babytun?useUnicode=true&amp;characterEncoding=UTF-8"/>
                <property name="user" value="root"/>
                <property name="password" value="root"/>
            </dataSource>
        </environment>

</configuration>
~~~

#### SqlSessionFactory

sql会话工程是MyBatis的核心对象。用于初始化MyBatis，创建SqlSession对象。保证SqlSessionFactory在应用中全局唯一。

#### SqlSession

SqlSession使用JDBC方式与数据库交互，提供了CRUD对应的方法。

~~~java
        //利用Reader加载classpath下的mybatis-config.xml核心配置文件
        Reader reader = Resources.getResourceAsReader("mybatis-config.xml");
        //初始化SqlSessionFactory对象,同时解析mybatis-config.xml文件
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);
        System.out.println("SessionFactory加载成功");
        SqlSession sqlSession = null;
        try {
            //创建SqlSession对象,SqlSession是JDBC的扩展类,用于与数据库交互
            sqlSession = sqlSessionFactory.openSession();
            //创建数据库连接(测试用)
            Connection connection = sqlSession.getConnection();
            System.out.println(connection);
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            if(sqlSession != null){
                //如果type="POOLED",代表使用连接池,close则是将连接回收到连接池中
                //如果type="UNPOOLED",代表直连,close则会调用Connection.close()方法关闭连接
                sqlSession.close();
            }
        }
~~~

为保证SqlSessionFactory的唯一，此代码应被在单例对象中。

~~~java
/**
 * MyBatisUtils工具类,创建全局唯一的SqlSessionFactory对象
 */
public class MyBatisUtils {
    //利用static(静态)属于类不属于对象,且全局唯一
    private static SqlSessionFactory sqlSessionFactory = null;
    //利用静态块在初始化类时实例化sqlSessionFactory
    static {
        Reader reader = null;
        try {
            reader = Resources.getResourceAsReader("mybatis-config.xml");
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);
        } catch (IOException e) {
            e.printStackTrace();
            //初始化错误时,通过抛出异常ExceptionInInitializerError通知调用者
            throw new ExceptionInInitializerError(e);
        }
    }

    /**
     * openSession 创建一个新的SqlSession对象
     * @return SqlSession对象
     */
    public static SqlSession openSession(){
        //默认SqlSession对自动提交事务数据(commit)
        //设置false代表关闭自动提交,改为手动提交事务数据
        return sqlSessionFactory.openSession(false);
    }

    /**
     * 释放一个有效的SqlSession对象
     * @param session 准备释放SqlSession对象
     */
    public static void closeSession(SqlSession session){
        if(session != null){
            session.close();
        }
    }
}

~~~





#### 数据查询

进行数据操作大致可分为六个步骤

1.创建实体类（数据模型）

2.创建Mapper xml

3.添加sql语句标签

4.添加驼峰命名映射

5.配置文件添加<mapper>

6.执行sql语句



**创建Mapper xml**

在resources目录下创建

mappers文件夹，存放映射的xml文件。数据模型和数据表的映射关系需要通过这个xml文件来说明。

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="goods">
   
   <select id="selectAll" resultType="com.test.mybatis.entity.Goods" useCache="false">
        select * from t_goods order by goods_id desc limit 10
    </select>

</mapper>
~~~

namespace：命名空间，类似java中的包概念
id：区分sql语句
resultType：将返回结果保证成指定对象



**4.添加驼峰命名映射**

因为java使用驼峰命名，数据库多半使用下划线。导致模型中的变量名和字段名对不上。可以通过设置驼峰映射来解决。

配置文件中的configuration标签下添加

~~~xml
        <!--  驼峰命名转换 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
~~~



**5.配置文件中添加<mapper>**

~~~xml
<mappers>
        <mapper resource="mappers/goods.xml"/>
    </mappers>
~~~

**6.执行sql**

~~~java
    public void testSelectAll() throws Exception {
        SqlSession session = null;
        try{
            session = MyBatisUtils.openSession();
            List<Goods> list = session.selectList("goods.selectAll");
            for(Goods g : list){
                System.out.println(g.getTitle());
            }
        }catch (Exception e){
            throw e;
        }finally {
            MyBatisUtils.closeSession(session);
        }
    }
~~~

### Sql传参

#### 单个参数

~~~xml
   <!-- 单参数传递,使用parameterType指定参数的数据类型即可,SQL中#{value}提取参数-->
    <select id="selectById" parameterType="Integer" resultType="com.test.mybatis.entity.Goods">
        select * from t_goods where goods_id = #{value}
    </select>
~~~



~~~java
   /**
     * 传递单个SQL参数
     * @throws Exception
     */
    @Test
    public void testSelectById() throws Exception {
        SqlSession session = null;
        try{
            session = MyBatisUtils.openSession();
            Goods goods = session.selectOne("goods.selectById" , 1603);
            System.out.println(goods.getTitle());
        }catch (Exception e){
            throw e;
        }finally {
            MyBatisUtils.closeSession(session);
        }
    }
~~~

#### 多个参数

~~~xml
  <!-- 多参数传递时,使用parameterType指定Map接口,SQL中#{key}提取参数 -->
    <select id="selectByPriceRange" parameterType="java.util.Map" resultType="com.test.mybatis.entity.Goods">
        select * from t_goods
        where
          current_price between  #{min} and #{max}
        order by current_price
        limit 0,#{limt}
    </select>
~~~

~~~java
public void testSelectByPriceRange() throws Exception {
        SqlSession session = null;
        try{
            session = MyBatisUtils.openSession();
            Map param = new HashMap();
            param.put("min",100);
            param.put("max" , 500);
            param.put("limt" , 10);
            List<Goods> list = session.selectList("goods.selectByPriceRange", param);
            for(Goods g:list){
                System.out.println(g.getTitle() + ":" + g.getCurrentPrice());

            }
        }catch (Exception e){
            throw e;
        }finally {
            MyBatisUtils.closeSession(session);
        }
    }

~~~





### 多表联查

#### 多表联查

多表联查的结果不仅限于单个数据模型，可以将resultType修改为Map对象。

~~~xml
 <!-- 利用Map保存多表关联结果
        MyBatis会将每一条记录包装为Map对象
        key是字段名  value是字段对应的值 , 字段类型根据表结构进行自动判断
        优点: 易于扩展,易于使用
        缺点: 太过灵活,无法进行编译时检查
     -->
    <select id="selectGoodsMap" resultType="java.util.Map" flushCache="true">
        select g.* , c.category_name,'1' as test from t_goods g , t_category c
        where g.category_id = c.category_id
    </select>
~~~

~~~java
 SqlSession session = null;
        try{
            session = MyBatisUtils.openSession();
            List<Map> list = session.selectList("goods.selectGoodsMap");
            for(Map map : list){
                System.out.println(map);
            }
        }catch (Exception e){
            throw e;
        }finally {
            MyBatisUtils.closeSession(session);
        }
~~~



#### ResultMap结果映射

使用map进行多表联查的体验并不好，可以通过ResultMap在解决这个问题

**ResultMap**

1.可以将查询的结果映射为复杂类型的java对象

2.适用于java对象保存多表关联的结果

3.支持对象关联查询

1.创建DTO，DTO是数据扩展对象，其实就是对数据模型的扩展。

2.创建ResultMap标签

~~~xml
 <!--结果映射-->
    <resultMap id="rmGoods" type="com.test.mybatis.dto.GoodsDTO">
        <!--设置主键字段与属性映射-->
        <id property="goods.goodsId" column="goods_id"></id>
        <!--设置非主键字段与属性映射-->
        <result property="goods.title" column="title"></result>
        <result property="goods.originalCost" column="original_cost"></result>
        <result property="goods.currentPrice" column="current_price"></result>
        <result property="goods.discount" column="discount"></result>
        <result property="goods.isFreeDelivery" column="is_free_delivery"></result>
        <result property="goods.categoryId" column="category_id"></result>
        <result property="category.categoryId" column="category_id"></result>
        <result property="category.categoryName" column="category_name"></result>
        <result property="category.parentId" column="parent_id"></result>
        <result property="category.categoryLevel" column="category_level"></result>
        <result property="category.categoryOrder" column="category_order"></result>
        <result property="test" column="test"/>
    </resultMap>
~~~

~~~xml
    <select id="selectGoodsDTO" resultMap="rmGoods">
        select g.* , c.*,'1' as test from t_goods g , t_category c
        where g.category_id = c.category_id
    </select>
~~~

~~~java
public void testSelectGoodsDTO() throws Exception {
        SqlSession session = null;
        try{
            session = MyBatisUtils.openSession();
            List<GoodsDTO> list = session.selectList("goods.selectGoodsDTO");
            for (GoodsDTO g : list) {
                System.out.println(g.getGoods().getTitle());
            }
        }catch (Exception e){
            throw e;
        }finally {
            MyBatisUtils.closeSession(session);
        }
    }
~~~



### MyBatis插入，修改，删除

#### 插入

~~~xml
 <insert id="insert" parameterType="com.test.mybatis.entity.Goods" >
        INSERT INTO t_goods(title, sub_title, original_cost, current_price, discount, is_free_delivery, category_id)
        VALUES (#{title} , #{subTitle} , #{originalCost}, #{currentPrice}, #{discount}, #{isFreeDelivery}, #{categoryId})
   </insert>
~~~

~~~java
 public void testInsert() throws Exception {
        SqlSession session = null;
        try{
            session = MyBatisUtils.openSession();
            Goods goods = new Goods();
            goods.setTitle("测试商品");
            goods.setSubTitle("测试子标题");
            goods.setOriginalCost(200f);
            goods.setCurrentPrice(100f);
            goods.setDiscount(0.5f);
            goods.setIsFreeDelivery(1);
            goods.setCategoryId(43);
            //insert()方法返回值代表本次成功插入的记录总数
            int num = session.insert("goods.insert", goods);
            session.commit();//提交事务数据
            System.out.println(goods.getGoodsId());
        }catch (Exception e){
            if(session != null){
                session.rollback();//回滚事务
            }
            throw e;
        }finally {
            MyBatisUtils.closeSession(session);
        }
    }
~~~

#### 插入成功回填id

~~~xml
  <insert id="insert" parameterType="com.test.mybatis.entity.Goods" >
        INSERT INTO t_goods(title, sub_title, original_cost, current_price, discount, is_free_delivery, category_id)
        VALUES (#{title} , #{subTitle} , #{originalCost}, #{currentPrice}, #{discount}, #{isFreeDelivery}, #{categoryId})
      <selectKey resultType="Integer" keyProperty="goodsId" order="AFTER">
          select last_insert_id()
      </selectKey>
    </insert>
~~~



#### selectKey与useGeneratedKeys

selectKey必须用户insetr标签内，要明确的编写查询主键的sql语句

useGeneratedKeys可以不用写查询语句，在insetr中添加

~~~xml
    <insert id="insert" parameterType="com.imooc.mybatis.entity.Goods" 
    	useGeneratedKeys = "true"
    	keyProperty="goodsId"
    	keColumn = "goods_id"
    	>
        INSERT INTO t_goods(title, sub_title, original_cost, current_price, discount, is_free_delivery, category_id)
        VALUES (#{title} , #{subTitle} , #{originalCost}, #{currentPrice}, #{discount}, #{isFreeDelivery}, #{categoryId})  
    </insert>
~~~

**useGeneratedKeys只能是在在支持自增主键的数据库**

#### 修改

~~~xml
<update id="update" parameterType="com.imooc.mybatis.entity.Goods">
        UPDATE t_goods
        SET
          title = #{title} ,
          sub_title = #{subTitle} ,
          original_cost = #{originalCost} ,
          current_price = #{currentPrice} ,
          discount = #{discount} ,
          is_free_delivery = #{isFreeDelivery} ,
          category_id = #{categoryId}
        WHERE
          goods_id = #{goodsId}
    </update>
~~~

~~~java
public void testUpdate() throws Exception {
        SqlSession session = null;
        try{
            session = MyBatisUtils.openSession();
            Goods goods = session.selectOne("goods.selectById", 739);
            goods.setTitle("更新测试商品");
            int num = session.update("goods.update" , goods);
            session.commit();//提交事务数据
        }catch (Exception e){
            if(session != null){
                session.rollback();//回滚事务
            }
            throw e;
        }finally {
            MyBatisUtils.closeSession(session);
        }
    }
~~~



#### 删除

~~~xml
<delete id="delete" parameterType="Integer">
        delete from t_goods where goods_id = #{value}
    </delete>
~~~

~~~java
 public void testDelete() throws Exception {
        SqlSession session = null;
        try{
            session = MyBatisUtils.openSession();
            int num = session.delete("goods.delete" , 739);
            session.commit();//提交事务数据
        }catch (Exception e){
            if(session != null){
                session.rollback();//回滚事务
            }
            throw e;
        }finally {
            MyBatisUtils.closeSession(session);
        }
    }
~~~



### 预防sql注入攻击

sql注入主要是通过编写sql关键字来带入到sql语句中来修改原本sql的查询结果。

#### MyBatis的传值方式

**1.${}:**文本替换，未做任何处理，直接对sql文件替换

**2.#{}:**预编译传值，使用预编译传值可以预防sql注入。



