<template>
  <div class="sidebar">
    <div class="logo">
      <div class="school-icon">
        <img
          src="https://img.freepik.com/vector-premium/capybara-esta-leyendo-al-estilo-dibujos-animados_995281-13303.jpg"
          alt="Logo del colegio"
        />
      </div>
      <span class="label logo-text">CodeCapibara</span>
    </div>

    <nav>
      <router-link
        v-for="item in menuItems"
        :key="item.route"
        :to="item.route"
        :class="{ active: $route.name === item.name }"
        :title="item.label"
      >
        <i :class="item.icon"></i>
        <span class="label nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      menuItems: [
        { route: '/', name: 'Home', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
        { route: '/control-asistencia', name: 'ControlAsistencia', icon: 'fas fa-users', label: 'Estudiantes' },
        { route: '/reportes', name: 'Reportes', icon: 'fas fa-chart-line', label: 'Reportes' },
        { route: '/historial-academico', name: 'HistorialAcademico', icon: 'fas fa-book', label: 'Tareas' },
        { route: '/calificaciones', name: 'Calificaciones', icon: 'fas fa-star', label: 'Calificaciones' },
        { route: '/calendario', name: 'AcademicCalendar', icon: 'fas fa-calendar-alt', label: 'Calendario' },
        { route: '/justificar-ausencias', name: 'JustificarAusencias', icon: 'fas fa-file-alt', label: 'Justificar Ausencias' },
        { route: '/foro', name: 'Forum', icon: 'fas fa-comments', label: 'Foro' },
        { route: '/admin-reports', name: 'AdminReports', icon: 'fas fa-file-export', label: 'Informes Admin' },
        { route: '/task-details', name: 'TaskDetails', icon: 'fas fa-tasks', label: 'Detalles de Tareas' }
      ]
    };
  }
};
</script>

<style scoped>
.sidebar {
  background: #1a2e4a;
  height: 100vh;
  width: 70px;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  z-index:9999;
}

.sidebar:hover {
  width: 240px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0.5rem;
}

.logo-text {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.6rem;
  color: #ffffff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

nav {
  width: 100%;
  flex-grow: 1;
  padding-left: 0.3rem;
}

.sidebar a {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: #e0e7ff;
  text-decoration: none;
  border-radius: 6px;
  margin: 0.4rem 0;
  transition: all 0.3s ease;
}

.sidebar a:hover,
.sidebar a.active {
  background: rgba(255, 255, 255, 0.05);
  color: #d4c08a;
  transform: scale(1.02);
}

.sidebar i {
  min-width: 30px;
  text-align: center;
  color: #a3bffa;
  font-size: 1.4rem;
}

.label {
  opacity: 0;
  transition: opacity 0.3s ease, margin-left 0.3s ease;
  white-space: nowrap;
}

.sidebar:hover .label {
  opacity: 1;
}

.nav-label {
  font-family: 'Playfair Display', serif;
  margin-left: 0.5rem;
  font-size: 1rem;
}

.school-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #a3bffa;
  flex-shrink: 0; /* <- esto lo mantiene siempre visible */
}

.school-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-text {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 1.6rem;
  color: #ffffff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar:hover .logo-text {
  opacity: 1;
}
</style>
