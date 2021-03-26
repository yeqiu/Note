---
layout:     post  
title:      2021-03-11-ViewModel
subtitle:   ViewModel
date:       2021-03-11
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



## ViewModel简介

在常规的开发中通常会将UI交互和数据获取这些放在一起，但这是不符合单一功能原则的。页面应该只处理用户交互，展示对应的数据。与数据相关的业务应该单独处理，数据的储存和变更也应该单独处理。

Jetpack提供了ViewModel，专门用于处理应用数据。

![](https://tva1.sinaimg.cn/large/008eGmZEly1gotzfsu4syj30m8084mzc.jpg)

ViewModel是介于View和Model之间的东西。使页面和数据分离，单可以保持通信。



## ViewModel的生命周期

ViewModel的生命周期独立于Activity

![](https://tva1.sinaimg.cn/large/008eGmZEly1gotzlinsx5j30ia0lfjv1.jpg)



## ViewModel的基本使用

ViewModel的创建是通过ViewModelProvider来完成的。ViewModelProvider会判断ViewModel是否存在，若存在则直接返回，否则它会创建一个ViewModel。



案例：在屏幕是有个计数器，点一下数字+1。

1.创建ViewModel

```kotlin
class ViewModelDemo1 : ViewModel(){
    var count =0
    override fun onCleared() {
        super.onCleared()
        count = 0
    }
}
```

2.创建ViewModel实力

```kotlin
viewModelDemo1 = ViewModelProvider(this).get(ViewModelDemo1::class.java)
```

3.点击按钮修改ViewModel的count

```kotlin
btAdd1.setOnClickListener {
    viewModelDemo1.count = viewModelDemo1.count + 1
    showCount()
}
```

4.显示数字到屏幕上

```kotlin
private fun showCount() {
    tvCount1.text = viewModelDemo1.count.toString()
}
```



运行程序旋转屏幕，当Activity创建时，页面上的数字没有发生变化。这就意味着在横竖屏下Activity所获取的ViewModel都是同一个。

还有另一种场景，在创建ViewModel需要传递一些参数，这时就需要用到CountViewModelFactory

```kotlin
val count = 10
val countViewModelFactory = CountViewModelFactory(count)
viewModelDemo2 = ViewModelProvider(this, countViewModelFactory)
    .get(ViewModelDemo2::class.java)
```



## ViewModel的原理

~~~kotlin
//ViewModelProvider构造源码   
public ViewModelProvider(@NonNull ViewModelStoreOwner owner) {
        this(owner.getViewModelStore(), owner instanceof HasDefaultViewModelProviderFactory
                ? ((HasDefaultViewModelProviderFactory) owner).getDefaultViewModelProviderFactory()
                : NewInstanceFactory.getInstance());
    }

~~~

ViewModelProvider需要一个ViewModelStoreOwner参数，在androidx中FragmentActivity已经实现了ViewModelStoreOwner接口

~~~kotlin
    		//FragmentActivity getViewModelStore函数源码
				@NonNull
        @Override
        public ViewModelStore getViewModelStore() {
            return FragmentActivity.this.getViewModelStore();
        }

~~~



```kotlin
//ViewModelStore 源码
public class ViewModelStore {

    private final HashMap<String, ViewModel> mMap = new HashMap<>();

    final void put(String key, ViewModel viewModel) {
        ViewModel oldViewModel = mMap.put(key, viewModel);
        if (oldViewModel != null) {
            oldViewModel.onCleared();
        }
    }

    final ViewModel get(String key) {
        return mMap.get(key);
    }

    Set<String> keys() {
        return new HashSet<>(mMap.keySet());
    }

    /**
     *  Clears internal storage and notifies ViewModels that they are no longer used.
     */
    public final void clear() {
        for (ViewModel vm : mMap.values()) {
            vm.clear();
        }
        mMap.clear();
    }
}
```

从源码看出ViewModelStore的本质其实一个HashMap<String, ViewModel>。创建的ViewModel会被存放到map中缓存起来。Activity的横竖屏切换并不能影响ViewModel的生命周期。所有在切换横竖屏的时候获取的ViewModel都是同一个。



## ViewModel的内存泄漏

由于ViewModel的生命周期独立于Acitvity，所以在使用ViewModel如果应用的Acitvity的context，可能会导致Acitvity结束页面无法销毁造成内存泄漏。



## 对比 onSaveInstanceState()

onSaveInstanceState也是针对Activity旋转丢失数据的。但onSaveInstanceState()方法只能保存少量的、能支持序列化的数据，而ViewModel没有这个限制。ViewModel能支持页面中所有的数据。

还有当页面意外被关闭时ViewModel不可以恢复数据。但是onSaveInstanceState可以。所以onSaveInstanceState是有特殊的用途。二者的使用场景并不相同。



## ViewModel小结

ViewModel可以帮助我们将数据从页面中分离开，ViewModel有独立的生命周期，我们无需关心页面旋转的问题。