<template>
  <div class="card p-3">
    <h3 class="mb-3">Resumen General</h3>
    <Chart
      v-if="chartData && chartData.labels"
      :type="'bar'"
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup>
import { Chart } from 'vue-chartjs'
import { ref } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

const chartData = ref({
  labels: ['Tareas Completadas', 'Tareas Pendientes', 'Asistencia', 'Participación'],
  datasets: [
    {
      label: 'Resumen',
      data: [12, 5, 18, 10],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  scales: {
    y: {
      beginAtZero: true
    }
  }
})
</script>
