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
      <router-link to="/calendario" :class="{ active: $route.name === 'AcademicCalendar' }">
        <i class="fas fa-calendar-alt"></i> Calendario
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

        <!-- Calendar Section -->
        <div class="form-section animate__animated animate__fadeInUp">
          <h2>Calendario Académico</h2>
          <p class="text-sm text-gray-600 mb-4">Consulta las fechas clave para organizarte mejor.</p>
          <div class="calendar-app">
            <CalendarComponent
              :events="eventos"
              :current-year="currentYear"
              :current-month="currentMonth"
              :selected-date="selectedDate"
              @update:month="updateMonth"
              @update:year="updateYear"
              @select-date="mostrarEventosDelDia"
            />
            <DateDetails :eventos="eventosDelDia" :mensaje="mensaje" />
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
import CalendarComponent from '@/components/CalendarComponent.vue';
import DateDetails from '@/components/DateDetails.vue';
import '@/assets/calendario.css';

export default {
  name: 'AcademicCalendar',
  components: { CalendarComponent, DateDetails },
  data() {
    const hoy = new Date();
    const fechaStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    return {
      parentName: 'María González',
      students: [
        { id: 1, name: 'Ana González', grade: '5° Primaria', section: 'Sección A' },
        { id: 2, name: 'Carlos González', grade: '2° Secundaria', section: 'Sección B' },
        { id: 3, name: 'Lucía González', grade: '3° Primaria', section: 'Sección C' },
      ],
      currentYear: hoy.getFullYear(),
      currentMonth: hoy.getMonth(),
      selectedDate: fechaStr,
      eventos: [
        { id: 1, date: '2025-04-16', titulo: 'Exámenes 2do Parcial', descripcion: 'Matemáticas', tipo: 'evaluación' },
        { id: 2, date: '2025-04-16', titulo: 'Exámenes 2do Parcial', descripcion: 'Matemáticas', tipo: 'evaluación' },
        { id: 3, date: '2025-04-17', titulo: 'Exámenes 2do Parcial', descripcion: 'Lenguaje', tipo: 'evaluación' },
        { id: 4, date: '2025-04-21', titulo: 'Taller Creativo', descripcion: 'Actividad recreativa', tipo: 'evento' },
        { id: 5, date: '2025-05-17', titulo: 'Exámenes 2do Parcial', descripcion: 'Lenguaje', tipo: 'evaluación' },
        { id: 6, date: '2025-05-21', titulo: 'Taller Padres', descripcion: 'Actividad recreativa', tipo: 'evento' },
      ],
      eventosDelDia: [],
      mensaje: '',
    };
  },
  mounted() {
    this.mostrarEventosDelDia(this.selectedDate);
  },
  methods: {
    updateMonth(newMonth) {
      this.currentMonth = newMonth;
    },
    updateYear(newYear) {
      this.currentYear = newYear;
    },
    mostrarEventosDelDia(fecha) {
      this.selectedDate = fecha;
      const eventos = this.eventos.filter(e => e.date === fecha);
      const hoy = new Date();
      const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

      this.eventosDelDia = eventos;
      this.mensaje = eventos.length
        ? ''
        : fecha === hoyStr
        ? 'No hay actividades hoy'
        : `No hay actividades para el ${fecha.split('-').reverse().join('/')}`;
    },
  },
};
</script>
