<template>
  <div>
    <!-- Botón de hamburguesa siempre fijo -->
    <button 
      v-if="isMobile"
      class="hamburger-btn"
      @click="toggleSidebar"
      aria-label="Menú"
    >
      <i class="fas" :class="isSidebarOpen ? 'fa-times' : 'fa-bars'"></i>
    </button>

    <!-- Overlay para móviles -->
    <div 
      v-if="isMobile && isSidebarOpen"
      class="sidebar-overlay" 
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar principal -->
    <div 
      class="sidebar" 
      :class="{ 
        'collapsed': (!isMobile && isCollapsed) || (isMobile && !isSidebarOpen),
        'mobile-open': isMobile && isSidebarOpen
      }"
    >
      <div class="logo" @click="isMobile && toggleSidebar()">
        <div class="school-icon">
          <img
            src="https://img.freepik.com/vector-premium/capybara-esta-leyendo-al-estilo-dibujos-animados_995281-13303.jpg"
            alt="Logo de CodeCapibara"
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
          @click="handleNavClick"
        >
          <i :class="item.icon"></i>
          <span class="label nav-label">{{ item.label }}</span>
        </router-link>
      </nav>

      <FooterSidebar @nav-click="handleNavClick" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import FooterSidebar from './FooterSidebar.vue'

const route = useRoute()
const menuItems = ref([])
const isSidebarOpen = ref(false)
const isCollapsed = ref(false)
const isMobile = ref(false)

// Verificar tamaño de pantalla
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 992 // Changed to 992px to include tablets
  if (isMobile.value) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
    isCollapsed.value = false
  }
}

// Alternar sidebar
const toggleSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = !isSidebarOpen.value
    // Bloquear/desbloquear scroll del body cuando el sidebar está abierto
    if (isSidebarOpen.value) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}

// Manejar clic en navegación
const handleNavClick = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
    document.body.classList.remove('no-scroll')
  }
}

// Cargar menú según rol
const loadMenuItems = () => {
  const user = JSON.parse(localStorage.getItem("user") || '{}')
  const role = user.rol?.toUpperCase()

  const roleBasedMenus = {
    PADRE: [
      { route: '/parent-dashboard', name: 'Home', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
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
      { route: '/teacher-tasks', name: 'Tareas', icon: 'fas fa-tasks', label: 'Mis Tareas' },
      { route: '/control-asistencia', name: 'Asistencia', icon: 'fas fa-check-circle', label: 'Asistencia' },
      { route: '/foro', name: 'Forum', icon: 'fas fa-comments', label: 'Foro' },
      { route: '/calendario', name: 'AcademicCalendar', icon: 'fas fa-calendar-alt', label: 'Calendario' }
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
}

watch(() => route.name, () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
    document.body.classList.remove('no-scroll')
  }
})

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  loadMenuItems()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.body.classList.remove('no-scroll')
})
</script>

<style scoped>
.sidebar {
  background: var(--t-color-primary);
  color: var(--t-color-light);
  height: 100vh;
  width: 245px;
  transition: transform 0.3s ease, width 0.3s ease;
  overflow: hidden;
  position: fixed;
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  /*
  clip-path: polygon(
    0 0,
    calc(100% - 50px) 0,
    100% 50px,
    100% calc(100% - 50px),
    calc(100% - 50px) 100%,
    0 100%
  );*/
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  top: 0;
  left: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
}

.logo-text {
  font-family: var(--t-font-title);
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--color-light);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  opacity: 1;
  transition: opacity 0.3s ease;
}

.school-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
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
  overflow-y: auto;
}

.sidebar a {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: var(--t-color-light);
  text-decoration: none;
  border-radius: 6px;
  margin: 0.4rem 0.4rem 0.4rem 0;
  transition: all 0.3s ease;
}

.sidebar a:hover {
  background: var(--t-hover-primary);
  color: white;
  transform: translateX(5px);
}

.sidebar a.active {
  background: var(--t-color-accent);
  color: white;
  font-weight: 600;
}

.sidebar i {
  min-width: 30px;
  text-align: center;
  color: var(--t-color-light);
  font-size: 1.1rem;
  opacity: 0.8;
}

.sidebar a.active i {
  opacity: 1;
}

.label {
  opacity: 1;
  transition: opacity 0.3s ease, margin-left 0.3s ease;
  white-space: nowrap;
}

.nav-label {
  font-family: var(--t-font-body);
  margin-left: 0.5rem;
  font-size: 0.95rem;
}

.sidebar.collapsed {
  width: 65px;
}

.sidebar.collapsed .label {
  opacity: 0;
  margin-left: -10px;
}

.sidebar.collapsed .logo {
  justify-content: center;
  margin-left: 0;
}

.sidebar.collapsed .school-icon {
  width: 35px;
  height: 35px;
  border-width: 1px;
}

.sidebar.collapsed a {
  justify-content: center;
  margin: 0.4rem 0;
}

.sidebar.collapsed a:hover {
  transform: none;
}

.hamburger-btn {
  position: fixed;
  top: 15px;
  left: 15px;
  background: var(--t-color-accent);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 900;
  backdrop-filter: blur(3px);
}

/* Tablet y móvil (≤992px) */
@media (max-width: 992px) {
  .sidebar {
    width: 245px;
    transform: translateX(-100%);
    clip-path: none;
    border-radius: 0;
    height: 100vh !important;
    overflow-y: auto;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 245px;
    transform: translateX(-100%);
  }

  .sidebar.collapsed .label {
    opacity: 1;
    margin-left: 0.5rem;
  }

  .sidebar.collapsed a {
    justify-content: flex-start;
  }

  .sidebar.collapsed .logo {
    justify-content: flex-start;
    margin-left: 0.5rem;
  }

  .logo-text {
    font-size: 1.4rem;
  }

  .school-icon {
    width: 40px;
    height: 40px;
  }

  .nav-label {
    font-size: 0.9rem;
  }

  .sidebar i {
    font-size: 1rem;
  }
}

/* Móvil (≤576px) */
@media (max-width: 576px) {
  .sidebar {
    width: 200px;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    width: 200px;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  .school-icon {
    width: 35px;
    height: 35px;
  }

  .nav-label {
    font-size: 0.85rem;
  }

  .sidebar i {
    font-size: 0.9rem;
  }

  .hamburger-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
    top: 10px;
    left: 10px;
  }
}
</style>

<style>
/* Estilo global para el body cuando el sidebar está abierto */
.no-scroll {
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>