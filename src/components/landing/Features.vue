<template>
  <section class="features-section">
    <div class="container">
      <h2 class="title">Funcionalidades destacadas</h2>
      <div class="grid">
        <div
          class="feature-card animate__animated animate__fadeInUp"
          v-for="(feature, index) in features"
          :key="index"
        >
          <i :class="feature.icon" class="feature-icon"></i>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: 'fas fa-chalkboard-teacher',
    title: 'Gestión Académica',
    description: 'Administra cursos, materias, tareas y evaluaciones de forma integral.'
  },
  {
    icon: 'fas fa-user-shield',
    title: 'Control de Usuarios',
    description: 'Define roles, permisos y flujos de aprobación con total seguridad.'
  },
  {
    icon: 'fas fa-calendar-check',
    title: 'Asistencia y Calendario',
    description: 'Registra la asistencia y visualiza eventos importantes en un solo lugar.'
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Informes Personalizados',
    description: 'Genera reportes dinámicos de desempeño académico por curso y estudiante.'
  },
  {
    icon: 'fas fa-bell',
    title: 'Notificaciones Inteligentes',
    description: 'Mantén a todos informados con alertas automáticas y mensajes dirigidos.'
  },
  {
    icon: 'fas fa-comments',
    title: 'Comunicación y Foros',
    description: 'Facilita el intercambio entre estudiantes, profesores y padres de familia.'
  }
];
</script>

<style scoped>
.features-section {
  background: linear-gradient(to bottom right, var(--color-bg) 60%, #f0f4f8 100%);
  padding: 4rem 1rem;
  font-family: var(--font-body);
  text-align: center;
}

.title {
  font-family: var(--font-title);
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--color-primary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  justify-items: center;
}

.feature-card {
  background-color: white;
  border-radius: 2rem;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 350px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-10px);
  background-color: var(--color-bg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  font-size: 3rem;
  color: var(--color-secondary);
  margin-bottom: 1rem;
}

.feature-title {
  font-family: var(--font-title);
  color: var(--color-primary);
  font-size: 1.6rem;
  margin-bottom: 0.7rem;
}

.feature-description {
  font-size: 1rem;
  color: var(--color-dark);
  padding: 0 1rem;
}

/* Responsive pequeño ajuste para centrar los últimos cards */
@media (max-width: 768px) {
  .grid {
    justify-content: center;
  }
}
</style>
