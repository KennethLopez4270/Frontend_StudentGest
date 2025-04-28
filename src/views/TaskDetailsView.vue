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
    const userData = JSON.parse(localStorage.getItem('user'));
    
    return {
      parentName: userData ? `${userData.nombre} ${userData.apellido}` : 'Usuario',
      parentId: userData ? userData.id : null,
      selectedStudent: null,
      students: [],
      tasks: [],
      allCMP: [],
      allDeliveries: [],
      loading: false
    };
  },
  async created() {
    await this.fetchChildren();
  },
  methods: {
    async fetchData(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    },

    async fetchChildren() {
      try {
        this.loading = true;
        const data = await this.fetchData(`http://localhost:8080/api/students/hijos/${this.parentId}`);
        if (data) {
          this.students = data.map(child => ({
            id: child.id_estudiante,
            userId: child.id_usuario,
            name: `${child.nombre} ${child.apellido_paterno}`,
            rawData: child
          }));
          console.log('Hijos obtenidos:', this.students);
        }
      } catch (error) {
        console.error('Error al obtener hijos:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchTasks() {
      if (!this.selectedStudent) return;
      
      try {
        this.loading = true;
        
        // 1. Obtener cursos del estudiante
        const courses = await this.fetchData(`http://localhost:8080/api/students/cursos/${this.selectedStudent.id}`);
        console.log('Cursos del estudiante:', courses);
        
        if (!courses) return;
        
        // 2. Obtener todas las relaciones CMP
        const allCMP = await this.fetchData('http://localhost:8080/api/students/curso_materia_profesor');
        this.allCMP = allCMP || [];
        console.log('Relaciones CMP:', this.allCMP);
        
        // 3. Obtener todas las tareas
        const allTasks = await this.fetchData('http://localhost:8080/api/homework/tareas');
        console.log('Todas las tareas:', allTasks);
        
        // 4. Obtener todas las entregas
        const allDeliveries = await this.fetchData('http://localhost:8080/api/homework/entregas');
        this.allDeliveries = allDeliveries || [];
        console.log('Todas las entregas:', this.allDeliveries);
        
        // Filtrar CMP que pertenecen a los cursos del estudiante
        const studentCourseIds = courses.map(c => c.id_curso);
        const relevantCMP = this.allCMP.filter(cmp => 
          studentCourseIds.includes(cmp.idCurso)
        );
        
        // Filtrar tareas que pertenecen a los CMP relevantes
        const relevantTasks = (allTasks || []).filter(task =>
          relevantCMP.some(cmp => cmp.idCmp === task.idCmp)
        );
        
        // Mapear a formato que espera el frontend
        this.tasks = relevantTasks.map(task => {
          const delivery = this.allDeliveries.find(d => 
            d.idTarea === task.idTarea && d.idEstudiante === this.selectedStudent.id
          );
          
          const cmp = relevantCMP.find(c => c.idCmp === task.idCmp);
          
          return {
            id: task.idTarea,
            studentId: this.selectedStudent.id,
            title: task.titulo,
            description: task.descripcion,
            instructions: task.descripcion,
            materials: 'No especificado',
            subject: `Materia ${cmp.idMateria}`,
            assignedDate: task.creadoEn,
            dueDate: task.fechaEntrega,
            status: delivery ? delivery.estado : 'pending',
            isOverdue: this.isTaskOverdue(task.fechaEntrega),
            comments: delivery ? delivery.comentario : null,
            expanded: false
          };
        });
        
        console.log('Tareas procesadas:', this.tasks);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
      } finally {
        this.loading = false;
      }
    },
    
    isTaskOverdue(dueDate) {
      if (!dueDate) return false;
      const today = new Date();
      const due = new Date(dueDate);
      return today > due;
    },
    
    taskStatusClass(task) {
      return {
        'ausente-badge': task.status === 'pending' && task.isOverdue,
        'tardanza-badge': task.status === 'pending' && !task.isOverdue,
        'presente-badge': ['completed', 'entregado', 'calificado'].includes(task.status),
      };
    },
    
    taskStatusIcon(task) {
      return {
        'fas fa-exclamation-circle': task.status === 'pending' && task.isOverdue,
        'far fa-clock': task.status === 'pending' && !task.isOverdue,
        'fas fa-check-circle': ['completed', 'entregado', 'calificado'].includes(task.status),
      };
    },
  },
};
</script>
