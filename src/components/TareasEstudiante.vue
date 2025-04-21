<template>
  <div class="tareas-estudiante card">
    <h3>Tareas asignadas</h3>
    <ul v-if="tareas.length">
      <li v-for="(tarea, index) in tareas" :key="index" :class="{ completada: tarea.estado === 'completada' }">
        <div class="tarea-info">
          <strong>{{ tarea.titulo }}</strong> - {{ tarea.materia }}
          <span class="fecha">Entrega: {{ tarea.fecha_entrega }}</span>
        </div>
        <span class="estado">{{ tarea.estado }}</span>
      </li>
    </ul>
    <p v-else>No tienes tareas asignadas.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tareas = ref([])

onMounted(() => {
  // Simulación de tareas, luego se puede cambiar por fetch/axios
  tareas.value = [
    {
      titulo: 'Ejercicios de Álgebra',
      materia: 'Matemáticas',
      fecha_entrega: '2025-04-21',
      estado: 'pendiente',
    },
    {
      titulo: 'Ensayo de lectura',
      materia: 'Lenguaje',
      fecha_entrega: '2025-04-20',
      estado: 'completada',
    },
    {
      titulo: 'Cuestionario de historia',
      materia: 'Ciencias Sociales',
      fecha_entrega: '2025-04-22',
      estado: 'pendiente',
    },
  ]
})
</script>

<style scoped>
.card {
  background: transparent;
  padding: 1rem ;
  border: 0;
}
h3 {
  color: var(--color-primary);
  font-family: var(--font-title);
}
ul {
  list-style: none;

}
li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border);
}
li:last-child {
  border-bottom: none;
}
.tarea-info {
  font-size: 0.95rem;
}
.fecha {
  display: block;
  font-size: 0.85rem;
  color: var(--color-info);
}
.estado {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--color-warning);
}
.completada .estado {
  color: var(--color-success);
}
</style>
