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
        <router-link to="/justificar-ausencias" :class="{ active: $route.name === 'JustificarAusencias' }">
          <i class="fas fa-file-alt"></i> Justificar Ausencias
        </router-link>
      </div>
  
      <!-- Main Content -->
      <div class="main-content">
        <div class="left-section">
          <!-- Header -->
          <div class="header animate__animated animate__fadeInDown">
            <h1 class="animate__animated animate__pulse animate__infinite animate__slow">Bienvenido {{ usuario.nombre }} {{ usuario.apellido_paterno }}</h1>
            <a href="#" class="btn btn-lg">Exportar Reporte</a>
          </div>
  
          <!-- Reportes Section -->
          <div class="form-section animate__animated animate__fadeInUp">
            <h2>Informe Académico y de Asistencia</h2>
            <p class="text-sm text-gray-600 mb-4">Rol: <strong>{{ usuario.rol.toUpperCase() }}</strong></p>
  
            <!-- Selector de Estudiante -->
            <div class="row g-3 mb-6 justify-content-center">
              <div class="col-md-6">
                <label for="studentSelect" class="form-label">Seleccionar Estudiante</label>
                <select id="studentSelect" v-model="selectedStudent" class="form-select form-select-lg shadow-sm" @change="onStudentChange">
                  <option value="" disabled>-- Seleccionar --</option>
                  <option v-for="est in estudiantes" :key="est.id_estudiante" :value="est">
                    {{ est.usuario.nombre }} {{ est.usuario.apellido_paterno }}
                  </option>
                </select>
              </div>
            </div>
  
            <!-- Selección de Tipo de Reporte -->
            <div class="mb-6 d-flex justify-content-center flex-wrap gap-4 animate__animated animate__zoomIn">
              <div class="form-check form-check-inline custom-radio">
                <input type="radio" id="asistencias" value="asistencias" v-model="reportType" class="form-check-input" />
                <label for="asistencias" class="form-check-label">Asistencias</label>
              </div>
              <div class="form-check form-check-inline custom-radio">
                <input type="radio" id="calificaciones" value="calificaciones" v-model="reportType" class="form-check-input" />
                <label for="calificaciones" class="form-check-label">Calificaciones</label>
              </div>
              <div class="form-check form-check-inline custom-radio">
                <input type="radio" id="tareas" value="tareas" v-model="reportType" class="form-check-input" />
                <label for="tareas" class="form-check-label">Tareas</label>
              </div>
              <div class="form-check form-check-inline custom-radio">
                <input type="radio" id="justificaciones" value="justificaciones" v-model="reportType" class="form-check-input" />
                <label for="justificaciones" class="form-check-label">Justificaciones</label>
              </div>
            </div>
  
            <!-- Tablas de Reportes -->
            <div v-if="selectedStudent && reportType" class="history-table animate__animated animate__fadeIn">
              <h3 class="text-center text-lg font-semibold mb-2 capitalize animate__animated animate__bounceIn">
                Informe de {{ reportType }}
              </h3>
              <p class="text-sm text-gray-600 mb-4 text-center">
                Estudiante: <strong>{{ selectedStudent.usuario.nombre }} {{ selectedStudent.usuario.apellido_paterno }}</strong><br/>
                Fecha de Generación: <strong>{{ hoy }}</strong>
              </p>
  
              <!-- Asistencias -->
              <table v-if="reportType === 'asistencias'" class="table table-modern table-hover">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Excusa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="a in informes.asistencias" :key="a.id_asistencia" class="history-row animate__animated animate__fadeInUp">
                    <td>{{ a.fecha }}</td>
                    <td><span class="type-badge" :class="tipoClase(a.tipo)">{{ a.tipo }}</span></td>
                    <td>{{ a.excusa || '-' }}</td>
                  </tr>
                </tbody>
              </table>
  
              <!-- Calificaciones -->
              <table v-if="reportType === 'calificaciones'" class="table table-modern table-hover">
                <thead>
                  <tr>
                    <th>Materia</th>
                    <th>Calificación</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="c in informes.calificaciones" :key="c.id_calificacion" class="history-row animate__animated animate__fadeInUp">
                    <td>{{ c.materia.nombre }}</td>
                    <td><span class="type-badge grade-badge">{{ c.calificacion }}</span></td>
                    <td>{{ c.fecha_asignacion }}</td>
                  </tr>
                </tbody>
              </table>
  
              <!-- Tareas -->
              <table v-if="reportType === 'tareas'" class="table table-modern table-hover">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Fecha Entrega</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in informes.tareas" :key="t.id_tarea" class="history-row animate__animated animate__fadeInUp">
                    <td>{{ t.titulo }}</td>
                    <td><span class="type-badge" :class="estadoClase(t.estado)">{{ t.estado }}</span></td>
                    <td>{{ t.fecha_entrega }}</td>
                  </tr>
                </tbody>
              </table>
  
              <!-- Justificaciones -->
              <table v-if="reportType === 'justificaciones'" class="table table-modern table-hover">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="j in informes.justificaciones" :key="j.id" class="history-row animate__animated animate__fadeInUp">
                    <td>{{ j.fecha }}</td>
                    <td>{{ j.motivo }}</td>
                    <td><span class="type-badge" :class="estadoClase(j.estado)">{{ j.estado }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <!-- Right Section -->
        <div class="right-section">
          <div class="profile-card animate__animated animate__fadeInRight">
            <img src="https://i.pinimg.com/736x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg" alt="Profile" class="shadow-lg" />
            <h3>{{ usuario.nombre }} {{ usuario.apellido_paterno }}</h3>
            <p>{{ usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) }}</p>
            <p><i class="fas fa-building me-1"></i> Academia Prestige</p>
            <p><i class="fas fa-calendar-alt me-1"></i> Miembro desde: 01/01/2023</p>
            <p><i class="fas fa-users me-1"></i> {{ estudiantes.length }} Estudiantes</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import 'animate.css';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import '@/assets/reportesA.css';
  
  export default {
    name: 'Reportes',
    data() {
      return {
        usuario: {
          nombre: 'Juan',
          apellido_paterno: 'Gómez',
          rol: 'tutor',
          id: 1
        },
        estudiantes: [
          { id_estudiante: 1, usuario: { nombre: 'Ana', apellido_paterno: 'López' } },
          { id_estudiante: 2, usuario: { nombre: 'Carlos', apellido_paterno: 'Mendoza' } }
        ],
        selectedStudent: '', // Inicializado como string vacío para que coincida con la opción por defecto
        reportType: '',
        hoy: new Date().toISOString().slice(0, 10),
        informes: {
          asistencias: [
            { id_asistencia: 1, fecha: '2025-03-01', tipo: 'falta', excusa: 'Enfermedad' },
            { id_asistencia: 2, fecha: '2025-03-03', tipo: 'presente', excusa: null }
          ],
          calificaciones: [
            { id_calificacion: 1, materia: { nombre: 'Matemáticas' }, calificacion: 85, fecha_asignacion: '2025-03-04' },
            { id_calificacion: 2, materia: { nombre: 'Historia' }, calificacion: 90, fecha_asignacion: '2025-03-05' }
          ],
          tareas: [
            { id_tarea: 1, titulo: 'Ensayo de Literatura', estado: 'entregado', fecha_entrega: '2025-03-06' },
            { id_tarea: 2, titulo: 'Ejercicios de Álgebra', estado: 'pendiente', fecha_entrega: '2025-03-08' }
          ],
          justificaciones: [
            { id: 1, fecha: '2025-03-01', motivo: 'Consulta médica', estado: 'aprobado' },
            { id: 2, fecha: '2025-03-03', motivo: 'Familiar enfermo', estado: 'pendiente' }
          ]
        }
      };
    },
    methods: {
      tipoClase(tipo) {
        return {
          presente: 'presente-badge',
          falta: 'ausente-badge',
          tardanza: 'tardanza-badge'
        }[tipo] || '';
      },
      estadoClase(estado) {
        return {
          entregado: 'presente-badge',
          pendiente: 'tardanza-badge',
          aprobado: 'presente-badge',
          rechazado: 'ausente-badge'
        }[estado] || '';
      },
      onStudentChange() {
        console.log('Estudiante seleccionado:', this.selectedStudent);
      }
    }
  };
  </script>