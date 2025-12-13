<template>
  <div class="welcome-banner">
    <h1>¡Bienvenid@ de nuevo, <span>{{ firstName }}</span>!</h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const firstName = ref('Usuario')

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user?.nombre) {
    firstName.value = user.nombre.trim().split(' ')[0]
  }
})
</script>

<style scoped>
.welcome-banner {
  background-color: var(--t-color-primary);
  color: var(--t-color-light);
  padding: 1.5rem 2rem;
  /*border-radius: 0 0 30px 30px;*/
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease;
  margin-bottom: 1.5rem;
  text-align: center; /*cambiar como se vea mejor*/ 
}

.welcome-banner h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  font-family: var(--t-font-title);
  letter-spacing: 0.5px;
}

.welcome-banner h1 span {
  color: var(--t-color-accent-2);
  font-family: var(--t-font-body);
  font-weight: 600;
}
</style>