<template>
  <div class="header">
    <h1>¡Bienvenid@{{ nombre ? `, ${nombre}` : '' }}!</h1>
    <LogOutButton @logout="handleLogOut" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LogOutButton from './LogOutButton.vue'

const nombre = ref('')

onMounted(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?.nombre) {
      nombre.value = capitalizar(user.nombre)
    }
  } catch (error) {
    console.warn('No se pudo obtener el usuario del localStorage.')
  }
})

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

function handleLogOut() {
  localStorage.removeItem('user')
  console.log('Sesión cerrada')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.75rem;
  font-family: var(--font-body);
}

.header h1 {
  font-family: var(--font-title);
  font-size: 1.5rem;
  margin: 0;
}
</style>
