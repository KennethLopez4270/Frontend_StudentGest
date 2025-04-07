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
        <router-link to="/calendario" :class="{ active: $route.name === 'Calendario' }">
          <i class="fas fa-calendar-alt"></i> Calendario
        </router-link>
      </div>
  
      <!-- Main Content -->
      <div class="main-content">
        <div class="left-section">
          <!-- Header -->
          <div class="header animate__animated animate__fadeInDown">
            <h1>Justificar Ausencias</h1>
            <a href="#" class="btn">Ver Historial Completo</a>
          </div>
  
          <!-- Selector de hijo -->
          <div class="form-section animate__animated animate__fadeInUp">
            <h2>Selecciona un Hijo</h2>
            <div class="row g-3 justify-content-center">
              <div class="col-md-6">
                <label for="hijoSelect" class="form-label">Hijo</label>
                <select id="hijoSelect" v-model="hijoSeleccionado" class="form-select">
                  <option disabled value="">-- Seleccionar --</option>
                  <option v-for="hijo in hijos" :key="hijo.id" :value="hijo">
                    {{ hijo.nombre }} {{ hijo.apellido }}
                  </option>
                </select>
              </div>
            </div>
          </div>
  
          <!-- Tabla de Asistencias -->
          <div v-if="hijoSeleccionado" class="history-table animate__animated animate__fadeIn">
            <table class="table table-modern">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Justificación</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(asistencia, index) in asistencias" :key="index" class="history-row">
                  <td>{{ asistencia.fecha }}</td>
                  <td>
                    <span :class="estadoClase(asistencia.estado)" class="type-badge">
                      {{ asistencia.estado }}
                    </span>
                  </td>
                  <td>
                    <div v-if="asistencia.estado !== 'presente'">
                      <div v-if="asistencia.justificacion">
                        <span class="justification-text">{{ asistencia.justificacion }}</span>
                        <button class="btn-edit" @click="editarJustificacion(index)">Editar</button>
                      </div>
                      <div v-else>
                        <button class="btn-justify" @click="justificar(index)">Justificar</button>
                      </div>
                    </div>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <!-- Right Section (Opcional, por coherencia con el estilo) -->
        <div class="right-section">
          <div class="profile-card animate__animated animate__fadeInUp">
            <img src="https://i.pinimg.com/736x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg" alt="Profile" />
            <h3>Padre/Madre</h3>
            <p>Usuario de la Plataforma</p>
            <p><i class="fas fa-building me-1"></i> Academia Prestige</p>
            <p><i class="fas fa-calendar-alt me-1"></i> Miembro desde: 01/01/2023</p>
            <p><i class="fas fa-users me-1"></i> {{ hijos.length }} Hijos</p>
          </div>
        </div>
      </div>
  
      <!-- Modal -->
      <div v-if="mostrarModal" class="modal fade show" style="display: block;" @click.self="cerrarModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-lg">
            <div class="modal-header">
              <h5 class="modal-title">{{ modoEdicion ? 'Editar' : 'Justificar' }} Ausencia - {{ asistenciaSeleccionada.fecha }}</h5>
              <button type="button" class="btn-close" @click="cerrarModal"></button>
            </div>
            <div class="modal-body">
              <label class="form-label">Justificación:</label>
              <textarea v-model="justificacionTexto" rows="4" class="form-control" placeholder="Escribe la justificación aquí"></textarea>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
              <button class="btn btn-primary" @click="guardarJustificacion">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import 'animate.css';
  import '@/assets/justificarA.css';
  
  export default {
    name: 'JustificarAusencias',
    data() {
      return {
        hijos: [
          { id: 1, nombre: 'Pedro', apellido: 'Pérez' },
          { id: 2, nombre: 'Lucía', apellido: 'Pérez' },
        ],
        hijoSeleccionado: '',
        asistencias: [
          { fecha: '2025-04-01', estado: 'ausente', justificacion: null },
          { fecha: '2025-04-02', estado: 'presente', justificacion: null },
          { fecha: '2025-04-03', estado: 'tardanza', justificacion: 'Llegamos tarde por tráfico' },
        ],
        mostrarModal: false,
        justificacionTexto: '',
        asistenciaSeleccionada: {},
        indexSeleccionado: null,
        modoEdicion: false
      };
    },
    methods: {
      justificar(index) {
        this.modoEdicion = false;
        this.asistenciaSeleccionada = { ...this.asistencias[index] };
        this.indexSeleccionado = index;
        this.justificacionTexto = '';
        this.mostrarModal = true;
      },
      editarJustificacion(index) {
        this.modoEdicion = true;
        this.asistenciaSeleccionada = { ...this.asistencias[index] };
        this.indexSeleccionado = index;
        this.justificacionTexto = this.asistenciaSeleccionada.justificacion;
        this.mostrarModal = true;
      },
      guardarJustificacion() {
        if (this.indexSeleccionado !== null) {
          this.asistencias[this.indexSeleccionado].justificacion = this.justificacionTexto;
        }
        this.cerrarModal();
      },
      cerrarModal() {
        this.mostrarModal = false;
        this.justificacionTexto = '';
      },
      estadoClase(estado) {
        return {
          presente: 'presente-badge',
          ausente: 'ausente-badge',
          tardanza: 'tardanza-badge'
        }[estado] || '';
      }
    }
  };
  </script>