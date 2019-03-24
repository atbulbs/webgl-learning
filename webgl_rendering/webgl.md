1. 浏览器实现了OpenGL ES规范, 用它直接调用显卡(ES版本指嵌入式, 针对移动端高性能的API)
2. OpenGL ES与javascript绑定连接, 提供WebGL接口
3. WebGL接口使浏览器能展示3D模型和场景
4. three.js 封装WebGL接口

场景, 产品形态: 3D试衣看房家居, 点云效果渲染

web: 让信息被全世界每个人方便的接触到

GPU 有很多的ALU(计算单元), 多核编程, 计算密集型, 并行运算

如何对GPU编程:
  1. WebGL
  2. GLSL: GL shading language(类似C语言语法)

GLSL:
   1. Vertex Shader顶点着色器 gl_Position 
   2. Fragment Shader片元着色器 gl_FragColor 
   
WEBGL渲染管线
  * 显存存储顶点着色器数据与生成的片元着色器的数据
  * 显存对这些数据进行优化

1. javascript在显存中创建一个buffer, 传入图形数据, 顶点着色器和片元着色器从buffer中取数据
2. 显卡的memory把数据给顶点着色器, 顶点着色器根据位置进行并行运算
3. 



图元 给 光栅化 结果 传入 片元着色器 给点上色

GLSL中三种数据类型:
  1. attribute
   只能在vertext shader中使用的变量, 一般用于传递顶点数据
  2. uniform
   常量, 不能被shader修改, 被vertext与fragment共享使用 
  3. varing
   变量, vertext 与 fragment shader之间做数据传递

