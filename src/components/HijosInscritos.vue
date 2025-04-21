<template>
  <div class="card">
    <h4>Hijos Inscritos</h4>
    <ul>
      <li v-for="hijo in hijos" :key="hijo.id">
        {{ hijo.nombre }} {{ hijo.apellido }} - {{ hijo.curso }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const hijos = ref([])

onMounted(() => {
  // Simulación de datos estáticos
  hijos.value = [
    { id: 1, nombre: 'Laura', apellido: 'Ramírez', curso: '3ro B Primaria' },
    { id: 2, nombre: 'Mateo', apellido: 'Ramírez', curso: '1ro A Secundaria' }
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
</style>
