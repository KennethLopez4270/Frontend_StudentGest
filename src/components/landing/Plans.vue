<template>
    <section class="plans">
      <h2 class="section-title animate__animated animate__fadeInDown">Elige el Plan Perfecto para tu Escuela</h2>
      <div class="plans-grid">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          :class="`plan-card ${plan.class || ''} animate__animated animate__zoomIn animate__delay-${index + 1}s`"
        >
          <h3>{{ plan.name }}</h3>
          <p class="price">{{ plan.price }}</p>
          <ul>
            <li v-for="(item, i) in plan.features" :key="i">
              <i class="fas fa-check-circle"></i> {{ item }}
            </li>
          </ul>
          <router-link to="/registro" class="btn-plan">
            <i class="fas fa-star"></i> Seleccionar
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const plans = [
    { name: 'Básico', price: '$9/mes', features: ['Gestión de hasta 100 estudiantes', 'Informes básicos', 'Soporte por correo'] },
    { name: 'Premium', price: '$29/mes', class: 'premium', features: ['Gestión de hasta 500 estudiantes', 'Informes avanzados', 'Soporte 24/7', 'Calendario integrado'] },
    { name: 'VIP', price: '$99/mes', class: 'vip', features: ['Estudiantes ilimitados', 'Informes personalizados', 'Soporte prioritario', 'Funcionalidades exclusivas', 'Integraciones avanzadas'] }
  ];
  </script>
  