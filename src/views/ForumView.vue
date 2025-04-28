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

          <!-- Lista de Temas -->
          <div v-if="topics.length === 0" class="no-topics">
            No hay temas disponibles en este momento.
          </div>
          <div v-else class="topics-list">
            <div
              v-for="(topic, index) in topics"
              :key="index"
              class="topic-card animate__animated animate__fadeInUp"
              :class="{ 'animate__delay-1s': index % 2 === 0, 'animate__delay-2s': index % 2 !== 0 }"
            >
              <div class="topic-header">
                <h3>{{ topic.title }}</h3>
                <span class="type-badge">Creado por {{ topic.author }}</span>
              </div>
              <p class="topic-content">{{ topic.content }}</p>
              <p class="topic-date">
                <i class="far fa-calendar-alt me-1"></i>{{ topic.date }}
              </p>
              <button @click="viewTopic(index)" class="btn btn-view">
                {{ selectedTopic === index ? 'Ocultar' : 'Ver' }} Discusión
              </button>

              <!-- Respuestas -->
              <div v-if="selectedTopic === index" class="replies-section">
                <h4>Respuestas</h4>
                <div v-if="topic.replies.length === 0" class="no-replies">
                  No hay respuestas todavía. ¡Sé el primero en responder!
                </div>
                <div v-else class="replies-list">
                  <div v-for="(reply, replyIndex) in topic.replies" :key="replyIndex" class="reply-card">
                    <p class="reply-content">{{ reply.content }}</p>
                    <p class="reply-meta">
                      <i class="fas fa-user me-1"></i>{{ reply.author }} | 
                      <i class="far fa-calendar-alt me-1"></i>{{ reply.date }}
                    </p>
                  </div>
                </div>

                <!-- Formulario para Responder -->
                <form @submit.prevent="addReply(index)" class="reply-form">
                  <div class="form-group">
                    <label for="replyTextarea" class="form-label">Escribe tu respuesta</label>
                    <textarea
                      id="replyTextarea"
                      v-model="newReply"
                      class="form-control"
                      placeholder="Escribe tu respuesta aquí..."
                      required
                      rows="3"
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-reply"><i class="fas fa-reply me-1"></i> Responder</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <div class="profile-card animate__animated animate__fadeInRight">
          <img src="https://i.pinimg.com/736x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg" alt="Profile" />
          <h3>{{ parentName }}</h3>
          <p>Tutor</p>
          <p><i class="fas fa-building me-1"></i> Academia Prestige</p>
          <p><i class="fas fa-calendar-alt me-1"></i> Miembro desde: 01/01/2023</p>
          <p><i class="fas fa-users me-1"></i> {{ studentsCount }} Estudiantes</p>
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
    return {
      parentName: 'María González',
      studentsCount: 3,
      newReply: '',
      selectedTopic: null,
      topics: [
        {
          title: 'Cómo apoyar a los niños con las tareas escolares',
          content: 'Me gustaría discutir estrategias para ayudar a nuestros hijos con las tareas sin hacerlas por ellos. ¿Qué métodos han funcionado para ustedes?',
          author: 'Prof. Marta Pérez',
          date: '14 de abril de 2025',
          replies: [
            {
              content: 'Yo suelo establecer un horario fijo para las tareas y les doy pequeñas recompensas por completarlas a tiempo.',
              author: 'Laura Rodríguez, Madre',
              date: '14 de abril de 2025',
            },
          ],
        },
        {
          title: 'Estrategias para mejorar la comunicación entre padres y profesores',
          content: '¿Qué herramientas o métodos recomiendan para mantener una comunicación efectiva entre padres y profesores?',
          author: 'Prof. Carlos Gómez',
          date: '14 de abril de 2025',
          replies: [],
        },
      ],
    };
  },
  methods: {
    logout() {
      // Lógica para cerrar sesión
      console.log('Sesión cerrada');
    },
    viewTopic(index) {
      this.selectedTopic = this.selectedTopic === index ? null : index;
    },
    addReply(topicIndex) {
      const today = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      this.topics[topicIndex].replies.push({
        content: this.newReply,
        author: 'María González, Madre',
        date: today,
      });
      this.newReply = '';
    },
  },
};
</script>