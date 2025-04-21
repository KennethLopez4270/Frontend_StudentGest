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
            Bienvenido {{ directorName }}
          </h1>
          <a href="#" class="btn btn-lg">Cerrar Sesión</a>
        </div>

        <!-- Reports Section -->
        <div class="form-section animate__animated animate__fadeInUp">
          <h2>Reportes de Desempeño Docente</h2>
          <p class="text-sm text-gray-600 mb-4">Genera reportes para evaluar la eficacia de los docentes.</p>

          <!-- Filtros -->
          <div class="filters mb-5">
            <div class="row g-3">
              <div class="col-md-4">
                <label for="teacherSelect" class="form-label">Seleccionar Docente</label>
                <select
                  id="teacherSelect"
                  v-model="selectedTeacher"
                  class="form-select shadow-sm"
                  @change="generateReport"
                >
                  <option value="" disabled>-- Seleccionar --</option>
                  <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="periodSelect" class="form-label">Periodo</label>
                <select
                  id="periodSelect"
                  v-model="selectedPeriod"
                  class="form-select shadow-sm"
                  @change="generateReport"
                >
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              <div class="col-md-4 d-flex align-items-end">
                <button
                  v-if="selectedTeacher"
                  class="btn btn-primary w-100"
                  @click="downloadReport"
                >
                  <i class="fas fa-download me-1"></i> Descargar Reporte
                </button>
              </div>
            </div>
          </div>

          <!-- Reporte Generado -->
          <div class="report-section">
            <div v-if="!selectedTeacher" class="no-selection text-center text-gray-600">
              Selecciona un docente para generar el reporte.
            </div>
            <div v-else-if="!reportData" class="no-report text-center text-gray-600">
              No hay datos disponibles para este periodo.
            </div>
            <div v-else class="report-card">
              <h3 class="mb-4">Reporte de Desempeño: {{ selectedTeacherName }}</h3>
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="metric-card">
                    <h5>Promedio de Calificaciones</h5>
                    <p class="metric-value">{{ reportData.averageGrades }} / 100</p>
                    <p class="metric-description">Promedio de calificaciones de los estudiantes asignados.</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="metric-card">
                    <h5>Porcentaje de Tareas Completadas</h5>
                    <p class="metric-value">{{ reportData.taskCompletionRate }}%</p>
                    <p class="metric-description">Porcentaje de tareas completadas por los estudiantes.</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="metric-card">
                    <h5>Asistencia del Docente</h5>
                    <p class="metric-value">{{ reportData.attendanceRate }}%</p>
                    <p class="metric-description">Porcentaje de días asistidos en el periodo seleccionado.</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="metric-card">
                    <h5>Feedback</h5>
                    <p class="metric-value">{{ reportData.feedback || 'Sin comentarios' }}</p>
                    <p class="metric-description">Comentarios de padres y estudiantes.</p>
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
          <h3>{{ directorName }}</h3>
          <p>Director</p>
          <p><i class="fas fa-building me-1"></i> Academia Prestige</p>
          <p><i class="fas fa-calendar-alt me-1"></i> Miembro desde: 01/01/2020</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@/assets/teacherPerformanceReports.css';
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'TeacherPerformanceReports',
  components: { Sidebar },
  data() {
    return {
      directorName: 'Dr. Luis Fernández',
      selectedTeacher: '',
      selectedPeriod: 'mensual',
      reportData: null,
      teachers: [
        { id: 1, name: 'Prof. Marta Pérez' },
        { id: 2, name: 'Prof. Juan López' },
        { id: 3, name: 'Prof. Ana Ramírez' },
      ],
      teacherPerformanceData: [
        {
          teacherId: 1,
          period: 'mensual',
          averageGrades: 85,
          taskCompletionRate: 90,
          attendanceRate: 95,
          feedback: 'Excelente compromiso con los estudiantes.',
        },
        {
          teacherId: 1,
          period: 'trimestral',
          averageGrades: 88,
          taskCompletionRate: 92,
          attendanceRate: 93,
          feedback: 'Buen desempeño, pero podría mejorar la puntualidad.',
        },
        {
          teacherId: 1,
          period: 'anual',
          averageGrades: 87,
          taskCompletionRate: 91,
          attendanceRate: 94,
          feedback: 'Muy buen año, los estudiantes han progresado notablemente.',
        },
        {
          teacherId: 2,
          period: 'mensual',
          averageGrades: 78,
          taskCompletionRate: 85,
          attendanceRate: 90,
          feedback: 'Necesita mejorar la interacción con los estudiantes.',
        },
        {
          teacherId: 2,
          period: 'trimestral',
          averageGrades: 80,
          taskCompletionRate: 87,
          attendanceRate: 88,
          feedback: 'Progreso constante, pero hay áreas de mejora.',
        },
        {
          teacherId: 2,
          period: 'anual',
          averageGrades: 79,
          taskCompletionRate: 86,
          attendanceRate: 89,
          feedback: 'Desempeño aceptable, pero podría ser más consistente.',
        },
        {
          teacherId: 3,
          period: 'mensual',
          averageGrades: 92,
          taskCompletionRate: 95,
          attendanceRate: 98,
          feedback: 'Excepcional, muy querida por los estudiantes.',
        },
        {
          teacherId: 3,
          period: 'trimestral',
          averageGrades: 90,
          taskCompletionRate: 94,
          attendanceRate: 97,
          feedback: 'Mantiene un alto nivel de excelencia.',
        },
        {
          teacherId: 3,
          period: 'anual',
          averageGrades: 91,
          taskCompletionRate: 93,
          attendanceRate: 96,
          feedback: 'Modelo a seguir para otros docentes.',
        },
      ],
    };
  },
  computed: {
    selectedTeacherName() {
      const teacher = this.teachers.find(t => t.id === this.selectedTeacher);
      return teacher ? teacher.name : '';
    },
  },
  methods: {
    generateReport() {
      if (!this.selectedTeacher) {
        this.reportData = null;
        return;
      }
      const report = this.teacherPerformanceData.find(
        data => data.teacherId === this.selectedTeacher && data.period === this.selectedPeriod
      );
      this.reportData = report || null;
    },
    downloadReport() {
      if (!this.reportData) return;
      const reportText = `
Reporte de Desempeño Docente
Docente: ${this.selectedTeacherName}
Periodo: ${this.selectedPeriod.charAt(0).toUpperCase() + this.selectedPeriod.slice(1)}

Promedio de Calificaciones: ${this.reportData.averageGrades}/100
Porcentaje de Tareas Completadas: ${this.reportData.taskCompletionRate}%
Asistencia del Docente: ${this.reportData.attendanceRate}%
Feedback: ${this.reportData.feedback || 'Sin comentarios'}
      `;
      const blob = new Blob([reportText], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Reporte_${this.selectedTeacherName}_${this.selectedPeriod}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
  },
};
</script>