import * as THREE from 'three';

export class AppScene {
  container: HTMLDivElement;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sizes: {
    width: number;
    height: number;
  };
  elapsedTime: number;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clock: THREE.Clock;

  constructor(container: HTMLDivElement, setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    this.container = container;
    this.setLoading = setLoading;
    this.sizes = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.scene = new THREE.Scene();
    this.elapsedTime = 0;
    this.clock = new THREE.Clock();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLight();
    window.addEventListener('resize', () => this.onResize());
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(50, this.sizes.width / this.sizes.height, 1, 10000);
    this.camera.position.set(0, 0, 1920);
  }

  setupLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientLight);
  }

  onResize() {
    const sizes = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.camera.aspect = sizes.width / sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  update() {
    if (this.renderer === undefined) return;

    this.renderer.render(this.scene, this.camera);

    const currentElapsedTime = this.clock.getElapsedTime();
    const deltaTime = currentElapsedTime - this.elapsedTime;
    this.elapsedTime = currentElapsedTime;

    requestAnimationFrame(this.update.bind(this));
  }
}
