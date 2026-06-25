from pathlib import Path

files = {
    'components/navbar-component.js': '''export default {
  name: 'navbar-component',
  template: /* html */ `
    <nav class="navbar sticky-top bg-dark border-bottom px-3">
      <span class="navbar-brand mb-0 h1"><i class="bi bi-globe2 me-2"></i>Stellar Planets</span>

      <div class="ms-auto d-flex gap-2">
        <router-link class="btn btn-outline-primary btn-sm" to="/">
          <i class="bi bi-house me-1"></i>Home
        </router-link>
        <router-link class="btn btn-outline-primary btn-sm d-flex align-items-center" to="/items">
          <i class="bi bi-card-list me-1"></i>Items
        </router-link>
        <router-link class="btn btn-outline-primary btn-sm" to="/about">
          <i class="bi bi-info-circle me-1"></i>About
        </router-link>
      </div>
    </nav>
  `,
};
''',
    'components/landing-page-component.js': '''export default {
  name: 'landing-page-component',
  template: /* html */ `
    <div class="container py-4">
      <h1 class="mb-3">Stellar Planets</h1>
      <p class="lead">Explore the solar system with a simple planet guide. Browse planets, landing sites, and sample surface regions in one place.</p>
      <router-link to="/items" class="btn btn-primary mb-4"><i class="bi bi-globe2 me-1"></i>Explore the Planets</router-link>

      <h2 class="h4 mt-3">About this prototype</h2>
      <p>
        This project shows a basic planet explorer app with a home page, a collection of planetary items, and detail pages for each location. The goal is to help beginners learn how to build an app that loads CSV data, displays cards, and lets users move between pages.
      </p>
      <p>
        The prototype is styled for a space-themed mood with bright planet cards and a dark, immersive background. It is meant to feel like a simple version of a solar system explorer where users can read about planets and landing zones.
      </p>
    </div>
  `,
};
''',
    'components/collection-page-component.js': '''export default {
  name: 'collection-page-component',
  setup() {
    const itemsStore = Vue.inject('itemsStore');

    return {
      itemsStore,
    };
  },
  template: /* html */ `
    <section class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3 mb-0">Planet Explorer</h1>
        <span class="badge text-bg-light border">{{ itemsStore.items.length }} shown</span>
      </div>

      <p class="text-muted">Browse planets and landing sites with sample information and surface locations.</p>

      <div v-if="itemsStore.isLoading" class="alert alert-secondary" role="status">
        Loading items...
      </div>

      <div v-else-if="itemsStore.error" class="alert alert-danger" role="alert">
        {{ itemsStore.error }}
      </div>

      <div v-else-if="itemsStore.items.length === 0" class="alert alert-warning" role="alert">
        No items found in the dataset.
      </div>

      <div v-else class="row g-3">
        <div class="col-12 col-md-6 col-lg-4" v-for="item in itemsStore.items" :key="item.id">
          <article class="card h-100 shadow-sm border-0">
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
              class="card-img-top collection-card-image object-fit-cover" />
            <div
              v-else
              class="collection-card-image d-flex align-items-center justify-content-center bg-light text-muted">
              No image available
            </div>

            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h2 class="h5 card-title mb-0">{{ item.name }}</h2>
                <span class="badge text-bg-primary ms-2">{{ item.category || 'General' }}</span>
              </div>

              <p class="card-text text-muted flex-grow-1 collection-description">
                {{ item.description || 'No description available.' }}
              </p>

              <p class="small mb-3"><strong>Location:</strong> {{ item.location || 'N/A' }}</p>

              <div class="d-grid">
                <router-link :to="'/items/' + item.id" class="btn btn-outline-secondary btn-sm">
                  View details
                </router-link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
};
''',
    'components/item-detail-page-component.js': '''export default {
  name: 'item-detail-page-component',
  setup() {
    const itemsStore = Vue.inject('itemsStore');
    const route = VueRouter.useRoute();

    const selectedItem = Vue.computed(() => {
      return itemsStore.items.find((item) => item.id === route.params.id);
    });

    return {
      itemsStore,
      selectedItem,
    };
  },
  template: /* html */ `
    <section class="container py-4">
      <router-link to="/items" class="btn btn-link ps-0 mb-3">← Back to planet list</router-link>

      <div v-if="itemsStore.isLoading" class="alert alert-secondary" role="status">
        Loading item details...
      </div>

      <div v-else-if="itemsStore.error" class="alert alert-danger" role="alert">
        {{ itemsStore.error }}
      </div>

      <div v-else-if="!selectedItem" class="alert alert-warning" role="alert">
        Item not found.
      </div>

      <article v-else class="card shadow-sm border-0 overflow-hidden">
        <img
          v-if="selectedItem.imageUrl"
          :src="selectedItem.imageUrl"
          :alt="selectedItem.name"
          class="item-detail-image w-100 object-fit-cover" />
        <div
          v-else
          class="item-detail-image w-100 d-flex align-items-center justify-content-center bg-light text-muted">
          No image available
        </div>

        <div class="card-body p-4">
          <div class="d-flex align-items-center gap-2 mb-2">
            <h1 class="h3 mb-0">{{ selectedItem.name }}</h1>
            <span class="badge text-bg-primary">{{ selectedItem.category || 'General' }}</span>
          </div>

          <p class="lead mb-3">{{ selectedItem.description || 'No description available.' }}</p>
          <p class="mb-0"><strong>Location:</strong> {{ selectedItem.location || 'N/A' }}</p>
          <p class="text-muted mt-2 mb-0"><strong>Record ID:</strong> {{ selectedItem.id }}</p>
        </div>
      </article>
    </section>
  `,
};
''',
    'components/about-page-component.js': '''export default {
  name: 'about-page-component',
  template: /* html */ `
    <section class="container py-4">
      <h1>About</h1>
      <p>This app is a beginner prototype for exploring planets and landing sites in the solar system. It shows how a simple website can use CSV data to create an interactive, space-themed experience.</p>
    </section>
  `,
};
''',
    'style.css': '''body {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.6;
  color: #edf5ff;
  background: radial-gradient(circle at top, #10294f 0%, #050b18 55%, #01040a 100%);
}

.navbar {
  background-color: rgba(5, 13, 26, 0.96);
}

.navbar-brand,
.navbar a {
  color: #c8e8ff !important;
}

.btn-outline-primary {
  color: #d1e8ff;
  border-color: rgba(145, 203, 255, 0.7);
}

.btn-outline-primary:hover,
.btn-primary,
.btn-primary:focus {
  background-color: rgba(112, 186, 255, 0.18);
  border-color: #6ab6ff;
  color: #ffffff;
}

.card,
.alert {
  background-color: rgba(10, 23, 46, 0.94);
  border-color: rgba(255, 255, 255, 0.08);
  color: #edf5ff;
}

.card-title,
.lead,
.text-muted,
small {
  color: #d8e9ff;
}

.collection-card-image {
  height: 190px;
}

.collection-description {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-detail-image {
  max-height: 360px;
}
''',
    'style-guide.html': '''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stellar Planets Style Guide</title>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 24px;
        font-family: Arial, sans-serif;
        line-height: 1.5;
        background-color: #050c1a;
        color: #e8f0ff;
      }

      main {
        max-width: 760px;
        margin: 0 auto;
      }

      section {
        background-color: #111d34;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 16px;
        margin-bottom: 16px;
      }

      .swatch {
        width: 140px;
        height: 70px;
      }

      .bg-primary {
        background-color: #0d2340;
      }

      .bg-secondary {
        background-color: #5fb7ff;
      }

      button {
        background-color: #5fb7ff;
        color: #05101f;
        border: none;
        padding: 10px 14px;
      }

      button:hover {
        background-color: #3aa5ff;
      }

      input,
      textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #2f4a7a;
        margin-bottom: 12px;
        background-color: #0b1a33;
        color: #edf5ff;
      }

      .card {
        border: 1px solid rgba(255, 255, 255, 0.14);
        padding: 12px;
        background-color: #111d34;
      }

      .card h3,
      .card p {
        margin: 8px 0 8px 0;
      }

      .card img {
        margin: 0;
        display: block;
        width: 100%;
        height: auto;
      }

      .card-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      footer {
        color: #a8b8d7;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>Stellar Planets Style Guide</h1>
        <p>This page shows the color and layout ideas for the space-themed planet explorer app.</p>
      </header>

      <section>
        <b>Color Palette</b>
        <p>Use a deep space blue with a bright sky accent for the planet explorer theme.</p>
        <div class="row">
          <div>
            <div class="swatch bg-primary"></div>
            <p>Primary: #0d2340</p>
          </div>
          <div>
            <div class="swatch bg-secondary"></div>
            <p>Secondary: #5fb7ff</p>
          </div>
        </div>
      </section>

      <section>
        <b>Typography</b>
        <p>Heading text is larger than body text.</p>
        <h1>Example Heading 1</h1>
        <p>
          This is regular paragraph text. Keep body text simple and easy to read.
        </p>
      </section>

      <section>
        <b>Button</b>
        <p>Use one bright button style for key actions like exploring planets.</p>
        <button>Explore</button>
      </section>

      <section>
        <b>Form Elements</b>
        <p>Use basic form controls with clear labels.</p>

        <label for="name">Name</label>
        <input type="text" id="name" placeholder="Enter your name" />

        <label for="notes">Notes</label>
        <textarea id="notes" placeholder="Write notes here"></textarea>
      </section>

      <section>
        <b>Card Example</b>
        <p>Cards group planet or landing information in a clear way.</p>
        <div class="card-grid">
          <div class="card">
            <h3>Planet</h3>
            <p>Use cards to show the planet name, a short summary, and a picture.</p>
          </div>
          <div class="card">
            <h3>Landing Site</h3>
            <p>Landing cards can show the location and a short note about exploration.</p>
          </div>
          <div class="card">
            <img
              src="https://picsum.photos/seed/planet/300/180"
              alt="Example Image" />
            <h3>Surface View</h3>
            <p>Include one image so the card feels like a small planet preview.</p>
          </div>
        </div>
      </section>

      <footer>
        <p>
          Tip: Students can edit colors, spacing, and text to define app style.
        </p>
      </footer>
    </main>
  </body>
</html>
''',
    'items-template.csv': '''id,name,description,category,image_url,location
mercury,Mercury,"The smallest rocky planet with cratered terrain and a bright sunrise near the Sun.",Planet,https://picsum.photos/seed/mercury/800/600,Inner solar system
venus,Venus,"A thick-clouded world with active volcanoes and a hot orange atmosphere.",Planet,https://picsum.photos/seed/venus/800/600,Inner solar system
earth,Earth,"Our home planet with oceans, weather, and many explored landing sites.",Planet,https://picsum.photos/seed/earth/800/600,Sol system
moon,Moon,"Earth's natural satellite with historic Apollo landing sites and quiet crater fields.",Moon,https://picsum.photos/seed/moon/800/600,Earth orbit
apollo-11,Apollo 11 Landing Site,"First human landing site on the Moon, with a view across the Sea of Tranquility.",Landing Site,https://picsum.photos/seed/apollo/800/600,Sea of Tranquility
mars,Mars,"The red planet with dusty plains, polar ice caps, and rover exploration paths.",Planet,https://picsum.photos/seed/mars/800/600,Mars surface
jupiter,Jupiter,"A giant gas planet with stormy clouds, glowing bands, and a bright Great Red Spot.",Planet,https://picsum.photos/seed/jupiter/800/600,Outer solar system
saturn,Saturn,"A ringed gas giant known for its wide icy rings and many orbiting moons.",Planet,https://picsum.photos/seed/saturn/800/600,Outer solar system
'''
}
for path, content in files.items():
    Path(path).write_text(content, encoding='utf-8')
print('files written')