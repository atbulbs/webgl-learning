var width = 400
var height = 400

var canvas = document.getElementById('demo-canvas')
var renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
var scene = new THREE.Scene()
// OrthographicCamera 正交相机, 没有透视效果
var camera = new THREE.OrthographicCamera(-width / 2, width / 2,
height / 2, -height / 2, -1000, 1000)

renderer.setClearColor(new THREE.Color(0x000000, 1.0))
renderer.setSize(400, 400)

var triangleShape = new THREE.Shape()
triangleShape.moveTo(0, 100)
triangleShape.lineTo(-100, -100)
triangleShape.lineTo(100, -100)
triangleShape.lineTo(0, 100)

// 几何体, 顶点序列
var geometry = new THREE.ShapeGeometry(triangleShape)
// 素材, 着色
var material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  // 默认只有一个面
  side: THREE.DoubleSide
})
// 网格
var mesh = new THREE.Mesh(geometry, material)
mesh.position.x = 0
mesh.position.y = 0
mesh.position.z = 1
scene.add(mesh)

camera.position.x = 0
camera.position.y = 0
camera.position.z = 0
camera.lookAt(new THREE.Vector3(0, 0, 1))

var currentAngle = 0
var lastTimestamp = Date.now()

var animate = function () {
  var now = Date.now()
  var duration = now - lastTimestamp
  lastTimestamp = now
  currentAngle = currentAngle + duration / 1000 * Math.PI
}

var render = function () {
  animate()
  mesh.rotation.set(0, 0, currentAngle)
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()