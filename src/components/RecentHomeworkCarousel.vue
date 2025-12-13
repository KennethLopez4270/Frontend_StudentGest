<template>
  <div>
    <h5 class="mb-3">Últimas entregas de tareas</h5>
    <div class="carousel">
      <div
        v-for="(tarea, index) in tareas"
        :key="index"
        class="carousel-item"
      >
        <h6 class="mb-1">{{ tarea.titulo }}</h6>
        <p class="mb-1 text-muted">{{ tarea.fecha }}</p>
        <small><strong>Curso:</strong> {{ tarea.curso }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
const tareas = [
  { titulo: 'Ecuaciones cuadráticas', fecha: '2025-04-18', curso: '4to A' },
  { titulo: 'Trabajo de campo', fecha: '2025-04-17', curso: '5to B' },
  { titulo: 'Informe laboratorio', fecha: '2025-04-16', curso: '6to C' },
]
</script>

<style scoped>
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 15px;
  padding-bottom: 10px;
}

.carousel::-webkit-scrollbar {
  height: 8px;
}
.carousel::-webkit-scrollbar-thumb {
  background-color: var(--color-primary);
  border-radius: 4px;
}

.carousel-item {
  min-width: 220px;
  background: var(--color-light);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 15px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
