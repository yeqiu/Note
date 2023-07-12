

[toc]

# ViewBinding的使用



## 基本用法

### 开启ViewBinding

启用视图绑定需要在 **`build.gradle`** 配置

~~~java
android {
    ...
    viewBinding {
        enabled = true
    }
}
~~~

编译后会为XML文件生成一个绑定类，命名规则：xml文件转成首字母大写，去掉下划线，并加上Binding。

~~~java
activity_main  => ActivityMainBinding
~~~



### Activity中使用

~~~kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityMainBinding.inflate(layoutInflater)
        //获取最外层布局
        val rootView = binding.root
        setContentView(rootView)
        //修改数据
        binding.tvMain.text = "test"
    }
~~~



### Fragment中使用

~~~kotlin
class MainFragment : Fragment() {

    private var _binding: FragmentMainBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
//        return super.onCreateView(inflater, container, savedInstanceState)
        _binding = FragmentMainBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.tvFragment.text = "MainFragment"
    }

    /**
     * Fragment的存活时间比View长，销毁时需要清除对绑定类实例，否则会引发内存泄露
     */
    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }


}
~~~





### Dialog中使用

- DialogFragment的写法和Fragment一致
- Dialog的写法如下(PopupWindow类似))

~~~kotlin
class MainDialog(context:Context):Dialog(context) {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val binding = DialogMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.tvDialog.text = "MainDialog"
    }
}
~~~





### RecyclerView Adapter中使用

~~~kotlin
class RvMainAdapter :RecyclerView.Adapter<RvMainAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RvMainAdapter.ViewHolder {
        val binding = ItemRvMainBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.binding.tvItemMain.text = "$position,item main"
    }

    override fun getItemCount(): Int {
        return 10
    }
    
    class ViewHolder(val binding:ItemRvMainBinding):RecyclerView.ViewHolder(binding.root)

}
~~~



### 总结

视图绑定通过三个API

~~~kotlin
// View已存在，使用生成的Binding类调用bind方法绑定视图
fun <T> bind(view : View) : T
// View未存在
fun <T> inflate(inflater : LayoutInflater) : T
fun <T> inflate(inflater : LayoutInflater, parent : ViewGroup?, attachToParent : Boolean) : T

~~~



## 原理

在编译后自动生成的文件中发现本质还是调用findViewById。



## 基类封装

~~~java
//通过泛型和反射生成ViewBinding
//in Activity 
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            //获取父类的泛型
            ParameterizedType parameterizedType = (ParameterizedType) this.getClass().getGenericSuperclass();
            //获取第一个泛型参数
            Class<T> clazz = (Class<T>) parameterizedType.getActualTypeArguments()[0];
            //反射调用
            Method inflate = clazz.getMethod("inflate", LayoutInflater.class);
            binding = (T) inflate.invoke(null, getLayoutInflater());
            setContentView(binding.getRoot());
            init();
        } catch (Exception e) {
            e.printStackTrace();
            LogUtil.logException(e);
        }
    }

// in Fragment
 public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        try {
            ParameterizedType parameterizedType = (ParameterizedType) getClass().getGenericSuperclass();
            Class<T> clazz = (Class<T>) parameterizedType.getActualTypeArguments()[0];
            Method inflate = clazz.getMethod("inflate", LayoutInflater.class,ViewGroup.class, boolean.class);
//            Method inflate = clazz.getMethod("inflate", LayoutInflater.class);
            binding = (T) inflate.invoke(null,getLayoutInflater(),container,false);
        } catch (Exception exception) {
            exception.printStackTrace();
            LogUtil.logException(exception);
        }

        if (binding!=null){
            return binding.getRoot();
        }else{
            return super.onCreateView(inflater, container, savedInstanceState);
        }

    }

~~~







## 参考

[Jetpack】学穿：ViewBinding → 视图绑定](https://juejin.cn/post/7067532076223823903#heading-25)

[[Binding](https://github.com/hi-dhl/Binding)](https://github.com/hi-dhl/Binding)
