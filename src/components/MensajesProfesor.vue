<template>
  <div class="mensajes-profesor card">
    <h3>Mensajes de profesores</h3>
    <ul v-if="mensajes.length">
      <li v-for="(msg, i) in mensajes" :key="i">
        <strong>{{ msg.profesor }}:</strong> {{ msg.mensaje }}
        <span class="fecha">{{ msg.fecha }}</span>
      </li>
    </ul>
    <p v-else>No tienes mensajes nuevos.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mensajes = ref([])

onMounted(() => {
  mensajes.value = [
    { profesor: 'Prof. Ramírez', mensaje: 'Revisar la tarea de matemáticas.', fecha: '18/04/2025' },
    { profesor: 'Prof. Gómez', mensaje: 'Clase suspendida el lunes.', fecha: '17/04/2025' },
  ]
})
</script>

<style scoped>
/* Contenedor principal */
.card {
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
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

/* Lista de mensajes */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Elementos de la lista */
li {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(26, 46, 74, 0.15);
  border-left: 5px solid #355e3b;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* Efecto hover en los elementos de la lista */
li:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(26, 46, 74, 0.25);
  background: linear-gradient(135deg, #e0e7ff 0%, #ffffff 100%);
  border-left-color: #d4c08a;
}

/* Profesor y mensaje */
strong {
  color: #1a2e4a;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.1rem;
}

li {
  color: #355e3b;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
}

/* Fecha */
.fecha {
  display: block;
  font-size: 0.9rem;
  color: #a3bffa;
  font-family: 'Poppins', sans-serif;
  font-style: italic;
}

/* Mensaje cuando no hay mensajes */
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