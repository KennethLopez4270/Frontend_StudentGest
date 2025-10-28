<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <div class="main-content">
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
              <option value="RECHAZADO">Rechazado</option>
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
                <td>{{ user.rol || 'Sin rol' }}</td>
                <td>{{ user.activo ? 'Sí' : 'No' }}</td>
                <td>{{ user.estado }}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-2" @click="editUser(user)">Editar</button>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(user.id_usuario)">Eliminar</button>
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
                  <option value="RECHAZADO">Rechazado</option>
                </select>
              </div>
              <button class="btn btn-primary" @click="submitEditUser">Guardar Cambios</button>
              <button class="btn btn-secondary ms-2" @click="editingUser = null">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="showDeleteModal" class="modal-backdrop show"></div>
    <div v-if="showDeleteModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button @click="showDeleteModal = false" class="btn-close"></button>
          </div>
          <div class="modal-body">
            ¿Está seguro que desea desactivar este usuario?
          </div>
          <div class="modal-footer">
            <button @click="showDeleteModal = false" class="btn btn-secondary">Cancelar</button>
            <button @click="deleteUserConfirmed" class="btn btn-danger">Desactivar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

const API_URL = 'http://localhost:8080/api/users';
const ROLES_API = 'http://localhost:8080/api/roles';

export default {
  name: 'ABMUsuariosView',
  components: { Sidebar },
  data() {
    return {
      filterNombre: '',
      filterEmail: '',
      filterActivo: '',
      filterEstado: '',
      editingUser: null,
      users: [],
      filteredUsers: [],
      roles: [],
      showDeleteModal: false,
      userToDelete: null
    }
  },
  methods: {
    async loadUsers() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar usuarios');
        const data = await response.json();
        this.users = data;
        this.filteredUsers = [...this.users];
        this.filterUsers();
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        alert("Error al cargar usuarios: " + error.message);
      }
    },
    async loadRoles() {
      try {
        const response = await fetch(ROLES_API);
        if (!response.ok) throw new Error('Error al cargar roles');
        const data = await response.json();
        this.roles = data.map(r => ({
          id_rol: r.id_rol || r.idRol,
          nombre: r.nombre
        }));
      } catch (error) {
        console.error("Error cargando roles:", error);
      }
    },
    filterUsers() {
      this.filteredUsers = this.users.filter(user =>
        user.nombre.toLowerCase().includes(this.filterNombre.toLowerCase()) &&
        user.email.toLowerCase().includes(this.filterEmail.toLowerCase()) &&
        (this.filterActivo === '' || user.activo.toString() === this.filterActivo) &&
        (this.filterEstado === '' || user.estado === this.filterEstado)
      );
    },
    editUser(user) {
      this.editingUser = { ...user };
    },
    async submitEditUser() {
      if (!this.editingUser.nombre || !this.editingUser.apellido_paterno) {
        alert("Nombre y apellido paterno son obligatorios");
        return;
      }

      try {
        const payload = {
          nombre: this.editingUser.nombre,
          apellido_paterno: this.editingUser.apellido_paterno,
          apellido_materno: this.editingUser.apellido_materno,
          id_rol: this.editingUser.id_rol,
          activo: this.editingUser.activo,
          estado: this.editingUser.estado
        };

        const response = await fetch(`${API_URL}/${this.editingUser.id_usuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al actualizar');
        }

        alert("Usuario actualizado correctamente");
        await this.loadUsers();
        this.editingUser = null;
      } catch (error) {
        console.error("Error actualizando:", error);
        alert("Error: " + error.message);
      }
    },
    confirmDelete(id) {
      this.userToDelete = id;
      this.showDeleteModal = true;
    },
    async deleteUserConfirmed() {
      try {
        const response = await fetch(`${API_URL}/desactivar/${this.userToDelete}`, {
          method: 'PUT'
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al desactivar');
        }

        alert("Usuario desactivado correctamente");
        await this.loadUsers();
      } catch (error) {
        console.error("Error desactivando:", error);
        alert("Error: " + error.message);
      } finally {
        this.showDeleteModal = false;
        this.userToDelete = null;
      }
    }
  },
  async created() {
    await this.loadRoles();
    await this.loadUsers();
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  width: 100%;
}

.main-content {
  width: calc(100% - 250px);
  margin-left: 250px;
  padding: 20px;
}

.register-glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 1000px;
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

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
}

.modal-backdrop {
  opacity: 0.5;
}

@media (max-width: 768px) {
  .main-content {
    width: 100%;
    margin-left: 0;
  }
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