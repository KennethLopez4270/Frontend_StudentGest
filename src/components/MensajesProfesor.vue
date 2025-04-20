<template>
  <div class="mensajes-profesor card">
    <h3>Mensajes de profesores</h3>
    <ul v-if="mensajes.length">
      <li v-for="(msg, i) in mensajes" :key="i">
        <strong>{{ msg.profesor }}:</strong> {{ msg.mensaje }}
        <span class="fecha">{{ msg.fecha }}</span>
      </li>
    </ul>
    <p v-else>No tienes mensajes nuevos.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mensajes = ref([])

onMounted(() => {
  mensajes.value = [
    { profesor: 'Prof. Ramírez', mensaje: 'Revisar la tarea de matemáticas.', fecha: '18/04/2025' },
    { profesor: 'Prof. Gómez', mensaje: 'Clase suspendida el lunes.', fecha: '17/04/2025' },
  ]
})
</script>

<style scoped>
.card {
  background: var(--color-light);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
}
h3 {
  color: var(--color-primary);
  margin-bottom: 0.8rem;
}
li {
  margin-bottom: 0.8rem;
}
.fecha {
  display: block;
  font-size: 0.75rem;
  color: var(--color-info);
}
</style>
  