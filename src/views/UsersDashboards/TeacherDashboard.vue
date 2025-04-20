<template>
  <div class="dashboard-layout">
    <!-- Sidebar -->
    <div class="sidebar-column">
      <Sidebar />
    </div>

    <!-- Contenido principal -->
    <div class="content-column">
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
import Sidebar from '@/components/Sidebar.vue'
import WelcomeBanner from '@/components/WelcomeBanner.vue'
import CourseSummaryCards from '@/components/CourseSummaryCards.vue'
import RecentHomeworkCarousel from '@/components/RecentHomeworkCarousel.vue'
import CoursePerformanceCharts from '@/components/CoursePerformanceCharts.vue'
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
