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
          <button @click="logout" class="btn btn-lg logout-btn">Cerrar Sesión</button>
        </div>

        <!-- Forum Section -->
        <div class="form-section animate__animated animate__fadeInUp">
          <h2>Foro de la Comunidad</h2>
          <p class="description">Conecta con otros padres y profesores para discutir temas educativos.</p>

          <!-- Selector de Curso -->
          <div class="mb-4">
            <label for="courseSelect" class="form-label">Selecciona un curso:</label>
            <select 
              id="courseSelect" 
              v-model="selectedCourse" 
              class="form-select shadow-sm"
              @change="loadForumsForCourse"
            >
              <option value="">Todos los cursos</option>
              <option 
                v-for="course in uniqueCourses" 
                :key="course.id_curso" 
                :value="course.id_curso"
              >
                {{ course.nombre }} ({{ course.nivel }} - {{ course.turno }})
              </option>
            </select>
          </div>

          <!-- Lista de Temas -->
          <div v-if="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <div v-else-if="forums.length === 0" class="no-topics text-center text-gray-600">
            No hay foros disponibles en este curso.
          </div>
          <div v-else class="topics-list">
            <div
              v-for="(forum, index) in forums"
              :key="forum.id"
              class="topic-card animate__animated animate__fadeInUp"
              :class="{ 'animate__delay-1s': index % 2 === 0, 'animate__delay-2s': index % 2 !== 0 }"
            >
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h3>{{ forum.titulo }}</h3>
                <span class="type-badge">Curso: {{ getCourseName(forum.cursoId) }}</span>
              </div>
              <p class="text-muted small mb-3">
                <i class="fas fa-user me-1"></i> {{ getAuthorName(forum.creadoPor) }} | 
                <i class="far fa-calendar-alt me-1"></i> {{ formatDate(forum.creadoEn) }}
              </p>
              <button @click="toggleForumMessages(forum.id)" class="btn btn-sm btn-primary">
                {{ selectedForum === forum.id ? 'Ocultar' : 'Ver' }} Discusión
              </button>

              <!-- Respuestas -->
              <div v-if="selectedForum === forum.id" class="replies-section mt-4">
                <h4>Mensajes</h4>
                <div v-if="forumMessagesLoading" class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </div>
                <div v-else-if="forumMessages[forum.id] && forumMessages[forum.id].length === 0" class="no-replies text-center text-gray-600">
                  No hay mensajes todavía. ¡Sé el primero en comentar!
                </div>
                <div v-else-if="forumMessages[forum.id]" class="replies-list">
                  <div v-for="(message, messageIndex) in forumMessages[forum.id]" :key="messageIndex" class="reply-card">
                    <p>{{ message.mensaje }}</p>
                    <p class="text-muted small">
                      <i class="fas fa-user me-1"></i>{{ getAuthorName(message.usuarioId) }} | 
                      <i class="far fa-calendar-alt me-1"></i>{{ formatDate(message.fecha) }}
                    </p>
                  </div>
                </div>

                <!-- Formulario para Responder -->
                <form @submit.prevent="addMessage(forum.id)" class="reply-form mt-4">
                  <div class="mb-3">
                    <label for="replyTextarea" class="form-label">Escribe tu mensaje</label>
                    <textarea
                      id="replyTextarea"
                      v-model="newMessage"
                      class="form-control shadow-sm"
                      placeholder="Escribe tu mensaje aquí..."
                      required
                      rows="3"
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary"><i class="fas fa-reply me-1"></i> Enviar</button>
                </form>
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
import '@/assets/forum.css';

import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'ForumView',
  components: { Sidebar },
  
  data() {
    // Obtener datos del usuario del localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    
    return {
      parentName: userData ? `${userData.nombre} ${userData.apellido}` : 'Usuario',
      parentId: userData ? userData.id : null, // ID dinámico del padre logueado
      children: [],
      courses: [],
      forums: [],
      forumMessages: {},
      selectedCourse: '',
      selectedForum: null,
      newMessage: '',
      loading: false,
      forumMessagesLoading: false,
      authorsCache: {}
    };
  },
  
  computed: {
    uniqueCourses() {
      // Eliminar cursos duplicados
      const unique = [];
      const map = new Map();
      for (const course of this.courses) {
        if (!map.has(course.id_curso)) {
          map.set(course.id_curso, true);
          unique.push(course);
        }
      }
      return unique;
    },
    studentsCount() {
      return this.children.length;
    }
  },
  async created() {
    console.log('Componente creado - Iniciando carga de datos...');
    await this.loadChildren();
    await this.loadCoursesForChildren();
    await this.loadAllForums();
  },
  methods: {
    async loadChildren() {
      console.log(`Cargando hijos del padre ID: ${this.parentId}`);
      try {
        const response = await fetch(`http://localhost:8080/api/students/hijos/${this.parentId}`);
        this.children = await response.json();
        console.log('Hijos cargados:', this.children);
      } catch (error) {
        console.error('Error al cargar los hijos:', error);
      }
    },
    async loadCoursesForChildren() {
      console.log('Cargando cursos para los hijos...');
      this.courses = [];
      
      if (this.children.length === 0) {
        console.log('No hay hijos para cargar cursos');
        return;
      }

      for (const child of this.children) {
        console.log(`Cargando cursos para hijo ID: ${child.id_estudiante}`);
        try {
          const response = await fetch(`http://localhost:8080/api/students/cursos/${child.id_estudiante}`);
          const childCourses = await response.json();
          console.log(`Cursos para hijo ${child.id_estudiante}:`, childCourses);
          this.courses.push(...childCourses);
        } catch (error) {
          console.error(`Error al cargar cursos para el hijo ${child.id_estudiante}:`, error);
        }
      }
      console.log('Todos los cursos cargados:', this.courses);
    },
    async loadAllForums() {
      console.log('Cargando todos los foros...');
      this.loading = true;
      this.forums = [];
      
      if (this.uniqueCourses.length === 0) {
        console.log('No hay cursos disponibles para cargar foros');
        this.loading = false;
        return;
      }

      // Cargar foros para cada curso único
      for (const course of this.uniqueCourses) {
        console.log(`Cargando foros para curso ID: ${course.id_curso}`);
        try {
          const response = await fetch(`http://localhost:8088/api/foro/curso/${course.id_curso}`);
          const courseForums = await response.json();
          console.log(`Foros para curso ${course.id_curso}:`, courseForums);
          this.forums.push(...courseForums);
        } catch (error) {
          console.error(`Error al cargar foros para el curso ${course.id_curso}:`, error);
        }
      }
      
      console.log('Todos los foros cargados:', this.forums);
      this.loading = false;
    },
    async loadForumsForCourse() {
      console.log(`Cargando foros para curso seleccionado: ${this.selectedCourse}`);
      this.loading = true;
      this.forums = [];
      
      if (!this.selectedCourse) {
        console.log('No se seleccionó curso específico, cargando todos');
        await this.loadAllForums();
        return;
      }

      try {
        const response = await fetch(`http://localhost:8088/api/foro/curso/${this.selectedCourse}`);
        this.forums = await response.json();
        console.log(`Foros para curso ${this.selectedCourse}:`, this.forums);
      } catch (error) {
        console.error(`Error al cargar foros para el curso ${this.selectedCourse}:`, error);
      }
      
      this.loading = false;
    },
    async toggleForumMessages(forumId) {
      console.log(`Alternando mensajes para foro ID: ${forumId}`);
      if (this.selectedForum === forumId) {
        this.selectedForum = null;
        return;
      }
      
      this.selectedForum = forumId;
      
      if (this.forumMessages[forumId]) {
        console.log('Mensajes ya cargados, mostrando desde caché');
        return;
      }
      
      this.forumMessagesLoading = true;
      try {
        console.log(`Cargando mensajes para foro ID: ${forumId}`);
        const response = await fetch(`http://localhost:8088/api/foro/${forumId}/mensajes`);
        const messages = await response.json();
        console.log(`Mensajes para foro ${forumId}:`, messages);
        
        // Reemplaza this.$set con la siguiente línea:
        this.forumMessages = {...this.forumMessages, [forumId]: messages};
        
      } catch (error) {
        console.error(`Error al cargar mensajes para el foro ${forumId}:`, error);
      }
      this.forumMessagesLoading = false;
    },
    async addMessage(forumId) {
  if (!this.newMessage.trim()) return;

  console.log(`Agregando nuevo mensaje al foro ID: ${forumId}`);
  
  // Usar el primer hijo como usuario (ajusta según tu lógica)
  const usuarioId = this.children.length > 0 ? this.children[0].id_usuario : null;
  
  if (!usuarioId) {
    console.error('No se pudo determinar el usuario');
    return;
  }

  try {
    const response = await fetch(`http://localhost:8088/api/foro/${forumId}/comentar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuarioId: usuarioId,
        mensaje: this.newMessage
      })
    });

    if (response.ok) {
      console.log('Mensaje enviado con éxito');
      // Recargar los mensajes del foro
      const updatedMessages = await fetch(`http://localhost:8088/api/foro/${forumId}/mensajes`).then(res => res.json());
      
      // Actualizar reactivamente los mensajes
      this.forumMessages = {
        ...this.forumMessages,
        [forumId]: updatedMessages
      };
      
      this.newMessage = '';
    } else {
      console.error('Error al enviar el mensaje');
    }
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
  }
},
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getCourseName(courseId) {
      const course = this.courses.find(c => c.id_curso === courseId);
      return course ? `${course.nombre} (${course.nivel})` : `Curso ${courseId}`;
    },
    async getAuthorName(userId) {
      console.log(`Obteniendo nombre para usuario ID: ${userId}`);
      
      // Si ya tenemos el nombre en caché, lo devolvemos
      if (this.authorsCache[userId]) {
        console.log(`Nombre encontrado en caché: ${this.authorsCache[userId]}`);
        return this.authorsCache[userId];
      }

      // Primero buscamos en los hijos
      const child = this.children.find(c => c.id_usuario === userId);
      if (child) {
        const name = `${child.nombre} ${child.apellido_paterno || ''}`.trim();
        this.authorsCache[userId] = name;
        console.log(`Nombre de hijo encontrado: ${name}`);
        return name;
      }

      // Si no es un hijo, podríamos hacer una llamada al backend para obtener el nombre del usuario
      // Pero como no tenemos ese endpoint, usaremos un valor por defecto
      this.authorsCache[userId] = `Usuario ${userId}`;
      console.log(`Nombre por defecto: Usuario ${userId}`);
      return `Usuario ${userId}`;
    }
  }
};
</script>