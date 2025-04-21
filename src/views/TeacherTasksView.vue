<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="main-content">
      <div class="left-section">
        <!-- Task Management Section -->
        <div class="form-section animate__animated animate__fadeInUp">
          <h2>Gestión de Tareas</h2>
          <p class="text-sm text-gray-600 mb-4">Registra nuevas tareas para tus cursos.</p>

          <!-- Formulario para Registrar Nueva Tarea -->
          <div class="new-task-form mb-5">
            <h3>Registrar Nueva Tarea</h3>
            <form @submit.prevent="addTask">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="taskTitle" class="form-label">Título de la Tarea</label>
                  <input
                    type="text"
                    id="taskTitle"
                    v-model="newTask.title"
                    class="form-control shadow-sm"
                    placeholder="Ej: Proyecto de Ciencias"
                    required
                  />
                </div>
                
                <div class="col-md-6">
                  <label for="taskCourse" class="form-label">Curso</label>
                  <select
                    id="taskCourse"
                    v-model="newTask.courseId"
                    class="form-select shadow-sm"
                    required
                    :disabled="loadingCourses"
                  >
                    <option value="" disabled>-- Seleccionar --</option>
                    <option 
                      v-for="course in courses" 
                      :key="course.nombreCurso"
                      :value="course.nombreCurso"
                    >
                      {{ course.nombreMateria }} - {{ course.nivel }} ({{ course.turno }})
                    </option>
                  </select>
                  <div v-if="loadingCourses" class="spinner-border spinner-border-sm mt-2" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </div>
                
                <div class="col-md-12">
                  <label for="taskDescription" class="form-label">Descripción</label>
                  <textarea
                    id="taskDescription"
                    v-model="newTask.description"
                    class="form-control shadow-sm"
                    placeholder="Describe la tarea..."
                    rows="3"
                    required
                  ></textarea>
                </div>
                
                <div class="col-md-6">
                  <label for="taskDueDate" class="form-label">Fecha de Entrega</label>
                  <input
                    type="date"
                    id="taskDueDate"
                    v-model="newTask.dueDate"
                    class="form-control shadow-sm"
                    required
                  />
                </div>
                
                <div class="col-md-12 text-center">
                  <button 
                    type="submit" 
                    class="btn btn-primary mt-3"
                    :disabled="loading"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
                    <i v-else class="fas fa-plus me-1"></i> 
                    {{ loading ? 'Registrando...' : 'Registrar Tarea' }}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Lista de Tareas Creadas -->
          <div class="tasks-section">
            <h3>Tareas Recientes</h3>
            <div v-if="tasks.length === 0" class="no-tasks text-center text-gray-600">
              No hay tareas registradas.
            </div>
            <div v-else class="tasks-list">
              <div
                v-for="task in tasks"
                :key="task.id"
                class="task-card animate__animated animate__fadeInUp"
              >
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5>{{ task.title }}</h5>
                  <span class="type-badge">
                    {{ task.course }}
                  </span>
                </div>
                <p class="small mb-2">
                  <i class="fas fa-calendar-day me-1"></i>Entrega: {{ formatDate(task.dueDate) }}
                </p>
                <p class="small mb-3">{{ task.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showSuccess, showError } from '@/utils/useAlert';
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@/assets/teacherTasks.css';
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'TeacherTasksView',
  components: { Sidebar },
  data() {
    return {
      loading: false,
      loadingCourses: false,
      newTask: {
        title: '',
        courseId: '',
        description: '',
        dueDate: ''
      },
      courses: [],
      tasks: []
    };
  },
  async created() {
    await this.loadCourses();
  },
  methods: {
    async loadCourses() {
      try {
        this.loadingCourses = true;
        // El 4 es el ID del profesor (deberías obtenerlo del usuario logueado)
        const response = await fetch('http://localhost:8080/api/students/curso_materia/4');
        
        if (!response.ok) {
          throw new Error('Error al cargar los cursos');
        }
        
        this.courses = await response.json();
        
      } catch (error) {
        console.error(error);
        showError('Error', 'No se pudieron cargar los cursos');
      } finally {
        this.loadingCourses = false;
      }
    },
    
    async addTask() {
      try {
        this.loading = true;
        
        // Encontrar el curso seleccionado para obtener más datos
        const selectedCourse = this.courses.find(c => c.nombreCurso === this.newTask.courseId);
        
        if (!selectedCourse) {
          throw new Error('Curso no encontrado');
        }

        const payload = {
          idCmp: 1, // Valor constante por ahora
          titulo: this.newTask.title,
          descripcion: this.newTask.description,
          fechaEntrega: this.newTask.dueDate
        };

        const response = await fetch('http://localhost:8080/api/homework/tareas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Error al registrar la tarea');
        }

        // Agregar a la lista local
        this.tasks.unshift({
          id: Date.now(),
          title: this.newTask.title,
          description: this.newTask.description,
          course: `${selectedCourse.nombreMateria} - ${selectedCourse.nivel}`,
          dueDate: this.newTask.dueDate
        });

        // Limpiar formulario
        this.newTask = {
          title: '',
          courseId: '',
          description: '',
          dueDate: ''
        };

        showSuccess('Tarea registrada', 'La tarea se ha registrado exitosamente');

      } catch (error) {
        console.error(error);
        showError('Error', error.message || 'Ocurrió un error al registrar la tarea');
      } finally {
        this.loading = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Sin fecha';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    }
  }
};
</script>
