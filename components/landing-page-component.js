export default {
  name: 'landing-page-component',
  template: /* html */ `
    <div class="container py-4">
      <h1 class="mb-3">Stellar Planets</h1>
      <p class="lead">Explore the solar system with a simple planet guide. Browse planets, landing sites, and sample surface regions in one place.</p>

      <!-- Planet Carousel -->
      <div class="card mb-4 carousel-card" style="border: 2px solid #444; background: #000000; min-height: 450px; position: relative; overflow: hidden;">
        <!-- Space background stars -->
        <div class="stars-background"></div>
        
        <div class="card-body position-relative" style="z-index: 10;">
          <div class="row align-items-center h-100">
            <!-- Left Arrow -->
            <div class="col-1 text-center">
              <button @click="prevPlanet" class="btn btn-outline-light btn-lg" style="transition: all 0.3s ease;">
                <i class="bi bi-chevron-left"></i>
              </button>
            </div>

            <!-- Planet Display with Animation -->
            <div class="col-10">
              <div class="text-center carousel-container">
                <!-- Image carousel area (fixed height) -->
                <div class="carousel-slides-wrapper">
                  <!-- Previous planet (sliding out) -->
                  <div v-if="isAnimating" class="carousel-slide slide-out">
                    <img 
                      v-if="previousPlanet" 
                      :src="previousPlanet.image_url" 
                      :alt="previousPlanet.name"
                      class="carousel-image"
                    >
                  </div>

                  <!-- Current planet (sliding in) -->
                  <div class="carousel-slide" :class="{ 'slide-in': isAnimating, 'slide-static': !isAnimating }">
                    <img 
                      v-if="currentPlanet" 
                      :src="currentPlanet.image_url" 
                      :alt="currentPlanet.name"
                      class="carousel-image"
                    >
                  </div>
                </div>

                <!-- Text content (stays fixed below) -->
                <h2 class="h3 mb-2" style="color: #e0e0ff;">{{ currentPlanet.name }}</h2>
                <p class="text-light mb-3">{{ currentPlanet.description }}</p>
                <router-link 
                  :to="'/items/' + currentPlanet.id" 
                  class="btn btn-primary"
                >
                  More
                </router-link>
              </div>
            </div>

            <!-- Right Arrow -->
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
      currentIndex: 2, // Start at Earth (index 2 in planets array)
      isAnimating: false,
      previousIndex: 2,
    };
  },
  computed: {
    currentPlanet() {
      return this.planets[this.currentIndex] || null;
    },
    previousPlanet() {
      return this.planets[this.previousIndex] || null;
    },
  },
  methods: {
    nextPlanet() {
      if (this.isAnimating) return; // Prevent rapid clicks
      this.isAnimating = true;
      this.previousIndex = this.currentIndex;
      this.currentIndex = (this.currentIndex + 1) % this.planets.length;
      
      setTimeout(() => {
        this.isAnimating = false;
      }, 800); // Match animation duration
    },
    prevPlanet() {
      if (this.isAnimating) return; // Prevent rapid clicks
      this.isAnimating = true;
      this.previousIndex = this.currentIndex;
      this.currentIndex = (this.currentIndex - 1 + this.planets.length) % this.planets.length;
      
      setTimeout(() => {
        this.isAnimating = false;
      }, 800); // Match animation duration
    },
    async loadPlanets() {
      try {
        const response = await fetch('items-template.csv');
        const csv = await response.text();
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');

        // Filter for only planets, ordered by solar system distance
        this.planets = lines
          .slice(1)
          .map(line => {
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
          .filter(item => item.category === 'Planet' || item.category === 'Dwarf Planet')
          .sort((a, b) => {
            const order = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
            return order.indexOf(a.id) - order.indexOf(b.id);
          });

        // Find Earth index
        const earthIndex = this.planets.findIndex(p => p.id === 'earth');
        this.currentIndex = earthIndex >= 0 ? earthIndex : 0;
        this.previousIndex = this.currentIndex;
      } catch (error) {
        console.error('Error loading planets:', error);
      }
    },
  },
  mounted() {
    this.loadPlanets();
  },
};

