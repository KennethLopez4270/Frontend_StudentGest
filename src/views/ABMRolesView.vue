<template>
  <div class="register-glass card shadow-lg animate__animated animate__fadeIn">
    <h1 class="text-center mb-4 animate__animated animate__fadeInDown">GESTIÓN DE ROLES</h1>

    <div class="row">
      <div class="col-md-6">
        <form @submit.prevent="submitRol">
          <div class="mb-3">
            <label class="form-label">Nombre del Rol</label>
            <input v-model="newRol.nombre" type="text" class="form-control" placeholder="Nombre del rol" required maxlength="50" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <input v-model="newRol.descripcion" type="text" class="form-control" placeholder="Descripción del rol" required maxlength="200" />
          </div>
          <button type="submit" class="btn btn-primary">Crear Rol</button>
        </form>
      </div>
    </div>

    <table class="table table-bordered table-hover mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rol in roles" :key="rol.id_rol">
          <td>{{ rol.id_rol }}</td>
          <td>{{ rol.nombre }}</td>
          <td>{{ rol.descripcion }}</td>
          <td>
            <button class="btn btn-sm btn-danger" @click="deleteRol(rol.id_rol)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ABMRolesView',
  data() {
    return {
      newRol: { nombre: '', descripcion: '' },
      roles: [
        { id_rol: 1, nombre: 'Padre', descripcion: 'Padre o tutor de estudiantes' },
        { id_rol: 2, nombre: 'Profesor', descripcion: 'Docente de la institución' },
        { id_rol: 3, nombre: 'Director', descripcion: 'Administrador principal' },
        { id_rol: 4, nombre: 'Estudiante', descripcion: 'Estudiante matriculado' },
      ],
    }
  },
  methods: {
    submitRol() {
      const newId = this.roles.length + 1
      this.roles.push({ id_rol: newId, nombre: this.newRol.nombre, descripcion: this.newRol.descripcion })
      this.newRol = { nombre: '', descripcion: '' }
      console.log('Rol creado:', this.roles)
    },
    deleteRol(id_rol) {
      if (confirm('¿Seguro que quieres eliminar este rol?')) {
        this.roles = this.roles.filter(r => r.id_rol !== id_rol)
        console.log('Rol eliminado:', id_rol)
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