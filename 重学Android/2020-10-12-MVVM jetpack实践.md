---
layout:     post  
title:      MVVM jetpack实践 
subtitle:   MVVM jetpack
date:       2020-10-12
author:     小卷子
header-img: img/tag-bg.jpg
catalog: true
tags:
    - 标签
---



## 简介

本文是在学习[第一行代码](https://blog.csdn.net/guolin_blog/article/details/26365913)的笔记。



## 实践项目

天气预报App

### 项目架构图

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gjq4cvw67oj30ju0kc74z.jpg)

图中所有的箭头都是单向的，ui层持有viewModel层的引用,但是不能反过来.不能跨层控制.每一次都是控制与他相邻的层级组件.



## 搜索城市数据

api地址:https://api.caiyunapp.com/v2/place?token=F8TUEBSFSOmdSxHf&lang=zh_CN&query=北京

### 实现数据层

#### 1.定义网络请求数据模型

```kotlin
data class PlaceResponse(val status: String, val query:String,val places: List<Place>)


data class Place(
    val name: String, val location: Location,
    @SerializedName("formatted_address") val address: String
)


data class Location(val lng: String, val lat: String)
```

#### 2.创建请求服务

```kotlin
//定义Service
interface PlaceService {

    @GET("/v2/place?token=${AppData.weatherKey}&lang=zh_CN")
    fun searchPlaces(@Query("query") place:String):Call<PlaceResponse>

}
```

#### 3.创建同一网络数据入口

```kotlin
object NetWorkManager {
    
    private val placeService = ServiceFactory.create<PlaceService>()

    suspend fun searchPlaces(query: String)= placeService.searchPlaces(query).await()
    
}

object ServiceFactory {
    private const val BASE_URL = "https://api.caiyunapp.com/"
    private var loggingInterceptor = LoggingInterceptor.Builder()
        .loggable(true)
        .request()
        .requestTag("Request")
        .response()
        .responseTag("Response")
        .hideVerticalLine()// 隐藏竖线边框
        .build()
    private val okHttpClient = OkHttpClient.Builder()
        .writeTimeout(30 * 1000, TimeUnit.MILLISECONDS)
        .readTimeout(30 * 1000, TimeUnit.MILLISECONDS)
        .connectTimeout(30 * 1000, TimeUnit.MILLISECONDS)
        .addInterceptor(NetInterceptor())
        .addInterceptor(loggingInterceptor)
        .build()
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .client(okHttpClient)
        .build()
  
    fun <T> create(service: Class<T>): T {
        return retrofit.create(service)
    }
    inline fun <reified T> create(): T = create(T::class.java)
}
```

#### 4.创建数据仓库

```kotlin
object PlaceRepository {
    fun searchPlaces(query: String) = liveData(Dispatchers.IO){
        var result = try{
            //请求网络数据
            val placeResponse = NetWorkManager.searchPlaces(query)
            if (placeResponse.status == "ok"){
                val place = placeResponse.places
                Result.success(place)
            }else{
                Result.failure(RuntimeException("获取地区数据错误,${placeResponse.status}"))
            }
        }catch (e:Exception){
            Result.failure(e)
        }
        //设置请求的结果，类似调用setValue
        emit(result)
    }

}
```

#### 5.创建ViewModel

```kotlin
class PlaceViewModel : ViewModel() {

    private val searchPlace = MutableLiveData<String>()
    //用于缓存数据，外界可直接调用这个集合获取数据
    val placeList = ArrayList<Place>()

    //观察当searchPlace发生变化，从仓库中获取新的数据
    val placeLiveData = Transformations.switchMap(searchPlace) { query ->
        PlaceRepository.searchPlaces(query)
    }
    
    //改变searchPlace
    fun searchPlace(query: String) {
        searchPlace.value = query
    }
}
```

### 实现UI层

```kotlin
class PlaceFragment:Fragment() {

   private val placeViewModel by lazy {
        ViewModelProvider(this).get(PlaceViewModel::class.java)
    }

    private lateinit var placeAdapter: PlaceAdapter



    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        return inflater.inflate(R.layout.fragment_place,container,false);
    }


    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        //初始化RecyclerView
        val linearLayoutManager = LinearLayoutManager(activity)
        rvPlaceList.layoutManager = linearLayoutManager
        val placeList = placeViewModel.placeList
        placeAdapter = PlaceAdapter(placeList)
        rvPlaceList.adapter = placeAdapter

        etPlace.addTextChangedListener{editable->
            val context = editable.toString()
            if (context.isNotEmpty()){
                placeViewModel.searchPlace(context)
            }else{
                //输入内容为空
                //隐藏列表，清除之前的数据
                rvPlaceList.visibility = View.INVISIBLE
                placeViewModel.placeList.clear()
            }
        }

        

        //列表数据回调监听
        placeViewModel.placeLiveData.observe(viewLifecycleOwner,{result->
            val placeList = result.getOrNull()

            if (placeList!=null){
                rvPlaceList.visibility = View.VISIBLE
              	//设置ViewModel的数据
                placeViewModel.placeList.clear()
                placeViewModel.placeList.addAll(placeList)
                placeAdapter.notifyDataSetChanged()
            }else{
                "未能查询到任何地点".showToast()
                result.exceptionOrNull()?.printStackTrace()
            }
        })
    }

}
```











