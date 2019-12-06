### 创建线程

java中创建线程由三种方式

1.继承Thread

2.实现Runnable接口

**继承Thread**

~~~java
//继承Thread 重写run方法，调用Thread的start方法
public class ThreadTest {
    public static void main(String[] args) {
        MyThread myThread = new MyThread();
        myThread.start();
        
    }
}

class MyThread extends Thread {
    @Override
    public void run() {
        super.run();
        System.out.println(getName() + "MyThread");
    }
}
~~~

**实现Runnable接口**

~~~java
//实现Runnable接口，实现run方法。创建Thread并把Runnable对象传递进去，调用Thread的start方法
class MyRunnable implements Runnable{
    @Override
    public void run() {
        System.out.println( "MyRunnable");
    }
}

	 Thread thread = new Thread(new MyRunnable());
	 thread.start();
~~~

**实现Callable接口**

~~~java
//实现Callable接口，实现call方法
//创建Callable的示例对象，并创建FutureTask将Callable对象当做参数传递
//创建Thread对象将FutureTask传递进去，调用start方法启动线程
//启动线程后调用FutureTask的get方法获取线程的返回值
class  MyCallable implements Callable<String>{
    @Override
    public String call() throws Exception {
        return "MyCallable";
    }
}

        Callable<String> callable = new MyCallable();
        FutureTask<String> futureTask = new FutureTask<>(callable);
        Thread thread = new Thread(futureTask);
        thread.start();
        
        try {
            String s = futureTask.get();
           System.out.println(s);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
~~~



### 线程的生命周期

![](https://tva1.sinaimg.cn/large/006tNbRwly1g9lvbbszbpj30yq0jgmz1.jpg)

正常的线程生命周期是

1.创建线程

2.调用start，线程处于就绪 可运行状态

3.获取cpu使用权后线程执行，处于正在运行状态

4.线程执行完进入终止状态



在线程运行的时候cpu的运行全被其他线程获取，当前线程就进入可运行状态。

线程运行遇到sleep等方法进去阻塞状态，阻塞完后进入可运行状态。

线程在任何状态都可以调用停止线程的方法进入终止状态

**线程在阻塞完后不是回到运行状态，而是进入可运行的就绪状态等到获取cpu执行权**





### 线程的执行顺序

线程的执行依靠获取CPU的执行权，当时间片到期后又会切换到其他线程。所以多个线程的执行顺序有随机性

~~~java
        Thread thread1 = new Thread("线程1") {
            @Override
            public void run() {
                super.run();
                for (int i = 0; i <= 50; i++) {
                    System.out.println(getName() + "  " + i);
                }
            }
        };

        Thread thread2 = new Thread("线程2") {
            @Override
            public void run() {
                super.run();
                for (int i = 0; i <= 50; i++) {
                    System.out.println(getName() + "  " + i);
                }
            }
        };
        
        thread1.start();
        thread2.start();
~~~

以上线程可能会出现交叉执行，也可能出现thread1先执行





### Thread的常见方法

**run方法：**

线程体，当前线程运行的代码



**start方法：**

启动线程



**sleep方法：**

休眠一定毫秒

**在线程休眠时会让出线程的执行权，此时如果有其他线程可能被其他线程获取执行权**



**join方法：**

优先调用，通俗的说就是等待调用join的线程先执行完，在执行其他线程

~~~java
thread1.start();
thread1.join();		
thread2.start();
~~~

以上代码thread1执行完后才会执行thread2。如果两个线程都start后再调用join，优先调用就不会生效。

join方法可以传递参数`public final synchronized void join(long millis)`

表示优先调用该线程的时间，达到该时间后，线程不在优先调用。



### 线程优先级

线程的优先级从1到10，1最低，10最高，主线程的优先级是5，新建线程的默认优先级也是5

 Thread.MAX_PRIORITY：优先级10
  Thread.MIN_PRIORITY：优先级1
  Thread.NORM_PRIORITY：优先级5

可以通过`setPriority()`设置优先级，`getPriority()`获取优先级



### 线程同步 锁







### 线程通信

















