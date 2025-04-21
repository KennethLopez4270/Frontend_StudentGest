<template>
    <div class="card">
      <h4>Resumen Académico</h4>
      <div v-for="hijo in hijosResumen" :key="hijo.id" class="hijo-card">
        <strong>{{ hijo.nombre }}</strong>
        <p>Tareas pendientes: {{ hijo.tareasPendientes }}</p>
        <p>Asistencia: {{ hijo.asistencia }}%</p>
        <p>Promedio: {{ hijo.promedio }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const hijosResumen = ref([])
  
  onMounted(() => {
    hijosResumen.value = [
      {
        id: 1,
        nombre: 'Laura Ramírez',
        tareasPendientes: 2,
        asistencia: 95,
        promedio: 88.5
      },
      {
        id: 2,
        nombre: 'Mateo Ramírez',
        tareasPendientes: 0,
        asistencia: 97,
        promedio: 92.3
      }
    ]
  })
  </script>
  
  <style scoped>
  .card {
    background: var(--color-light);
    border-radius: 8px;
    padding: 16px;
    box-shadow: var(--shadow);
  }
  .hijo-card {
    margin-bottom: 12px;
    padding: 8px;
    border-bottom: 1px solid var(--color-border);
  }
  </style>
  