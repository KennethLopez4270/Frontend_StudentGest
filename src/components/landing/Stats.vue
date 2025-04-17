<template>
    <section class="stats">
      <h2 class="section-title animate__animated animate__fadeInDown">Nuestra Huella en la Educación</h2>
      <div class="stats-grid">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          :class="`stat-card animate__animated animate__bounceIn animate__delay-${index + 1}s`"
        >
          <h3>{{ stat.value }}</h3>
          <p>{{ stat.label }}</p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const stats = [
    { value: '98%', label: 'Satisfacción' },
    { value: '10K+', label: 'Estudiantes' },
    { value: '500+', label: 'Instituciones' },
    { value: '24/7', label: 'Soporte' }
  ];
  </script>
  