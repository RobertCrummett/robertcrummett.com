import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 10)
camera.position.z = 5

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const canvas = document.querySelector('canvas.threejs')
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true

const renderLoop = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(renderLoop)
}

renderLoop()
