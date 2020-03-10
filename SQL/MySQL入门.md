---
layout:     post  
title:      MySQL入门 
subtitle:   MySQL
date:       2020-2-10
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



[TOC]





### MySql的基本操作

#### 开启服务

~~~sql
mysql.server start
~~~

#### 关闭服务

```sql
mysql.server stop
```

#### 登录

```sql
mysql -u root -p
```

#### 退出

```sql
quit
exit
\q
```



### 数据库的基本操作

#### 创建数据库

~~~sql
CREATE DATABASE 数据库名;
~~~

#### 查看当前服务下的所有数据库

```sql
SHOW DATABASES;
```

#### 打开数据库

```sql
USE 数据库名;
```

#### 删除数据库

```sql
DROP DATABASE 数据库名;
```

创建时如果已经存在同名的数据库会报错，删除时如果不存在数据也会报错。可以使用下面这样的语句

~~~sql
CREATE DATABASE [IF NOT EXISTS] 数据库名;
DROP DATABASE [IF EXISTS] 数据库名;
~~~

####查看当前数据库下所有的表

~~~sql
SHOW TABLES;
~~~



### 数据表的基本操作

数据表由行和列组成，表明要求唯一。

#### 创建表

~~~sql
CREATE TABLE  表名(
    字段名称 字段类型 [完整性约束条件],
    字段名称 字段类型 [完整性约束条件],
	...
);
~~~

#### 常见的约束条件

**UNSIGNED：**无符号，没有负数，从0开始
**ZEROFILL：**零填充，当数据的显示长度不够的时候可以使用前补0的效果填充至指定长度,字段会自动添加UNSIGNED
**NOT NULL：**非空约束，也就是插入值的时候这个字段必须要给值,值不能为空
**DEFAULT：**默认值，如果插入记录的时候没有给字段赋值，则使用默认值
**PRIMARY KEY：**主键，标识记录的唯一性，值不能重复，一个表只能有一个主键，自动禁止为空
**AUTO_INCREMENT：**自动增长，只能用于数值列，而且配合索引使用,默认起始值从1开始，每次增长
**UNIQUE KEY：**唯一性，一个表中可以有多个字段是唯一索引，同样的值不能重复，但是NULL值除外
**FOREIGN KEY：**外键约束

示例

~~~sql
CREATE TABLE first_table (
    first_column INT,
    second_column VARCHAR(100)
);
~~~

#### 查看数据表的详细信息

```sql
SHOW CREATE TABLE 表名;
```

此命令能查看建表语句

#### 查看表

```sql
DESC 表名;
```

#### 删除表

```sql
DROP TABLE [IF EXISTS] 表名;
```

#### 添加字段

```sql
ALTER TABLE 表名 
ADD 字段名称 字段属性 [完整性约束条件] [FIRST|AFTER 字段名称]
```

#### 删除字段

```sql
ALTER TABLE 表名
DROP 字段名称
```

#### 字段添加默认值

```sql
ALTER TABLE 表名
ALTER 字段名称 SET DEFAULT 默认值;
```

#### 字段删除默认值

```sql
ALTER TABLE 表名
ALTER 字段名称 DROP DEFAULT
```

#### 修改字段属性

```sql
ALTER TABLE 表名
MODIFY 字段名称 字段类型 [字段属性] [FIRST | AFTER 字段名称]
```

#### 修改字段名称，属性

```sql
ALTER TABLE 表名
CHANGE 原字段名称 新字段名称 字段类型 字段属性 [FIRST | AFTER 字段名称]
```

#### 添加主键

```sql
ALTER TABLE 表名
ADD PRIMARY KEY(字段名称)
```

#### 删除主键

```sql
ALTER TABLE 表名
DROP PRIMARY KEY;
```

注意在创建表的时候一般主键会使用AUTO_INCREMENT属性，如果使用这个属性的主键，那么在删除主键之前要先去掉这个属性。



#### 添加唯一属性

```sql
ALTER TABLE admin_user ADD unique (`name`);
```

#### 删除唯一属性

```sql
ALTER TABLE 表名 
DROP index_name;
```

注意唯一这个属性要添加别名（index_name),删除的时候可以直接删除这个别名。如果不添加别名，mysql会自动使用这个字段名作为别名。



#### 修改表名

```sql
ALTER TABLE 表名 
RENAME [TO|AS] 新表名
```

~~~sql
RENAME TABLE tbl_name TO 新表名;
~~~

#### 清空表

~~~sql
TRUNCATE TABLE 表名;
~~~

如果有外键约束，就无法使用TRUNCATE清空，需要先去除外键约束。



#### 注释

建表语句最后加上`COMMENT`语句

~~~sql
CREATE TABLE 表名 (
    各个列的信息 ...
) COMMENT '表的注释信息';
~~~

字段注释添加在字段属性后面

~~~sql
CREATE TABLE student_info(
	number INT PRIMARY KEY COMMENT '主键',
	name VARCHAR(20) NOT NULL COMMENT '姓名',
	sex ENUM('男','女') DEFAULT '男' COMMENT '性别',
	id_number CHAR(18) COMMENT '身份证号',
    department VARCHAR(30) COMMENT '学院',
    major VARCHAR(30) COMMENT '科目',
    enrollment_time DATE COMMENT '入学时间',
    UNIQUE KEY id_number (id_number)
)COMMENT '学生信息表';
~~~





###数据类型

####数字类型

很显然，使用的字节数越多，意味着能表示的数值范围就越大，但是也就越耗费存储空间。根据表示一个数占用字节数的不同，`MySQL`把整数划分成如下所示的类型：

| 类型         | 大小                                     | 范围（有符号）                                               | 范围（无符号）                                               |      用途       |
| :----------- | :--------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :-------------: |
| TINYINT      | 1 字节                                   | (-128，127)                                                  | (0，255)                                                     |    小整数值     |
| SMALLINT     | 2 字节                                   | (-32 768，32 767)                                            | (0，65 535)                                                  |    大整数值     |
| MEDIUMINT    | 3 字节                                   | (-8 388 608，8 388 607)                                      | (0，16 777 215)                                              |    大整数值     |
| INT或INTEGER | 4 字节                                   | (-2 147 483 648，2 147 483 647)                              | (0，4 294 967 295)                                           |    大整数值     |
| BIGINT       | 8 字节                                   | (-9,223,372,036,854,775,808，9 223 372 036 854 775 807)      | (0，18 446 744 073 709 551 615)                              |   极大整数值    |
| FLOAT        | 4 字节                                   | (-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38) | 0，(1.175 494 351 E-38，3.402 823 466 E+38)                  | 单精度 浮点数值 |
| DOUBLE       | 8 字节                                   | (-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 双精度 浮点数值 |
| DECIMAL      | 对DECIMAL(M,D) ，如果M>D，为M+2否则为D+2 | 依赖于M和D的值                                               | 依赖于M和D的值                                               |     小数值      |



####日期和时间类型

| 类型      | 大小 (字节) | 范围                                                         | 格式                | 用途                     |
| :-------- | :---------- | :----------------------------------------------------------- | :------------------ | :----------------------- |
| DATE      | 3           | 1000-01-01/9999-12-31                                        | YYYY-MM-DD          | 日期值                   |
| TIME      | 3           | '-838:59:59'/'838:59:59'                                     | HH:MM:SS            | 时间值或持续时间         |
| YEAR      | 1           | 1901/2155                                                    | YYYY                | 年份值                   |
| DATETIME  | 8           | 1000-01-01 00:00:00/9999-12-31 23:59:59                      | YYYY-MM-DD HH:MM:SS | 混合日期和时间值         |
| TIMESTAMP | 4           | 1970-01-01 00:00:00/2038结束时间是第 **2147483647** 秒，北京时间 **2038-1-19 11:14:07**，格林尼治时间 2038年1月19日 凌晨 03:14:07 | YYYYMMDD HHMMSS     | 混合日期和时间值，时间戳 |

####字符串类型

| 类型       | 大小                | 用途                            |
| :--------- | :------------------ | :------------------------------ |
| CHAR(M)    | 0-255字节           | 固定长度字符串                  |
| VARCHAR(M) | 0-65535 字节        | 可变长度字符串                  |
| TINYBLOB   | 0-255字节           | 不超过 255 个字符的二进制字符串 |
| TINYTEXT   | 0-255字节           | 短文本字符串                    |
| BLOB       | 0-65 535字节        | 二进制形式的长文本数据          |
| TEXT       | 0-65 535字节        | 长文本数据                      |
| MEDIUMBLOB | 0-16 777 215字节    | 二进制形式的中等长度文本数据    |
| MEDIUMTEXT | 0-16 777 215字节    | 中等长度文本数据                |
| LONGBLOB   | 0-4 294 967 295字节 | 二进制形式的极大文本数据        |
| LONGTEXT   | 0-4 294 967 295字节 | 极大文本数据                    |

####ENUM类型和SET类型

ENUM：也叫枚举类，格式如下：

```sql
ENUM('str1', 'str2', 'str3' ⋯)
```

表示只能在给定的字符串中选择一个。

SET：表示可能从给定的值里选择多个，格式如下：

```sql
SET('str1', 'str2', 'str3' ⋯)
```



### 数据的基本操作

#### 插入数据

~~~sql
INSERT INTO 表名字(字段名,...) {对应的值,...};
~~~

添加多条可以使用

~~~sql
INSERT INTO 表名字(字段名,...){对应的值,...}{对应的值,...};
~~~

不添加字段名默认会按照建表时的顺序添加值。

#### 修改数据

~~~sql
UPDATE 表名 SET 字段名=值,字段名=值 WHERE 条件;
~~~

不添加 WHERE 条件会改变表中所有的对应字段。

#### 删除数据

~~~sql
DELETE FROM 表名 [WHERE 条件]
~~~

不添加 WHERE 条件会删除表中所有记录。

使用DELETE删除数据并不会清空自增长的值。

#### 清空表

~~~sql
TRUNCATE TABLE 表名;
~~~

使用TRUNCATE清空表后会删除自增长的记录

### 查找数据

#### 查询语句的基本形式

~~~sql
SELECT 字段名,... FROM 表名 ;
~~~

SELECT select_expr,... FROM tbl_name
[WHERE 条件]
[GROUP BY {col_name|position} HAVING 二次筛选]
[ORDER BY {col_name|position|expr} [ASC|DESC]]
[LIMIT 限制结果集的显示条数] 

查询语句中可以使用WHERE来指定查询条件，GROUP BY来进行分组，LIMIT来限制条数

~~~sql
SELECT * FROM 表名 ;
~~~

*代表查询挑中的所有字段，在查询时候可以对字段和表名设置别名

~~~sql
SELECT 字段名 AS 别名 FROM 表名 AS 表的名字
~~~

单表查询并没有什么必要被表取别名

#### where条件筛选

**使用基本运算符 **

~~~sql
>,>=, <, <=, !=
~~~

where中不可以直接使用null，如果条件中包含null

**匹配null**

~~~sql
查询字段是null的
WHERE 字段名 <=>NULL;
WHERE 字段名 IS NULL;
~~~

~~~sql
WHERE 字段名 IS NOT NULL NULL;
~~~

**指定查询范围**

~~~sql
WHERE 字段名 BETWEEN 值1 AND 值2
范围取反
WHERE 字段名 NOT BETWEEN 值1 AND 值2
~~~

**指定集合范围**

~~~sql
WHERE 字段名 IN (值1,值2...);
范围取反
WHERE 字段名 NOT IN (值1,值2...);
~~~

**AND和OR**

~~~sql
AND表示要同时满足条件
WHERE 字段名1 = 值1 AND 字段名2 = 值2
~~~

~~~sql
OR表示满足其中一个条件即可
WHERE 字段名1 = 值1 OR 字段名2 = 值2
~~~

**匹配字符（模糊查询）**

使用LIKE NOT LIKE

~~~sql
查询的数据中包含值1
WHERE 字段名1 LIKE 值1
~~~

通配符

模糊查询时可以使用%来匹配条件

~~~sql
这里%表示可以是任意长度的字符串
WHERE 字段名1 LIKE "%值%"
~~~

_（下划线）任意一个字符

~~~sql
WHERE 字段名1 LIKE "_"
~~~

WHERE后面的组合也可以使用在修改，删除的语句上

#### group by分组

把值相同放到一个组中，最终查询出的结果只会显示组中一条记录

~~~sql
SELECT * FROM 表名 GROUP BY 要分组的字段名
~~~

##### GROUP_CONCAT()

GROUP_CONCAT函数可以用来查看组中某个字段的详细信息

~~~sql
SELECT GROUP_CONCAT(要查看的字段) FROM asset GROUP BY 要分组的字段名
~~~

上面的sql可以分组中所有的要查看的字段查询出来。

##### 配合聚合函数

**COUNT()：统计记录总数**
COUNT(字段名称)，不会统计NULL值

~~~sql
SELECT COUNT(字段名) FROM 表名;
~~~

查询出的结果就是改字段的总数，COUNT(字段名)可以起别名

~~~sql
SELECT COUNT(字段名) AS 别名 FROM 表名;
~~~

**SUM() ：求和**

用法类似COUNT()

**MAX()：求最大值**

用法类似COUNT()

**MIN()：求最小值**

用法类似COUNT()

**AVG()：求平均值**

用法类似COUNT()

##### 配合HAVING

HAVING子句对分组结果进行二次筛选

~~~sql
SELECT 字段名  FROM 表名 HAVING 条件 ;
~~~

#### order by 排序

ASC：升序

DESC：降序

~~~sql
SELECT 字段名  FROM 表名 ORDER BY 排序的字段 DESC ;
~~~

打乱顺序，随机顺序

~~~sql
ORDER BY RAND();
~~~



#### limit限制结果数量

LIMIT 条数：显示结果集的指定条数
LIMIT offset,row_count：从offset开始，显示几条记录,offset从0开始



### 数据的高级操作

#### 多表联查



#### 外键约束



#### 动态创建外键



#### 删除外键



#### 子查询



#### any、some、all关键字的子查询



#### 联合查询



#### 无限级分类数据表



### 常用函数

#### 数据函数



#### 字符串常用函数



#### 日期常用函数



#### 其他常用函数



### MyBatis入门





### MyBatis进阶



