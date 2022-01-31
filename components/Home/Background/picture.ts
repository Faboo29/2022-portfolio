import * as THREE from 'three';
import { ShaderMaterialParameters } from 'three';
import gsap from 'gsap';
import fragmentShader from './shaders/fragmentShader.glsl';
import vertexShader from './shaders/vertexShader.glsl';

export class Picture {
  scene: THREE.Scene;
  callback: () => void;
  $image: HTMLImageElement | null;
  ratio: number;
  loader: THREE.TextureLoader;
  image: THREE.Texture;
  hoverImage: THREE.Texture;
  sizes: THREE.Vector2;
  mouse: THREE.Vector2;
  offset: THREE.Vector2;
  velocity: number;
  intensity: number;
  geometry: THREE.PlaneBufferGeometry;
  material: THREE.ShaderMaterial;
  uniforms: ShaderMaterialParameters['uniforms'];
  mesh: THREE.Mesh;

  constructor(scene: THREE.Scene, cb: () => void) {
    this.scene = scene;
    this.callback = cb;
    this.$image = document.getElementById('tile-image') as HTMLImageElement;
    this.ratio = 16 / 9;
    this.loader = new THREE.TextureLoader();
    this.image = this.loader.load(this.$image.src);
    this.hoverImage = this.loader.load(this.$image.dataset.hover as string, () => {});
    this.sizes = new THREE.Vector2(0, 0);
    this.offset = new THREE.Vector2(0, 0);
    this.mouse = new THREE.Vector2(0, 0);
    this.velocity = 0;
    this.intensity = 0;
  }

  start() {
    window.addEventListener('mousemove', (e) => {
      this.onMouseMove(e);
    });

    this.getSizes();
    this.createMesh();
    this.setupGUI();
    this.callback();
  }

  getSizes() {
    if (!this.$image) return;

    const { width, height, top, left } = this.$image.getBoundingClientRect();
    this.sizes.set(left - window.innerHeight / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
  }

  createMesh() {
    const initialHeight = 2250;
    const initialWidth = initialHeight * this.ratio;

    this.uniforms = {
      u_image: { value: this.image },
      u_imageHover: { value: this.hoverImage },
      u_mouse: { value: this.mouse },
      u_res: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      },
      u_time: { value: 0 },
      u_intensity: { value: this.velocity }
    };

    this.geometry = new THREE.PlaneBufferGeometry(initialWidth, initialHeight, 20, 20);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      defines: {
        PR: window.devicePixelRatio.toFixed(1)
      }
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  onMouseMove(e: MouseEvent) {
    gsap.to(this.mouse, {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1
    });

    this.velocity += e.clientX * 0.001;
    gsap.to(this.mesh.rotation, {
      x: this.mouse.y * -0.01,
      y: this.mouse.x * 0.01,
      duration: 1
    });
  }

  setupGUI() {}

  update(delta: number) {
    if (this.uniforms) {
      this.uniforms.u_time.value += delta;
      this.uniforms.u_intensity.value = this.velocity > 0.1 ? this.velocity : 0.1;
    }

    const friction = 0.0004;

    this.intensity += Math.pow(this.velocity, 0.95) + friction;
    this.velocity *= 0.8;
  }
}
