import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

//
// LOAD WASM FILES
//
let wasmModule
let wasmExports

async function initWASM() {
	const response = await fetch('geoid.wasm')
	const bytes = await response.arrayBuffer()
	const wasmInstance = await WebAssembly.instantiate(bytes)

	wasmModule = wasmInstance.instance
	wasmExports = wasmInstance.instance.exports
}

initWASM().catch(console.error)

//
// PLOT SPHERE GEOMETRY
//
var container = document.getElementById( 'geoid-container' );

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF)

var camera = new THREE.PerspectiveCamera(30, container.clientWidth/ container.clientHeight, 0.5, 20)
camera.position.z = 9

var renderer = new THREE.WebGLRenderer({
	antialias: false,
	alpha: false,
	powerPreference: "high-performance",
})
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.setAnimationLoop( animationLoop )
renderer.gammaFactor = 2.2;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights
container.appendChild(renderer.domElement)

var controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan = false
controls.minDistance = 2
controls.maxDistance = 20

scene.add(new THREE.AmbientLight('white', 0.8));

const geometry = new THREE.SphereGeometry(1, 8, 4)
const positions = geometry.attributes.position.array

function positionToSpherical(positions, colatitude, longitude) {
	for (let i = 0; i < colatitude.length; i++) {
		const x = positions[3 * i]
		const y = positions[3 * i + 1]
		const z = positions[3 * i + 2]
		const r = Math.sqrt(x*x + y*y + z*z)
		colatitude[i] = Math.acos(y / r)
		longitude[i] = Math.atan2(x, z)
	}
}

const colatitude = new Float32Array(positions.length/3)
const longitude = new Float32Array(positions.length/3)
positionToSpherical(positions, colatitude, longitude)

const tempColor = new THREE.Color()
const colors = new Float32Array(positions.length)
const colorAttribute = new THREE.BufferAttribute(colors, 3)
colorAttribute.setUsage(THREE.DynamicDrawUsage)
geometry.setAttribute('color', colorAttribute)

//
// UPDATE COLOR MAP ON SPHERE
//
const black = new THREE.Color(0x000000);
function updateColors() {
	if (!wasmExports) return

	const hue = ((Date.now() * 0.01) % 360) / 360
	tempColor.setHSL(hue, 1.0, 0.5)

	for (let i = 0; i < positions.length; i+=3) {
		if (positions[i+1] === 1 || positions[i+1] === -1) {
			colors[i] = black.r
			colors[i + 1] = black.b
			colors[i + 2] = black.g
		} else {
			colors[i] = tempColor.r
			colors[i + 1] = tempColor.g
			colors[i + 2] = tempColor.b
		}
	}

	geometry.attributes.color.array.set(colors)
	geometry.attributes.color.needsUpdate = true
}

const material = new THREE.MeshBasicMaterial({
	vertexColors: true,
	wireframe: true,
})
material.color.convertSRGBToLinear()

var sphere = new THREE.Mesh(geometry, material)
sphere.scale.set(1.5, 1.5, 1.5)
scene.add(sphere)

scene.add(new THREE.AxesHelper(4))

//
// ANIMATION THE SPHERE
//
setInterval(updateColors, 100)

function animationLoop() {
	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(animationLoop)
}

animationLoop()
