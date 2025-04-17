<template>
    <section class="benefits">
      <h2 class="section-title animate__animated animate__fadeInDown">Beneficios de StudentGest</h2>
      <div class="benefits-grid">
        <div
          v-for="(benefit, index) in benefits"
          :key="index"
          :class="`benefit-item animate__animated ${index % 2 === 0 ? 'animate__slideInLeft' : 'animate__slideInRight'} animate__delay-${index + 1}s`"
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
  