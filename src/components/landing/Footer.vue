<template>
  <footer class="footer py-4 mt-5">
    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
      <!-- Información Principal -->
      <div class="text-center text-md-start mb-3 mb-md-0">
        <h5 class="mb-1 brand-name">CodeCapibara</h5>
        <p class="mb-0 slogan">Desarrollando el futuro, una línea de código a la vez.</p>
      </div>

      <!-- Íconos Sociales -->
      <div class="social-icons text-center text-md-end">
        <a href="#" class="me-3" aria-label="GitHub"><i class="fab fa-github"></i></a>
        <a href="#" class="me-3" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
      </div>
    </div>

    <!-- Línea Divisoria -->
    <hr class="my-3" />

    <!-- Copyright -->
    <div class="text-center small">
      &copy; {{ currentYear }} CodeCapibara. Todos los derechos reservados.
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

// Año actual automático
const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--color-light, #f8f9fa);
  color: var(--color-primary, #2c3e50);
  font-family: var(--font-body, 'Poppins', sans-serif);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.brand-name {
  font-size: 1.5rem;
  font-family: 'Playfair Display', serif;
  color: var(--color-primary, #2c3e50);
}

.slogan {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--color-muted, #6c757d);
}

.social-icons a {
  color: var(--color-primary, #2c3e50);
  font-size: 1.4rem;
  transition: color 0.3s ease;
}

.social-icons a:hover {
  color: var(--color-accent, #ff9f1c);
}

hr {
  border-top: 1px solid #dee2e6;
}
</style>