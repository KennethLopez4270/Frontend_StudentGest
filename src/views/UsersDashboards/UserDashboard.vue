<template>
  <div class="dashboard-layout">
    <!-- Columna izquierda: Sidebar -->
    <div class="sidebar-column">
      <Sidebar />
    </div>

    <!-- Columna derecha: Contenido principal -->
    <div class="content-column">
      <WelcomeBanner />
      <div class="content">
        <router-view /> <!-- Renderiza las vistas de las funcionalidades -->
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import WelcomeBanner from '@/components/WelcomeBanner.vue'
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
}

/* Sidebar */
.sidebar-column {
  width: 245px; /* Coincide con el ancho del Sidebar.vue */
  background-color: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
}

/* Contenido */
.content-column {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px;
}

.content {
  padding: 10px;
}

/* --- RESPONSIVE --- */
@media (max-width: 992px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar-column {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    display: none; /* Oculta el sidebar estático, depende del botón hamburguesa del Sidebar.vue */
  }

  .content-column {
    width: 100%;
    padding: 10px;
  }
}
</style>