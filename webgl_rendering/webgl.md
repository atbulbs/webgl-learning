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
  * 显存存储顶点数据与生成的片元数据
  * 显存的存储结构会对这些图形数据进行优化, 读写数据的效率比较高

1. javascript在显存中创建一个buffer, 传入图形数据, 顶点着色器和片元着色器从buffer中取数据, 从而js通过显存实现了数据的传递
2. 显卡的memory把数据给顶点着色器, 顶点着色器根据位置进行并行运算, 位置如a_position, 其为一系列顶点位置的集合, 假设是三角形, 它就是三个顶点坐标, 传进来的坐标, 顶点着色器会进行代码并发执行 
3. 执行完之后进行图元装配以及光栅化, 光栅化就是将三个顶点中间点的位置进行运算
4. 光栅化的结果传入片元着色器, 片元着色器对光栅化后一系列的点进行上色, 对gl_FragColor进行赋值
5. 完成上色后就会在屏幕上显示出来

FrameBuffer: 离屏渲染的缓冲区(也叫帧缓冲区), 可以将片元着色器渲染出来的数据进行修改, 然后再在屏幕上显示(相当于画画打草稿), 以纹理Textures的形式贴在屏幕上

三角形的渲染: 
  1. Vertices数组, 在js代码中, js代码通过webgl API在显存的memory中定义一个Vertices数组对应的显存空间, 一个buffer
  2. Vertex shader顶点着色器从buffer中将顶点数据取过来, 对顶点数组最终所处的位置进行计算, gl_Position就是最终所处的位置, 是由a_position计算出来的, a_position就是外界传来的顶点的位置, 需要在图形学的视界中根据不同的视角进行一系列的坐标转换, 最终得到的也就是gl_Position
  3. 进入图元装配阶段Primitive assembly, webgl中预定义了一些图元, 会根据图元的类型进行装配, 不同的图元会被装配成不同的形状
  4. 光栅化Rasteriztion, 将图元变成像素的形式, 
  5. Pixel Shader中如果一些边缘无法变成像素的形式, 就会被除掉, 最终展现由一系列像素组成的完整的图元
  6. 片元着色器对每个像素点进行颜色渲染, 给gl_FragColor进行赋值, 渲染光栅化结果的颜色, 如果gl_FragColor与位置相关, 需要将v_color从顶点着色器传入片元着色器, 通过varing数据类型, 在顶点着色器中定义一个varing变量, 在片元着色器中定义同样一个varing的变量就能拿到
  7. 片元着色器将光栅化的结果渲染上颜色并投到屏幕上



图元 给 光栅化 结果 传入 片元着色器 给点上色

GLSL中三种数据类型:
  1. attribute
   只能在vertext shader中使用的变量, 一般用于传递顶点数据
  2. uniform
   常量, 不能被shader修改, 被vertext shader与fragment shader当做全局变量共享使用 
  3. varing
   变量, vertext shader与fragment shader之间做数据传递, 使用场景: 颜色与位置有关系

```c
// Vertex Shader
attribute vec3 a_position; // 起始位置, Original Vertices 原始顶点坐标
uniform mat4 u_matrix; // 变换矩阵

void main () {
  gl_Position = u_matrix * a_position; // 在屏幕上渲染的位置 Clipspace Vertices
}
```

```c
// 光栅化 伪代码
v_color = 0.45, 0.46, 0.50
gl_FragColor = v_color
// 三个顶点, 带着渐变色的三角形
v0: 0.50, 0.57, 0.50
v1: 0.88, 0.09, 0.50
v2: 0.06, 0.17, 0.50
```

