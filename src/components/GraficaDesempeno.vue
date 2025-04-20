<template>
  <div class="card">
    <h4>Gráfico de Desempeño</h4>
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
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { ref } from 'vue'

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler)

const chartData = ref({
  labels: ['Matemáticas', 'Lenguaje', 'Ciencias', 'Sociales', 'Inglés'],
  datasets: [
    {
      label: 'Laura Ramírez',
      data: [85, 90, 80, 75, 88],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    },
    {
      label: 'Mateo Ramírez',
      data: [78, 88, 82, 85, 80],
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  }
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
