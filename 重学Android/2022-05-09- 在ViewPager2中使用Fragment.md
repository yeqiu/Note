# 在ViewPager2中使用Fragment

## 简单使用

adapter使用FragmentStateAdapter，需要传入FragmentActivity或者Fragment或者FragmentManager

```kotlin
class FragmentAdapter(activity: FragmentActivity):FragmentStateAdapter(activity){
    override fun getItemCount(): Int {
        return fragments.size
    }

    override fun createFragment(position: Int): Fragment {
        return fragments[position]
    }
}
```

FragmentAdapter中的Fragment中已经实现懒加载。会在加载当前Fragment时才会执行对应的生命周期，生命周期如下

onCreate -> onCreateView -> onViewCreated -> onResume

再次加载时候仅执行 onResume

如果需要一次性加载所有的Fragment，可以给ViewPager2设置 offscreenPageLimit

~~~kotlin
binding.vp2.offscreenPageLimit = fragments.size 
~~~

