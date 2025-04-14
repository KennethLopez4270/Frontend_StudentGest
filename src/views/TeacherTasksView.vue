<template>
    <div class="wrapper">
      <!-- Sidebar -->
      <div class="sidebar animate__animated animate__fadeInLeft">
        <div class="logo">Academia</div>
        <router-link to="/" :class="{ active: $route.name === 'Home' }">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
        <router-link to="/control-asistencia" :class="{ active: $route.name === 'ControlAsistencia' }">
          <i class="fas fa-users"></i> Estudiantes
        </router-link>
        <router-link to="/reportes" :class="{ active: $route.name === 'Reportes' }">
          <i class="fas fa-chart-line"></i> Reportes
        </router-link>
        <router-link to="/historial-academico" :class="{ active: $route.name === 'HistorialAcademico' }">
          <i class="fas fa-book"></i> Tareas
        </router-link>
        <router-link to="/calificaciones" :class="{ active: $route.name === 'Calificaciones' }">
          <i class="fas fa-star"></i> Calificaciones
        </router-link>
        <router-link to="/calendario" :class="{ active: $route.name === 'Calendario' }">
          <i class="fas fa-calendar-alt"></i> Calendario
        </router-link>
        <router-link to="/justificar-ausencias" :class="{ active: $route.name === 'JustificarAusencias' }">
          <i class="fas fa-file-alt"></i> Justificar Ausencias
        </router-link>
        <router-link to="/foro" :class="{ active: $route.name === 'Forum' }">
          <i class="fas fa-comments"></i> Foro
        </router-link>
        <router-link to="/admin-reports" :class="{ active: $route.name === 'AdminReports' }">
          <i class="fas fa-file-export"></i> Informes Admin
        </router-link>
        <router-link to="/task-details" :class="{ active: $route.name === 'TaskDetails' }">
          <i class="fas fa-tasks"></i> Detalles de Tareas
        </router-link>
        <router-link to="/teacher-tasks" :class="{ active: $route.name === 'TeacherTasks' }">
          <i class="fas fa-chalkboard-teacher"></i> Gestión de Tareas
        </router-link>
      </div>
  
      <!-- Main Content -->
      <div class="main-content">
        <div class="left-section">
          <!-- Header -->
          <div class="header animate__animated animate__fadeInDown">
            <h1 class="animate__animated animate__pulse animate__infinite animate__slow">
              Bienvenido {{ teacherName }}
            </h1>
            <a href="#" class="btn btn-lg">Cerrar Sesión</a>
          </div>
  
          <!-- Task Management Section -->
          <div class="form-section animate__animated animate__fadeInUp">
            <h2>Gestión de Tareas</h2>
            <p class="text-sm text-gray-600 mb-4">Registra, califica y comenta las tareas de los estudiantes.</p>
  
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
                    <label for="taskSubject" class="form-label">Materia</label>
                    <select
                      id="taskSubject"
                      v-model="newTask.subject"
                      class="form-select shadow-sm"
                      required
                    >
                      <option value="" disabled>-- Seleccionar --</option>
                      <option value="Ciencias">Ciencias</option>
                      <option value="Matemáticas">Matemáticas</option>
                      <option value="Español">Español</option>
                      <option value="Historia">Historia</option>
                    </select>
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
                    <label for="taskInstructions" class="form-label">Instrucciones</label>
                    <textarea
                      id="taskInstructions"
                      v-model="newTask.instructions"
                      class="form-control shadow-sm"
                      placeholder="Instrucciones detalladas..."
                      rows="2"
                      required
                    ></textarea>
                  </div>
                  <div class="col-md-6">
                    <label for="taskMaterials" class="form-label">Materiales Necesarios</label>
                    <input
                      type="text"
                      id="taskMaterials"
                      v-model="newTask.materials"
                      class="form-control shadow-sm"
                      placeholder="Ej: Cartulinas, lápices..."
                    />
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
                  <div class="col-md-6">
                    <label for="taskStudent" class="form-label">Estudiante</label>
                    <select
                      id="taskStudent"
                      v-model="newTask.studentId"
                      class="form-select shadow-sm"
                      required
                    >
                      <option value="" disabled>-- Seleccionar --</option>
                      <option v-for="student in students" :key="student.id" :value="student.id">
                        {{ student.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-12 text-center">
                    <button type="submit" class="btn btn-primary mt-3">
                      <i class="fas fa-plus me-1"></i> Registrar Tarea
                    </button>
                  </div>
                </div>
              </form>
            </div>
  
            <!-- Lista de Tareas Asignadas -->
            <div class="tasks-section">
              <h3>Tareas Asignadas</h3>
              <div v-if="tasks.length === 0" class="no-tasks text-center text-gray-600">
                No hay tareas asignadas.
              </div>
              <div v-else class="tasks-list">
                <div
                  v-for="task in tasks"
                  :key="task.id"
                  class="task-card animate__animated animate__fadeInUp"
                  :class="{
                    'border-warning': task.status === 'pending',
                    'border-info': task.status === 'submitted',
                    'border-success': task.status === 'graded'
                  }"
                >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5>{{ task.title }}</h5>
                    <span class="type-badge" :class="taskStatusClass(task)">
                      {{ task.status === 'pending' ? 'Pendiente' : task.status === 'submitted' ? 'Entregada' : 'Calificada' }}
                    </span>
                  </div>
                  <p class="small text-muted mb-2">
                    <i class="fas fa-book me-1"></i>{{ task.subject }}
                  </p>
                  <p class="small mb-2">
                    <i class="fas fa-user me-1"></i>Estudiante: {{ getStudentName(task.studentId) }}
                  </p>
                  <p class="small mb-2">
                    <i class="far fa-clock me-1"></i>Fecha de Entrega: {{ task.dueDate }}
                  </p>
                  <p class="small mb-3">{{ task.description }}</p>
  
                  <!-- Formulario para Calificar y Comentar -->
                  <div v-if="task.status !== 'pending'" class="grade-form mt-3">
                    <h6>Calificar y Comentar</h6>
                    <div class="row g-3">
                      <div class="col-md-4">
                        <label :for="'grade-' + task.id" class="form-label">Calificación (0-100)</label>
                        <input
                          :id="'grade-' + task.id"
                          type="number"
                          v-model="task.grade"
                          class="form-control shadow-sm"
                          min="0"
                          max="100"
                          :disabled="task.status === 'graded'"
                        />
                      </div>
                      <div class="col-md-8">
                        <label :for="'comment-' + task.id" class="form-label">Comentarios</label>
                        <textarea
                          :id="'comment-' + task.id"
                          v-model="task.comments"
                          class="form-control shadow-sm"
                          placeholder="Escribe tus comentarios..."
                          rows="2"
                          :disabled="task.status === 'graded'"
                        ></textarea>
                      </div>
                      <div class="col-md-12 text-center">
                        <button
                          v-if="task.status !== 'graded'"
                          class="btn btn-primary btn-sm mt-2"
                          @click="submitGrade(task)"
                        >
                          <i class="fas fa-check me-1"></i> Guardar Calificación
                        </button>
                      </div>
                    </div>
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
            <h3>{{ teacherName }}</h3>
            <p>Profesor</p>
            <p><i class="fas fa-building me-1"></i> Academia Prestige</p>
            <p><i class="fas fa-calendar-alt me-1"></i> Miembro desde: 01/01/2023</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import 'animate.css';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import '@/assets/teacherTasks.css';
  
  export default {
    name: 'TeacherTasksView',
    data() {
      return {
        teacherName: 'Prof. Marta Pérez',
        newTask: {
          title: '',
          subject: '',
          description: '',
          instructions: '',
          materials: '',
          dueDate: '',
          studentId: '',
        },
        students: [
          { id: 1, name: 'Ana González' },
          { id: 2, name: 'Carlos González' },
          { id: 3, name: 'Lucía González' },
        ],
        tasks: [
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
            grade: null,
            comments: null,
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
            status: 'submitted',
            grade: null,
            comments: null,
          },
        ],
      };
    },
    methods: {
      addTask() {
        const newTask = {
          id: this.tasks.length + 1,
          studentId: this.newTask.studentId,
          title: this.newTask.title,
          subject: this.newTask.subject,
          description: this.newTask.description,
          instructions: this.newTask.instructions,
          materials: this.newTask.materials || 'No especificado',
          assignedDate: new Date().toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }),
          dueDate: new Date(this.newTask.dueDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }),
          status: 'pending',
          grade: null,
          comments: null,
        };
        this.tasks.push(newTask);
        this.newTask = {
          title: '',
          subject: '',
          description: '',
          instructions: '',
          materials: '',
          dueDate: '',
          studentId: '',
        };
        alert('Tarea registrada exitosamente.');
      },
      getStudentName(studentId) {
        const student = this.students.find(s => s.id === studentId);
        return student ? student.name : 'Desconocido';
      },
      submitGrade(task) {
        if (task.grade !== null && task.grade >= 0 && task.grade <= 100) {
          task.status = 'graded';
          alert(`Calificación guardada para "${task.title}": ${task.grade}/100`);
        } else {
          alert('Por favor, introduce una calificación válida entre 0 y 100.');
        }
      },
      taskStatusClass(task) {
        return {
          'pending-badge': task.status === 'pending',
          'submitted-badge': task.status === 'submitted',
          'graded-badge': task.status === 'graded',
        };
      },
    },
  };
  </script>