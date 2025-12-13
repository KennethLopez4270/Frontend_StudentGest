<template>
  <div>
    <h3 class="text-center mb-3">Desempeño Académico por Curso</h3>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

// Registrar componentes necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Datos estáticos simulados
const chartData = {
  labels: ['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia'],
  datasets: [
    {
      label: 'Promedio General',
      backgroundColor: '#42A5F5',
      data: [85, 78, 92, 88],
    },
  ],
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Promedio por Materia (Curso)' },
  },
}
</script>

<style scoped>
h3 {
  color: var(--color-primary);
}
</style>
