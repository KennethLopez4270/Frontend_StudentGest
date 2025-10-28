<template>
  <div class="register-glass card shadow-lg animate__animated animate__fadeIn mx-auto">
    <h1 class="text-center mb-4 animate__animated animate__fadeInDown">ASIGNAR FUNCIONALIDADES A ROLES</h1>

    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="mb-3">
          <label class="form-label">Seleccionar Rol</label>
          <select v-model="selectedRolId" class="form-control" @change="loadFuncionalidades">
            <option value="" disabled>Selecciona un rol</option>
            <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol">
              {{ rol.nombre }} ({{ rol.descripcion }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="selectedRolId" class="row justify-content-center">
      <div class="col-md-8">
        <h4>Funcionalidades para {{ selectedRolNombre }}</h4>
        <div class="form-check" v-for="func in funcionalidades" :key="func.id_funcionalidad">
          <input
            class="form-check-input"
            type="checkbox"
            :id="`func-${selectedRolId}-${func.id_funcionalidad}`"
            :checked="isFuncionalidadAssigned(selectedRolId, func.id_funcionalidad)"
            @change="toggleFuncionalidad(selectedRolId, func.id_funcionalidad)"
          />
          <label class="form-check-label" :for="`func-${selectedRolId}-${func.id_funcionalidad}`">
            {{ func.nombre }} ({{ func.direccion }})
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GestionRolesFuncionalidadesView',
  data() {
    return {
      selectedRolId: '',
      roles: [
        { id_rol: 1, nombre: 'Padre', descripcion: 'Padre o tutor de estudiantes' },
        { id_rol: 2, nombre: 'Profesor', descripcion: 'Docente de la institución' },
        { id_rol: 3, nombre: 'Director', descripcion: 'Administrador principal' },
        { id_rol: 4, nombre: 'Estudiante', descripcion: 'Estudiante matriculado' },
      ],
      funcionalidades: [
        { id_funcionalidad: 1, nombre: 'Administración de Usuarios', descripcion: 'Gestionar usuarios del sistema', direccion: '/abm-usuarios' },
        { id_funcionalidad: 2, nombre: 'Registro de Asistencia', descripcion: 'Registrar asistencias de estudiantes', direccion: '/control-asistencia' },
        { id_funcionalidad: 3, nombre: 'Consulta de Historial Académico', descripcion: 'Consultar historial académico de estudiantes', direccion: '/historial-academico' },
        { id_funcionalidad: 4, nombre: 'Foro de Discusión', descripcion: 'Participar en foros de discusión', direccion: '/foro' },
        { id_funcionalidad: 5, nombre: 'Justificación de Ausencias', descripcion: 'Justificar ausencias de estudiantes', direccion: '/justificar-ausencias' },
        { id_funcionalidad: 6, nombre: 'Gestión de Reportes', descripcion: 'Generar y consultar reportes', direccion: '/reportes' },
        { id_funcionalidad: 7, nombre: 'Administración de Reportes', descripcion: 'Gestionar reportes administrativos', direccion: '/admin-reports' },
        { id_funcionalidad: 8, nombre: 'Gestión de Tareas', descripcion: 'Administrar tareas docentes', direccion: '/teacher-tasks' },
        { id_funcionalidad: 9, nombre: 'Calendario Académico', descripcion: 'Consultar calendario académico', direccion: '/calendario' },
        { id_funcionalidad: 10, nombre: 'Reportes de Desempeño', descripcion: 'Consultar reportes de desempeño docente', direccion: '/teacher-performance-reports' },
        { id_funcionalidad: 11, nombre: 'Gestión de Eventos', descripcion: 'Crear y gestionar eventos', direccion: '/eventos' },
        { id_funcionalidad: 12, nombre: 'Gestión de Padres', descripcion: 'Administrar información de padres', direccion: '/gestion-padres' },
      ],
      rolFuncionalidades: [
        { id_rol: 3, id_funcionalidad: 1 }, // Director: Administración de Usuarios
        { id_rol: 2, id_funcionalidad: 2 }, // Profesor: Registro de Asistencia
        { id_rol: 4, id_funcionalidad: 4 }, // Estudiante: Foro de Discusión
        { id_rol: 3, id_funcionalidad: 7 }, // Director: Administración de Reportes
      ],
    }
  },
  computed: {
    selectedRolNombre() {
      const rol = this.roles.find(r => r.id_rol === this.selectedRolId)
      return rol ? rol.nombre : ''
    },
  },
  methods: {
    loadFuncionalidades() {
      console.log('Cargando funcionalidades para rol:', this.selectedRolId)
    },
    isFuncionalidadAssigned(id_rol, id_funcionalidad) {
      return this.rolFuncionalidades.some(rf => rf.id_rol === id_rol && rf.id_funcionalidad === id_funcionalidad)
    },
    toggleFuncionalidad(id_rol, id_funcionalidad) {
      const exists = this.rolFuncionalidades.find(rf => rf.id_rol === id_rol && rf.id_funcionalidad === id_funcionalidad)
      if (exists) {
        this.rolFuncionalidades = this.rolFuncionalidades.filter(rf => !(rf.id_rol === id_rol && rf.id_funcionalidad === id_funcionalidad))
        console.log('Funcionalidad desasignada:', { id_rol, id_funcionalidad })
      } else {
        this.rolFuncionalidades.push({ id_rol, id_funcionalidad })
        console.log('Funcionalidad asignada:', { id_rol, id_funcionalidad })
      }
    },
  },
}
</script>

<style scoped>
.register-glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 900px;
  color: #000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
}

.input-group, .form-control {
  background-color: #ffffff9c;
}

h1 {
  font-family: 'Georgia', serif;
  font-weight: bold;
  color: #213547;
  font-size: 30px;
}

.btn-primary {
  background-color: #213547 !important;
  border-color: #213547 !important;
}

.btn-primary:disabled {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}

.form-check {
  margin-bottom: 10px;
}

@media (max-width: 526px) {
  .register-glass {
    padding: 30px 20px;
    max-width: 90%;
  }
  h1 {
    font-size: 24px;
  }
}
</style>