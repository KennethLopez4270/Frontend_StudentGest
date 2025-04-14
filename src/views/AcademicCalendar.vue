<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <div class="sidebar animate__animated animate__fadeInLeft">
      <div class="logo">Academia</div>
      <!-- Tus router-links existentes -->
      <!-- ... (los enlaces siguen igual, sin cambios) ... -->
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
      currentYear: hoy.getFullYear(),
      currentMonth: hoy.getMonth(),
      selectedDate: fechaStr,
      eventos: [],
      eventosDelDia: [],
      mensaje: '',
    };
  },
  mounted() {
    this.cargarEventos();
  },
  methods: {
    updateMonth(newMonth) {
      this.currentMonth = newMonth;
    },
    updateYear(newYear) {
      this.currentYear = newYear;
    },
    async cargarEventos() {
      try {
        const response = await fetch('http://localhost:8080/api/calendario/eventos');
        if (!response.ok) throw new Error('Error al obtener eventos');
        const data = await response.json();
        this.eventos = data;
        this.mostrarEventosDelDia(this.selectedDate);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        this.mensaje = 'Error al cargar los eventos. Intenta más tarde.';
      }
    },
    mostrarEventosDelDia(fecha) {
      this.selectedDate = fecha;
      const eventos = this.eventos.filter(e => fecha >= e.fechaInicio && fecha <= e.fechaFin);
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