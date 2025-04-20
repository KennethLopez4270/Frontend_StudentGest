<template>
  <div class="welcome-banner">
    <h1>¡Bienvenid@ de nuevo, {{ firstName }}!</h1>
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
  background-color: var(--color-primary);
  color: var(--color-light);
  padding: 1.2rem 2rem;
  border-radius: 0 0 0 30px;
  /*
  clip-path: polygon(
    30px 0%,   // esquina superior izquierda cortada
    100% 0%, 
    100% 100%, 
    30px 100%, // esquina inferior izquierda cortada 
    0% 0%,    // triángulo inferior 
    0% 0%     // triángulo superior 
  ); */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 5px;
}

.welcome-banner h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
