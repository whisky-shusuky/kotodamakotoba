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

    var frag = `
precision highp float;

uniform vec2 resolution;
uniform float time;

float gTime = 0.;
const float REPEAT = 5.0;

const float totalUnicodePoints = 25000.0;
const float rWeight = ${this.$store.state.rWeight}.;
const float gWeight = ${this.$store.state.gWeight}.;
const float bWeight = ${this.$store.state.bWeight}.;

// 回転行列
mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c,s,-s,c);
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float box(vec3 pos, float scale) {
  pos *= scale;
  float base = sdBox(pos, vec3(.4,.4,.1)) /1.5;
  pos.xy *= 5.;
  pos.y -= 3.5;
  pos.xy *= rot(.75);
  float result = -base;
  return result;
}

float box_set(vec3 pos, float time) {
  vec3 pos_origin = pos;
  pos = pos_origin;
  pos .y += sin(gTime * 0.4) * 2.5;
  pos.xy *=   rot(.8);
  float box1 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
  pos = pos_origin;
  pos .y -=sin(gTime * 0.4) * 2.5;
  pos.xy *=   rot(.8);
  float box2 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
  pos = pos_origin;
  pos .x +=sin(gTime * 0.4) * 2.5;
  pos.xy *=   rot(.8);
  float box3 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);  
  pos = pos_origin;
  pos .x -=sin(gTime * 0.4) * 2.5;
  pos.xy *=   rot(.8);
  float box4 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);  
  pos = pos_origin;
  pos.xy *=   rot(.8);
  float box5 = box(pos,.5) * 6.;  
  pos = pos_origin;
  float box6 = box(pos,.5) * 6.;  
  float result = max(max(max(max(max(box1,box2),box3),box4),box5),box6);
  return result;
}

float map(vec3 pos, float time) {
  vec3 pos_origin = pos;
  float box_set1 = box_set(pos, time);

  return box_set1;
}

float rand(float x){
    return fract(sin(x) * 100000.0);
}

void main( void ) {
  vec2 p = (gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y);
  vec3 ro = vec3(60.,60., time * 0.5);
  vec3 ray = normalize(vec3(p, 1.5));
  float t = 0.01;
  vec3 col = vec3(0.);
  float ac = 0.0;


  for (int i = 0; i < 50; i++){
    vec3 pos = ro + ray * t;
    pos = mod(pos-2., 4.) -2.;
    gTime = time -float(i) * 0.01;
    
    float d = map(pos, time);

    d = max(abs(d), 0.01);
    ac += exp(-d*23.);

    t += d* 0.55;
  }

  col = vec3(ac * 0.02);
  col +=vec3(rWeight / 255. ,gWeight / 255.,bWeight / 255.);
  gl_FragColor = vec4(col ,1.0);
}
`

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { type: 'f', value: 0.0 },
        resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      fragmentShader: frag,
      transparent: true,
      depthWrite: true,
      clipping: true,
      side: THREE.DoubleSide,
      uniformsNeedUpdate: true
    })
    const cube = new THREE.Mesh(geometry, material)
    return { scene, renderer, camera, light, geometry, material, cube }
  },
  mounted () {
    const $canvas = document.getElementById('canvas')
    // canvasを後付けで設定する方法あったら教えてほしいー
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: $canvas,
      alpha: true,
      localClippingEnabled: true
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
      this.cube.rotation.x += 0.005
      this.cube.rotation.y += 0.005
      this.material.uniforms.time.value += 0.01
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<style></style>
