<template>
    <div class="student-carousel">
      <h3 class="section-title">Estudiantes</h3>
  
      <div class="students-wrapper" ref="carousel">
        <div class="students-container">
          <div
            v-for="student in students"
            :key="student.id"
            class="student-card"
            :class="{ active: student.id === selectedStudentId }"
            @click="selectStudent(student.id)"
          >
            <div class="student-avatar">
              <span>{{ getInitials(student.nombre, student.apellido_paterno) }}</span>
            </div>
            <div class="student-info">
              <h5>{{ student.nombre }} {{ student.apellido_paterno }}</h5>
              <p>{{ student.curso || 'Sin curso' }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <button class="carousel-control prev" @click="scrollLeft">&#10094;</button>
      <button class="carousel-control next" @click="scrollRight">&#10095;</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    students: {
      type: Array,
      required: true
    },
    selectedStudentId: {
      type: Number,
      default: null
    }
  })
  
  const emit = defineEmits(['update:selectedStudentId'])
  
  const carousel = ref(null)
  
  const scrollLeft = () => {
    carousel.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
  
  const scrollRight = () => {
    carousel.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
  
  const selectStudent = (id) => {
    emit('update:selectedStudentId', id)
  }
  
  const getInitials = (nombre, apellido) => {
    return `${nombre?.charAt(0) ?? ''}${apellido?.charAt(0) ?? ''}`.toUpperCase()
  }
  </script>
  