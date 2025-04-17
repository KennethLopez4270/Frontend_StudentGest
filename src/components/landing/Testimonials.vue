<template>
    <section class="testimonials">
      <h2 class="section-title animate__animated animate__fadeInDown">Voces de Nuestra Comunidad</h2>
      <div class="testimonials-grid">
        <div
          v-for="(testimonial, index) in testimonials"
          :key="index"
          :class="`testimonial-card animate__animated animate__fadeInUp animate__delay-${index + 1}s`"
        >
          <p>"{{ testimonial.text }}"</p>
          <h4>– {{ testimonial.author }}</h4>
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
  