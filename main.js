import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader();

const geometry = new THREE.BoxGeometry(1, 1, 1)
const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16)
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)

const grassAlbedo = textureLoader.load('static/textures/whispy-grass-meadow-bl/wispy-grass-meadow_albedo.png')
const grassAo = textureLoader.load('static/textures/whispy-grass-meadow-bl/wispy-grass-meadow_ao.png')
const grassHeight = textureLoader.load('static/textures/whispy-grass-meadow-bl/wispy-grass-meadow_height.png')
const grassMetallic = textureLoader.load('static/textures/whispy-grass-meadow-bl/wispy-grass-meadow_metallic.png')
const grassNormal = textureLoader.load('static/textures/whispy-grass-meadow-bl/wispy-grass-meadow_normal-ogl.png')
const grassRoughness = textureLoader.load('static/textures/whispy-grass-meadow-bl/wispy-grass-meadow_roughness.png')

const material = new THREE.MeshStandardMaterial()
material.map = grassAlbedo
material.roughnessMap = grassRoughness
material.roughness = 1
material.metalnessMap = grassMetallic
material.metalness = 1
material.normalMap = grassNormal
// material.displacementMap = grassHeight
// material.displacementScale = 0.1
material.aoMap = grassAo;
material.aoMapIntensity = 0.5;

const cube = new THREE.Mesh(geometry, material)
const knot = new THREE.Mesh(torusKnotGeometry, material)
knot.position.x = 1.5
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.x = -1.5
const sphere = new THREE.Mesh()
sphere.geometry = sphereGeometry
sphere.material = material
sphere.position.y = 1.5
const cylinder = new THREE.Mesh()
cylinder.geometry = cylinderGeometry
cylinder.material = material
cylinder.position.y = -1.5

const group = new THREE.Group()
group.add(sphere, cylinder, cube, knot, plane)
scene.add(group)

const light = new THREE.AmbientLight(0xffffff, 1)
scene.add(light)

const pointLight = new THREE.PointLight(0xffffff, 100)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

const axesHelper = new THREE.AxesHelper()
axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff)
scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera(
    35, window.innerWidth / window.innerHeight, 0.1, 200
)
camera.position.z = 10
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

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

const renderLoop = () => {
    group.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
            child.rotation.y += 0.001
        }
    })
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(renderLoop)
}

renderLoop()
