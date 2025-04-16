<template>
    <div class="wrapper">
      <!-- Sidebar -->
      <Sidebar />
  
      <!-- Main Content -->
      <div class="main-content">
        <div class="left-section">
          <!-- Header -->
          <div class="header animate__animated animate__fadeInDown">
            <h1 class="animate__animated animate__pulse animate__infinite animate__slow">
              Bienvenido {{ parentName }}
            </h1>
            <a href="#" class="btn btn-lg">Cerrar Sesión</a>
          </div>
  
          <!-- Charts Section -->
          <div class="form-section animate__animated animate__fadeInUp">
            <h2>Gráficos de Desempeño</h2>
            <p class="text-sm text-gray-600 mb-4">Visualiza el desempeño de tus hijos a través de gráficos interactivos.</p>
  
            <!-- Filtros -->
            <div class="filters mb-5">
              <div class="row g-3">
                <div class="col-md-4">
                  <label for="studentSelect" class="form-label">Seleccionar Estudiante</label>
                  <select
                    id="studentSelect"
                    v-model="selectedStudent"
                    class="form-select shadow-sm"
                    @change="updateCharts"
                  >
                    <option value="" disabled>-- Seleccionar --</option>
                    <option v-for="student in students" :key="student.id" :value="student.id">
                      {{ student.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="periodSelect" class="form-label">Periodo</label>
                  <select
                    id="periodSelect"
                    v-model="selectedPeriod"
                    class="form-select shadow-sm"
                    @change="updateCharts"
                  >
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="metricSelect" class="form-label">Métrica</label>
                  <select
                    id="metricSelect"
                    v-model="selectedMetric"
                    class="form-select shadow-sm"
                    @change="updateCharts"
                  >
                    <option value="grades">Calificaciones</option>
                    <option value="attendance">Asistencia</option>
                    <option value="tasks">Tareas Completadas</option>
                  </select>
                </div>
              </div>
            </div>
  
            <!-- Charts -->
            <div class="charts-section">
              <div v-if="!selectedStudent" class="no-selection text-center text-gray-600">
                Selecciona un estudiante para ver los gráficos.
              </div>
              <div v-else-if="!chartData" class="no-data text-center text-gray-600">
                No hay datos disponibles para este periodo.
              </div>
              <div v-else class="charts-container">
                <h3 class="mb-4">Desempeño de {{ selectedStudentName }}</h3>
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="chart-card">
                      <h5>{{ metricTitle }}</h5>
                      <BarChart :data="chartData" :options="chartOptions" />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="chart-card">
                      <h5>Progreso General</h5>
                      <LineChart :data="progressChartData" :options="chartOptions" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Right Section -->
        <div class="right-section">
          <div class="profile-card animate__animated animate__fadeInRight">
            <img src="https://i.pinimg.com/736x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg" alt="Profile" class="shadow-lg" />
            <h3>{{ parentName }}</h3>
            <p>Tutor</p>
            <p><i class="fas fa-building me-1"></i> Academia Prestige</p>
            <p><i class="fas fa-calendar-alt me-1"></i> Miembro desde: 01/01/2023</p>
            <p><i class="fas fa-users me-1"></i> {{ students.length }} Estudiantes</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import 'animate.css';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import { BarChart, LineChart } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
  } from 'chart.js';
  import '@/assets/performanceCharts.css';
import Sidebar from '../components/Sidebar.vue';
  
  // Registrar los componentes de Chart.js
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
  );
  
  export default {
    name: 'PerformanceCharts',
    components: {
      BarChart,
      LineChart
    },
    components: { Sidebar },
    data() {
      return {
        parentName: 'María González',
        selectedStudent: '',
        selectedPeriod: 'mensual',
        selectedMetric: 'grades',
        students: [
          { id: 1, name: 'Ana González' },
          { id: 2, name: 'Carlos González' },
          { id: 3, name: 'Lucía González' },
        ],
        performanceData: [
          {
            studentId: 1,
            period: 'mensual',
            grades: [85, 90, 88],
            attendance: [95, 90, 100],
            tasks: [90, 85, 92],
            progress: [80, 85, 88], // Progreso general a lo largo de los meses
            labels: ['Semana 1', 'Semana 2', 'Semana 3'],
          },
          {
            studentId: 1,
            period: 'trimestral',
            grades: [82, 87, 90],
            attendance: [92, 95, 93],
            tasks: [88, 90, 91],
            progress: [78, 85, 90],
            labels: ['Mes 1', 'Mes 2', 'Mes 3'],
          },
          {
            studentId: 1,
            period: 'anual',
            grades: [80, 85, 88, 90],
            attendance: [90, 92, 95, 93],
            tasks: [85, 88, 90, 92],
            progress: [75, 80, 85, 90],
            labels: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'],
          },
          {
            studentId: 2,
            period: 'mensual',
            grades: [78, 80, 82],
            attendance: [85, 88, 90],
            tasks: [80, 82, 85],
            progress: [75, 78, 82],
            labels: ['Semana 1', 'Semana 2', 'Semana 3'],
          },
          {
            studentId: 2,
            period: 'trimestral',
            grades: [75, 78, 80],
            attendance: [88, 90, 92],
            tasks: [78, 80, 82],
            progress: [70, 75, 80],
            labels: ['Mes 1', 'Mes 2', 'Mes 3'],
          },
          {
            studentId: 2,
            period: 'anual',
            grades: [72, 75, 78, 80],
            attendance: [85, 88, 90, 92],
            tasks: [75, 78, 80, 82],
            progress: [68, 72, 75, 80],
            labels: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'],
          },
          {
            studentId: 3,
            period: 'mensual',
            grades: [92, 95, 93],
            attendance: [98, 100, 97],
            tasks: [95, 93, 96],
            progress: [90, 92, 95],
            labels: ['Semana 1', 'Semana 2', 'Semana 3'],
          },
          {
            studentId: 3,
            period: 'trimestral',
            grades: [90, 92, 94],
            attendance: [97, 98, 99],
            tasks: [92, 94, 95],
            progress: [88, 90, 94],
            labels: ['Mes 1', 'Mes 2', 'Mes 3'],
          },
          {
            studentId: 3,
            period: 'anual',
            grades: [88, 90, 92, 94],
            attendance: [96, 97, 98, 99],
            tasks: [90, 92, 94, 95],
            progress: [85, 88, 90, 94],
            labels: ['Trimestre 1', 'Trimestre 2', 'Trimestre 3', 'Trimestre 4'],
          },
        ],
        chartData: null,
        progressChartData: null,
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Porcentaje (%)',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Periodo',
              },
            },
          },
        },
      };
    },
    computed: {
      selectedStudentName() {
        const student = this.students.find(s => s.id === this.selectedStudent);
        return student ? student.name : '';
      },
      metricTitle() {
        switch (this.selectedMetric) {
          case 'grades':
            return 'Calificaciones por Periodo';
          case 'attendance':
            return 'Asistencia por Periodo';
          case 'tasks':
            return 'Tareas Completadas por Periodo';
          default:
            return '';
        }
      },
    },
    methods: {
      updateCharts() {
        if (!this.selectedStudent) {
          this.chartData = null;
          this.progressChartData = null;
          return;
        }
  
        const data = this.performanceData.find(
          d => d.studentId === this.selectedStudent && d.period === this.selectedPeriod
        );
  
        if (!data) {
          this.chartData = null;
          this.progressChartData = null;
          return;
        }
  
        // Datos para el gráfico de barras (calificaciones, asistencia o tareas)
        this.chartData = {
          labels: data.labels,
          datasets: [
            {
              label: this.metricTitle,
              data: data[this.selectedMetric],
              backgroundColor: '#355e3b',
              borderColor: '#1a2e4a',
              borderWidth: 1,
            },
          ],
        };
  
        // Datos para el gráfico de líneas (progreso general)
        this.progressChartData = {
          labels: data.labels,
          datasets: [
            {
              label: 'Progreso General',
              data: data.progress,
              borderColor: '#8b2e3c',
              backgroundColor: 'rgba(139, 46, 60, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        };
      },
    },
  };
  </script>