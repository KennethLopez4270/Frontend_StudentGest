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
    </div>
  </div>
</template>

<script>
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
      const tareaPayload = {
        idCmp: 1,
        titulo: this.newTask.title,
        descripcion: this.newTask.description,
        fechaEntrega: this.newTask.dueDate, // En formato YYYY-MM-DD
      };

      fetch('http://localhost:8080/api/homework/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tareaPayload),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al registrar la tarea');
          }
          return response.json();
        })
        .then(data => {
          alert('Tarea registrada exitosamente en el backend 🎯');
          // Limpia el formulario
          this.newTask = {
            title: '',
            subject: '',
            description: '',
            instructions: '',
            materials: '',
            dueDate: '',
            studentId: '',
          };
        })
        .catch(error => {
          console.error(error);
          alert('Ocurrió un error al registrar la tarea 😓');
        });
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