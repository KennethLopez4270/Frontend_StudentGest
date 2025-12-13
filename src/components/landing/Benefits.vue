<template>
  <section class="benefits">
    <h2 class="section-title animate__animated animate__fadeInDown">Beneficios de StudentGest</h2>
    <div class="benefits-grid">
      <div
        v-for="(benefit, index) in benefits"
        :key="index"
        class="benefit-item animate__animated animate__fadeInUp"
      >
        <i :class="benefit.icon"></i>
        <h3>{{ benefit.title }}</h3>
        <p>{{ benefit.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const benefits = [
  { icon: 'fas fa-rocket', title: 'Rápido y Eficiente', description: 'Optimiza la gestión escolar en minutos.' },
  { icon: 'fas fa-mobile-alt', title: 'Acceso Móvil', description: 'Gestiona desde cualquier dispositivo.' },
  { icon: 'fas fa-globe', title: 'Multi-Idioma', description: 'Disponible en varios idiomas.' }
];
</script>

<style scoped>
.benefits {
  background-color: var(--color-light);
  padding: 4rem 1rem;
  text-align: center;
  font-family: var(--font-body);
}

.section-title {
  font-family: var(--font-title);
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 3rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

.benefit-item {
  background: white;
  border: 2px solid var(--color-secondary);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.benefit-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.benefit-item i {
  font-size: 3rem;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.benefit-item h3 {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  font-family: var(--font-title);
}

.benefit-item p {
  font-size: 1rem;
  color: var(--color-dark);
}
</style>
