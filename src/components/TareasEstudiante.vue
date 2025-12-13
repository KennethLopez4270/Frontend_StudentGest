<template>
  <div class="tareas-estudiante card">
    <h3>Tareas asignadas</h3>
    <ul v-if="tareas.length">
      <li v-for="(tarea, index) in tareas" :key="index" :class="{ completada: tarea.estado === 'completada' }">
        <div class="tarea-info">
          <strong>{{ tarea.titulo }}</strong> - {{ tarea.materia }}
          <span class="fecha">Entrega: {{ tarea.fecha_entrega }}</span>
        </div>
        <span class="estado">{{ tarea.estado }}</span>
      </li>
    </ul>
    <p v-else>No tienes tareas asignadas.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tareas = ref([])

onMounted(() => {
  // Simulación de tareas, luego se puede cambiar por fetch/axios
  tareas.value = [
    {
      titulo: 'Ejercicios de Álgebra',
      materia: 'Matemáticas',
      fecha_entrega: '2025-04-21',
      estado: 'pendiente',
    },
    {
      titulo: 'Ensayo de lectura',
      materia: 'Lenguaje',
      fecha_entrega: '2025-04-20',
      estado: 'completada',
    },
    {
      titulo: 'Cuestionario de historia',
      materia: 'Ciencias Sociales',
      fecha_entrega: '2025-04-22',
      estado: 'pendiente',
    },
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

/* Lista de tareas */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Elementos de la lista */
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(26, 46, 74, 0.15);
  border-left: 5px solid #355e3b;
  transition: all 0.3s ease;
  border-bottom: none; /* Eliminamos el borde inferior porque ahora cada li tiene su propio fondo */
}

/* Efecto hover en los elementos de la lista */
li:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(26, 46, 74, 0.25);
  background: linear-gradient(135deg, #e0e7ff 0%, #ffffff 100%);
  border-left-color: #d4c08a;
}

/* Información de la tarea */
.tarea-info {
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* Título y materia */
.tarea-info strong {
  color: #1a2e4a;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
}

.tarea-info {
  color: #355e3b;
  font-family: 'Poppins', sans-serif;
}

/* Fecha de entrega */
.fecha {
  display: block;
  font-size: 0.9rem;
  color: #a3bffa;
  font-family: 'Poppins', sans-serif;
  font-style: italic;
}

/* Estado de la tarea */
.estado {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  background: #f8f1e9;
  color: #d4c08a; /* Pendiente */
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* Estado completada */
.completada .estado {
  color: #355e3b;
  background: rgba(53, 94, 59, 0.1);
}

/* Mensaje cuando no hay tareas */
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