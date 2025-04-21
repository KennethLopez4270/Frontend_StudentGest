<template>
  <section class="courses-section">
    <h1 class="section-title">Tus cursos</h1>
    
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">Error al cargar los datos</div>
    <div v-else-if="summaryData.length === 0" class="empty">No tienes cursos asignados</div>
    <div v-else class="courses-grid">
      <div
        v-for="(item, index) in summaryData"
        :key="index"
        class="course-card"
      >
        <h4 class="course-title">{{ item.nombreMateria }}</h4>
        <p><strong>Curso:</strong> {{ item.nombreCurso }}</p>
        <p><strong>Nivel:</strong> {{ item.nivel }}</p>
        <p><strong>Turno:</strong> {{ capitalizeFirstLetter(item.turno) }}</p>
        <p><strong>Gestión:</strong> {{ item.gestion }}</p>
        <div class="students-section">
          <p><strong>Estudiantes ({{ item.nombresEstudiantes.length }}):</strong></p>
          <ul>
            <li v-for="(student, studentIndex) in item.nombresEstudiantes" :key="studentIndex">
              {{ student }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const summaryData = ref([])
const loading = ref(true)
const error = ref(null)

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const fetchCourseData = async () => {
  try {
    loading.value = true
    error.value = null

    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      throw new Error('Usuario no autenticado')
    }

    const user = JSON.parse(storedUser)
    const userId = user.id

    const response = await fetch(`http://localhost:8080/api/students/curso_materia/${userId}`)
    
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor')
    }

    const data = await response.json()
    summaryData.value = data
  } catch (err) {
    error.value = err.message
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCourseData()
})
</script>

<style scoped>
.courses-section {
  padding: 1.5rem;
}

.section-title {
  color: var(--color-primary);
  font-size: 1.8rem;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: var(--color-accent);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.course-card p {
  color: var(--color-light);
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}


.course-title {
  color: var(--color-light);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.students-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #eee;
  color: var(--color-light);
}

.students-section ul {
  margin-top: 0.5rem;
  padding-left: 1.2rem;
}

.students-section li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

/* Estados */
.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #7f8c8d;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>