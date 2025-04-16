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
        { route: '/parent-dashboard', name: 'Home', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
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
/* Sidebar */
.sidebar {
  background: var(--color-primary);
  color: var(--color-light);
  height: 100vh;
  width: 65px;
  max-width: 300px;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  border-radius: 0 40px 40px 0;
  z-index: 9999;
  
}

.sidebar:hover {
  width: 250px;
  border-radius: 0 40px 40px 0;
  padding-right: 5px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0.5rem;
}

.logo-text {
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--color-text);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar:hover .logo-text {
  opacity: 1;
}

/* Icono del colegio */
.school-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-dark);
  flex-shrink: 0;
}

.school-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Navegación */
nav {
  width: 100%;
  flex-grow: 1;
  padding-left: 0.3rem;
}

.sidebar a {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 6px;
  margin: 0.4rem 0;
  transition: all 0.3s ease;
}

.sidebar a:hover,
.sidebar a.active {
  background: var(--hover-primary);
  color: var(--hover-secondary);
  transform: scale(1.02);
  margin-right: 5px;
}

.sidebar i {
  min-width: 30px;
  text-align: center;
  color: var(--color-icon); /*no entiendo porque al cambiar esto se vuelve raro*/
  font-size: 1.4rem;
  
}

/* Etiquetas del menú */
.label {
  opacity: 0;
  transition: opacity 0.3s ease, margin-left 0.3s ease;
  white-space: nowrap;
}

.sidebar:hover .label {
  opacity: 1;
}

.nav-label {
  font-family: var(--font-title);
  margin-left: 0.5rem;
  font-size: 1rem;
}
</style>

