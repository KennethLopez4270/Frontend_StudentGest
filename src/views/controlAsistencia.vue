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
            <div class="form-section animate__animated animate__fadeInUp">
              <h2>Control de Asistencia</h2>
              
              <!-- Selector de Curso -->
              <div class="mb-4">
                <label class="form-label">Seleccionar Curso</label>
                <select 
                  v-model="selectedCourse" 
                  class="form-select"
                  @change="loadStudentsForCourse"
                  :disabled="loadingCourses"
                >
                  <option value="" disabled>-- Seleccionar curso --</option>
                  <option 
                    v-for="course in teacherCourses" 
                    :key="course.nombreCurso"
                    :value="course"
                  >
                    {{ course.nombreMateria }} - {{ course.nivel }} ({{ course.turno }})
                  </option>
                </select>
                <div v-if="loadingCourses" class="spinner-border spinner-border-sm mt-2" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>

              <!-- Filtros -->
              <div class="filter-section mb-4">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Fecha</label>
                    <input 
                      type="date" 
                      v-model="selectedDate" 
                      class="form-control"
                      :max="new Date().toISOString().split('T')[0]"
                    >
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Filtrar por estado</label>
                    <select v-model="filterStatus" class="form-select">
                      <option value="all">Todos</option>
                      <option value="presente">Presente</option>
                      <option value="ausente">Ausente</option>
                      <option value="tardanza">Tardanza</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Lista de Estudiantes -->
              <div class="student-table">
                <div v-if="loadingStudents" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                  <p class="mt-2">Cargando estudiantes...</p>
                </div>

                <div v-else-if="filteredStudents.length === 0" class="text-center py-4 text-muted">
                  No hay estudiantes para mostrar
                </div>

                <div v-else class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="student in filteredStudents" :key="student.id">
                        <td>{{ student.name }}</td>
                        <td>
                          <span class="badge" :class="statusBadgeClass(student.attendanceStatus)">
                            {{ getStatusText(student.attendanceStatus) }}
                          </span>
                          <span v-if="student.excuse" class="small text-muted ms-2">
                            <i class="fas fa-comment"></i> {{ student.excuse }}
                          </span>
                        </td>
                        <td>
                          <button 
                            class="btn btn-sm btn-success me-1"
                            :class="{ 'active': student.attendanceStatus === 'presente' }"
                            @click="updateAttendance(student, 'presente')"
                          >
                            <i class="fas fa-check"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-danger me-1"
                            :class="{ 'active': student.attendanceStatus === 'ausente' }"
                            @click="updateAttendance(student, 'ausente')"
                          >
                            <i class="fas fa-times"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-warning me-1"
                            :class="{ 'active': student.attendanceStatus === 'tardanza' }"
                            @click="updateAttendance(student, 'tardanza')"
                          >
                            <i class="fas fa-clock"></i>
                          </button>
                          <button 
                            class="btn btn-sm btn-info"
                            @click="showExcuseModal(student)"
                            data-bs-toggle="modal" 
                            data-bs-target="#excuseModal"
                          >
                            <i class="fas fa-comment-medical"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de Asistencia -->
          <div class="right-section">
            <div class="summary-card">
              <h3>Resumen de Asistencia</h3>
              <div v-if="selectedCourse" class="mt-3">
                <p class="mb-1">
                  <strong>Curso:</strong> {{ selectedCourse.nombreMateria }} - {{ selectedCourse.nivel }}
                </p>
                <p class="mb-1"><strong>Fecha:</strong> {{ formattedSelectedDate }}</p>
                
                <div class="mt-4">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Presentes:</span>
                    <span class="badge bg-success">{{ attendanceSummary.present }}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Ausentes:</span>
                    <span class="badge bg-danger">{{ attendanceSummary.absent }}</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Tardanzas:</span>
                    <span class="badge bg-warning">{{ attendanceSummary.tardy }}</span>
                  </div>
                </div>

                <button 
                  class="btn btn-primary w-100 mt-4"
                  @click="saveAllAttendances"
                  :disabled="savingAttendances"
                >
                  <span v-if="savingAttendances" class="spinner-border spinner-border-sm" role="status"></span>
                  {{ savingAttendances ? 'Guardando...' : 'Guardar Asistencias' }}
                </button>
              </div>
              <div v-else class="text-center text-muted py-4">
                Selecciona un curso para ver el resumen
              </div>
            </div>
          </div>
        
      </div>
    </div>
  </div>

    <!-- Modal para Excusa -->
    <div class="modal fade" id="excuseModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registrar Excusa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Motivo de la excusa</label>
              <textarea 
                v-model="currentExcuse" 
                class="form-control" 
                rows="3"
                placeholder="Ej: Enfermedad, cita médica..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="saveExcuse"
              :disabled="!currentExcuse"
            >
              Guardar Excusa
            </button>
          </div>
        </div>
      </div>
    </div>
  
  <!-- Historial de Asistencias -->
  <div class="history-section">
    <h3 class="text-center mb-4">Historial de Asistencias</h3>
    
    <div class="history-controls mb-3 text-center">
      <button 
        class="btn btn-primary"
        @click="loadAttendanceHistory"
        :disabled="loadingHistory"
      >
        <span v-if="loadingHistory" class="spinner-border spinner-border-sm" role="status"></span>
        {{ loadingHistory ? 'Cargando...' : 'Generar Historial' }}
      </button>
    </div>

    <div v-if="attendanceHistory.length > 0" class="table-container">
      <div class="table-responsive fixed-size-table">
        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              <th class="fixed-side">Estudiante</th>
              <th v-for="date in uniqueDates" :key="date" class="date-header">
                {{ formatDateHeader(date) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td class="fixed-side">{{ student.name }}</td>
              <td v-for="date in uniqueDates" :key="`${student.id}-${date}`">
                <div v-if="getAttendanceForStudent(student.id, date)" class="attendance-buttons">
                  <button 
                    class="btn btn-sm btn-success me-1"
                    :class="{ 'active': getAttendanceForStudent(student.id, date).tipo === 'presente' }"
                    @click="updateHistoricalAttendance(getAttendanceForStudent(student.id, date), 'presente')"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-danger me-1"
                    :class="{ 'active': getAttendanceForStudent(student.id, date).tipo === 'ausente' }"
                    @click="updateHistoricalAttendance(getAttendanceForStudent(student.id, date), 'ausente')"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-warning"
                    :class="{ 'active': getAttendanceForStudent(student.id, date).tipo === 'tardanza' }"
                    @click="updateHistoricalAttendance(getAttendanceForStudent(student.id, date), 'tardanza')"
                  >
                    <i class="fas fa-clock"></i>
                  </button>
                </div>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { showSuccess, showError } from '@/utils/useAlert';
import Sidebar from '../components/Sidebar.vue';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default {
  name: 'AttendanceControl',
  components: { Sidebar },
  setup() {
    // Datos del profesor logueado
    const userData = JSON.parse(localStorage.getItem('user'));
    const teacherId = userData?.id || 5; // Default a 5 si no hay usuario

    // Estado del componente
    const teacherCourses = ref([]);
    const selectedCourse = ref(null);
    const students = ref([]);
    const selectedDate = ref(new Date().toISOString().split('T')[0]);
    const filterStatus = ref('all');
    const currentExcuse = ref('');
    const currentStudent = ref(null);
    const loadingCourses = ref(false);
    const loadingStudents = ref(false);
    const savingAttendances = ref(false);

    const allCourses = ref([]); // Para almacenar todos los cursos disponibles
    const attendanceHistory = ref([]); // Para el historial de asistencias
    const loadingHistory = ref(false); // Loading state para el historial

    // Cargar cursos del profesor al montar el componente
    onMounted(async () => {
      await loadTeacherCourses();
      await loadAllCourses();
    });

    // Cargar cursos del profesor
    async function loadTeacherCourses() {
      try {
        loadingCourses.value = true;
        const response = await fetch(`http://localhost:8080/api/students/curso_materia/${teacherId}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los cursos');
        }
        
        teacherCourses.value = await response.json();
        
      } catch (error) {
        console.error(error);
        showError('Error', 'No se pudieron cargar los cursos');
      } finally {
        loadingCourses.value = false;
      }
    }

    // Cargar estudiantes para el curso seleccionado
    async function loadStudentsForCourse() {
      if (!selectedCourse.value) return;
      
      try {
        loadingStudents.value = true;
        students.value = selectedCourse.value.nombresEstudiantes.map((name, index) => ({
          id: index + 1, // ID temporal (deberías obtener el ID real de cada estudiante)
          name,
          attendanceStatus: 'presente', // Por defecto todos presentes
          excuse: null,
          modified: false
        }));
        
        // Aquí deberías cargar las asistencias ya registradas para esta fecha
        // desde tu API si las tienes
        
      } catch (error) {
        console.error(error);
        showError('Error', 'No se pudieron cargar los estudiantes');
      } finally {
        loadingStudents.value = false;
      }
    }

    // Actualizar estado de asistencia
    function updateAttendance(student, status) {
      student.attendanceStatus = status;
      student.modified = true;
    }

    // Mostrar modal para excusa
    function showExcuseModal(student) {
      currentStudent.value = student;
      currentExcuse.value = student.excuse || '';
    }

    // Guardar excusa
    function saveExcuse() {
      if (currentStudent.value) {
        currentStudent.value.excuse = currentExcuse.value;
        currentStudent.value.modified = true;
        bootstrap.Modal.getInstance(document.getElementById('excuseModal')).hide();
      }
    }

    // Guardar todas las asistencias
    async function saveAllAttendances() {
      if (!selectedCourse.value) {
        showError('Error', 'Selecciona un curso primero');
        return;
      }

      try {
        savingAttendances.value = true;
        const modifiedStudents = students.value.filter(s => s.modified);
        
        // Obtener el ID real del curso (esto es un ejemplo, ajusta según tu API)
        // Asumimos que el objeto course tiene un idCurso o similar
        const courseId = selectedCourse.value.idCurso || 1; // Valor por defecto temporal
        
        // Registrar cada asistencia modificada
        for (const student of modifiedStudents) {
          // Asegúrate de que student.id es el ID real del estudiante
          // Si no lo tienes, necesitarás obtenerlo de tu API
          const studentId = student.id || 1; // Valor por defecto temporal
          
          const payload = {
            studentId: studentId, // Debe ser el ID real del estudiante
            courseId: courseId,   // Debe ser el ID real del curso (número)
            fecha: selectedDate.value,
            tipo: student.attendanceStatus,
            excusa: student.excuse || null, // Asegurar que sea null si no hay excusa
            registeredBy: teacherId,
            createdAt: new Date().toISOString()
          };

          console.log("Enviando payload:", payload); // Para depuración

          const response = await fetch('http://localhost:8080/api/asistencia/registrar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });

          // Verificar si la respuesta es JSON antes de intentar parsearla
          const contentType = response.headers.get('content-type');
          let data;
          
          if (contentType && contentType.includes('application/json')) {
            data = await response.json();
          } else {
            data = await response.text();
          }

          if (!response.ok) {
            // Mostrar el mensaje de error del backend si está disponible
            const errorMsg = data.message || data || `Error ${response.status}: ${response.statusText}`;
            throw new Error(errorMsg);
          }

          student.modified = false;
        }

        showSuccess('Éxito', 'Asistencias guardadas correctamente');
        
      } catch (error) {
        console.error("Error detallado:", error);
        showError('Error al guardar', error.message || 'Revise los datos e intente nuevamente');
      } finally {
        savingAttendances.value = false;
      }
    }

    // Computed properties
    const filteredStudents = computed(() => {
      if (filterStatus.value === 'all') return students.value;
      return students.value.filter(s => s.attendanceStatus === filterStatus.value);
    });

    const attendanceSummary = computed(() => {
      return {
        present: students.value.filter(s => s.attendanceStatus === 'presente').length,
        absent: students.value.filter(s => s.attendanceStatus === 'ausente').length,
        tardy: students.value.filter(s => s.attendanceStatus === 'tardanza').length
      };
    });

    const formattedSelectedDate = computed(() => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(selectedDate.value).toLocaleDateString('es-ES', options);
    });

    // Funciones de ayuda
    function statusBadgeClass(status) {
      return {
        'bg-success': status === 'presente',
        'bg-danger': status === 'ausente',
        'bg-warning': status === 'tardanza'
      };
    }

    function getStatusText(status) {
      return {
        'presente': 'Presente',
        'ausente': 'Ausente',
        'tardanza': 'Tardanza'
      }[status] || status;
    }
    // Función para cargar todos los cursos disponibles
    async function loadAllCourses() {
      try {
        const response = await fetch('http://localhost:8080/api/students/curso');
        if (!response.ok) throw new Error('Error al cargar cursos');
        allCourses.value = await response.json();
      } catch (error) {
        console.error(error);
        showError('Error', 'No se pudieron cargar los cursos disponibles');
      }
    }

    // Función para encontrar el id_curso comparando los datos
    function findCourseId(selectedCourse) {
      if (!selectedCourse || !allCourses.value.length) return null;
      
      return allCourses.value.find(course => 
        course.nombre === selectedCourse.nombreCurso &&
        course.nivel === selectedCourse.nivel &&
        course.turno === selectedCourse.turno &&
        course.gestion == selectedCourse.gestion // Usamos == para manejar string/number
      )?.id_curso || null;
    }

    // Función para cargar el historial de asistencias
    async function loadAttendanceHistory() {
      if (!selectedCourse.value) return;
      
      const courseId = findCourseId(selectedCourse.value);
      if (!courseId) {
        console.error("No se pudo encontrar el ID del curso seleccionado");
        return;
      }

      try {
        loadingHistory.value = true;
        const response = await fetch(`http://localhost:8080/api/asistencia/curso/${courseId}`);
        
        if (!response.ok) throw new Error('Error al cargar el historial');
        
        const data = await response.json();
        console.log("Datos de asistencia recibidos:", data);
        attendanceHistory.value = processAttendanceData(data);
        
      } catch (error) {
        console.error(error);
        showError('Error', error.message);
      } finally {
        loadingHistory.value = false;
      }
    }

    // Procesa los datos de asistencia para quedarse con el último registro por día
    function processAttendanceData(data) {
      const grouped = {};
      
      data.forEach(item => {
        const key = `${item.studentId}_${item.fecha}`;
        if (!grouped[key] || new Date(item.createdAt) > new Date(grouped[key].createdAt)) {
          grouped[key] = item;
        }
      });
      
      return Object.values(grouped);
    }
    // Obtiene fechas únicas ordenadas
    const uniqueDates = computed(() => {
      const dates = [...new Set(attendanceHistory.value.map(item => item.fecha))];
      return dates.sort((a, b) => new Date(b) - new Date(a)); // Más reciente primero
    });

    // Obtiene la asistencia de un estudiante en una fecha específica
    function getAttendanceForStudent(studentId, date) {
      return attendanceHistory.value.find(
        item => item.studentId == studentId && item.fecha === date
      );
    }

    // Formatea la fecha para los headers
    function formatDateHeader(dateStr) {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleString('es-ES', { month: 'short' });
      return `${day} ${month}`;
    }

    // Convierte el status a símbolo
    function getStatusSymbol(status) {
      return {
        'presente': 'P',
        'ausente': 'A',
        'tardanza': 'T'
      }[status] || status;
    }
    async function updateHistoricalAttendance(attendanceRecord, newStatus) {
      try {
        const payload = {
          tipo: newStatus,
          excusa: "", // Siempre vacío como solicitaste
          usuarioId: teacherId // ID del profesor automático
        };

        const response = await fetch(`http://localhost:8080/api/asistencia/editar/${attendanceRecord.id_asistencia}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la asistencia');
        }

        // Actualización local inmediata
        attendanceRecord.tipo = newStatus;
        showSuccess('Éxito', 'Asistencia actualizada correctamente');
        
      } catch (error) {
        console.error(error);
        showError('Error', error.message);
      }
    }
    return {
      teacherCourses,
      selectedCourse,
      students,
      selectedDate,
      filterStatus,
      currentExcuse,
      loadingCourses,
      loadingStudents,
      savingAttendances,
      filteredStudents,
      attendanceSummary,
      formattedSelectedDate,
      loadStudentsForCourse,
      updateAttendance,
      showExcuseModal,
      saveExcuse,
      saveAllAttendances,
      statusBadgeClass,
      getStatusText,
      // ... tus propiedades existentes ...
      attendanceHistory,
      loadingHistory,
      uniqueDates,
      // ... tus métodos existentes ...
      loadAttendanceHistory,
      getAttendanceForStudent,
      formatDateHeader,
      updateHistoricalAttendance
    };
  }
};
</script>

<style scoped>
.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
}

.left-section {
  flex: 3;
  padding-right: 20px;
}

.right-section {
  flex: 1;
  min-width: 300px;
}

.summary-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.student-table {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn.active {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
}

.badge {
  font-size: 0.85em;
  padding: 5px 10px;
}
.history-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.history-section th {
  white-space: nowrap;
  text-align: center;
}

.history-section td {
  text-align: center;
}
.attendance-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.attendance-buttons .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.attendance-buttons .btn.active {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
}

.attendance-buttons .btn-sm {
  min-width: 28px;
}
.history-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 20px auto;
  max-width: 95%;
}

.table-container {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.fixed-size-table {
  width: 100%;
  overflow-x: auto;
  display: block;
  max-height: 500px;
}

.fixed-side {
  position: sticky;
  left: 0;
  background: white;
  z-index: 2;
  min-width: 200px;
  max-width: 200px;
}

.date-header {
  min-width: 120px;
  text-align: center;
}

.attendance-buttons {
  display: flex;
  justify-content: center;
  gap: 5px;
  padding: 5px;
}

/* Mantenemos tus estilos de botones */
.attendance-buttons .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.attendance-buttons .btn.active {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
}

/* Scrollbar styling */
.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
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