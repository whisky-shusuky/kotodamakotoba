<template>
  <canvas id="canvas" width="600" height="400"></canvas>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'RotateBox',
  data () {
    const scene = new THREE.Scene()
    const renderer = null
    const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000)
    const light = new THREE.DirectionalLight(0xffffff)
    const geometry = new THREE.BoxGeometry(1, 1, 1)

    var test = 1.0
    var frag = `
      uniform sampler2D map;
      varying vec2 vUv;
      void main() {
  
          gl_FragColor = vec4(0.5,${test},${test},1.0);
      }`

    const material = new THREE.ShaderMaterial({
      fragmentShader: frag,
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide
    })
    const cube = new THREE.Mesh(geometry, material)
    return { scene, renderer, camera, light, geometry, material, cube }
  },
  mounted () {
    const $canvas = document.getElementById('canvas')
    // canvasを後付けで設定する方法あったら教えてほしいー
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: $canvas
    })

    this.camera.position.set(0, 0, 2)
    this.light.position.set(0, 0, 10)
    this.scene.add(this.cube)
    this.scene.add(this.light)

    this.animate()
  },
  methods: {
    animate () {
      requestAnimationFrame(this.animate)

      this.cube.rotation.x += 0.02
      this.cube.rotation.y += 0.02

      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<style></style>
