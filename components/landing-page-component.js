export default {
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
