<template>
  <div class="dashboard-layout">
    <!-- 
      Sidebar Placeholder:
      Esta columna asegura la estructura de dos paneles.
      NO eliminar: mantiene el layout responsive en desktop.
    -->
    <div class="sidebar-column">
    </div>

    <!-- Columna derecha: Contenido principal -->
    <div class="content-column">
      <Sidebar />
      <WelcomeBanner />
      <div class="content">
        <div class="form-section animate__animated animate__fadeInUp">
          <h2>Panel de Padres</h2>

          <!-- Carrusel de Estudiantes -->
          <div class="student-carousel mb-5">
            <h4 class="section-title mb-4">Selecciona un Estudiante</h4>
            <div class="position-relative">
              <button
                @click="prevStudent"
                class="carousel-control prev"
                :disabled="currentStudentIndex === 0"
              >
                <i class="fas fa-chevron-left"></i>
              </button>

              <div class="students-wrapper">
                <transition-group name="slide" tag="div" class="students-container">
                  <div
                    v-for="(student, index) in students"
                    :key="student.id"
                    class="student-card"
                    :class="{ active: currentStudentIndex === index }"
                    @click="selectStudent(index)"
                  >
                    <div class="student-avatar">
                      <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="student-info">
                      <h5>{{ student.name }}</h5>
                      <p><i class="fas fa-graduation-cap me-1"></i>{{ student.grade }}</p>
                      <span class="type-badge">{{ student.section }}</span>
                    </div>
                  </div>
                </transition-group>
              </div>

              <button
                @click="nextStudent"
                class="carousel-control next"
                :disabled="currentStudentIndex === students.length - 1"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Calificaciones -->
          <div class="grades-section mb-5">
            <div class="section-header d-flex justify-content-between align-items-center mb-4">
              <h3>Calificaciones Recientes</h3>
              <!-- <router-link to="#" class="btn">Ver Todas</router-link> -->
            </div>
            <div class="row g-3">
              <div v-for="grade in filteredGrades" :key="grade.id" class="col-md-6 col-lg-3">
                <div class="grade-card animate__animated animate__fadeInUp">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5>{{ grade.subject }}</h5>
                    <span class="type-badge" :class="gradeClass(grade.score)">
                      {{ grade.score }}%
                    </span>
                  </div>
                  <p class="text-muted small mb-2">
                    <i class="far fa-calendar-alt me-1"></i>{{ grade.date }}
                  </p>
                  <div class="progress" style="height: 6px;">
                    <div
                      class="progress-bar"
                      :class="gradeClass(grade.score)"
                      :style="{ width: grade.score + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-if="filteredGrades.length === 0" class="col-12 text-center text-gray-600">
                No hay calificaciones disponibles para este estudiante.
              </div>
            </div>
          </div>

          <!-- Tareas -->
          <div class="tasks-section">
            <div class="section-header d-flex justify-content-between align-items-center mb-4">
              <h3>Tareas Pendientes</h3>
              <!-- <router-link to="#" class="btn">Ver Todas</router-link> -->
            </div>
            <div class="row g-3">
              <div v-for="task in filteredHomework" :key="task.idEntrega" class="col-md-6 col-lg-4">
                <div
                  class="task-card animate__animated animate__fadeInUp"
                  :class="{
                    'border-danger': task.estado === 'pendiente' && isOverdue(task.fechaEntrega),
                    'border-success': task.estado === 'entregado'
                  }"
                >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5>Tarea #{{ task.idTarea }}</h5>
                    <span class="type-badge" :class="homeworkStatusClass(task)">
                      <i :class="homeworkStatusIcon(task)"></i>
                    </span>
                  </div>
                  <p class="small text-muted mb-2">
                    <i class="fas fa-book me-1"></i>Asignatura no especificada
                  </p>
                  <p class="small mb-3">{{ task.comentario || 'Sin comentarios' }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span
                      class="small"
                      :class="{
                        'text-danger': task.estado === 'pendiente' && isOverdue(task.fechaEntrega),
                        'text-success': task.estado === 'entregado'
                      }"
                    >
                      <i class="far fa-clock me-1"></i>
                      {{ task.fechaEntrega ? formatDate(task.fechaEntrega) : 'Sin fecha' }}
                    </span>
                    <button
                      class="btn btn-sm"
                      :class="{
                        'btn-danger': task.estado === 'pendiente' && isOverdue(task.fechaEntrega),
                        'btn-primary': task.estado === 'pendiente' && !isOverdue(task.fechaEntrega),
                        'btn-success': task.estado === 'entregado'
                      }"
                    >
                      {{ task.estado === 'entregado' ? 'Entregada' : isOverdue(task.fechaEntrega) ? 'Atrasada' : 'Pendiente' }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="filteredHomework.length === 0" class="col-12 text-center text-gray-600">
                No hay tareas disponibles para este estudiante.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import WelcomeBanner from '@/components/WelcomeBanner.vue'
import '@/assets/parentDashboard.css';
import { ref, computed, onMounted } from 'vue';

// Datos del padre y estado del componente
const parentName = ref('');
const currentStudentIndex = ref(0);
const isLoading = ref(true);

// Datos de estudiantes (se cargarán desde la API)
const students = ref([]);
const homework = ref([]); // Nuevo: Para almacenar las tareas del API

// Datos de ejemplo para calificaciones
const sampleGrades = ref([
  { id: 1, studentId: 1, subject: 'Matemáticas', score: 85, date: '15/03/2023' },
  { id: 2, studentId: 1, subject: 'Ciencias', score: 78, date: '10/03/2023' },
  { id: 3, studentId: 2, subject: 'Historia', score: 92, date: '08/03/2023' },
  { id: 4, studentId: 3, subject: 'Español', score: 65, date: '05/03/2023' }
]);

// Obtener el ID del padre desde localStorage
const userData = JSON.parse(localStorage.getItem("user"));
const parentId = userData?.id;

// Cargar los hijos del padre
async function loadChildren() {
  if (!parentId) {
    console.error("No se encontró el ID del padre");
    return;
  }
  
  try {
    isLoading.value = true;
    const response = await fetch(`http://localhost:8080/api/students/hijos/${parentId}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Mapear los datos de la API al formato esperado
    students.value = data.map(student => ({
      id: student.id_estudiante,
      name: `${student.nombre} ${student.apellido_paterno || ''} ${student.apellido_materno || ''}`.trim(),
      grade: 'Grado no especificado',
      section: 'Sección no especificada',
      avatar: student.foto
    }));
    
    // Establecer el nombre del padre para mostrar
    parentName.value = `${userData.nombre} ${userData.apellido_paterno || ''}`.trim();
    
  } catch (error) {
    console.error('Error al cargar los estudiantes:', error);
    students.value = [
      { id: 1, name: 'Ana González', grade: '5° Primaria', section: 'Sección A', avatar: null },
      { id: 2, name: 'Carlos González', grade: '2° Secundaria', section: 'Sección B', avatar: null }
    ];
  } finally {
    isLoading.value = false;
  }
}

// Cargar las tareas desde el API
async function loadHomework() {
  try {
    const response = await fetch('http://localhost:8080/api/homework/entregas');
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    homework.value = await response.json();
  } catch (error) {
    console.error('Error al cargar las tareas:', error);
    homework.value = [];
  }
}

// Formatear fecha
function formatDate(dateString) {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
}

// Verificar si la tarea está vencida
function isOverdue(dateString) {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  return dueDate < today;
}

// Cargar los datos cuando el componente se monta
onMounted(() => {
  loadChildren();
  loadHomework();
});

// Computed properties
const currentStudent = computed(() => {
  return students.value.length > 0 
    ? students.value[currentStudentIndex.value] 
    : { id: null };
});

const filteredGrades = computed(() => {
  if (!currentStudent.value?.id) return [];
  return sampleGrades.value.filter((grade) => grade.studentId === currentStudent.value.id);
});

const filteredHomework = computed(() => {
  if (!currentStudent.value?.id) return [];
  return homework.value.filter((task) => task.idEstudiante === currentStudent.value.id);
});

// Funciones del carrusel
function prevStudent() {
  if (currentStudentIndex.value > 0) {
    currentStudentIndex.value--;
  }
}

function nextStudent() {
  if (currentStudentIndex.value < students.value.length - 1) {
    currentStudentIndex.value++;
  }
}

function selectStudent(index) {
  currentStudentIndex.value = index;
}

// Funciones de estilo
function gradeClass(score) {
  return {
    'bg-danger': score < 60,
    'bg-warning': score >= 60 && score < 80,
    'presente-badge': score >= 80
  };
}

function homeworkStatusClass(task) {
  return {
    'ausente-badge': task.estado === 'pendiente' && isOverdue(task.fechaEntrega),
    'tardanza-badge': task.estado === 'pendiente' && !isOverdue(task.fechaEntrega),
    'presente-badge': task.estado === 'entregado'
  };
}

function homeworkStatusIcon(task) {
  return {
    'fas fa-exclamation-circle': task.estado === 'pendiente' && isOverdue(task.fechaEntrega),
    'far fa-clock': task.estado === 'pendiente' && !isOverdue(task.fechaEntrega),
    'fas fa-check-circle': task.estado === 'entregado'
  };
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(---t-color-bg);
}

/* Sidebar */
.sidebar-column {
  width: 240px;
  background-color: var(--t-color-sidebar);
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
    display: none; /* oculto el sidebar estático, ahora depende del burger */
  }

  .content-column {
    width: 100%;
    padding: 10px;
  }
}
</style>
