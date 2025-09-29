<template>
  <div class="dashboard-layout">
    <!-- Columna izquierda: Sidebar -->
    <div class="sidebar-column">
      <!-- Puedes poner el sidebar si quieres -->
    </div>

    <!-- Columna derecha: Contenido principal -->
    <div class="content-column">
      <Sidebar />
      <div class="content">
        <!-- Formulario para enviar evento escolar -->
        <form class="evento-form" @submit.prevent="enviarEvento">
          <h2>Crear Evento Escolar</h2>

          <label for="titulo">Título</label>
          <input id="titulo" v-model="evento.titulo" type="text" required />

          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" v-model="evento.descripcion" required></textarea>

          <label for="fechaInicio">Fecha de Inicio</label>
          <input id="fechaInicio" v-model="evento.fechaInicio" type="date" required />

          <label for="fechaFin">Fecha de Fin</label>
          <input id="fechaFin" v-model="evento.fechaFin" type="date" required />

          <label for="rolDestinatario">Rol destinatario</label>
          <select id="rolDestinatario" v-model="evento.rolDestinatario" required>
            <option value="todos">Todos</option>
            <option value="profesores">Profesores</option>
            <option value="alumnos">Alumnos</option>
            <!-- Puedes agregar más roles aquí -->
          </select>

          <button type="submit">Crear Evento</button>

          <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { showSuccess, showError } from '@/utils/useAlert'

// Datos del evento
const evento = ref({
  titulo: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  rolDestinatario: 'todos'
})

const enviarEvento = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/calendario/evento-escolar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(evento.value)
    })

    if (!response.ok) {
      throw new Error('Error al crear el evento')
    }

    showSuccess('Evento creado', 'El evento escolar se registró exitosamente.')
    // Opcional: limpiar el formulario
    evento.value = {
      titulo: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      rolDestinatario: 'todos'
    }
  } catch (error) {
    console.error(error)
    showError('Error', 'Hubo un problema al crear el evento.')
  }
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
}

/* Sidebar */
.sidebar-column {
  width: 240px;
  background-color: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

/* Contenido */
.content-column {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0 0 10px;
}

.content {
  padding: 10px;
}

/* Formulario */
.evento-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
}

.evento-form h2 {
  margin-bottom: 20px;
  color: var(--color-primary, #333);
}

.evento-form label {
  margin-top: 10px;
  margin-bottom: 5px;
  font-weight: bold;
}

.evento-form input,
.evento-form textarea,
.evento-form select {
  padding: 10px;
  border: 1px solid var(--color-border, #ccc);
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 1rem;
}

.evento-form button {
  margin-top: 10px;
  padding: 10px;
  background-color: var(--color-primary, #007BFF);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.evento-form button:hover {
  background-color: #0056b3;
}

.mensaje {
  margin-top: 15px;
  font-weight: bold;
  color: green;
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar-column {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    display: none;
  }

  .content-column {
    width: 100%;
    padding: 10px;
  }
}
</style>
