<template>
    <div class="wrapper">
      <!-- Sidebar -->
      <Sidebar />
  
      <!-- Main Content -->
      <div class="main-content">
        <div class="left-section">
          <!-- Header -->
          <div class="header animate__animated animate__fadeInDown">
            <h1 class="animate__animated animate__pulse animate__infinite animate__slow">
              Bienvenido {{ parentName }}
            </h1>
            <a href="#" class="btn btn-lg">Cerrar Sesión</a>
          </div>
  
          <!-- Task Details Section -->
          <div class="form-section animate__animated animate__fadeInUp">
            <h2>Detalles de Tareas</h2>
            <p class="text-sm text-gray-600 mb-4">Revisa las tareas de tus hijos para brindarles apoyo si lo necesitan.</p>
  
            <!-- Selector de Estudiante -->
            <div class="row g-3 mb-6 justify-content-center">
              <div class="col-md-6">
                <label for="studentSelect" class="form-label">Seleccionar Estudiante</label>
                <select
                  id="studentSelect"
                  v-model="selectedStudent"
                  class="form-select form-select-lg shadow-sm"
                  @change="fetchTasks"
                >
                  <option value="" disabled>-- Seleccionar --</option>
                  <option v-for="student in students" :key="student.id" :value="student">
                    {{ student.name }}
                  </option>
                </select>
              </div>
            </div>
  
            <!-- Lista de Tareas -->
            <div class="tasks-section">
              <h3 v-if="selectedStudent">Tareas de {{ selectedStudent.name }}</h3>
              <div v-if="!selectedStudent" class="no-selection text-center text-gray-600">
                Selecciona un estudiante para ver sus tareas.
              </div>
              <div v-else-if="tasks.length === 0" class="no-tasks text-center text-gray-600">
                No hay tareas disponibles para este estudiante.
              </div>
              <div v-else class="tasks-list">
                <div
                  v-for="task in tasks"
                  :key="task.id"
                  class="task-card animate__animated animate__fadeInUp"
                  :class="{
                    'border-danger': task.status === 'pending' && task.isOverdue,
                    'border-success': task.status === 'completed'
                  }"
                >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5>{{ task.title }}</h5>
                    <span class="type-badge" :class="taskStatusClass(task)">
                      <i :class="taskStatusIcon(task)"></i>
                    </span>
                  </div>
                  <p class="small text-muted mb-2">
                    <i class="fas fa-book me-1"></i>{{ task.subject }}
                  </p>
                  <p class="small mb-2">
                    <i class="far fa-clock me-1"></i>Fecha de Entrega: {{ task.dueDate }}
                  </p>
                  <p class="small mb-3">{{ task.description }}</p>
                  <div v-if="task.comments" class="comments-section mb-3">
                    <p class="small text-muted">
                      <i class="fas fa-comment me-1"></i>Comentarios del Profesor: {{ task.comments }}
                    </p>
                  </div>
                  <button
                    class="btn btn-sm btn-primary"
                    @click="task.expanded = !task.expanded"
                  >
                    {{ task.expanded ? 'Ocultar Detalles' : 'Ver Detalles' }}
                  </button>
                  <div v-if="task.expanded" class="task-details mt-3">
                    <p><strong>Instrucciones:</strong> {{ task.instructions }}</p>
                    <p><strong>Materiales Necesarios:</strong> {{ task.materials || 'No especificado' }}</p>
                    <p><strong>Fecha de Asignación:</strong> {{ task.assignedDate }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Right Section -->
        <div class="right-section">
          <div class="profile-card animate__animated animate__fadeInRight">
            <img src="https://i.pinimg.com/736x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg" alt="Profile" class="shadow-lg" />
            <h3>{{ parentName }}</h3>
            <p>Tutor</p>
            <p><i class="fas fa-building me-1"></i> Academia Prestige</p>
            <p><i class="fas fa-calendar-alt me-1"></i> Miembro desde: 01/01/2023</p>
            <p><i class="fas fa-users me-1"></i> {{ students.length }} Estudiantes</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import 'animate.css';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import '@/assets/taskDetails.css';
import Sidebar from '../components/Sidebar.vue';
  
  export default {
    name: 'TaskDetailsView',
    components: { Sidebar },
    data() {
      return {
        parentName: 'María González',
        selectedStudent: '',
        students: [
          { id: 1, name: 'Ana González', grade: '5° Primaria', section: 'Sección A' },
          { id: 2, name: 'Carlos González', grade: '2° Secundaria', section: 'Sección B' },
          { id: 3, name: 'Lucía González', grade: '3° Primaria', section: 'Sección C' },
        ],
        tasks: [],
        sampleTasks: [
          {
            id: 1,
            studentId: 1,
            title: 'Proyecto de Ciencias',
            description: 'Investigación sobre el sistema solar con maqueta',
            instructions: 'Realizar una investigación sobre los planetas y construir una maqueta del sistema solar.',
            materials: 'Cartulinas, pinturas, esferas de poliestireno',
            subject: 'Ciencias',
            assignedDate: '10/04/2025',
            dueDate: '20/04/2025',
            status: 'pending',
            isOverdue: false,
            comments: 'Asegúrate de incluir datos sobre las órbitas de los planetas.',
            expanded: false,
          },
          {
            id: 2,
            studentId: 2,
            title: 'Ejercicios de Matemáticas',
            description: 'Páginas 45-50 del libro de ejercicios',
            instructions: 'Resolver los ejercicios de álgebra en las páginas indicadas.',
            materials: 'Libro de matemáticas, calculadora',
            subject: 'Matemáticas',
            assignedDate: '08/04/2025',
            dueDate: '14/04/2025',
            status: 'pending',
            isOverdue: true,
            comments: 'Revisar los ejercicios de ecuaciones lineales con más cuidado.',
            expanded: false,
          },
          {
            id: 3,
            studentId: 2,
            title: 'Ensayo literario',
            description: 'Redactar un ensayo sobre "Cien años de soledad"',
            instructions: 'Escribir un ensayo de 500 palabras analizando los temas principales de la obra.',
            materials: 'Libro "Cien años de soledad", computadora',
            subject: 'Español',
            assignedDate: '12/04/2025',
            dueDate: '22/04/2025',
            status: 'pending',
            isOverdue: false,
            comments: null,
            expanded: false,
          },
          {
            id: 4,
            studentId: 3,
            title: 'Dibujo histórico',
            description: 'Representar una escena de la independencia',
            instructions: 'Dibujar una escena representativa de la independencia de Bolivia.',
            materials: 'Hojas de dibujo, lápices de colores',
            subject: 'Historia',
            assignedDate: '05/04/2025',
            dueDate: '10/04/2025',
            status: 'completed',
            isOverdue: false,
            comments: 'Excelente trabajo, muy detallado.',
            expanded: false,
          },
        ],
      };
    },
    methods: {
      fetchTasks() {
        if (this.selectedStudent) {
          this.tasks = this.sampleTasks.filter(task => task.studentId === this.selectedStudent.id);
        } else {
          this.tasks = [];
        }
      },
      taskStatusClass(task) {
        return {
          'ausente-badge': task.status === 'pending' && task.isOverdue,
          'tardanza-badge': task.status === 'pending' && !task.isOverdue,
          'presente-badge': task.status === 'completed',
        };
      },
      taskStatusIcon(task) {
        return {
          'fas fa-exclamation-circle': task.status === 'pending' && task.isOverdue,
          'far fa-clock': task.status === 'pending' && !task.isOverdue,
          'fas fa-check-circle': task.status === 'completed',
        };
      },
    },
  };
  </script>