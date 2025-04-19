<!-- src/components/Sidebar.vue -->
<template>
  <div class="sidebar" :class="{ collapsed: isMobile && !isSidebarOpen }">
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

    <FooterSidebar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FooterSidebar from './FooterSidebar.vue'

const route = useRoute()
const menuItems = ref([])
const isSidebarOpen = ref(true)
const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const role = user.rol?.toUpperCase();

  const roleBasedMenus = {
    PADRE: [
      { route: '/parent-dashboard', name: 'Home', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { route: '/control-asistencia', name: 'ControlAsistencia', icon: 'fas fa-users', label: 'Estudiantes' },
      { route: '/historial-academico', name: 'HistorialAcademico', icon: 'fas fa-book', label: 'Tareas' },
      { route: '/calificaciones', name: 'Calificaciones', icon: 'fas fa-star', label: 'Calificaciones' },
      { route: '/justificar-ausencias', name: 'JustificarAusencias', icon: 'fas fa-file-alt', label: 'Justificar Ausencias' },
      { route: '/foro', name: 'Forum', icon: 'fas fa-comments', label: 'Foro' },
      { route: '/calendario', name: 'AcademicCalendar', icon: 'fas fa-calendar-alt', label: 'Calendario' }
    ],
    ESTUDIANTE: [
      { route: '/student-dashboard', name: 'Home', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { route: '/tareas', name: 'MisTareas', icon: 'fas fa-tasks', label: 'Mis Tareas' },
      { route: '/calificaciones', name: 'Notas', icon: 'fas fa-star', label: 'Mis Calificaciones' },
      { route: '/foro', name: 'Forum', icon: 'fas fa-comments', label: 'Foro' },
      { route: '/calendario', name: 'AcademicCalendar', icon: 'fas fa-calendar-alt', label: 'Calendario' }
    ],
    PROFESOR: [
      { route: '/teacher-dashboard', name: 'Home', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { route: '/mis-cursos', name: 'Cursos', icon: 'fas fa-book', label: 'Mis Cursos' },
      { route: '/mis-tareas', name: 'Tareas', icon: 'fas fa-tasks', label: 'Mis Tareas' },
      { route: '/control-asistencia', name: 'Asistencia', icon: 'fas fa-check-circle', label: 'Asistencia' },
      { route: '/foro', name: 'Forum', icon: 'fas fa-comments', label: 'Foro' }
    ],
    DIRECTOR: [
      { route: '/admin-dashboard', name: 'Home', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { route: '/gestion-usuarios', name: 'Usuarios', icon: 'fas fa-users-cog', label: 'Gestión de Usuarios' },
      { route: '/reportes', name: 'Reportes', icon: 'fas fa-chart-line', label: 'Reportes Generales' }
    ],
    PERSONAL: [
      { route: '/personal-dashboard', name: 'Home', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { route: '/calendario', name: 'Calendario', icon: 'fas fa-calendar-alt', label: 'Calendario Escolar' },
      { route: '/eventos', name: 'Eventos', icon: 'fas fa-bullhorn', label: 'Eventos' }
    ]
  }

  menuItems.value = roleBasedMenus[role] || []
})
</script>

<style scoped>
.sidebar {
  background: var(--color-primary);
  color: var(--color-light);
  height: 100vh;
  width: 250px;
  transition: width 0.3s ease;
  overflow: hidden;
  position: fixed;
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  border-radius: 0 40px 40px 0;
  z-index: 9999;
}

.sidebar.collapsed {
  width: 65px;
}

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
  opacity: 1;
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .logo-text {
  opacity: 0;
}

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
  color: var(--color-icon);
  font-size: 1.4rem;
}

.label {
  opacity: 1;
  transition: opacity 0.3s ease, margin-left 0.3s ease;
  white-space: nowrap;
}

.sidebar.collapsed .label {
  opacity: 0;
}

.nav-label {
  font-family: var(--font-title);
  margin-left: 0.5rem;
  font-size: 1rem;
}
</style>
