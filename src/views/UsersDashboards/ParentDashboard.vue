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
        <HijosInscritos />
        <ResumenHijos />
        <GraficaDesempeno />
        <CalendarioEscolar /> <!-- Este lo tienes tú -->
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import WelcomeBanner from '@/components/WelcomeBanner.vue'
import HijosInscritos from '@/components/HijosInscritos.vue'
import ResumenHijos from '@/components/ResumenHijos.vue'
import GraficaDesempeno from '@/components/GraficaDesempeno.vue'

</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.sidebar-column {
  width: 240px;
  background-color: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.content-column {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0 0 10px;
}

.content {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 16px;
}
</style>
