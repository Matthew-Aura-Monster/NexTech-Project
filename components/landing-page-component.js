import * as THREE from 'https://unpkg.com/three@0.162.0/build/three.module.js';

export default {
  name: 'landing-page-component',
  template: /* html */ `
    <div class="container py-4">
      <h1 class="mb-3">Stellar Planets</h1>
      <p class="lead">Explore the solar system with a simple planet guide. Browse planets, landing sites, and sample surface regions in one place.</p>

      <div class="card mb-4" style="border: 2px solid #444; background: linear-gradient(135deg, #060816 0%, #0f1f3d 100%); min-height: 500px; position: relative; overflow: hidden;">
        <div class="stars-background"></div>

        <div class="card-body position-relative" style="z-index: 10;">
          <div class="row align-items-center h-100">
            <div class="col-1 text-center">
              <button @click="prevPlanet" class="btn btn-outline-light btn-lg" style="transition: all 0.3s ease;">
                <i class="bi bi-chevron-left"></i>
              </button>
            </div>

            <div class="col-10">
              <div class="text-center">
                <div ref="threeRoot" class="mx-auto rounded shadow" style="width: 100%; max-width: 980px; height: 560px; border: 1px solid rgba(255,255,255,0.2); background: radial-gradient(circle at center, #142141 0%, #04070f 70%);"></div>

                <h2 class="h3 mt-3 mb-2" style="color: #e0e0ff;">{{ currentPlanet ? currentPlanet.name : 'Loading...' }}</h2>
                <p class="text-light mb-3">{{ currentPlanet ? currentPlanet.description : 'Loading planet data...' }}</p>
                <router-link v-if="currentPlanet" :to="'/items/' + currentPlanet.id" class="btn btn-primary">
                  More
                </router-link>
              </div>
            </div>

            <div class="col-1 text-center">
              <button @click="nextPlanet" class="btn btn-outline-light btn-lg" style="transition: all 0.3s ease;">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2 class="h4 mt-3">About this prototype</h2>
      <p>
        This project shows a basic planet explorer app with a home page, a collection of planetary items, and detail pages for each location. The goal is to help beginners learn how to build an app that loads CSV data, displays cards, and lets users move between pages.
      </p>
      <p>
        The prototype is styled for a space-themed mood with bright planet cards and a dark, immersive background. It is meant to feel like a simple version of a solar system explorer where users can read about planets and landing zones.
      </p>
    </div>
  `,
  data() {
    return {
      planets: [],
      currentIndex: 2,
      isAnimating: false,
      previousIndex: 2,
    };
  },
  created() {
    this._threeState = {
      scene: null,
      camera: null,
      renderer: null,
      animationFrameId: null,
      planetGroup: null,
      planetMeshes: [],
      targetGroupX: 0,
      targetGroupRotation: 0,
      textureLoader: null,
      planetTextureCache: {},
      spaceGroup: null,
      backgroundSpeed: 0.001,
      targetBackgroundSpeed: 0.001,
      transitionTimer: null,
    };
  },
  computed: {
    currentPlanet() {
      return this.planets[this.currentIndex] || null;
    },
  },
  methods: {
    nextPlanet() {
      if (this.isAnimating || this.planets.length === 0 || this.currentIndex >= this.planets.length - 1) return;
      this.isAnimating = true;
      this.previousIndex = this.currentIndex;
      this.currentIndex += 1;
      this.updatePlanetView();

      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    },
    prevPlanet() {
      if (this.isAnimating || this.planets.length === 0 || this.currentIndex <= 0) return;
      this.isAnimating = true;
      this.previousIndex = this.currentIndex;
      this.currentIndex -= 1;
      this.updatePlanetView();

      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    },
    updatePlanetView() {
      if (!this._threeState.planetGroup) return;
      this._threeState.targetGroupX = -this.currentIndex * 13.5;
      this._threeState.targetGroupRotation = 0;
      this._threeState.targetBackgroundSpeed = 0.0004;
      if (this._threeState.transitionTimer) {
        window.clearTimeout(this._threeState.transitionTimer);
      }
      this._threeState.transitionTimer = window.setTimeout(() => {
        this._threeState.targetBackgroundSpeed = 0.00008;
      }, 900);
    },
    setupScene() {
      const root = this.$refs.threeRoot;
      if (!root || this._threeState.renderer) return;
      if (typeof THREE === 'undefined') {
        console.error('Three.js did not load correctly for the landing page scene.');
        return;
      }

      this._threeState.scene = new THREE.Scene();
      this._threeState.scene.background = new THREE.Color(0x02040d);

      this._threeState.camera = new THREE.PerspectiveCamera(40, root.clientWidth / root.clientHeight, 0.1, 280);
      this._threeState.camera.position.set(0, 2.4, 25);
      this._threeState.camera.lookAt(0, 0, 0);

      this._threeState.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this._threeState.renderer.outputEncoding = THREE.sRGBEncoding;
      this._threeState.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this._threeState.renderer.toneMappingExposure = 1.1;
      this._threeState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this._threeState.renderer.setSize(root.clientWidth, root.clientHeight);
      root.appendChild(this._threeState.renderer.domElement);
      this._threeState.textureLoader = new THREE.TextureLoader();
      this._threeState.textureLoader.setCrossOrigin('anonymous');

      const ambientLight = new THREE.AmbientLight(0x96b5ff, 0.92);
      const hemiLight = new THREE.HemisphereLight(0x8899ff, 0x110022, 0.4);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(14, 9, 15);
      const fillLight = new THREE.DirectionalLight(0x8899ff, 0.82);
      fillLight.position.set(-10, -4, -12);
      const backLight = new THREE.DirectionalLight(0x7788cc, 0.38);
      backLight.position.set(-14, 5, -8);
      const pointLight = new THREE.PointLight(0xffffff, 0.9, 160);
      pointLight.position.set(4, 8, 8);
      this._threeState.scene.add(ambientLight, hemiLight, directionalLight, fillLight, backLight, pointLight);

      this._threeState.spaceGroup = new THREE.Group();
      this._threeState.scene.add(this._threeState.spaceGroup);

      const nebulaGeometry = new THREE.SphereGeometry(140, 32, 24);
      const nebulaMaterial = new THREE.MeshBasicMaterial({ color: 0x060b19, side: THREE.BackSide, transparent: true, opacity: 0.95 });
      const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      this._threeState.spaceGroup.add(nebula);

      const starGeometry = new THREE.BufferGeometry();
      const starPositions = [];
      for (let i = 0; i < 2500; i += 1) {
        starPositions.push((Math.random() - 0.5) * 220);
        starPositions.push((Math.random() - 0.5) * 220);
        starPositions.push((Math.random() - 0.5) * 220);
      }
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.035, transparent: true, opacity: 0.45 });
      const stars = new THREE.Points(starGeometry, starMaterial);
      this._threeState.spaceGroup.add(stars);

      this._threeState.planetGroup = new THREE.Group();
      this._threeState.scene.add(this._threeState.planetGroup);

      this.animateScene();
    },
    buildPlanetMeshes() {
      if (!this._threeState.planetGroup) return;

      this._threeState.planetMeshes.forEach((mesh) => {
        this._threeState.planetGroup.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      this._threeState.planetMeshes = [];

      this.planets.forEach((planet, index) => {
        const planetKey = String(planet.id || '').toLowerCase();
        const color = this.getPlanetColor(planet.name);
        const radius = 1.9 + (index % 3) * 0.42;
        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        const texture = this._threeState.planetTextureCache[planetKey] || null;
        if (texture) {
          texture.encoding = THREE.sRGBEncoding;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
        }

        const materialColor = texture ? 0xffffff : color;
        const material = new THREE.MeshPhongMaterial({
          color: materialColor,
          map: texture,
          shininess: 10,
          specular: 0x888888,
          emissive: 0x0c1018,
          emissiveIntensity: 0.02,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(index * 13.5, 0, 0);
        mesh.castShadow = true;
        this._threeState.planetGroup.add(mesh);
        this._threeState.planetMeshes.push(mesh);

        const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.015, 40, 40);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color: this.getAtmosphereColor(planet.name),
          transparent: true,
          opacity: 0.02,
          side: THREE.FrontSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        atmosphere.position.copy(mesh.position);
        this._threeState.planetGroup.add(atmosphere);
        this._threeState.planetMeshes.push(atmosphere);

        if (planetKey === 'saturn') {
          const ringGeometry = new THREE.RingGeometry(radius * 1.45, radius * 2.5, 120);
          const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0xe2d094,
            transparent: true,
            opacity: 0.58,
            side: THREE.DoubleSide,
            roughness: 0.75,
            metalness: 0.1,
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.position.copy(mesh.position);
          ring.rotation.x = -Math.PI / 2.3;
          this._threeState.planetGroup.add(ring);
          this._threeState.planetMeshes.push(ring);
        }
      });

      this.updatePlanetView();
    },
    loadPlanetTextures() {
      if (!this._threeState.textureLoader) {
        return Promise.resolve();
      }

      const textureUrls = {
        mercury: 'https://threejs.org/examples/textures/planets/mercury.jpg',
        venus: 'https://threejs.org/examples/textures/planets/venus.jpg',
        earth: 'https://threejs.org/examples/textures/planets/earthmap1k.jpg',
        mars: 'https://threejs.org/examples/textures/planets/mars_1k_color.jpg',
        jupiter: 'https://threejs.org/examples/textures/planets/jupiter.jpg',
        saturn: 'https://threejs.org/examples/textures/planets/saturn.jpg',
        uranus: 'https://threejs.org/examples/textures/planets/uranus.jpg',
        neptune: 'https://threejs.org/examples/textures/planets/neptune.jpg',
        pluto: 'https://threejs.org/examples/textures/planets/pluto.jpg',
      };

      return Promise.all(Object.entries(textureUrls).map(([key, url]) => new Promise((resolve) => {
        this._threeState.textureLoader.load(
          url,
          (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            if (this._threeState.renderer) {
              texture.anisotropy = this._threeState.renderer.capabilities.getMaxAnisotropy();
            }
            this._threeState.planetTextureCache[key] = texture;
            resolve();
          },
          undefined,
          () => {
            console.error('Failed to load planet texture:', key, url);
            this._threeState.planetTextureCache[key] = null;
            resolve();
          },
        );
      })));
    },
    getPlanetColor(name) {
      const palette = {
        mercury: 0xb4b4b4,
        venus: 0xe6b26a,
        earth: 0x2f7cff,
        mars: 0xd46a3f,
        jupiter: 0xc97b3d,
        saturn: 0xd9c77b,
        uranus: 0x7ee0e8,
        neptune: 0x4f6cff,
        pluto: 0x9f8f7d,
      };
      return palette[String(name || '').toLowerCase()] || 0x8a8a8a;
    },
    getAtmosphereColor(name) {
      const palette = {
        mercury: 0x9aa0b2,
        venus: 0xe6c17a,
        earth: 0x3b7cff,
        mars: 0xd96d44,
        jupiter: 0xe6b26d,
        saturn: 0xe0c976,
        uranus: 0x75dfe4,
        neptune: 0x5474ff,
        pluto: 0x9f8f7d,
      };
      return palette[String(name || '').toLowerCase()] || 0x7f7f7f;
    },
    animateScene() {
      const tick = () => {
        if (this._threeState.planetGroup) {
          this._threeState.planetGroup.position.x += (this._threeState.targetGroupX - this._threeState.planetGroup.position.x) * 0.08;
          this._threeState.planetGroup.rotation.y += (this._threeState.targetGroupRotation - this._threeState.planetGroup.rotation.y) * 0.06;
        }

        if (this._threeState.spaceGroup) {
          this._threeState.backgroundSpeed += (this._threeState.targetBackgroundSpeed - this._threeState.backgroundSpeed) * 0.08;
          this._threeState.spaceGroup.rotation.y += this._threeState.backgroundSpeed;
          this._threeState.spaceGroup.rotation.x = Math.sin(performance.now() * 0.000015) * 0.03;
        }

        if (this._threeState.renderer && this._threeState.scene && this._threeState.camera) {
          this._threeState.renderer.render(this._threeState.scene, this._threeState.camera);
        }

        this._threeState.animationFrameId = window.requestAnimationFrame(tick);
      };

      tick();
    },
    handleResize() {
      const root = this.$refs.threeRoot;
      if (!root || !this._threeState.camera || !this._threeState.renderer) return;

      this._threeState.camera.aspect = root.clientWidth / root.clientHeight;
      this._threeState.camera.updateProjectionMatrix();
      this._threeState.renderer.setSize(root.clientWidth, root.clientHeight);
    },
    cleanupScene() {
      if (this._threeState.animationFrameId) {
        window.cancelAnimationFrame(this._threeState.animationFrameId);
      }

      this._threeState.planetMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });

      Object.values(this._threeState.planetTextureCache).forEach((texture) => {
        texture?.dispose();
      });
      this._threeState.planetTextureCache = {};

      if (this._threeState.renderer) {
        this._threeState.renderer.dispose();
        this._threeState.renderer.domElement.remove();
      }

      if (this._threeState.transitionTimer) {
        window.clearTimeout(this._threeState.transitionTimer);
      }

      this._threeState.scene = null;
      this._threeState.camera = null;
      this._threeState.renderer = null;
      this._threeState.planetGroup = null;
      this._threeState.spaceGroup = null;
      this._threeState.planetMeshes = [];
    },
    async loadPlanets() {
      try {
        const response = await fetch('items-template.csv');
        const csv = await response.text();

        const parsed = await new Promise((resolve, reject) => {
          Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result),
            error: (error) => reject(error),
          });
        });

        this.planets = parsed.data
          .map((row) => ({
            id: String(row.id || '').trim(),
            name: String(row.name || '').trim(),
            description: String(row.description || '').trim(),
            category: String(row.category || '').trim(),
            image_url: String(row.image_url || '').trim(),
            location: String(row.location || '').trim(),
          }))
          .filter((item) => item.category === 'Planet' || item.category === 'Dwarf Planet')
          .sort((a, b) => {
            const order = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
            return order.indexOf(a.id) - order.indexOf(b.id);
          });

        const earthIndex = this.planets.findIndex((planet) => planet.id === 'earth');
        this.currentIndex = earthIndex >= 0 ? earthIndex : 0;
        this.previousIndex = this.currentIndex;
        await this.loadPlanetTextures();
        this.buildPlanetMeshes();
      } catch (error) {
        console.error('Error loading planets:', error);
      }
    },
  },
  mounted() {
    this.setupScene();
    this.loadPlanets();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.cleanupScene();
  },
};

