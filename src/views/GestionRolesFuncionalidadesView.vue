<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <div class="main-content">
      <div class="register-glass card shadow-lg animate__animated animate__fadeIn mx-auto">
        <h1 class="text-center mb-4 animate__animated animate__fadeInDown">ASIGNAR FUNCIONALIDADES A ROLES</h1>

        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="mb-3">
              <label class="form-label">Seleccionar Rol</label>
              <select v-model="selectedRolId" class="form-control" @change="loadFuncionalidades">
                <option value="" disabled>Selecciona un rol</option>
                <option v-for="rol in roles" :key="rol.id_rol" :value="rol.id_rol">
                  {{ rol.nombre }}
                  <span v-if="rol.nombre === 'OSI'" class="text-warning"> [PROTEGIDO]</span>
                  ({{ rol.descripcion }})
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="selectedRolId" class="row justify-content-center">
          <div class="col-md-8">
            <h4>Funcionalidades para {{ selectedRolNombre }}</h4>
            <p v-if="isOsiRol" class="text-success">
              El rol OSI tiene acceso total y no se pueden desasignar funcionalidades críticas.
            </p>

            <div class="form-check" v-for="func in funcionalidades" :key="func.id_funcionalidad">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`func-${selectedRolId}-${func.id_funcionalidad}`"
                :checked="isFuncionalidadAssigned(func.id_funcionalidad)"
                :disabled="isCriticalFunctionality(func.direccion) && isOsiRol"
                @change="toggleFuncionalidad(func.id_funcionalidad)"
              />
              <label class="form-check-label" :for="`func-${selectedRolId}-${func.id_funcionalidad}`">
                {{ func.nombre }} (<code>{{ func.direccion }}</code>)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

// Updated ports to 8084
const ROLES_API = 'http://localhost:8084/api/roles';
const FUNCIONALIDADES_API = 'http://localhost:8084/api/roles/functionalities';
const ASSIGN_API = (roleId, funcId) => `http://localhost:8084/api/roles/${roleId}/functionalities/${funcId}`;

// Funcionalidades CRÍTICAS que el OSI siempre debe tener
const CRITICAL_PATHS = [
  '/abm-usuarios',
  '/abm-roles',
  '/abm-funcionalidades',
  '/gestion-roles-funcionalidades'
];

export default {
  name: 'GestionRolesFuncionalidadesView',
  components: { Sidebar },
  data() {
    return {
      selectedRolId: '',
      roles: [],
      funcionalidades: [],
      assignedFuncionalidades: new Set()
    }
  },
  computed: {
    selectedRolNombre() {
      const rol = this.roles.find(r => r.id_rol === this.selectedRolId);
      return rol ? rol.nombre : '';
    },
    isOsiRol() {
      const rol = this.roles.find(r => r.id_rol === this.selectedRolId);
      return rol?.nombre === 'OSI';
    }
  },
  methods: {
    isCriticalFunctionality(direccion) {
      return CRITICAL_PATHS.includes(direccion);
    },
    async loadRoles() {
      try {
        const response = await fetch(ROLES_API);
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
    async loadFuncionalidades() {
      if (!this.selectedRolId) return;

      this.assignedFuncionalidades = new Set();

      try {
        const funcResponse = await fetch(FUNCIONALIDADES_API);
        if (!funcResponse.ok) throw new Error('Error al cargar funcionalidades');
        const funcData = await funcResponse.json();
        this.funcionalidades = funcData.map(f => ({
          id_funcionalidad: f.id_funcionalidad || f.idFuncionalidad,
          nombre: f.nombre,
          descripcion: f.descripcion,
          direccion: f.direccion
        }));

        const assignResponse = await fetch(`${ROLES_API}/${this.selectedRolId}/functionalities`);
        if (!assignResponse.ok) throw new Error('Error al cargar asignaciones');
        const assignData = await assignResponse.json();
        assignData.forEach(f => this.assignedFuncionalidades.add(f.id_funcionalidad));

        if (this.isOsiRol) {
          this.funcionalidades.forEach(f => {
            if (this.isCriticalFunctionality(f.direccion)) {
              this.assignedFuncionalidades.add(f.id_funcionalidad);
            }
          });
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        alert("Error: " + error.message);
      }
    },
    isFuncionalidadAssigned(funcId) {
      return this.assignedFuncionalidades.has(funcId);
    },
    async toggleFuncionalidad(funcId) {
      const func = this.funcionalidades.find(f => f.id_funcionalidad === funcId);
      const isCritical = this.isCriticalFunctionality(func.direccion);
      const isAssigned = this.assignedFuncionalidades.has(funcId);

      if (isCritical && this.isOsiRol && isAssigned) {
        alert("No puedes desasignar esta funcionalidad del rol OSI.");
        return;
      }

      try {
        if (isAssigned) {
          const response = await fetch(ASSIGN_API(this.selectedRolId, funcId), {
            method: 'DELETE'
          });
          if (!response.ok) throw new Error('Error al desasignar');
          this.assignedFuncionalidades.delete(funcId);
          alert("Funcionalidad desasignada");
        } else {
          const response = await fetch(ASSIGN_API(this.selectedRolId, funcId), {
            method: 'POST'
          });
          if (!response.ok) throw new Error('Error al asignar');
          this.assignedFuncionalidades.add(funcId);
          alert("Funcionalidad asignada");
        }
      } catch (error) {
        console.error("Error en asignación:", error);
        alert("Error: " + error.message);
        await this.loadFuncionalidades();
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

.form-check {
  margin-bottom: 12px;
  padding-left: 2.5rem;
}

.form-check-input:disabled + .form-check-label {
  opacity: 0.7;
  cursor: not-allowed;
}

.text-success { color: #198754; }
.text-warning { color: #ffc107; font-weight: bold; }

/* RUTA EN NEGRO */
code {
  background-color: #f1f1f1;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #000;
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
