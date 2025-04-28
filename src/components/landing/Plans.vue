<template>
  <section class="plans-section">
    <div class="container">
      <h2 class="title">Planes que se adaptan a ti</h2>
      <div class="grid">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          :class="['plan-card', { featured: plan.featured }]"
          class="animate__animated animate__zoomIn"
        >
          <h3 class="plan-title">{{ plan.name }}</h3>
          <p class="plan-price">{{ plan.price }}</p>
          <ul class="plan-features">
            <li v-for="(feature, i) in plan.features" :key="i">
              <i class="fas fa-check-circle"></i> {{ feature }}
            </li>
          </ul>
          <button class="select-button">Seleccionar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const plans = [
  {
    name: 'Básico',
    price: 'Gratis',
    features: [
      'Hasta 1 institución',
      '10 usuarios activos',
      'Gestión de cursos y tareas',
      'Soporte por email'
    ]
  },
  {
    name: 'Profesional',
    price: '$19/mes',
    featured: true,
    features: [
      'Hasta 5 instituciones',
      'Usuarios ilimitados',
      'Asistencia y reportes',
      'Notificaciones y foros'
    ]
  },
  {
    name: 'Corporativo',
    price: '$49/mes',
    features: [
      'Instituciones ilimitadas',
      'Integración avanzada',
      'Informes personalizados',
      'Soporte prioritario'
    ]
  }
];
</script>

<style scoped>
.plans-section {
  background: linear-gradient(
    to bottom right,
    var(--color-light),
    #fdfcf9
  );
  padding: 5rem 1rem;
  font-family: var(--font-body);
  text-align: center;
}

.title {
  font-family: var(--font-title);
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 3rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
}

.plan-card {
  background-color: var(--color-light);
  border: 2px solid var(--color-secondary);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  transition: all 0.4s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.featured {
  border-color: var(--color-accent);
  background: linear-gradient(135deg, var(--color-light), #fff);
  position: relative;
}

.featured::before {
  content: "★ Recomendado";
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-accent);
  color: white;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  border-radius: 1rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.plan-title {
  font-family: var(--font-title);
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.plan-price {
  font-size: 1.8rem;
  color: var(--color-info);
  margin-bottom: 2rem;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem;
  color: var(--color-dark);
  text-align: left;
}

.plan-features li {
  margin: 0.8rem 0;
  font-size: 1rem;
}

.plan-features i {
  color: var(--color-secondary);
  margin-right: 0.5rem;
}

.select-button {
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 2.2rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.select-button:hover {
  background-color: var(--hover-accent);
  transform: scale(1.05);
}

/* Mejoras de responsividad extra */
@media (max-width: 480px) {
  .plan-card {
    padding: 2rem 1.5rem;
  }

  .plan-title {
    font-size: 1.6rem;
  }

  .plan-price {
    font-size: 1.4rem;
  }
}
</style>
