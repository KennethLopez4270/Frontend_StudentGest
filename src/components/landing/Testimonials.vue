<template>
  <section class="testimonials">
    <h2 class="section-title animate__animated animate__fadeInDown">
      Voces de Nuestra Comunidad
    </h2>
    <div class="testimonials-grid">
      <div
        v-for="(testimonial, index) in testimonials"
        :key="index"
        class="testimonial-card animate__animated animate__fadeInUp"
      >
        <p class="testimonial-text">"{{ testimonial.text }}"</p>
        <h4 class="testimonial-author">– {{ testimonial.author }}</h4>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  { text: 'StudentGest ha transformado nuestra escuela. ¡Es increíble!', author: 'Prof. Marta Pérez' },
  { text: 'Puedo seguir el progreso de mi hijo desde cualquier lugar.', author: 'Laura Rodríguez, Madre' },
  { text: 'La plataforma es rápida, segura y fácil de usar.', author: 'Juan Morales, IT Manager' }
];
</script>

<style scoped>
.testimonials {
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

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  background-color: white;
  border: 2px solid var(--color-secondary);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.testimonial-text {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--color-dark);
  margin-bottom: 1rem;
}

.testimonial-author {
  font-weight: bold;
  font-size: 1rem;
  color: var(--color-accent);
  font-family: var(--font-title);
}
</style>
