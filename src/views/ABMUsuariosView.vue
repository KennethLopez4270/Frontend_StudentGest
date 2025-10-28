```vue
<template>
  <div class="register-glass card shadow-lg animate__animated animate__fadeIn mx-auto">
    <h1 class="text-center mb-4 animate__animated animate__fadeInDown">GESTIÓN DE USUARIOS</h1>

    <!-- Filtros -->
    <div class="row mb-3 justify-content-center">
      <div class="col-md-3 col-sm-6 mb-2">
        <input v-model="filterNombre" class="form-control" placeholder="Filtrar por nombre" @input="filterUsers" />
      </div>
      <div class="col-md-3 col-sm-6 mb-2">
        <input v-model="filterEmail" class="form-control" placeholder="Filtrar por correo" @input="filterUsers" />
      </div>
      <div class="col-md-3 col-sm-6 mb-2">
        <select v-model="filterActivo" class="form-control" @change="filterUsers">
          <option value="">Todos (Activo)</option>
          <option value="true">Activado</option>
          <option value="false">Desactivado</option>
        </select>
      </div>
      <div class="col-md-3 col-sm-6 mb-2">
        <select v-model="filterEstado" class="form-control" @change="filterUsers">
          <option value="">Todos (Estado)</option>
          <option value="APROBADO">Aprobado</option>
          <option value="PENDIENTE">Pendiente</option>
        </select>
      </div>
    </div>

    <!-- Tabla de Usuarios -->
    <div class="table-responsive">
      <table class="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id_usuario">
            <td>{{ user.id_usuario }}</td>
            <td>{{ user.nombre }}</td>
            <td>{{ user.apellido_paterno }} {{ user.apellido_materno }}</td>
            <td>{{ user.email }}</td>
            <td>{{ getRolNombre(user.id_rol) }}</td>
            <td>{{ user.activo ? 'Sí' : 'No' }}</td>
            <td>{{ user.estado }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="editUser(user)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="deleteUser(user.id_usuario)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formulario de Edición -->
    <div v-if="editingUser" class="mt-4">
      <h4>Editar Usuario</h4>
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">ID</label>
            <input v-model="editingUser.id_usuario" type="text" class="form-control" disabled />
          </div>
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input v-model="editingUser.nombre" type="text" class="form-control" placeholder="Nombre(s)" required maxlength="100" />
          </div>
          <div class="mb-3 row">
            <div class="col">
              <label class="form-label">Apellido Paterno</label>
              <input v-model="editingUser.apellido_paterno" type="text" class="form-control" placeholder="Apellido Paterno" required maxlength="100" />
            </div>
            <div class="col">
              <label class="form-label">Apellido Materno</label>
              <input v-model="editingUser.apellido_materno" type="text" class="form-control" placeholder="Apellido Materno" required maxlength="100" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Correo Electrónico</label>
            <input v-model="editingUser.email" type="email" class="form-control" placeholder="Correo electrónico" disabled />
          </div>
          <div class="mb-3">
            <label class="form-label">Rol</label>
            <select v-model="editingUser.id_rol" class="form-control" required>
              <option disabled value="">Seleccionar rol</option>
              <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol">{{ rol.nombre }}</option>
            </select>
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input v-model="editingUser.activo" type="checkbox" class="form-check-input" id="activo" />
              <label class="form-check-label" for="activo">Activo</label>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Estado</label>
            <select v-model="editingUser.estado" class="form-control" required>
              <option value="APROBADO">Aprobado</option>
              <option value="PENDIENTE">Pendiente</option>
            </select>
          </div>
          <button class="btn btn-primary" @click="submitEditUser">Guardar Cambios</button>
          <button class="btn btn-secondary ms-2" @click="editingUser = null">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ABMUsuariosView',
  data() {
    return {
      filterNombre: '',
      filterEmail: '',
      filterActivo: '',
      filterEstado: '',
      editingUser: null,
      users: [
        { id_usuario: 1, nombre: 'Kenneth', apellido_paterno: 'García', apellido_materno: 'López', email: 'kenneth.garcia.fbc@gmail.com', id_rol: 1, activo: true, estado: 'APROBADO' },
        { id_usuario: 2, nombre: 'Ronald', apellido_paterno: 'Bolívar', apellido_materno: 'Suárez', email: 'ronald.bolivar.fbc@gmail.com', id_rol: 2, activo: true, estado: 'APROBADO' },
        { id_usuario: 3, nombre: 'Alejandro', apellido_paterno: 'Vargas', apellido_materno: 'Mendoza', email: 'alejandro.vargas.fbc@gmail.com', id_rol: 3, activo: false, estado: 'PENDIENTE' },
        { id_usuario: 4, nombre: 'María', apellido_paterno: 'Pérez', apellido_materno: 'Ramírez', email: 'maria.perez.fbc@gmail.com', id_rol: 4, activo: true, estado: 'PENDIENTE' },
      ],
      filteredUsers: [],
      roles: [
        { id_rol: 1, nombre: 'Padre', descripcion: 'Padre o tutor de estudiantes' },
        { id_rol: 2, nombre: 'Profesor', descripcion: 'Docente de la institución' },
        { id_rol: 3, nombre: 'Director', descripcion: 'Administrador principal' },
        { id_rol: 4, nombre: 'Estudiante', descripcion: 'Estudiante matriculado' },
      ],
    }
  },
  computed: {
    getRolNombre() {
      return (id_rol) => {
        const rol = this.roles.find(r => r.id_rol === id_rol)
        return rol ? rol.nombre : 'Sin rol'
      }
    },
  },
  methods: {
    filterUsers() {
      this.filteredUsers = this.users.filter(user =>
        user.nombre.toLowerCase().includes(this.filterNombre.toLowerCase()) &&
        user.email.toLowerCase().includes(this.filterEmail.toLowerCase()) &&
        (this.filterActivo === '' || user.activo.toString() === this.filterActivo) &&
        (this.filterEstado === '' || user.estado === this.filterEstado)
      )
    },
    editUser(user) {
      this.editingUser = { ...user }
    },
    submitEditUser() {
      console.log('Guardando usuario:', this.editingUser)
      this.editingUser = null
    },
    deleteUser(id_usuario) {
      if (confirm('¿Seguro que quieres eliminar este usuario?')) {
        console.log('Eliminando usuario:', id_usuario)
      }
    },
  },
  mounted() {
    this.filteredUsers = this.users
    this.filterUsers()
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
  max-width: 1000px; /* Ajustado para evitar desborde */
  color: #000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 20px auto; /* Centrado horizontalmente */
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

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  max-width: 100%;
  margin: 0 auto; /* Centrado dentro del contenedor */
}

@media (max-width: 768px) {
  .register-glass {
    padding: 20px;
    max-width: 90%;
  }
  h1 {
    font-size: 24px;
  }
  .table {
    font-size: 14px;
  }
  .btn-sm {
    font-size: 12px;
    padding: 4px 8px;
  }
}
</style>