<template>
  <div class="dashboard-layout">
    <!-- Columna izquierda: Sidebar -->
    <div class="sidebar-column">
      <Sidebar />
    </div>

    <!-- Columna derecha: Contenido dashboard -->
    <div class="content-column">
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
import ClasesEstudiante from '../../components/ClasesEstudiante.vue';
import TareasEstudiante from '../../components/TareasEstudiante.vue';
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

.sidebar-column {
  width: 240px; /* o el ancho real de tu sidebar */
  background-color: var(--color-sidebar); /* puedes definirlo en tu tema */
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.content{
  padding: 10px;
}

.content-column {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0 0 10px;
}
</style>
