<template>
    <div class="wrapper">
      <!-- Sidebar -->
      <div class="sidebar animate__animated animate__fadeInLeft">
        <div class="logo">Academia</div>
        <router-link to="/" :class="{ active: $route.name === 'Home' }">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
        <router-link to="/control-asistencia" :class="{ active: $route.name === 'ControlAsistencia' }">
          <i class="fas fa-users"></i> Estudiantes
        </router-link>
        <router-link to="/reportes" :class="{ active: $route.name === 'Reportes' }">
          <i class="fas fa-chart-line"></i> Reportes
        </router-link>
        <router-link to="/historial-academico" :class="{ active: $route.name === 'HistorialAcademico' }">
          <i class="fas fa-book"></i> Tareas
        </router-link>
        <router-link to="/calificaciones" :class="{ active: $route.name === 'Calificaciones' }">
          <i class="fas fa-star"></i> Calificaciones
        </router-link>
        <router-link to="/justificar-ausencias" :class="{ active: $route.name === 'JustificarAusencias' }">
          <i class="fas fa-file-alt"></i> Justificar Ausencias
        </router-link>
        <router-link to="/foro" :class="{ active: $route.name === 'Forum' }">
          <i class="fas fa-comments"></i> Foro
        </router-link>
        <router-link to="/admin-reports" :class="{ active: $route.name === 'AdminReports' }">
          <i class="fas fa-file-export"></i> Informes Admin
        </router-link>
        <router-link to="/task-details" :class="{ active: $route.name === 'TaskDetails' }">
          <i class="fas fa-tasks"></i> Detalles de Tareas
        </router-link>
        <router-link to="/teacher-tasks" :class="{ active: $route.name === 'TeacherTasks' }">
          <i class="fas fa-chalkboard-teacher"></i> Gestión de Tareas
        </router-link>
        <router-link to="/teacher-performance-reports" :class="{ active: $route.name === 'TeacherPerformanceReports' }">
          <i class="fas fa-chart-bar"></i> Reportes Docentes
        </router-link>
        <router-link to="/performance-charts" :class="{ active: $route.name === 'PerformanceCharts' }">
          <i class="fas fa-chart-pie"></i> Gráficos de Desempeño
        </router-link>
        <router-link to="/student-progress" :class="{ active: $route.name === 'StudentProgress' }">
          <i class="fas fa-graduation-cap"></i> Progreso Estudiantil
        </router-link>
      </div>
  
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
  
          <!-- Progress Section -->
          <div class="form-section animate__animated animate__fadeInUp">
            <h2>Progreso Académico</h2>
            <p class="text-sm text-gray-600 mb-4">Realiza un seguimiento personalizado del desarrollo académico de tus hijos.</p>
  
            <!-- Filtros -->
            <div class="filters mb-5">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="studentSelect" class="form-label">Seleccionar Estudiante</label>
                  <select
                    id="studentSelect"
                    v-model="selectedStudent"
                    class="form-select shadow-sm"
                    @change="updateProgress"
                  >
                    <option value="" disabled>-- Seleccionar --</option>
                    <option v-for="student in students" :key="student.id" :value="student.id">
                      {{ student.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="periodSelect" class="form-label">Periodo</label>
                  <select
                    id="periodSelect"
                    v-model="selectedPeriod"
                    class="form-select shadow-sm"
                    @change="updateProgress"
                  >
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>
            </div>
  
            <!-- Progress Details -->
            <div class="progress-section">
              <div v-if="!selectedStudent" class="no-selection text-center text-gray-600">
                Selecciona un estudiante para ver su progreso académico.
              </div>
              <div v-else-if="!progressData" class="no-data text-center text-gray-600">
                No hay datos disponibles para este periodo.
              </div>
              <div v-else class="progress-card">
                <h3 class="mb-4">Progreso de {{ selectedStudentName }}</h3>
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="metric-card">
                      <h5>Promedio de Calificaciones</h5>
                      <p class="metric-value">{{ progressData.averageGrades }} / 100</p>
                      <p class="metric-description">Promedio de todas las materias en el periodo seleccionado.</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="metric-card">
                      <h5>Asistencia</h5>
                      <p class="metric-value">{{ progressData.attendance }}%</p>
                      <p class="metric-description">Porcentaje de días asistidos en el periodo seleccionado.</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="metric-card">
                      <h5>Tareas Completadas</h5>
                      <p class="metric-value">{{ progressData.tasksCompleted }}%</p>
                      <p class="metric-description">Porcentaje de tareas completadas en el periodo seleccionado.</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="metric-card">
                      <h5>Comentarios del Profesor</h5>
                      <p class="metric-value">{{ progressData.teacherComments || 'Sin comentarios' }}</p>
                      <p class="metric-description">Observaciones del profesor sobre el desempeño del estudiante.</p>
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
  import '@/assets/studentProgress.css';
  
  export default {
    name: 'StudentProgress',
    data() {
      return {
        parentName: 'María González',
        selectedStudent: '',
        selectedPeriod: 'mensual',
        students: [
          { id: 1, name: 'Ana González' },
          { id: 2, name: 'Carlos González' },
          { id: 3, name: 'Lucía González' },
        ],
        progressData: null,
        academicData: [
          {
            studentId: 1,
            period: 'mensual',
            averageGrades: 85,
            attendance: 95,
            tasksCompleted: 90,
            teacherComments: 'Ana está mostrando un gran esfuerzo en matemáticas, pero podría mejorar en ciencias.',
          },
          {
            studentId: 1,
            period: 'trimestral',
            averageGrades: 88,
            attendance: 93,
            tasksCompleted: 92,
            teacherComments: 'Buen progreso en todas las materias, especialmente en lengua.',
          },
          {
            studentId: 1,
            period: 'anual',
            averageGrades: 87,
            attendance: 94,
            tasksCompleted: 91,
            teacherComments: 'Ana ha tenido un año sólido, con mejoras constantes.',
          },
          {
            studentId: 2,
            period: 'mensual',
            averageGrades: 78,
            attendance: 85,
            tasksCompleted: 80,
            teacherComments: 'Carlos necesita enfocarse más en sus tareas de historia.',
          },
          {
            studentId: 2,
            period: 'trimestral',
            averageGrades: 80,
            attendance: 88,
            tasksCompleted: 82,
            teacherComments: 'Carlos está mejorando, pero su asistencia sigue siendo un área de preocupación.',
          },
          {
            studentId: 2,
            period: 'anual',
            averageGrades: 79,
            attendance: 89,
            tasksCompleted: 83,
            teacherComments: 'Carlos ha mostrado mejoras, pero debe trabajar en su consistencia.',
          },
          {
            studentId: 3,
            period: 'mensual',
            averageGrades: 92,
            attendance: 98,
            tasksCompleted: 95,
            teacherComments: 'Lucía es una estudiante ejemplar, siempre participativa.',
          },
          {
            studentId: 3,
            period: 'trimestral',
            averageGrades: 90,
            attendance: 97,
            tasksCompleted: 94,
            teacherComments: 'Lucía mantiene un desempeño excepcional en todas las áreas.',
          },
          {
            studentId: 3,
            period: 'anual',
            averageGrades: 91,
            attendance: 96,
            tasksCompleted: 93,
            teacherComments: 'Lucía ha tenido un año excelente, es un placer tenerla en clase.',
          },
        ],
      };
    },
    computed: {
      selectedStudentName() {
        const student = this.students.find(s => s.id === this.selectedStudent);
        return student ? student.name : '';
      },
    },
    methods: {
      updateProgress() {
        if (!this.selectedStudent) {
          this.progressData = null;
          return;
        }
        const progress = this.academicData.find(
          data => data.studentId === this.selectedStudent && data.period === this.selectedPeriod
        );
        this.progressData = progress || null;
      },
    },
  };
  </script>