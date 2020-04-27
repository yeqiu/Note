[TOC]

### AOP

AOP（Aspect Oriented Programming），意为：[面向切面编程](https://baike.baidu.com/item/面向切面编程/6016335)，通过预编译方式和运行期间动态代理实现程序功能的统一维护的一种技术。AOP是[OOP]的延续，是软件开发中的一个热点，也是Spring框架中的一个重要内容，是函数式编程的一种衍生范型。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

AOP采取横向抽取机制，取代了传统纵向继承体系重复性代码。Spring AOP 使用纯java实现，在运行期间通过代理方式向目标植入增强代码。



### JDK动态代理

例：

~~~java
public class DaoImpl implements Dao {
    @Override
    public void save() {
        System.out.println("save...");
    }

    @Override
    public void update() {
        System.out.println("update...");
    }

    @Override
    public void delete() {
        System.out.println("delete...");
    }

    @Override
    public void find() {
        System.out.println("find...");
    }
}
~~~

需求 在sava或者其他一个方法执行前进行身份校验。

使用传统方式的思路大概是，新建一个创建校验身份的方法，然后在需要校验的地方调用这个方法。

创建JDK代理类

~~~java
package jdkproxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 * @project：JavaDemo
 * @author：小卷子
 * @date 2020/4/22
 * @describe：
 * @fix：
 */

public class JdkProxy implements InvocationHandler {


    private Dao dao;

    public JdkProxy(Dao dao) {
        this.dao = dao;
    }


    public Object createProxy() {
        Object proxy = Proxy.newProxyInstance(dao.getClass().getClassLoader(), dao.getClass().getInterfaces(), this);
        return proxy;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if ("save".equals(method.getName())) {
            System.out.println("权限校验");
            return method.invoke(dao, args);
        }
        return method.invoke(dao, args);
    }
}

~~~



~~~java
        Dao dao = new DaoImpl();
        Dao proxy = (Dao) new JdkProxy(dao).createProxy();
        proxy.find();
        proxy.update();
        proxy.save();
        proxy.delete();
~~~



### CGLIB生成代理

~~~java
public class CglibProxy implements MethodInterceptor {

    private Dao dao;

    public CglibProxy(Dao dao) {
        this.dao = dao;
    }

    public Object createProxy(){
        // 1.创建核心类
        Enhancer enhancer = new Enhancer();
        // 2.设置父类
        enhancer.setSuperclass(dao.getClass());
        // 3.设置回调
        enhancer.setCallback(this);
        // 4.生成代理
        Object proxy = enhancer.create();
        return proxy;
    }

    public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        if("save".equals(method.getName())){
            System.out.println("权限校验");
            return methodProxy.invokeSuper(proxy,args);
        }
        return methodProxy.invokeSuper(proxy,args);
    }

}
~~~

~~~java
        Dao dao = new DaoImpl();
        Dao proxy = (Dao) new CglibProxy(dao).createProxy();
        proxy.find();
        proxy.update();
        proxy.delete();
        proxy.save();
~~~



### 代理总结

JDK动态代理要求代理对象必须实现接口，生成一个包装类对象，由InvocationHandler来分发请求给代理对象，分发时就可以做增强。

CGLIB是针对目标生成子类，又子类来增强代码。



### AOP增强类型









