<template>
  <div class="clases-estudiante card">
    <h3>Clases de hoy</h3>
    <ul v-if="clases.length">
      <li v-for="(clase, index) in clases" :key="index">
        <div class="clase-info">
          <strong>{{ clase.materia }}</strong> - {{ clase.hora }}
          <span class="aula">Aula: {{ clase.aula }}</span>
        </div>
      </li>
    </ul>
    <p v-else>No tienes clases programadas para hoy.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const clases = ref([])

onMounted(() => {
  // Simulación de datos estáticos (luego puedes cambiar a un fetch o axios)
  clases.value = [
    { materia: 'Matemáticas', hora: '08:00 - 09:30', aula: 'A-101' },
    { materia: 'Lenguaje', hora: '10:00 - 11:30', aula: 'B-202' },
    { materia: 'Educación Física', hora: '12:00 - 13:00', aula: 'Gimnasio' },
  ]
})
</script>

<style scoped>
/* Contenedor principal */
.card {
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(26, 46, 74, 0.15);
  border: none;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-in-out;
}

/* Título */
h3 {
  color: #1a2e4a;
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Decoración debajo del título */
h3::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #355e3b, #d4c08a);
  margin-top: 0.5rem;
  border-radius: 2px;
}

/* Lista de clases */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Elementos de la lista */
li {
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

/* Información de la clase */
.clase-info {
  font-size: 1rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 3px 12px rgba(26, 46, 74, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-left: 5px solid #355e3b;
}

/* Efecto hover en la información de la clase */
.clase-info:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(26, 46, 74, 0.25);
  background: linear-gradient(135deg, #e0e7ff 0%, #ffffff 100%);
  border-left-color: #d4c08a;
}

/* Materia y hora */
.clase-info strong {
  color: #1a2e4a;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
}

.clase-info {
  color: #355e3b;
  font-family: 'Poppins', sans-serif;
}

/* Aula */
.aula {
  display: block;
  font-size: 0.9rem;
  color: #a3bffa;
  font-family: 'Poppins', sans-serif;
  font-style: italic;
}

/* Mensaje cuando no hay clases */
p {
  color: #1a2e4a;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  text-align: center;
  padding: 1rem;
  background: rgba(26, 46, 74, 0.05);
  border-radius: 10px;
  border-left: 4px solid #d4c08a;
}

/* Animación de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>