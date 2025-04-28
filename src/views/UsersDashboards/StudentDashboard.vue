<template>
  <div class="dashboard-layout">
    <!-- Columna izquierda: Sidebar -->
    <div class="sidebar-column">
      
    </div>

    <!-- Columna derecha: Contenido principal -->
    <div class="content-column">
      <Sidebar />
      <WelcomeBanner />
      <div class="content">
        <!-- Aquí iría el contenido del dashboard del estudiante -->
        <ClasesEstudiante />
        <TareasEstudiante />
        <MensajesProfesor />
        <ProgresoAcademico />
        <ResumenGeneral />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import WelcomeBanner from '@/components/WelcomeBanner.vue'
import ClasesEstudiante from '@/components/ClasesEstudiante.vue'
import TareasEstudiante from '@/components/TareasEstudiante.vue'
import MensajesProfesor from '@/components/MensajesProfesor.vue'  
import ProgresoAcademico from '@/components/ProgresoAcademico.vue'
import ResumenGeneral from '@/components/ResumenGeneral.vue'
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
}

/* Sidebar */
.sidebar-column {
  width: 240px;
  background-color: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

/* Contenido */
.content-column {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0 0 10px;
}

.content {
  padding: 10px;
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column; /* Ya no lado a lado, sino arriba/abajo */
  }

  .sidebar-column {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    display: none; /* oculto el sidebar estático, ahora depende del burger */
  }

  .content-column {
    width: 100%;
    padding: 10px;
  }
}
</style>