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





### 线程休眠

`sleep()` 和`Wait()`都可以是线程停止运行。

sleep：休眠一定时间，到期后自动执行

Wait：线程等待，需要别人唤醒



### 线程同步 锁

线程是获取cpu的执行执行权来执行，线程中的代码什么时候被执行，什么时候结束。这些是无法控制的。随意当多个线程同时并发操作的时候就会会产生一些问题。在多线程同时操作一个数据源的时候我们就要用到同步，在线程的执行过程中cpu不要切换到其他线程。

~~~java
class ThreadTest extends Thread {
    private static int i = 100;
    public void run() {
        while(true) {
            if(i == 0) {
                break;
            }
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            i--;
            System.out.println(getName() + "i = "+i);
        }
    }
}
~~~

以上代码的本意是要在循环中对i做-1操作知道i等于0。创建多个ThreadTest的对象并开启线程，运行会发现 i的值会被一直减下去，减到负数。

当i=1的时候可能已经有线程已经执行完了if判断，但是还处于休眠，当休眠结束执行-1操作。一旦i的小于0 if的判断就无效了。

以上的问题就需要通过同步来解决。

使用synchronized关键字修饰符方法，被修饰的方法就是同步的。在这个方法没执行结束之前不会切换到别的代码



**同步方法**

使用synchronized关键字修饰一个方法, 该方法中所有的代码都是同步的

非静态同步方法的锁对象：this

静态同步方法的锁对象：该类的字节码对象

**同步代码块**

使用synchronized关键字修饰一段代码块



#### 死锁

死锁是指多个线程互相竞争对方的资源，而又不释放自己的资源，导致互相锁死。如下图

![](https://tva1.sinaimg.cn/large/006tNbRwly1g9rggpx6bcj306i07rdfs.jpg)



**死锁产生的4个必要条件**

1.互斥条件：进程要求对所分配的资源进行排它性控制，即在一段时间内某资源仅为一进程所占用。
2.请求和保持条件：当进程因请求资源而阻塞时，对已获得的资源保持不放。
3.不剥夺条件：进程已获得的资源在未使用完之前，不能剥夺，只能在使用完时由自己释放。
4.环路等待条件：在发生死锁时，必然存在一个进程--资源的环形链。

**预防死锁**：
1.资源一次性分配：一次性分配所有资源，这样就不会再有请求了：（破坏请求条件）
2.只要有一个资源得不到分配，也不给这个进程分配其他的资源：（破坏请保持条件）
3.可剥夺资源：即当某进程获得了部分资源，但得不到其它资源，则释放已占有的资源（破坏不可剥夺条件）
4.资源有序分配法：系统给每类资源赋予一个编号，每一个进程按编号递增的顺序请求资源，释放则相反（破环路等待条件）



[多线程锁的资料](https://www.jianshu.com/p/68c0fef7b63e)





### 线程通信

多个线程并发执行时, 在默认情况下CPU是随机切换线程的

怎么通信

​	1.线程等待, 调用wait()

​	2.唤醒等待的线程, 调用notify();

​	3.这两个方法必须在同步代码中执行, 并且使用同步锁对象来调用

**notify()和notifyAll() **

notify()：随机唤醒一个线程

 notifyAll()：唤醒所有线程



**sleep()和wait() **

sleep()：不释放锁对象，当前线程休眠，其他线程也无法获取锁对象执行

wait()：释放锁对象，当前线程进入等待，其他线程可以获取锁对象执行



 



