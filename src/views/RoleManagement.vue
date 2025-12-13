<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <div class="main-content">
      <div class="container-fluid py-4">
        <div class="row">
          <div class="col-12">
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 text-primary fw-bold"><i class="fas fa-user-shield me-2"></i>Gestión de Roles</h5>
                <button class="btn btn-primary" @click="openCreateModal">
                  <i class="fas fa-plus me-1"></i> Nuevo Rol
                </button>
              </div>
              <div class="card-body">
                
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="alert alert-danger" role="alert">
                  <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
                </div>

                <!-- Roles Table -->
                <div v-else class="table-responsive">
                  <table class="table table-hover align-middle">
                    <thead class="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="role in roles" :key="role.id_rol">
                        <td>#{{ role.id_rol }}</td>
                        <td><span class="badge bg-light text-dark border">{{ role.nombre }}</span></td>
                        <td>{{ role.descripcion }}</td>
                        <td class="text-center">
                          <button class="btn btn-sm btn-outline-info me-2" @click="manageFunctionalities(role)" title="Gestionar Funcionalidades">
                            <i class="fas fa-cogs"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-primary me-2" @click="editRole(role)" title="Editar">
                            <i class="fas fa-edit"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(role)" title="Eliminar">
                            <i class="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Create/Edit Role -->
        <div v-if="showRoleModal" class="modal-backdrop-custom d-flex justify-content-center align-items-center">
          <div class="card shadow-lg" style="width: 500px; max-width: 90%;">
            <div class="card-header bg-white py-3">
              <h5 class="mb-0 fw-bold">{{ isEditing ? 'Editar Rol' : 'Crear Nuevo Rol' }}</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitRole">
                <div class="mb-3">
                  <label class="form-label">Nombre del Rol</label>
                  <input v-model="currentRole.nombre" type="text" class="form-control" required placeholder="Ej: EDITOR">
                </div>
                <div class="mb-3">
                  <label class="form-label">Descripción</label>
                  <textarea v-model="currentRole.descripcion" class="form-control" rows="3" required placeholder="Descripción de las responsabilidades..."></textarea>
                </div>
                <div class="d-flex justify-content-end gap-2">
                  <button type="button" class="btn btn-secondary" @click="closeRoleModal">Cancelar</button>
                  <button type="submit" class="btn btn-primary" :disabled="saving">
                    <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    {{ isEditing ? 'Actualizar' : 'Guardar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Modal Funcionalidades -->
        <div v-if="showFuncModal" class="modal-backdrop-custom d-flex justify-content-center align-items-center">
          <div class="card shadow-lg" style="width: 700px; max-width: 95%;">
            <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 class="mb-0 fw-bold">Funcionalidades: {{ selectedRole.nombre }}</h5>
              <button type="button" class="btn-close" @click="closeFuncModal"></button>
            </div>
            <div class="card-body">
              <div class="row">
                <!-- Available Funcs -->
                <div class="col-md-6 border-end">
                  <h6 class="text-muted mb-3">Disponibles</h6>
                  <div class="list-group overflow-auto" style="max-height: 300px;">
                    <button 
                      v-for="func in availableFunctionalities" 
                      :key="func.id_funcionalidad"
                      class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      @click="assignFunc(func)"
                    >
                      <div>
                        <div class="fw-bold">{{ func.nombre }}</div>
                        <small class="text-muted">{{ func.codigo }}</small>
                      </div>
                      <i class="fas fa-plus-circle text-success"></i>
                    </button>
                    <div v-if="availableFunctionalities.length === 0" class="text-center text-muted py-3">
                      No hay más funcionalidades disponibles
                    </div>
                  </div>
                </div>
                <!-- Assigned Funcs -->
                <div class="col-md-6">
                  <h6 class="text-muted mb-3">Asignadas</h6>
                  <div class="list-group overflow-auto" style="max-height: 300px;">
                    <button 
                      v-for="func in roleFunctionalities" 
                      :key="func.id_funcionalidad"
                      class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      @click="removeFunc(func)"
                    >
                      <div>
                        <div class="fw-bold">{{ func.nombre }}</div>
                        <small class="text-muted">{{ func.codigo }}</small>
                      </div>
                      <i class="fas fa-minus-circle text-danger"></i>
                    </button>
                    <div v-if="roleFunctionalities.length === 0" class="text-center text-muted py-3">
                      Este rol no tiene funcionalidades asignadas
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer bg-light text-end">
              <button type="button" class="btn btn-secondary" @click="closeFuncModal">Cerrar</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import API_URL from '@/config/api'
import { showSuccess, showError, showConfirm } from '@/utils/useAlert'
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'RoleManagement',
  components: { Sidebar },
  data() {
    return {
      roles: [],
      allFunctionalities: [],
      roleFunctionalities: [], // Funcionalidades del rol seleccionado
      loading: false,
      error: null,
      
      // Modal Rol
      showRoleModal: false,
      isEditing: false,
      saving: false,
      currentRole: {
        id_rol: null,
        nombre: '',
        descripcion: ''
      },

      // Modal Funcionalidades
      showFuncModal: false,
      selectedRole: null
    }
  },
  computed: {
    availableFunctionalities() {
      // Retorna las funcionalidades que NO están asignadas al rol actual
      if (!this.selectedRole) return [];
      const assignedIds = this.roleFunctionalities.map(f => f.id_funcionalidad);
      return this.allFunctionalities.filter(f => !assignedIds.includes(f.id_funcionalidad));
    }
  },
  async mounted() {
    await this.fetchRoles();
    await this.fetchAllFunctionalities();
  },
  methods: {
    getHeaders() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      };
    },

    async fetchRoles() {
      this.loading = true;
      try {
        const response = await fetch(`${API_URL}/api/roles', {
            headers: this.getHeaders() // Just in case, though GET is public
        });
        if (response.ok) {
          this.roles = await response.json();
        } else {
          throw new Error('Error al cargar roles');
        }
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchAllFunctionalities() {
      try {
        const response = await fetch(`${API_URL}/api/roles/functionalities', {
             headers: this.getHeaders()
        });
        if (response.ok) {
          this.allFunctionalities = await response.json();
        }
      } catch (e) {
        console.error("Error loading functionalities", e);
      }
    },

    openCreateModal() {
      this.isEditing = false;
      this.currentRole = { nombre: '', descripcion: '' };
      this.showRoleModal = true;
    },

    editRole(role) {
      this.isEditing = true;
      this.currentRole = { ...role };
      this.showRoleModal = true;
    },

    closeRoleModal() {
      this.showRoleModal = false;
      this.currentRole = { nombre: '', descripcion: '' };
    },

    async submitRole() {
      this.saving = true;
      const url = this.isEditing 
        ? `http://localhost:8084/api/roles/${this.currentRole.id_rol}`
        : `${API_URL}/api/roles';
      
      const method = this.isEditing ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: method,
          headers: this.getHeaders(),
          body: JSON.stringify(this.currentRole)
        });

        if (response.ok) {
          showSuccess('Éxito', `Rol ${this.isEditing ? 'actualizado' : 'creado'} correctamente`);
          this.closeRoleModal();
          this.fetchRoles();
        } else {
          throw new Error('Error al guardar el rol');
        }
      } catch (e) {
        showError('Error', e.message);
      } finally {
        this.saving = false;
      }
    },

    async confirmDelete(role) {
      const confirmed = await showConfirm(
        '¿Estás seguro?',
        `Se eliminará el rol "${role.nombre}". Esta acción no se puede deshacer.`
      );

      if (confirmed) {
        try {
          const response = await fetch(`http://localhost:8084/api/roles/${role.id_rol}`, {
            method: 'DELETE',
            headers: this.getHeaders()
          });

          if (response.ok) {
            showSuccess('Eliminado', 'El rol ha sido eliminado.');
            this.fetchRoles();
          } else {
            throw new Error('Error al eliminar el rol');
          }
        } catch (e) {
          showError('Error', e.message);
        }
      }
    },

    // Funcionalidades
    async manageFunctionalities(role) {
      this.selectedRole = role;
      try {
        const response = await fetch(`http://localhost:8084/api/roles/${role.id_rol}/functionalities`, {
             headers: this.getHeaders()
        });
        if (response.ok) {
          this.roleFunctionalities = await response.json();
          this.showFuncModal = true;
        } else {
          showError('Error', 'No se pudieron cargar las funcionalidades del rol');
        }
      } catch (e) {
        console.error(e);
      }
    },

    async assignFunc(func) {
      if (!this.selectedRole) return;
      try {
        const response = await fetch(`http://localhost:8084/api/roles/${this.selectedRole.id_rol}/functionalities/${func.id_funcionalidad}`, {
          method: 'POST',
           headers: this.getHeaders()
        });

        if (response.ok) {
          // Update local state without re-fetch for speed
          this.roleFunctionalities.push(func);
        } else {
            showError('Error', 'Falló la asignación');
        }
      } catch (e) {
        showError('Error', e.message);
      }
    },

    async removeFunc(func) {
      if (!this.selectedRole) return;
      try {
        const response = await fetch(`http://localhost:8084/api/roles/${this.selectedRole.id_rol}/functionalities/${func.id_funcionalidad}`, {
          method: 'DELETE',
           headers: this.getHeaders()
        });

        if (response.ok) {
          this.roleFunctionalities = this.roleFunctionalities.filter(f => f.id_funcionalidad !== func.id_funcionalidad);
        } else {
            showError('Error', 'Falló la desasignación');
        }
      } catch (e) {
        showError('Error', e.message);
      }
    },
    
    closeFuncModal() {
      this.showFuncModal = false;
      this.selectedRole = null;
      this.roleFunctionalities = [];
    }
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
@media (max-width: 768px) {
  .main-content {
    width: 100%;
    margin-left: 0;
  }
}

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  z-index: 1050;
}
.list-group-item {
  cursor: pointer;
  transition: background-color 0.2s;
}
.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>
