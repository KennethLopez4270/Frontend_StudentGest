<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <div class="main-content">
      <div class="register-glass card shadow-lg animate__animated animate__fadeIn mx-auto">
        <h1 class="text-center mb-4 animate__animated animate__fadeInDown">GESTIÓN DE ROLES</h1>

        <!-- Formulario para crear rol -->
        <div class="row">
          <div class="col-md-6">
            <form @submit.prevent="submitRol">
              <div class="mb-3">
                <label class="form-label">Nombre del Rol</label>
                <input 
                  v-model="newRol.nombre" 
                  type="text" 
                  class="form-control" 
                  placeholder="Nombre del rol" 
                  required 
                  maxlength="50"
                  :disabled="isOsiName"
                />
                <small v-if="isOsiName" class="text-danger">
                  El nombre "OSI" está reservado y no puede usarse.
                </small>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <input 
                  v-model="newRol.descripcion" 
                  type="text" 
                  class="form-control" 
                  placeholder="Descripción del rol" 
                  required 
                  maxlength="200" 
                />
              </div>
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="!newRol.nombre || !newRol.descripcion || isOsiName"
              >
                Crear Rol
              </button>
            </form>
          </div>
        </div>

        <!-- Tabla de roles -->
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
              <td>
                <strong v-if="rol.nombre === 'OSI'">[PROTEGIDO]</strong>
                {{ rol.nombre }}
              </td>
              <td>{{ rol.descripcion }}</td>
              <td>
                <button 
                  class="btn btn-sm btn-danger" 
                  @click="confirmDelete(rol.id_rol)"
                  :disabled="rol.nombre === 'OSI'"
                >
                  {{ rol.nombre === 'OSI' ? 'Protegido' : 'Eliminar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
            ¿Está seguro que desea eliminar este rol?
          </div>
          <div class="modal-footer">
            <button @click="showDeleteModal = false" class="btn btn-secondary">Cancelar</button>
            <button @click="deleteRolConfirmed" class="btn btn-danger">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

// Updated port to 8084
const API_URL = 'http://localhost:8084/api/roles';

export default {
  name: 'ABMRolesView',
  components: { Sidebar },
  data() {
    return {
      newRol: { nombre: '', descripcion: '' },
      roles: [],
      showDeleteModal: false,
      rolToDelete: null
    }
  },
  computed: {
    isOsiName() {
      return this.newRol.nombre.trim().toUpperCase() === 'OSI';
    }
  },
  methods: {
    async loadRoles() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar roles');
        const data = await response.json();
        this.roles = data.map(r => ({
          id_rol: r.id_rol || r.idRol,
          nombre: r.nombre,
          descripcion: r.descripcion
        }));
      } catch (error) {
        console.error("Error cargando roles:", error);
        // alert("Error al cargar roles: " + error.message);
      }
    },
    async submitRol() {
      if (!this.newRol.nombre || !this.newRol.descripcion) {
        alert("Nombre y descripción son obligatorios");
        return;
      }

      if (this.isOsiName) {
        alert("No puedes crear un rol con el nombre 'OSI'. Está reservado.");
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: this.newRol.nombre,
            descripcion: this.newRol.descripcion
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al crear rol');
        }

        alert("Rol creado correctamente");
        this.newRol = { nombre: '', descripcion: '' };
        await this.loadRoles();
      } catch (error) {
        console.error("Error creando rol:", error);
        alert("Error: " + error.message);
      }
    },
    confirmDelete(id_rol) {
      const rol = this.roles.find(r => r.id_rol === id_rol);
      if (rol && rol.nombre === 'OSI') {
        alert("El rol OSI está protegido y no puede eliminarse.");
        return;
      }
      this.rolToDelete = id_rol;
      this.showDeleteModal = true;
    },
    async deleteRolConfirmed() {
      try {
        const response = await fetch(`${API_URL}/${this.rolToDelete}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al eliminar');
        }

        alert("Rol eliminado correctamente");
        await this.loadRoles();
      } catch (error) {
        console.error("Error eliminando rol:", error);
        alert("Error: " + error.message);
      } finally {
        this.showDeleteModal = false;
        this.rolToDelete = null;
      }
    }
  },
  async created() {
    await this.loadRoles();
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

.modal-backdrop {
  opacity: 0.5;
}

.text-danger {
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .main-content {
    width: 100%;
    margin-left: 0;
  }
  .register-glass {
    padding: 30px 20px;
    max-width: 90%;
  }
  h1 {
    font-size: 24px;
  }
}
</style>
