<template>
  <div class="dashboard-layout">
    <!-- Sidebar (se manejará de forma responsive dentro del componente) -->
    <Sidebar ref="sidebar" />
    
    <!-- Contenido principal -->
    <div class="content-column" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- Botón de hamburguesa solo para móviles -->
      <button 
        v-if="isMobile"
        class="mobile-menu-btn"
        @click="toggleSidebar"
      >
        <i class="fas fa-bars"></i>
      </button>

      <WelcomeBanner />
      
      <div class="content">
        <!-- Resumen de materias y cursos -->
        <CourseSummaryCards />
        
        <!-- Últimas entregas de tareas -->
        <RecentHomeworkCarousel />
        
        <!-- Historial académico por curso -->
        <CoursePerformanceCharts />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import WelcomeBanner from '@/components/WelcomeBanner.vue'
import CourseSummaryCards from '@/components/CourseSummaryCards.vue'
import RecentHomeworkCarousel from '@/components/RecentHomeworkCarousel.vue'
import CoursePerformanceCharts from '@/components/CoursePerformanceCharts.vue'

const sidebar = ref(null)
const isMobile = ref(false)
const isSidebarCollapsed = ref(false)

// Verificar tamaño de pantalla
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 768
  isSidebarCollapsed.value = isMobile.value
}

// Alternar sidebar
const toggleSidebar = () => {
  if (sidebar.value) {
    sidebar.value.toggleSidebar()
  }
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
  position: relative;
}

.content-column {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
  transition: margin-left 0.3s ease;
}

.content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Botón de menú móvil */
.mobile-menu-btn {
  position: fixed;
  top: 15px;
  left: 15px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* Estilos responsivos */
@media (min-width: 769px) {
  .content-column {
    margin-left: 240px;
  }
  
  .content-column.sidebar-collapsed {
    margin-left: 65px;
  }
}

@media (max-width: 768px) {
  .content-column {
    margin-left: 0;
    width: 100%;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
}

/* Transiciones suaves */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>