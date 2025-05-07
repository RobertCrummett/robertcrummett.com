import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    35, window.innerWidth / window.innerHeight, 0.1, 1000
)
camera.position.z = 10

// Create custom geometry
const geometry = new THREE.BoxGeometry(1, 1, 1)
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16)
const planeGeometry = new THREE.PlaneGeometry(1, 1)

const material = new THREE.MeshPhysicalMaterial()
material.color = new THREE.Color('green')
material.metalness = 0.1
material.roughness = 0
material.reflectivity = 0
material.clearcoat = 0.4

const mesh = new THREE.Mesh(geometry, material)
const mesh2 = new THREE.Mesh(torusKnotGeometry, material)
mesh2.position.x = 1.5
const mesh3 = new THREE.Mesh(planeGeometry, material)
mesh3.position.x = -1.5

scene.add(mesh)
scene.add(mesh2)
scene.add(mesh3)

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

const pointLight = new THREE.PointLight(0xffffff, 10)
pointLight.position.set(1, 1, 1)
scene.add(pointLight)

const axesHelper = new THREE.AxesHelper()
axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff)
scene.add(axesHelper)

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

const clock = new THREE.Clock()
let previousTime = 0

const renderLoop = () => {
    const currentTime = clock.getElapsedTime()
    const delta = currentTime - previousTime
    previousTime = currentTime

    // cubeMesh.rotation.y += THREE.MathUtils.degToRad(1) * delta * 20
    // cubeMesh.scale.x = Math.sin(currentTime)

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(renderLoop)
}

renderLoop()
