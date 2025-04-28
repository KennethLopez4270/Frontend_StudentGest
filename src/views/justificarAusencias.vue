<template>

    <div class="dashboard-layout">
      <!-- Columna izquierda: Sidebar -->
      <div class="sidebar-column">
        
      </div>

      <!-- Columna derecha: Contenido principal -->
      <div class="content-column">
        <Sidebar />
        <div class="content">
          <div class="left-section">
            <!-- Header -->
            <div class="header animate__animated animate__fadeInDown">
              <h1>Justificar Ausencias</h1>
              <router-link to="/historial-asistencias" class="btn">Ver Historial Completo</router-link>
            </div>

            <!-- Selector de hijo -->
            <div class="form-section animate__animated animate__fadeInUp">
              <h2>Selecciona un Hijo</h2>
              <div class="row g-3 justify-content-center">
                <div class="col-md-6">
                  <label for="hijoSelect" class="form-label">Hijo</label>
                  <select 
                    id="hijoSelect" 
                    v-model="hijoSeleccionado" 
                    class="form-select"
                    :disabled="loadingHijos"
                  >
                    <option disabled value="">-- Seleccionar --</option>
                    <option v-for="hijo in hijos" :key="hijo.id" :value="hijo">
                      {{ hijo.nombre }} {{ hijo.apellido }}
                    </option>
                  </select>
                  <div v-if="loadingHijos" class="spinner-border spinner-border-sm mt-2" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de Asistencias -->
            <div v-if="hijoSeleccionado" class="history-table animate__animated animate__fadeIn">
              <div v-if="loadingAsistencias" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando asistencias...</p>
              </div>

              <div v-else-if="asistencias.length === 0" class="text-center py-4 text-muted">
                No hay registros de asistencia para este estudiante
              </div>

              <table v-else class="table table-modern">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Justificación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(asistencia, index) in asistencias" :key="index" class="history-row">
                    <td>{{ formatDate(asistencia.fecha) }}</td>
                    <td>
                      <span :class="estadoClase(asistencia.estado)" class="type-badge">
                        {{ asistencia.estado }}
                      </span>
                    </td>
                    <td>
                      <div v-if="asistencia.estado !== 'presente'">
                        <div v-if="asistencia.justificacion">
                          <span class="justification-text">{{ asistencia.justificacion }}</span>
                          <button 
                            class="btn-edit" 
                            @click="editarJustificacion(index)"
                            :disabled="savingJustification"
                          >
                            Editar
                          </button>
                        </div>
                        <div v-else>
                          <button 
                            class="btn-justify" 
                            @click="justificar(index)"
                            :disabled="savingJustification"
                          >
                            Justificar
                          </button>
                        </div>
                      </div>
                      <span v-else>-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="modal-backdrop fade show" @click.self="cerrarModal"></div>
    <div v-if="mostrarModal" class="modal fade show" style="display: block;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-lg">
          <div class="modal-header">
            <h5 class="modal-title">{{ modoEdicion ? 'Editar' : 'Justificar' }} Ausencia - {{ formatDate(asistenciaSeleccionada.fecha) }}</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">Justificación:</label>
            <textarea 
              v-model="justificacionTexto" 
              rows="4" 
              class="form-control" 
              placeholder="Escribe la justificación aquí"
              :disabled="savingJustification"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button 
              class="btn btn-secondary" 
              @click="cerrarModal"
              :disabled="savingJustification"
            >
              Cancelar
            </button>
            <button 
              class="btn btn-primary" 
              @click="guardarJustificacion"
              :disabled="!justificacionTexto || savingJustification"
            >
              <span v-if="savingJustification" class="spinner-border spinner-border-sm" role="status"></span>
              {{ savingJustification ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { showSuccess, showError } from '@/utils/useAlert';
import Sidebar from '../components/Sidebar.vue';
import 'animate.css';
import '@/assets/justificarA.css';

export default {
  name: 'JustificarAusencias',
  components: { Sidebar },
  setup() {
    // Datos del padre logueado
    const userData = JSON.parse(localStorage.getItem('user'));
    const parentId = userData?.id;

    // Estado del componente
    const hijos = ref([]);
    const hijoSeleccionado = ref(null);
    const asistencias = ref([]);
    const mostrarModal = ref(false);
    const justificacionTexto = ref('');
    const asistenciaSeleccionada = ref({});
    const indexSeleccionado = ref(null);
    const modoEdicion = ref(false);
    const loadingHijos = ref(false);
    const loadingAsistencias = ref(false);
    const savingJustification = ref(false);

    // Cargar hijos del padre al montar el componente
    onMounted(async () => {
      await loadHijos();
    });

    // Cargar hijos del padre desde el backend
    async function loadHijos() {
      try {
        loadingHijos.value = true;
        const response = await fetch(`http://localhost:8080/api/students/hijos/${parentId}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los hijos');
        }
        
        const data = await response.json();
        
        hijos.value = data.map(hijo => ({
          id: hijo.id_estudiante,
          nombre: hijo.nombre,
          apellido: [hijo.apellido_paterno, hijo.apellido_materno].filter(Boolean).join(' '),
          datosCompletos: hijo
        }));
        
        if (hijos.value.length === 0) {
          showError('Información', 'No se encontraron hijos registrados');
        }
        
      } catch (error) {
        console.error(error);
        showError('Error', 'No se pudieron cargar los hijos');
        hijos.value = [];
      } finally {
        loadingHijos.value = false;
      }
    }

    // Datos de ejemplo para asistencias (con ausencias y tardanzas para justificar)
    const getAsistenciasEjemplo = (studentId) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      const formatDate = (date) => date.toISOString().split('T')[0];
      
      // Ejemplo completo con diferentes estados
      return [
        { 
          id: 1, 
          fecha: formatDate(threeDaysAgo), 
          estado: 'presente', 
          justificacion: null 
        },
        { 
          id: 2, 
          fecha: formatDate(twoDaysAgo), 
          estado: 'ausente', 
          justificacion: null, // Ausencia para justificar
          puedeJustificar: true
        },
        { 
          id: 3, 
          fecha: formatDate(yesterday), 
          estado: 'tardanza', 
          justificacion: null, // Tardanza para justificar
          puedeJustificar: true
        },
        { 
          id: 4, 
          fecha: formatDate(today), 
          estado: 'presente', 
          justificacion: null 
        },
        { 
          id: 5, 
          fecha: formatDate(threeDaysAgo), 
          estado: 'ausente', 
          justificacion: 'Visita médica programada', // Ausencia ya justificada
          puedeJustificar: false
        }
      ];
    };

    // Cargar asistencias cuando se selecciona un hijo
    watch(hijoSeleccionado, async (newVal) => {
      if (newVal) {
        await loadAsistencias(newVal.id);
      }
    });

    // Cargar asistencias del hijo seleccionado
    async function loadAsistencias(studentId) {
      try {
        loadingAsistencias.value = true;
        
        // Intenta cargar del backend primero
        try {
          const response = await fetch(`http://localhost:8080/api/asistencia/estudiante/${studentId}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              // Marcamos qué registros se pueden justificar
              asistencias.value = data.map(item => ({
                ...item,
                puedeJustificar: ['ausente', 'tardanza'].includes(item.estado) && !item.justificacion
              }));
              return;
            }
          }
        } catch (error) {
          console.log("Usando datos de ejemplo:", error);
        }
        
        // Si no hay datos reales, usa ejemplos con registros para justificar
        asistencias.value = getAsistenciasEjemplo(studentId);
        
      } catch (error) {
        console.error(error);
        showError('Error', 'No se pudieron cargar las asistencias');
        asistencias.value = [];
      } finally {
        loadingAsistencias.value = false;
      }
    }

    // Mostrar modal para justificar
    const justificar = (index) => {
      modoEdicion.value = false;
      asistenciaSeleccionada.value = { ...asistencias.value[index] };
      indexSeleccionado.value = index;
      justificacionTexto.value = '';
      mostrarModal.value = true;
    };

    // Mostrar modal para editar justificación
    const editarJustificacion = (index) => {
      modoEdicion.value = true;
      asistenciaSeleccionada.value = { ...asistencias.value[index] };
      indexSeleccionado.value = index;
      justificacionTexto.value = asistenciaSeleccionada.value.justificacion;
      mostrarModal.value = true;
    };

    // Guardar justificación
    const guardarJustificacion = async () => {
      if (indexSeleccionado.value === null || !hijoSeleccionado.value) return;

      try {
        savingJustification.value = true;
        
        // Simular petición al API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Actualizar localmente
        const updatedRecord = {
          ...asistencias.value[indexSeleccionado.value],
          justificacion: justificacionTexto.value,
          puedeJustificar: false
        };
        
        asistencias.value[indexSeleccionado.value] = updatedRecord;
        
        // Mostrar confirmación
        await showSuccess('¡Justificación guardada!', 'La falta ha sido justificada correctamente');
        
        cerrarModal();
        
      } catch (error) {
        console.error(error);
        showError('Error', 'No se pudo guardar la justificación');
      } finally {
        savingJustification.value = false;
      }
    };

    // Cerrar modal
    const cerrarModal = () => {
      mostrarModal.value = false;
      justificacionTexto.value = '';
    };

    // Clase CSS según estado
    const estadoClase = (estado) => {
      return {
        presente: 'presente-badge',
        ausente: 'ausente-badge',
        tardanza: 'tardanza-badge'
      }[estado] || '';
    };

    // Formatear fecha
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return {
      // Variables reactivas
      hijos,
      hijoSeleccionado,
      asistencias,
      mostrarModal,
      justificacionTexto,
      asistenciaSeleccionada,
      modoEdicion,
      loadingHijos,
      loadingAsistencias,
      savingJustification,
      
      // Funciones
      justificar,
      editarJustificacion,
      guardarJustificacion,
      cerrarModal,
      estadoClase,
      formatDate
    };
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  overflow-y: auto;
}

.btn-justify, .btn-edit {
  border: none;
  background: none;
  padding: 0;
  margin-left: 10px;
  cursor: pointer;
  font-size: 0.9em;
}

.btn-justify {
  color: #4a6baf;
  text-decoration: underline;
}

.btn-edit {
  color: #6c757d;
}

.justification-text {
  color: #495057;
}

.type-badge {
  padding: 0.25em 0.6em;
  font-size: 0.85em;
  border-radius: 0.25rem;
}

.presente-badge {
  background-color: #d1e7dd;
  color: #0f5132;
}

.ausente-badge {
  background-color: #f8d7da;
  color: #842029;
}

.tardanza-badge {
  background-color: #fff3cd;
  color: #664d03;
}

.table-modern {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.table-modern th {
  background-color: #f8f9fa;
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
}

.table-modern td {
  padding: 12px 15px;
  border-bottom: 1px solid #dee2e6;
}

.history-row:hover {
  background-color: #f8f9fa;
}

.form-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
}

/* Sidebar */
.sidebar-column {
  width: 240px;
  background-color: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

/* Contenido */
.content-column {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0 0 10px;
}

.content {
  padding: 10px;
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column; /* Ya no lado a lado, sino arriba/abajo */
  }

  .sidebar-column {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    display: none; /* oculto el sidebar estático, ahora depende del burger */
  }

  .content-column {
    width: 100%;
    padding: 10px;
  }
}
</style>