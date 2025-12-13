<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <div class="main-content">
      <div class="register-glass card shadow-lg animate__animated animate__fadeIn mx-auto">
        <h1 class="text-center mb-4 animate__animated animate__fadeInDown">GESTIÓN DE FUNCIONALIDADES</h1>

        <!-- Formulario para crear funcionalidad -->
        <div class="row">
          <div class="col-md-6">
            <form @submit.prevent="submitFuncionalidad">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input 
                  v-model="newFuncionalidad.nombre" 
                  type="text" 
                  class="form-control" 
                  placeholder="Nombre" 
                  required 
                  maxlength="50"
                  :disabled="isProtectedPath"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <input 
                  v-model="newFuncionalidad.descripcion" 
                  type="text" 
                  class="form-control" 
                  placeholder="Descripción" 
                  required 
                  maxlength="200"
                  :disabled="isProtectedPath"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Ruta</label>
                <input 
                  v-model="newFuncionalidad.direccion" 
                  type="text" 
                  class="form-control" 
                  placeholder="Ruta (ej. /dashboard)" 
                  required 
                  maxlength="100"
                  :disabled="isProtectedPath"
                />
                <small v-if="isProtectedPath" class="text-danger">
                  Esta ruta está protegida y no puede modificarse.
                </small>
              </div>
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="!newFuncionalidad.nombre || !newFuncionalidad.descripcion || !newFuncionalidad.direccion || isProtectedPath"
              >
                Crear Funcionalidad
              </button>
            </form>
          </div>
        </div>

        <!-- Tabla de funcionalidades -->
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
              <td>
                <span v-if="isProtected(func.direccion)" class="text-warning">[PROTEGIDA]</span>
                {{ func.nombre }}
              </td>
              <td>{{ func.descripcion }}</td>
              <td>
                <code>{{ func.direccion }}</code>
              </td>
              <td>
                <button 
                  class="btn btn-sm btn-danger" 
                  @click="confirmDelete(func.id_funcionalidad)"
                  :disabled="isProtected(func.direccion)"
                >
                  {{ isProtected(func.direccion) ? 'Protegida' : 'Eliminar' }}
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
            ¿Está seguro que desea eliminar esta funcionalidad?
          </div>
          <div class="modal-footer">
            <button @click="showDeleteModal = false" class="btn btn-secondary">Cancelar</button>
            <button @click="deleteFuncionalidadConfirmed" class="btn btn-danger">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

// Updated port to 8084
const API_URL = 'http://localhost:8084/api/roles/functionalities';

// Rutas protegidas (las que vienen por defecto en el sistema)
const PROTECTED_PATHS = [
  '/abm-usuarios',
  '/abm-roles',
  '/abm-funcionalidades',
  '/gestion-roles-funcionalidades'
];

export default {
  name: 'ABMFuncionalidadesView',
  components: { Sidebar },
  data() {
    return {
      newFuncionalidad: { nombre: '', descripcion: '', direccion: '' },
      funcionalidades: [],
      showDeleteModal: false,
      funcToDelete: null
    }
  },
  computed: {
    isProtectedPath() {
      return PROTECTED_PATHS.includes(this.newFuncionalidad.direccion);
    }
  },
  methods: {
    isProtected(direccion) {
      return PROTECTED_PATHS.includes(direccion);
    },
    async loadFuncionalidades() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar funcionalidades');
        const data = await response.json();
        this.funcionalidades = data.map(f => ({
          id_funcionalidad: f.id_funcionalidad || f.idFuncionalidad,
          nombre: f.nombre,
          descripcion: f.descripcion,
          direccion: f.direccion
        }));
      } catch (error) {
        console.error("Error cargando funcionalidades:", error);
        // alert("Error al cargar funcionalidades: " + error.message);
      }
    },
    async submitFuncionalidad() {
      if (!this.newFuncionalidad.nombre || !this.newFuncionalidad.descripcion || !this.newFuncionalidad.direccion) {
        alert("Todos los campos son obligatorios");
        return;
      }

      if (this.isProtectedPath) {
        alert("No puedes crear una funcionalidad con una ruta protegida.");
        return;
      }

      // Validar ruta única
      const exists = this.funcionalidades.some(f => f.direccion === this.newFuncionalidad.direccion);
      if (exists) {
        alert("Ya existe una funcionalidad con esta ruta.");
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newFuncionalidad)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al crear funcionalidad');
        }

        alert("Funcionalidad creada correctamente");
        this.newFuncionalidad = { nombre: '', descripcion: '', direccion: '' };
        await this.loadFuncionalidades();
      } catch (error) {
        console.error("Error creando funcionalidad:", error);
        alert("Error: " + error.message);
      }
    },
    confirmDelete(id_funcionalidad) {
      const func = this.funcionalidades.find(f => f.id_funcionalidad === id_funcionalidad);
      if (func && this.isProtected(func.direccion)) {
        alert("Esta funcionalidad está protegida y no puede eliminarse.");
        return;
      }
      this.funcToDelete = id_funcionalidad;
      this.showDeleteModal = true;
    },
    async deleteFuncionalidadConfirmed() {
      try {
        const response = await fetch(`${API_URL}/${this.funcToDelete}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al eliminar');
        }

        alert("Funcionalidad eliminada correctamente");
        await this.loadFuncionalidades();
      } catch (error) {
        console.error("Error eliminando funcionalidad:", error);
        alert("Error: " + error.message);
      } finally {
        this.showDeleteModal = false;
        this.funcToDelete = null;
      }
    }
  },
  async created() {
    await this.loadFuncionalidades();
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

.text-warning {
  font-weight: bold;
}

code {
  background-color: #f1f1f1;
  padding: 2px 6px;
  border-radius: 4px;
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
