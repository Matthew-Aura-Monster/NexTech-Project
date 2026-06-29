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
                <div ref="threeRoot" class="mx-auto rounded shadow" style="width: 100%; max-width: 650px; height: 340px; border: 1px solid rgba(255,255,255,0.2); background: radial-gradient(circle at center, #142141 0%, #04070f 70%);"></div>

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
      if (this.isAnimating || this.planets.length === 0) return;
      this.isAnimating = true;
      this.previousIndex = this.currentIndex;
      this.currentIndex = (this.currentIndex + 1) % this.planets.length;
      this.updatePlanetView();

      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    },
    prevPlanet() {
      if (this.isAnimating || this.planets.length === 0) return;
      this.isAnimating = true;
      this.previousIndex = this.currentIndex;
      this.currentIndex = (this.currentIndex - 1 + this.planets.length) % this.planets.length;
      this.updatePlanetView();

      setTimeout(() => {
        this.isAnimating = false;
      }, 600);
    },
    updatePlanetView() {
      if (!this.planetGroup) return;
      this.targetGroupX = -this.currentIndex * 4.4;
      this.targetGroupRotation = this.currentIndex * 0.35;
      this.targetBackgroundSpeed = 0.004;
      if (this.transitionTimer) {
        window.clearTimeout(this.transitionTimer);
      }
      this.transitionTimer = window.setTimeout(() => {
        this.targetBackgroundSpeed = 0.001;
      }, 700);
    },
    setupScene() {
      const root = this.$refs.threeRoot;
      if (!root || this.renderer) return;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x02040d);

      this.camera = new THREE.PerspectiveCamera(45, root.clientWidth / root.clientHeight, 0.1, 100);
      this.camera.position.set(0, 1.4, 12);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(root.clientWidth, root.clientHeight);
      root.appendChild(this.renderer.domElement);
      this.textureLoader = new THREE.TextureLoader();

      const ambientLight = new THREE.AmbientLight(0x8aa0ff, 0.95);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(8, 6, 10);
      const pointLight = new THREE.PointLight(0xffffff, 1.6, 120);
      pointLight.position.set(6, 8, 10);
      this.scene.add(ambientLight, directionalLight, pointLight);

      this.spaceGroup = new THREE.Group();
      this.scene.add(this.spaceGroup);

      const nebulaGeometry = new THREE.SphereGeometry(140, 32, 24);
      const nebulaMaterial = new THREE.MeshBasicMaterial({ color: 0x060b19, side: THREE.BackSide, transparent: true, opacity: 0.95 });
      const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      this.spaceGroup.add(nebula);

      const starGeometry = new THREE.BufferGeometry();
      const starPositions = [];
      for (let i = 0; i < 2500; i += 1) {
        starPositions.push((Math.random() - 0.5) * 220);
        starPositions.push((Math.random() - 0.5) * 220);
        starPositions.push((Math.random() - 0.5) * 220);
      }
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.95 });
      const stars = new THREE.Points(starGeometry, starMaterial);
      this.spaceGroup.add(stars);

      this.planetGroup = new THREE.Group();
      this.scene.add(this.planetGroup);

      this.animateScene();
    },
    buildPlanetMeshes() {
      if (!this.planetGroup) return;

      this.planetMeshes.forEach((mesh) => {
        this.planetGroup.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      this.planetMeshes = [];

      this.planets.forEach((planet, index) => {
        const planetKey = String(planet.id || '').toLowerCase();
        const color = this.getPlanetColor(planet.name);
        const radius = 0.7 + (index % 3) * 0.12;
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const texture = this.planetTextureCache[planetKey] || null;
        const material = new THREE.MeshStandardMaterial({
          color,
          map: texture,
          roughness: 0.8,
          metalness: 0.12,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(index * 4.4, 0, 0);
        mesh.castShadow = true;
        this.planetGroup.add(mesh);
        this.planetMeshes.push(mesh);

        const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.08, 24, 24);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color: this.getAtmosphereColor(planet.name),
          transparent: true,
          opacity: 0.18,
          side: THREE.BackSide,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        atmosphere.position.copy(mesh.position);
        this.planetGroup.add(atmosphere);
        this.planetMeshes.push(atmosphere);

        if (planetKey === 'saturn') {
          const ringGeometry = new THREE.RingGeometry(radius * 1.45, radius * 2.2, 64);
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xe2d094,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.position.copy(mesh.position);
          ring.rotation.x = -Math.PI / 2.3;
          this.planetGroup.add(ring);
          this.planetMeshes.push(ring);
        }
      });

      this.updatePlanetView();
    },
    loadPlanetTextures() {
      if (!this.textureLoader) {
        return Promise.resolve();
      }

      const textureUrls = {
        mercury: 'https://images-assets.nasa.gov/image/PIA16853/PIA16853~orig.jpg',
        venus: 'https://images-assets.nasa.gov/image/PIA00271/PIA00271~orig.jpg',
        earth: 'https://images-assets.nasa.gov/image/PIA03375/PIA03375~orig.jpg',
        mars: 'https://images-assets.nasa.gov/image/PIA00131/PIA00131~orig.jpg',
        jupiter: 'https://images-assets.nasa.gov/image/PIA02863/PIA02863~orig.jpg',
        saturn: 'https://images-assets.nasa.gov/image/PIA03550/PIA03550~orig.jpg',
        uranus: 'https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg',
        neptune: 'https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg',
        pluto: 'https://images-assets.nasa.gov/image/PIA19948/PIA19948~orig.jpg',
      };

      return Promise.all(Object.entries(textureUrls).map(([key, url]) => new Promise((resolve) => {
        this.textureLoader.load(
          url,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            if (this.renderer) {
              texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
            }
            this.planetTextureCache[key] = texture;
            resolve();
          },
          undefined,
          () => {
            this.planetTextureCache[key] = null;
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
        if (this.planetGroup) {
          this.planetGroup.position.x += (this.targetGroupX - this.planetGroup.position.x) * 0.08;
          this.planetGroup.rotation.y += (this.targetGroupRotation - this.planetGroup.rotation.y) * 0.06;
        }

        if (this.spaceGroup) {
          this.backgroundSpeed += (this.targetBackgroundSpeed - this.backgroundSpeed) * 0.08;
          this.spaceGroup.rotation.y += this.backgroundSpeed;
          this.spaceGroup.rotation.x = Math.sin(performance.now() * 0.00003) * 0.08;
        }

        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }

        this.animationFrameId = window.requestAnimationFrame(tick);
      };

      tick();
    },
    handleResize() {
      const root = this.$refs.threeRoot;
      if (!root || !this.camera || !this.renderer) return;

      this.camera.aspect = root.clientWidth / root.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(root.clientWidth, root.clientHeight);
    },
    cleanupScene() {
      if (this.animationFrameId) {
        window.cancelAnimationFrame(this.animationFrameId);
      }

      this.planetMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });

      Object.values(this.planetTextureCache).forEach((texture) => {
        texture?.dispose();
      });
      this.planetTextureCache = {};

      if (this.renderer) {
        this.renderer.dispose();
        this.renderer.domElement.remove();
      }

      if (this.transitionTimer) {
        window.clearTimeout(this.transitionTimer);
      }

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.planetGroup = null;
      this.spaceGroup = null;
      this.planetMeshes = [];
    },
    async loadPlanets() {
      try {
        const response = await fetch('items-template.csv');
        const csv = await response.text();
        const lines = csv.trim().split('\n');

        this.planets = lines
          .slice(1)
          .map((line) => {
            const values = line.split(',');
            return {
              id: values[0],
              name: values[1],
              description: values[2],
              category: values[3],
              image_url: values[4],
              location: values[5],
            };
          })
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

