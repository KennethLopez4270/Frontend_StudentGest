<template>
  <div class="cards-grid">
    <div
      v-for="(item, index) in summaryData"
      :key="index"
      class="card"
    >
      <h4>{{ item.materia }}</h4>
      <p><strong>Curso:</strong> {{ item.curso }}</p>
      <p><strong>Turno:</strong> {{ item.turno }}</p>
      <p><strong>Inscritos:</strong> {{ item.inscritos }}</p>
    </div>
  </div>
</template>

<script setup>
const summaryData = [
  { materia: 'Matemáticas', curso: '4to A', turno: 'Mañana', inscritos: 28 },
  { materia: 'Física', curso: '5to B', turno: 'Tarde', inscritos: 32 },
  { materia: 'Química', curso: '6to C', turno: 'Mañana', inscritos: 30 },
]
</script>

<style scoped>
.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.card {
  flex: 1 1 250px;
  background: var(--color-light);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
}
</style>
