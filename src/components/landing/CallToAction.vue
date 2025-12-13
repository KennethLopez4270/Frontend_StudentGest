<template>
  <section class="cta">
    <div class="cta-content animate__animated animate__fadeInRight">
      <h2 class="cta-title">¡Lleva tu Escuela al Siguiente Nivel!</h2>
      <p class="cta-text">Únete a StudentGest y descubre un mundo de posibilidades.</p>
      <router-link to="/registrar-colegio" class="cta-button">
        <i class="fas fa-rocket"></i> Comenzar Ahora
      </router-link>
    </div>
  </section>
</template>

<script setup>
// No hay lógica por ahora
</script>

<style scoped>
.cta {
  background-color: var(--color-primary);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  font-family: var(--font-body);
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-family: var(--font-title);
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--color-light);
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-accent);
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border-radius: 2rem;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.cta-button:hover {
  background-color: var(--color-accent-dark, #d48806); /* fallback opcional */
  transform: translateY(-4px);
}
</style>