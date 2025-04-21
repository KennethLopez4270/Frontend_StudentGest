<template>
  <div class="tasks-section">
    <div class="section-header d-flex justify-content-between align-items-center mb-4">
      <h3>Tareas Pendientes</h3>
      <router-link to="#" class="btn">Ver Todas</router-link>
    </div>
    <div class="row g-3">
      <div v-for="task in tasks" :key="task.id" class="col-md-6 col-lg-4">
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
      <div v-if="tasks.length === 0" class="col-12 text-center text-gray-600">
        No hay tareas disponibles para este estudiante.
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
});

function taskStatusClass(task) {
  return {
    'ausente-badge': task.status === 'pending' && task.isOverdue,
    'tardanza-badge': task.status === 'pending' && !task.isOverdue,
    'presente-badge': task.status === 'completed'
  };
}

function taskStatusIcon(task) {
  return {
    'fas fa-exclamation-circle': task.status === 'pending' && task.isOverdue,
    'far fa-clock': task.status === 'pending' && !task.isOverdue,
    'fas fa-check-circle': task.status === 'completed'
  };
}
</script>

<style scoped>
.tasks-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: #1a2e4a;
  margin-bottom: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
}

.section-header .btn {
  background: #355e3b;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.section-header .btn:hover {
  background: #d4c08a;
  color: #1a2e4a;
}

.task-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(26, 46, 74, 0.2);
  transition: all 0.3s ease;
}

.task-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(26, 46, 74, 0.3);
}

.task-card.border-danger {
  border: 2px solid #8b2e3c;
}

.task-card.border-success {
  border: 2px solid #355e3b;
}

.task-card h5 {
  font-size: 1.1rem;
  color: #1a2e4a;
}
</style>