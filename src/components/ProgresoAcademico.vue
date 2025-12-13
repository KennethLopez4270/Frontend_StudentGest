<template>
  <div class="card p-3">
    <h3 class="mb-3">Progreso Académico</h3>
    <Chart
      v-if="chartData && chartData.labels"
      :type="'radar'"
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
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
)

const chartData = ref({
  labels: ['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés'],
  datasets: [
    {
      label: 'Desempeño',
      data: [80, 75, 90, 60, 70],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  scales: {
    r: {
      beginAtZero: true,
      max: 100
    }
  }
})
</script>
