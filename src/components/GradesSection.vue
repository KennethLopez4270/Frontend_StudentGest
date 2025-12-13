<template>
  <div class="grades-section mb-5">
    <div class="section-header d-flex justify-content-between align-items-center mb-4">
      <h3>Calificaciones Recientes</h3>
      <router-link to="#" class="btn">Ver Todas</router-link>
    </div>
    <div class="row g-3">
      <div v-for="grade in grades" :key="grade.id" class="col-md-6 col-lg-3">
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
      <div v-if="grades.length === 0" class="col-12 text-center text-gray-600">
        No hay calificaciones disponibles para este estudiante.
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  grades: {
    type: Array,
    required: true
  }
});

function gradeClass(score) {
  return {
    'bg-danger': score < 60,
    'bg-warning': score >= 60 && score < 80,
    'presente-badge': score >= 80
  };
}
</script>

<style scoped>
.grades-section {
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

.grade-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(26, 46, 74, 0.2);
  transition: all 0.3s ease;
}

.grade-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(26, 46, 74, 0.3);
}

.grade-card h5 {
  font-size: 1.1rem;
  color: #1a2e4a;
}

.progress-bar.bg-danger {
  background: #8b2e3c !important;
}

.progress-bar.bg-warning {
  background: #3b5998 !important;
}
</style>