<template>
  <div class="wrapper">
  <!--SIDEBAR-->
  <Sidebar />
    <!-- Main Content -->
    <div class="main-content">
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
  </div>
</template>

<script >
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import CalendarComponent from '@/components/CalendarComponent.vue';
import DateDetails from '@/components/DateDetails.vue';
import Sidebar from '@/components/Sidebar.vue';


export default {
  name: 'AcademicCalendar',
  components: { CalendarComponent, DateDetails, Sidebar },
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
