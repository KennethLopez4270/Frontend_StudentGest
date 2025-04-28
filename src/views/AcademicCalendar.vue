<template>
  <div class="dashboard-layout">
    <!-- Columna izquierda: Sidebar -->
    <div class="sidebar-column">
      
    </div>

    <!-- Columna derecha: Contenido principal -->
    <div class="content-column">
      <Sidebar />
      <div class="content">
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

<script setup>
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ref, onMounted } from 'vue';
import CalendarComponent from '@/components/CalendarComponent.vue';
import DateDetails from '@/components/DateDetails.vue';
import Sidebar from '@/components/Sidebar.vue';

const parentName = 'María González';

const students = ref([
  { id: 1, name: 'Ana González', grade: '5° Primaria', section: 'Sección A' },
  { id: 2, name: 'Carlos González', grade: '2° Secundaria', section: 'Sección B' },
  { id: 3, name: 'Lucía González', grade: '3° Primaria', section: 'Sección C' },
]);

const hoy = new Date();
const fechaStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

const currentYear = ref(hoy.getFullYear());
const currentMonth = ref(hoy.getMonth());
const selectedDate = ref(fechaStr);

const eventos = ref([]);
const eventosDelDia = ref([]);
const mensaje = ref('');

async function cargarEventos() {
  try {
    const response = await fetch('http://localhost:8080/api/calendario/eventos');
    const data = await response.json();
    // Mapeamos para que todo trabaje con la misma estructura que esperas
    eventos.value = data.map(e => ({
      id: e.id,
      date: e.fechaInicio, // usamos fechaInicio
      titulo: e.titulo,
      descripcion: e.descripcion,
      tipo: 'evento', // Puedes adaptar esto si quieres manejar tipos (evento, evaluación, etc.)
      rolDestinatario: e.rolDestinatario,
    }));
  } catch (error) {
    console.error('Error cargando eventos:', error);
  }
}

function updateMonth(newMonth) {
  currentMonth.value = newMonth;
}

function updateYear(newYear) {
  currentYear.value = newYear;
}

function mostrarEventosDelDia(fecha) {
  selectedDate.value = fecha;
  const eventosFiltrados = eventos.value.filter(e => e.date === fecha);
  
  const hoy = new Date();
  const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

  eventosDelDia.value = eventosFiltrados;
  mensaje.value = eventosFiltrados.length
    ? ''
    : fecha === hoyStr
    ? 'No hay actividades hoy'
    : `No hay actividades para el ${fecha.split('-').reverse().join('/')}`;
}

onMounted(async () => {
  await cargarEventos();
  mostrarEventosDelDia(selectedDate.value);
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
}

/* Sidebar */
.sidebar-column {
  width: 240px;
  background-color: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

/* Contenido */
.content-column {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0 0 10px;
}

.content {
  padding: 10px;
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column; /* Ya no lado a lado, sino arriba/abajo */
  }

  .sidebar-column {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    display: none; /* oculto el sidebar estático, ahora depende del burger */
  }

  .content-column {
    width: 100%;
    padding: 10px;
  }
}
</style>