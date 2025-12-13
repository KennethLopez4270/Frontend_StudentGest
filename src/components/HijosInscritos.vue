<template>
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
            :class="{ active: currentStudentIndex === index }"
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
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  students: {
    type: Array,
    required: true
  },
  currentStudentIndex: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['update:currentStudentIndex']);

function prevStudent() {
  if (props.currentStudentIndex > 0) {
    emit('update:currentStudentIndex', props.currentStudentIndex - 1);
  }
}

function nextStudent() {
  if (props.currentStudentIndex < props.students.length - 1) {
    emit('update:currentStudentIndex', props.currentStudentIndex + 1);
  }
}

function selectStudent(index) {
  emit('update:currentStudentIndex', index);
}
</script>

<style scoped>
.student-carousel {
  position: relative;
  overflow: hidden;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #1a2e4a;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
}

.students-wrapper {
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.students-wrapper::-webkit-scrollbar {
  display: none;
}

.students-container {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
}

.student-card {
  flex: 0 0 250px;
  background: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(26, 46, 74, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.student-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(26, 46, 74, 0.3);
  background: linear-gradient(135deg, #a3bffa 0%, #d4c08a 100%);
  color: #1a2e4a;
}

.student-card.active {
  background: #355e3b;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(26, 46, 74, 0.4);
}

.student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e9f2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #1a2e4a;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.student-card:hover .student-avatar,
.student-card.active .student-avatar {
  background: #d4c08a;
  color: #1a2e4a;
}

.student-info {
  text-align: center;
}

.student-info h5 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.student-info p {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  border: none;
  box-shadow: 0 2px 8px rgba(26, 46, 74, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a2e4a;
  transition: all 0.3s ease;
}

.carousel-control:hover {
  background: #d4c08a;
  color: #1a2e4a;
  transform: translateY(-50%) scale(1.1);
}

.carousel-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-control.prev {
  left: -20px;
}

.carousel-control.next {
  right: -20px;
}

/* Transiciones */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>