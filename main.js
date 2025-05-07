import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    35, window.innerWidth / window.innerHeight, 0.1, 30
)
camera.position.z = 10

// RGB Axis indicator
const axesHelper = new THREE.AxesHelper();
axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff)
scene.add(axesHelper)

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaaff,
    wireframe: true
})
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.add(cubeMesh)

const canvas = document.querySelector('canvas.threejs')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
const maxPixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(maxPixelRatio)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.autoRotate = true

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

const renderLoop = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(renderLoop)
}

renderLoop()
