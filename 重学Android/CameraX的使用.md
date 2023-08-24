# CameraX的使用

## 依赖

```kotlin
//camerax
val cameraxVersion = "1.3.0-alpha04"
val cameraCore = "androidx.camera:camera-core:$cameraxVersion"
val cameraCamera2 = "androidx.camera:camera-camera2:$cameraxVersion"
val cameraLifecycle = "androidx.camera:camera-lifecycle:$cameraxVersion"
val cameraVideo = "androidx.camera:camera-video:$cameraxVersion"
val cameraView = "androidx.camera:camera-view:$cameraxVersion"
val cameraMlkit = "androidx.camera:camera-mlkit-vision:$cameraxVersion"
val cameraExtensions = "androidx.camera:camera-extensions:$cameraxVersion"
```



## 预览

### 添加PreviewView，用来预览

使用PreviewView来实现预览，布局文件中添加PreviewView

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <androidx.camera.view.PreviewView
        android:id="@+id/pv_preview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

### 申请必要权限

```xml
<uses-feature android:name="android.hardware.camera.any" />

<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="28" />
```

> 如果在未指定 `android.hardware.camera.any` 的情况下使用 `android.hardware.camera`，并且设备未配有后置摄像头（例如大多数 Chromebook），那么相机将无法正常运行。



代码中申请运行时权限



### 开始预览

```kotlin
    private fun startCameraPreview() {
        // 获取相机提供者的实例
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)

        try {
            // 添加相机提供者监听器 
            // 参数1：Runnable，在此创建预览对象，设置摄像头
            // 参数2://工作的线程池，主线程
            cameraProviderFuture.addListener(
                {
                    val cameraProvider = cameraProviderFuture.get()
                    //创建相机预览对象
                    val preview = Preview.Builder().build()
                    //关联布局中的预览控件
                    preview.setSurfaceProvider(binding.pvPreview.surfaceProvider)

                    //选择摄像头
                    val cameraSelector =
                        when {
                            //优先使用后置
                            cameraProvider.hasCamera(CameraSelector.DEFAULT_BACK_CAMERA) -> CameraSelector.DEFAULT_BACK_CAMERA
                            cameraProvider.hasCamera(CameraSelector.DEFAULT_FRONT_CAMERA) -> CameraSelector.DEFAULT_FRONT_CAMERA
                            else -> throw IllegalStateException("无可用摄像头")
                        }

                    // 解绑所有相机以防止冲突，并将预览与相机生命周期绑定
                    cameraProvider.unbindAll()
                    //绑定声明周期，开始预览
                    cameraProvider.bindToLifecycle(this, cameraSelector, preview)
                },
                //工作的线程池，主线程
                ContextCompat.getMainExecutor(this),
            )
        } catch (ex: Exception) {
            "发生异常 ${ex.message}".log()
        }
    }
```

## 拍照

在开启预览创建ImageCapture，并绑定到Lifecycle

~~~kotlin
                    //创建拍照实例
                    this.imageCapture = ImageCapture.Builder()
                        //设置拍照的模式
                        .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                        .setTargetRotation(previewView.display.rotation)
                        .build()
~~~

发起拍照

~~~kotlin
    private fun takePhoto() {
        // 指定拍摄后的图片的名字
        val name = formatTime()

        // 使用MediaStore进行文件存储，并在相册中显示出来
        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, name)
            put(MediaStore.MediaColumns.MIME_TYPE, "image/jpeg")
            //android 9 以上可以设置单独目录
            if (Build.VERSION.SDK_INT > Build.VERSION_CODES.P) {
                put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/cameraxApp")
            }
        }

        // 创建图片拍摄的配置项，指定文件输出位置
        val outputOptions = ImageCapture.OutputFileOptions
            .Builder(
                contentResolver,
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                contentValues
            )
            .build()

        // 指定takePicture开始拍照
        imageCapture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(this),
            object : ImageCapture.OnImageSavedCallback {
                override fun onError(exc: ImageCaptureException) {
                    // 图片拍摄出错
                    showToast("图片拍摄失败")
                    exc.message?.log()
                }
                override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                    // 图片拍摄成功
                    val picUri = output.savedUri
                    showToast("图片拍摄成功")
                    "照片地址 ${picUri.toString()}".log()
                }
            }
        )
    }
~~~



## 录像

在开启预览创建VideoCapture，并绑定到Lifecycle

~~~kotlin
                    //创建录像实例,先配置录像参数
                    val recorder = Recorder.Builder()
                        .setTargetVideoEncodingBitRate(30_000)
                        // 设置宽高比
                        .setAspectRatio(AspectRatio.RATIO_16_9)
                        // 设置视频质量
                        .setQualitySelector(QualitySelector.from(Quality.HD))
                        .build()
                    this.videoCapture = VideoCapture.withOutput(recorder)
~~~

开启录制

```kotlin
private fun startRecording() {

    // 创建视频文件
    val name = formatTime()
    // 指定视频文件的名称，路径等
    val contentValues = ContentValues().apply {
        put(MediaStore.MediaColumns.DISPLAY_NAME, name)
        put(MediaStore.MediaColumns.MIME_TYPE, "video/mp4")
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.P) {
            put(MediaStore.Video.Media.RELATIVE_PATH, "Movies/cameraxApp")
        }
    }
    // 使用MediaStore来保存视频文件
    val mediaStoreOutputOptions = MediaStoreOutputOptions
        .Builder(contentResolver, MediaStore.Video.Media.EXTERNAL_CONTENT_URI)
        .setContentValues(contentValues)
        .build()
    // 开启录制
    this.recording = videoCapture.output
        .prepareRecording(this, mediaStoreOutputOptions)
        .apply {
            // 如果被授予了录音权限，则在视频录制中，开启录音能力
            if (PermissionChecker.checkSelfPermission(
                    this@CameraActivity,
                    Manifest.permission.RECORD_AUDIO
                ) == PermissionChecker.PERMISSION_GRANTED
            ) {
                withAudioEnabled()
            }
        }
        .start(ContextCompat.getMainExecutor(this)) { recordEvent ->
            // 录制的回调
            when (recordEvent) {
                // 开始录制，比如更新UI
                is VideoRecordEvent.Start -> {

                    isRecording = true
                    updateRecordingButton()

                }

                is VideoRecordEvent.Status -> {
                    // 视频录制进行中.....
                    // 可以拿到视频录制的时长，文件体积等
                }
                // 录制结束
                is VideoRecordEvent.Finalize -> {
                    isRecording = false
                    updateRecordingButton()
                    // 判断录制是否出现错误
                    if (!recordEvent.hasError()) {
                        showToast("视频录制成功")
                        "视频录制成功 ${recordEvent.outputResults.outputUri}".toString().log()
                    } else {

                        showToast("视频录制失败")
                        "${recordEvent.error}"?.log()

                    }
                }
            }
        }
}
```

停止录制

```kotlin
recording.stop()
```

## 对焦

~~~kotlin
preview.setonTouchEventListener{view,event->
// 实现手动对焦
    val meteringPointFactory = preview.meteringPointFactory
    val point = meteringPointFactory.createPoint(event.x, event.y)

    val action = event.action
    if (action == MotionEvent.ACTION_DOWN) {
        val actionBuilder = FocusMeteringAction.Builder(point, FocusMeteringAction.FLAG_AF)
        camera?.cameraControl?.startFocusAndMetering(actionBuilder.build())
    }
   }                                 
}
~~~



## 完整代码

```kotlin
class CameraActivity : AppCompatActivity() {

    private val binding: ActivityCamreaBinding by lazy {
        ActivityCamreaBinding.inflate(
            layoutInflater
        )
    }
    
    //默认后置摄像头
    private var isBackCamera = true

    //默认拍照模式
    private var isVideo = false

    //正在录制视频
    private var isRecording = false

    private lateinit var camera: Camera
    private lateinit var imageCapture: ImageCapture
    private lateinit var videoCapture: VideoCapture<Recorder>
    private lateinit var recording: Recording

    //手势监听
    private lateinit var scaleDetector: ScaleGestureDetector
    private lateinit var clickDetector: GestureDetector

    //缩放状态
    private lateinit var cameraZoomState: LiveData<ZoomState>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        //检查相关权限
        checkCameraPermission()
        initListener()
    }

    private fun checkCameraPermission() {
        val permissions = listOfNotNull(
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            //10以下添加文件读取权限
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            } else {
                null
            }
        )

        PermissionX.init(this)
            .permissions(permissions)
            .request { allGranted, _, _ ->
                if (allGranted) {
                    startCameraPreview()
                } else {
                    Toast.makeText(this@CameraActivity, "未获取权限", Toast.LENGTH_SHORT).show()
                }
            }
    }


    private fun startCameraPreview() {
        
        // 获取相机提供者的实例
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)

        bindPreview(cameraProviderFuture, binding.pvPreview)

    }

    private fun bindPreview(
        cameraProviderFuture: ListenableFuture<ProcessCameraProvider>,
        previewView: PreviewView
    ) {

        try {
            // 添加相机提供者监听器
            // 参数1：Runnable，在此创建预览对象，设置摄像头
            // 参数2://工作的线程池，主线程
            cameraProviderFuture.addListener(
                {
                    val cameraProvider = cameraProviderFuture.get()
                    //创建相机预览对象
                    val preview = Preview.Builder().build()
                    //关联布局中的预览控件
                    preview.setSurfaceProvider(previewView.surfaceProvider)

                    val cameraSelector = setCameraSelector(cameraProvider)

                    //创建拍照实例
                    this.imageCapture = ImageCapture.Builder()
                        //设置拍照的模式
                        .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                        .setTargetRotation(previewView.display.rotation)
                        .build()

                    //创建录像实例,先配置录像参数
                    val recorder = Recorder.Builder()
                        .setTargetVideoEncodingBitRate(30_000)
                        // 设置宽高比
                        .setAspectRatio(AspectRatio.RATIO_16_9)
                        // 设置视频质量
                        .setQualitySelector(QualitySelector.from(Quality.HD))
                        .build()
                    this.videoCapture = VideoCapture.withOutput(recorder)


                    // 解绑所有相机以防止冲突，并将预览与相机生命周期绑定
                    cameraProvider.unbindAll()
                    //绑定Lifecycle
                    if (isVideo) {
                        //录像
                        this.camera = cameraProvider.bindToLifecycle(
                            this,
                            cameraSelector,
                            preview,
                            videoCapture
                        )
                    } else {
                        //拍照
                        this.camera = cameraProvider.bindToLifecycle(
                            this,
                            cameraSelector,
                            preview,
                            imageCapture
                        )
                    }
                    updateUI()
                    //缩放状态
                    cameraZoomState = camera.cameraInfo.zoomState
                },
                //工作的线程池，主线程
                ContextCompat.getMainExecutor(this),
            )
        } catch (ex: Exception) {
            "发生异常 ${ex.message}".log()
        }


    }


    private fun initListener() {

        binding.mbtCamera.setOnClickListener {
            switchCamera()
        }
        binding.mbtCameraType.setOnClickListener {
            changeCameraType()
        }
        binding.mbtTake.setOnClickListener {
            cameraTake()
        }
        crateGestureDetector()


        binding.pvPreview.setOnTouchListener { v, event ->


            scaleDetector.onTouchEvent(event)
            clickDetector.onTouchEvent(event)

            true
        }


    }

    private fun setCameraFocus(event: MotionEvent) {

        if (::camera.isInitialized) {
            val meteringPointFactory = binding.pvPreview.meteringPointFactory
            val point = meteringPointFactory.createPoint(event.x, event.y)
            val actionBuilder = FocusMeteringAction.Builder(point, FocusMeteringAction.FLAG_AF)
            camera.cameraControl.startFocusAndMetering(actionBuilder.build())
            //显示对焦view
            showTapView(event.x.toInt(),event.y.toInt())
        }
    }

    /**
     * 显示对焦view，这里只是简单展示一个PopupWindow
     * @param x Int
     * @param y Int
     */
    private fun showTapView(x: Int, y: Int) {
        val popupWindow = PopupWindow(
           150,150
        )
        val imageView = ImageView(this)
        imageView.setImageResource(R.drawable.ic_focus_view)

        val offset = 150
        popupWindow.contentView = imageView
        popupWindow.showAsDropDown(binding.pvPreview, x , y  )

        binding.pvPreview.postDelayed({ popupWindow.dismiss() }, 600)
    }


    private fun crateGestureDetector() {

        scaleDetector = ScaleGestureDetector(this, object : SimpleOnScaleGestureListener() {
            override fun onScale(detector: ScaleGestureDetector): Boolean {

                cameraZoomState.value?.let {
                    val zoomRatio = it.zoomRatio
                    camera.cameraControl.setZoomRatio(zoomRatio * detector.scaleFactor)

                    "Scale factor:${detector.scaleFactor} current:$zoomRatio linear:${it.linearZoom}".log()
                }

                return true
            }
        })

        clickDetector =
            GestureDetector(this, object : GestureDetector.SimpleOnGestureListener() {
                override fun onDoubleTap(e: MotionEvent): Boolean {
                    cameraZoomState.value?.let {
                        //获取当前的缩放和最小缩放
                        val zoomRatio = it.zoomRatio
                        val minRatio = it.minZoomRatio
                        if (zoomRatio > minRatio) {
                            //还原
                            camera.cameraControl.setLinearZoom(0.toFloat())
                        } else {
                            //放大0.5
                            camera.cameraControl.setLinearZoom(0.5f)
                        }
                    }

                    return true
                }

                override fun onSingleTapConfirmed(e: MotionEvent): Boolean {
                    setCameraFocus(e)
                    return true
                }

            })
    }


    /**
     * 设置摄像头，同时校验是否有前后摄像头
     * @param cameraProvider ProcessCameraProvider
     */
    private fun setCameraSelector(cameraProvider: ProcessCameraProvider): CameraSelector {

        //前后都支持
        if (cameraProvider.hasCamera(CameraSelector.DEFAULT_BACK_CAMERA) &&
            cameraProvider.hasCamera(CameraSelector.DEFAULT_FRONT_CAMERA)
        ) {
            return if (isBackCamera) CameraSelector.DEFAULT_BACK_CAMERA else CameraSelector.DEFAULT_FRONT_CAMERA
        }

        return if (cameraProvider.hasCamera(CameraSelector.DEFAULT_BACK_CAMERA)) {
            //仅支持后置
            isBackCamera = true
            CameraSelector.DEFAULT_BACK_CAMERA
        } else if (cameraProvider.hasCamera(CameraSelector.DEFAULT_FRONT_CAMERA)) {
            //仅支持后置
            isBackCamera = false
            CameraSelector.DEFAULT_FRONT_CAMERA
        } else {
            throw IllegalStateException("未找到可用摄像头")
        }
    }


    private fun updateUI() {

        if (isBackCamera) {
            binding.mbtCamera.text = "切换到前置"
        } else {
            binding.mbtCamera.text = "切换到后置"
        }

        if (isVideo) {
            binding.mbtCameraType.text = "切换到拍照"
            binding.mbtTake.text = "录制"
        } else {
            binding.mbtCameraType.text = "切换到录像"
            binding.mbtTake.text = "拍照"
        }
    }


    private fun switchCamera() {

        isBackCamera = !isBackCamera
        // 重新启动相机预览
        startCameraPreview()

    }

    private fun changeCameraType() {

        isVideo = !isVideo

        startCameraPreview()

    }

    private fun cameraTake() {

        if (isVideo) {
            //录像
            takeVideo()
        } else {
            takePhoto()
        }
    }

    private fun updateRecordingButton() {

        if (isRecording) {
            //开始录制
            binding.mbtTake.text = "停止录制"
            //禁止切换拍照录像
            binding.mbtCameraType.isEnabled = false

        } else {
            //停止录制
            binding.mbtTake.text = "录制"
            binding.mbtCameraType.isEnabled = true

        }

    }


    private fun takeVideo() {

        if (isRecording) {
            recording.stop()
        } else {
            startRecording()
        }

    }

    private fun startRecording() {

        // 创建视频文件
        val name = formatTime()
        // 指定视频文件的名称，路径等
        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, name)
            put(MediaStore.MediaColumns.MIME_TYPE, "video/mp4")
            if (Build.VERSION.SDK_INT > Build.VERSION_CODES.P) {
                put(MediaStore.Video.Media.RELATIVE_PATH, "Movies/cameraxApp")
            }
        }
        // 使用MediaStore来保存视频文件
        val mediaStoreOutputOptions = MediaStoreOutputOptions
            .Builder(contentResolver, MediaStore.Video.Media.EXTERNAL_CONTENT_URI)
            .setContentValues(contentValues)
            .build()
        // 开启录制
        this.recording = videoCapture.output
            .prepareRecording(this, mediaStoreOutputOptions)
            .apply {
                // 如果被授予了录音权限，则在视频录制中，开启录音能力
                if (PermissionChecker.checkSelfPermission(
                        this@CameraActivity,
                        Manifest.permission.RECORD_AUDIO
                    ) == PermissionChecker.PERMISSION_GRANTED
                ) {
                    withAudioEnabled()
                }
            }
            .start(ContextCompat.getMainExecutor(this)) { recordEvent ->
                // 录制的回调
                when (recordEvent) {
                    // 开始录制，比如更新UI
                    is VideoRecordEvent.Start -> {
                        isRecording = true
                        updateRecordingButton()
                    }
                    is VideoRecordEvent.Status -> {
                        // 视频录制进行中.....
                        // 可以拿到视频录制的时长，文件体积等
                    }
                    // 录制结束
                    is VideoRecordEvent.Finalize -> {
                        isRecording = false
                        updateRecordingButton()
                        // 判断录制是否出现错误
                        if (!recordEvent.hasError()) {
                            showToast("视频录制成功")
                            "视频录制成功 ${recordEvent.outputResults.outputUri}".toString().log()
                        } else {

                            showToast("视频录制失败")
                            "${recordEvent.error}"?.log()

                        }
                    }
                }
            }
    }

    private fun takePhoto() {
        // 指定拍摄后的图片的名字
        val name = formatTime()

        // 使用MediaStore进行文件存储，并在相册中显示出来
        val contentValues = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, name)
            put(MediaStore.MediaColumns.MIME_TYPE, "image/jpeg")
            //android 9 以上可以设置单独目录
            if (Build.VERSION.SDK_INT > Build.VERSION_CODES.P) {
                put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/cameraxApp")
            }
        }

        // 创建图片拍摄的配置项，指定文件输出位置
        val outputOptions = ImageCapture.OutputFileOptions
            .Builder(
                contentResolver,
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                contentValues
            )
            .build()

        // 指定takePicture开始拍照
        imageCapture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(this),
            object : ImageCapture.OnImageSavedCallback {
                override fun onError(exc: ImageCaptureException) {
                    // 图片拍摄出错
                    showToast("图片拍摄失败")
                    exc.message?.log()
                }

                override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                    // 图片拍摄成功
                    val picUri = output.savedUri
                    showToast("图片拍摄成功")
                    "照片地址 ${picUri.toString()}".log()
                }
            }
        )
    }

}
```













