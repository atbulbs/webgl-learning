var canvas = document.getElementById('myCanvas')
var gl = canvas.getContext('webgl') // ctx

// 顶点着色器和片元着色器绑定ctx的program
// 让顶点着色器和片元着色器加载到canvas要执行的程序段里
// program = gl.createProgram 创建
// gl.attachShader(program, vertexShader) 绑定顶点着色器
// gl.attachShader(program, fragmentShader) 绑定片元着色器
// gl.linkProgram(program) 连接
// gl.useProgram(program) 使用
// 可以定义多个program和多个shader, 有业务逻辑选择用哪个program
// gl.program = program 更方便的访问program
var program = gl.createProgram()

var VSHADER_SOURCE, FSHADER_SOURCE

VSHADER_SOURCE =
  // attribute 只能在vertex shader中使用的变量, 用于传递顶点数据
  // attribute 利用webgl buffer定义, 将buffer的地址传递给顶点着色器, 
  // 并且往对应地址的buffer中传入顶点数据, 顶点着色器就能拿到attribute定义的顶点了
  // vec4 四维向量
  'attribute vec4 a_Position;\n' + 
  // uniform 常量, 可以在 vertex 和 fragment 两者声明和共享
  // 通过uniform传递变换矩阵, 光线变换的参数
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' + 
  'void main () {\n' + 
    'gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' + 
  '}\n'

FSHADER_SOURCE =
  'void main () {\n' + 
  // gl_FragColor 内置的获取屏幕像素的变量名
  // vec4(r, g, b, a)
    'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + 
  '}\n'

var vertexShader, fragmentShader

function createShader (gl, sourceCode, type) {
  // 创建shader
  var shader = gl.createShader(type)
  // 挂载shader代码
  gl.shaderSource(shader, sourceCode)
  // 编译shader代码
  gl.compileShader(shader)
  return shader
}

// define vertex shader
vertexShader = createShader(gl, VSHADER_SOURCE, gl.VERTEX_SHADER)
// define frament shader
fragmentShader = createShader(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER)

// attach shader to program
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)

// link program to context
gl.linkProgram(program)
gl.useProgram(program)
gl.program = program

var currentAngle = 0
var g_last = Date.now()


var tick = function () {
  // update the new rotation angle
  animate()
  // draw
  draw()
  window.requestAnimationFrame(tick)
}

function initVertexBuffers (gl) {
  // 定义顶点
  var vertices = new Float32Array([
    0, 0.5, -0.5, -0.5, 0.5, -0.5
  ])
  var n = 3
  // 创建buffer
  var vertexBuffer = gl.createBuffer()
  // buffer绑定webgl, 顶点缓冲区有两种, ARRAY_BUFFER: 顶点缓冲区, ELEMENT_ARRAY_BUFFER: 顶点索引缓冲区
  // 顶点缓冲区会有重复的数据, 用索引可以减小buffer使用的存储空间
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // write data into the buffer object
  // 灌入数据, gl.STATIC_DRAM对缓冲区优化, 定义缓冲区将被如何使用
  // STATIC_DRAW第一次对缓冲区进行render后再也不会对缓冲区的数据进行修改
  // 缓冲区会根据第三个参数和webgl刷新的频率, 对性能进行整体优化, 这叫webgl优化策略
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  // get attribute a_Position address in vertex shader
  // 缓冲区的数据将传入shader的哪个变量里
  // 获得shader中需要传入变量的地址
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  // 2 个数作为a_Position的一个坐标
  // 定义传的策略
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  // enable a_Position variable
  gl.enableVertexAttribArray(a_Position)
  return n
}

// write the positions of vertices to a vertex shader
// 将顶点数据传入顶点着色器, 初始化一个vertexBuffer, 并将数据传入vertexBuffer中, 最终传给vertexShader
// 实现a_Position和buffer的绑定
var n = initVertexBuffers(gl)

// 用黑色去清空画布
gl.clearColor(0, 0, 0, 1)

var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
var modelMatrix = new Matrix4()
// modelMatrix.setRotate(70, 0, 1, 0)

var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
var viewMatrix = new Matrix4()
viewMatrix.lookAt(100, 100, 100, 0, 0, 0, 0, 1, 0)

var u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix')
var projectionMatrix = new Matrix4()
// projectionMatrix.perspective(120, 1, 0.1, 1000)
projectionMatrix.ortho(-1, 1, -1, 1, 0.1, 1000)

// 变换角度
function animate () {
  var now = Date.now()
  var duration = now - g_last
  g_last = now
  currentAngle = currentAngle + duration / 1000 * 180
}


function draw () {
  // clear canvas and add background color
  modelMatrix.setRotate(currentAngle, 0, 0, 1)
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements)
  // gl.COLOR_BUFFER_BIT获取gl.clearColor操作设置的背景色
  gl.clear(gl.COLOR_BUFFER_BIT)
  // 按照三角形来绘制
  // 第二个参数为取第一顶点的索引
  // 绘制n个顶点
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

tick()

