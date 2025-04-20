<template>
  <div class="clases-estudiante card">
    <h3>Clases de hoy</h3>
    <ul v-if="clases.length">
      <li v-for="(clase, index) in clases" :key="index">
        <div class="clase-info">
          <strong>{{ clase.materia }}</strong> - {{ clase.hora }}
          <span class="aula">Aula: {{ clase.aula }}</span>
        </div>
      </li>
    </ul>
    <p v-else>No tienes clases programadas para hoy.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const clases = ref([])

onMounted(() => {
  // Simulación de datos estáticos (luego puedes cambiar a un fetch o axios)
  clases.value = [
    { materia: 'Matemáticas', hora: '08:00 - 09:30', aula: 'A-101' },
    { materia: 'Lenguaje', hora: '10:00 - 11:30', aula: 'B-202' },
    { materia: 'Educación Física', hora: '12:00 - 13:00', aula: 'Gimnasio' },
  ]
})
</script>

<style scoped>
.card {
  background: transparent;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  border: 0;
}
h3 {
  color: var(--color-primary);
  font-family: var(--font-title);
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.6rem;
}
.clase-info {
  font-size: 0.95rem;
  flex: 0 0 250px;
  background: #ffffff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(26, 46, 74, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}
.aula {
  display: block;
  font-size: 0.85rem;
  color: var(--color-info);
}
</style>
