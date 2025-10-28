<template>
  <div class="register-glass card shadow-lg animate__animated animate__fadeIn">
    <h1 class="text-center mb-4 animate__animated animate__fadeInDown">GESTIÓN DE FUNCIONALIDADES</h1>

    <div class="row">
      <div class="col-md-6">
        <form @submit.prevent="submitFuncionalidad">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input v-model="newFuncionalidad.nombre" type="text" class="form-control" placeholder="Nombre" required maxlength="50" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <input v-model="newFuncionalidad.descripcion" type="text" class="form-control" placeholder="Descripción" required maxlength="200" />
          </div>
          <div class="mb-3">
            <label class="form-label">Ruta</label>
            <input v-model="newFuncionalidad.direccion" type="text" class="form-control" placeholder="Ruta (ej. /dashboard)" required maxlength="100" />
          </div>
          <button type="submit" class="btn btn-primary">Crear Funcionalidad</button>
        </form>
      </div>
    </div>

    <table class="table table-bordered table-hover mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Ruta</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="func in funcionalidades" :key="func.id_funcionalidad">
          <td>{{ func.id_funcionalidad }}</td>
          <td>{{ func.nombre }}</td>
          <td>{{ func.descripcion }}</td>
          <td>{{ func.direccion }}</td>
          <td>
            <button class="btn btn-sm btn-danger" @click="deleteFuncionalidad(func.id_funcionalidad)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ABMFuncionalidadesView',
  data() {
    return {
      newFuncionalidad: { nombre: '', descripcion: '', direccion: '' },
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
    }
  },
  methods: {
    submitFuncionalidad() {
      const newId = this.funcionalidades.length + 1
      this.funcionalidades.push({
        id_funcionalidad: newId,
        nombre: this.newFuncionalidad.nombre,
        descripcion: this.newFuncionalidad.descripcion,
        direccion: this.newFuncionalidad.direccion
      })
      this.newFuncionalidad = { nombre: '', descripcion: '', direccion: '' }
      console.log('Funcionalidad creada:', this.funcionalidades)
    },
    deleteFuncionalidad(id_funcionalidad) {
      if (confirm('¿Seguro que quieres eliminar esta funcionalidad?')) {
        this.funcionalidades = this.funcionalidades.filter(f => f.id_funcionalidad !== id_funcionalidad)
        console.log('Funcionalidad eliminada:', id_funcionalidad)
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