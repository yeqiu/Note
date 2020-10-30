## Spring Boot + MyBatis


### 什么是Spring Boot

Spring Boot 是由 Pivotal 团队提供的全新框架。Spring Boot 是所有基于 Spring Framework 5.0 开发的项目。Spring Boot 的设计是为了让你尽可能快的跑起来 Spring 应用程序并且尽可能减少你的配置文件，用来简化 Spring 应用的初始搭建以及开发过程。

Spring Boot整合了许多框架，省去许多冗余代码和XML强制配置。使用约定来代替配置。

官网 [Spring Boot](https://spring.io/projects/spring-boot)

### 环境配置

1.JDK必须是1.8以上

2.Spring Boot使用Maven 管理工具，所以要先安装配置Maven 



### Spring Initializr

Spring initializr 是Spring 官方提供的一个用来初始化一个Spring boot 项目的工具。IDEA提供插件，可以直接一步创建项目。

[Spring initializr](https://start.spring.io/)



![IDEA插件](https://tva1.sinaimg.cn/large/0081Kckwly1gjy46xcawrj31k80u0djo.jpg)

![](https://tva1.sinaimg.cn/large/0081Kckwly1gjy48r2z59j31kv0u0wlh.jpg)



插件会自动创建启动类

![](https://tva1.sinaimg.cn/large/0081Kckwly1gjy4hkn6mwj309z06iglq.jpg)





pom文件大致如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.4.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
  
    <groupId>com.yeqiu</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.3</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
      
      
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <dependency>
            <groupId>org.apache.tomcat</groupId>
            <artifactId>tomcat-jdbc</artifactId>
        </dependency>


    </dependencies>



    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```



### 配置文件

```properties

#端口
server.port=8099
server.servlet.context-path=/demo

#数据库配置
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/demo?useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&useSSL=false
spring.datasource.username=root
spring.datasource.password=1111

#mybatis配置
mybatis.mapper-locations=classpath:mapping/*.xml
mybatis.type-aliases-package=com.yeqiu.demo.model

# mybatis 日志 dao的包路径
logging.level.com.yeqiu.demo.dao=debug

#pagehelper分页 配置
pagehelper.helperDialect=mysql
pagehelper.reasonable=true
pagehelper.supportMethodsArguments=true
pagehelper.params=count=countSql
```





### 常见注解

**`@SpringBootApplication`** 这个注解是项目的基础，注解的类是项目的启动类

**`@Autowired`** 自动注入，自动导入对象到当前类中。如Service 类注入到 Controller 类中。

**`@Component`** 通用注解，可注解任意类。如果一个类不知道属于那个层就可以使用这个注解。

**`@Repository`** Dao层，主要用于数据库操作

**`@Service`** 对应服务层，处理一些复杂逻辑

**`@Controller`** mvc控制层，用于接受请求并返回数据

**`@RestController`** 是`@Controller和`@`ResponseBody`的合集,表示这是个控制器 ,并且是将函数的返回值 填入 HTTP 响应体中。

[关于@RestController vs @Controller](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485544&idx=1&sn=3cc95b88979e28fe3bfe539eb421c6d8&chksm=cea247a3f9d5ceb5e324ff4b8697adc3e828ecf71a3468445e70221cce768d1e722085359907&token=1725092312&lang=zh_CN#rd)

**`@Configuration`** 声明是配置类

[更多注解详情](https://zhuanlan.zhihu.com/p/137507309)



### 创建接口实例

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    @GetMapping("/all")
    public List<User> getAllUser(){
        return userService.findAll();
    }
    
}

```



### MyBatis

MyBatis 是一个数据库持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。

[入门文档](https://mybatis.org/mybatis-3/zh/getting-started.html)

### MyBatis+Spring Boot

Spring Boot依赖MyBatis还需添加配置

1.配置文件中配置mapper和实体

~~~properties
#mybatis配置
mybatis.mapper-locations=classpath:mapping/*.xml
mybatis.type-aliases-package=com.yeqiu.demo.model
~~~

2.配置扫描Dao文件夹

在Application上添加注解

~~~java
@SpringBootApplication
@MapperScan(basePackages = "com.yeqiu.demo.dao")
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
~~~



### MyBatis实例

MyBatis可以直接使用注解生成Sql，也可以用xml。

按照上面的配置后

1.创建Dao对象

```java
@Repository
public interface UserDao {
    List<User> findAll();
}
```

2.mapping文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.yeqiu.demo.dao.UserDao">

    <resultMap id="user" type="com.yeqiu.demo.model.User">
        <result property="id" column="id"/>
        <result property="name" column="name"/>
        <result property="age" column="age"/>
        <result property="email" column="email"/>
    </resultMap>


    <sql id="u_sql">
        u.id,
        u.name,
        u.age,
        u.email
    </sql>

    <select id="findAll" resultMap="user">
        SELECT
        <include refid="u_sql"/>
        FROM `user` u
        ORDER BY u.id desc
    </select>

</mapper>
```



### MyBatis打印sql语句

接入日志工具配置后可以自动输出sql语句

我这里使用srpingboot自带的日志库，配置文件中添加

```properties
# mybatis 日志 dao的包路径
logging.level.com.yeqiu.demo.dao=debug
```



### MyBatis分页查询

MyBatis官方并没有提供分页查询，github上有很多分页的库。

[pagehelper](https://pagehelper.github.io/)

[文档](https://github.com/pagehelper/Mybatis-PageHelper/blob/master/README_zh.md) 
[配合Spring Boot](https://github.com/pagehelper/pagehelper-spring-boot)  

