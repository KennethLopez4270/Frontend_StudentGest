<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="main-content">
      <div class="left-section">
        <!-- Header -->
        <WelcomeUser />

        <!-- Carrusel de Estudiantes -->
        <div class="form-section animate__animated animate__fadeInUp">
          <h2>Panel de Padres</h2>
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
                    :class="{ 'active': currentStudentIndex === index }"
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

          <!-- Sección de Calificaciones -->
          <div class="grades-section mb-5">
            <div class="section-header d-flex justify-content-between align-items-center mb-4">
              <h3>Calificaciones Recientes</h3>
              <router-link to="#" class="btn">Ver Todas</router-link>
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

          <!-- Sección de Tareas -->
          <div class="tasks-section">
            <div class="section-header d-flex justify-content-between align-items-center mb-4">
              <h3>Tareas Pendientes</h3>
              <router-link to="#" class="btn">Ver Todas</router-link>
            </div>
            <div class="row g-3">
              <div v-for="task in filteredTasks" :key="task.id" class="col-md-6 col-lg-4">
                <div
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
                  <p class="small mb-3">{{ task.description }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span
                      class="small"
                      :class="{
                        'text-danger': task.status === 'pending' && task.isOverdue,
                        'text-success': task.status === 'completed'
                      }"
                    >
                      <i class="far fa-clock me-1"></i>{{ task.dueDate }}
                    </span>
                    <button
                      class="btn btn-sm"
                      :class="{
                        'btn-danger': task.status === 'pending' && task.isOverdue,
                        'btn-primary': task.status === 'pending' && !task.isOverdue,
                        'btn-success': task.status === 'completed'
                      }"
                    >
                      {{ task.status === 'completed' ? 'Completada' : task.isOverdue ? 'Atrasada' : 'Pendiente' }}
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="filteredTasks.length === 0" class="col-12 text-center text-gray-600">
                No hay tareas disponibles para este estudiante.
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
import '@/assets/parentDashboard.css';
import Sidebar from '../components/Sidebar.vue';
import WelcomeUser from '../components/WelcomeUser.vue';

export default {
  name: 'ParentDashboard',
  components: { Sidebar, WelcomeUser },
  data() {
    return {
      parentName: 'María González',
      currentStudentIndex: 0,
      students: [
        { id: 1, name: 'Ana González', grade: '5° Primaria', section: 'Sección A', avatar: null },
        { id: 2, name: 'Carlos González', grade: '2° Secundaria', section: 'Sección B', avatar: null },
        { id: 3, name: 'Lucía González', grade: '3° Primaria', section: 'Sección C', avatar: null }
      ],
      sampleGrades: [
        { id: 1, studentId: 1, subject: 'Matemáticas', score: 85, date: '15/03/2023' },
        { id: 2, studentId: 1, subject: 'Ciencias', score: 78, date: '10/03/2023' },
        { id: 3, studentId: 2, subject: 'Historia', score: 92, date: '08/03/2023' },
        { id: 4, studentId: 3, subject: 'Español', score: 65, date: '05/03/2023' }
      ],
      sampleTasks: [
        {
          id: 1,
          studentId: 1,
          title: 'Proyecto de Ciencias',
          description: 'Investigación sobre el sistema solar con maqueta',
          subject: 'Ciencias',
          dueDate: '20/03/2023',
          status: 'pending',
          isOverdue: false
        },
        {
          id: 2,
          studentId: 2,
          title: 'Ejercicios de Matemáticas',
          description: 'Páginas 45-50 del libro de ejercicios',
          subject: 'Matemáticas',
          dueDate: '18/03/2023',
          status: 'pending',
          isOverdue: true
        },
        {
          id: 3,
          studentId: 2,
          title: 'Ensayo literario',
          description: 'Redactar un ensayo sobre la obra "Cien años de soledad"',
          subject: 'Español',
          dueDate: '22/03/2023',
          status: 'pending',
          isOverdue: false
        },
        {
          id: 4,
          studentId: 3,
          title: 'Dibujo histórico',
          description: 'Representar una escena de la independencia',
          subject: 'Historia',
          dueDate: '10/03/2023',
          status: 'completed',
          isOverdue: false
        }
      ]
    };
  },
  computed: {
    currentStudent() {
      return this.students[this.currentStudentIndex];
    },
    filteredGrades() {
      return this.sampleGrades.filter(grade => grade.studentId === this.currentStudent.id);
    },
    filteredTasks() {
      return this.sampleTasks.filter(task => task.studentId === this.currentStudent.id);
    }
  },
  methods: {
    prevStudent() {
      if (this.currentStudentIndex > 0) {
        this.currentStudentIndex--;
      }
    },
    nextStudent() {
      if (this.currentStudentIndex < this.students.length - 1) {
        this.currentStudentIndex++;
      }
    },
    selectStudent(index) {
      this.currentStudentIndex = index;
    },
    gradeClass(score) {
      return {
        'bg-danger': score < 60,
        'bg-warning': score >= 60 && score < 80,
        'presente-badge': score >= 80
      };
    },
    taskStatusClass(task) {
      return {
        'ausente-badge': task.status === 'pending' && task.isOverdue,
        'tardanza-badge': task.status === 'pending' && !task.isOverdue,
        'presente-badge': task.status === 'completed'
      };
    },
    taskStatusIcon(task) {
      return {
        'fas fa-exclamation-circle': task.status === 'pending' && task.isOverdue,
        'far fa-clock': task.status === 'pending' && !task.isOverdue,
        'fas fa-check-circle': task.status === 'completed'
      };
    }
  }
};
</script>