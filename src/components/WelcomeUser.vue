<template>
  <div class="header">
    <h1>¡Bienvenida, {{ nombre }}!</h1>
    <LogOutButton @logout="handleLogOut" />
  </div>
</template>

<script setup>
import LogOutButton from './LogOutButton.vue'

const nombre = 'María' // En el futuro puedes obtener esto de un endpoint o localStorage

function handleLogOut() {
  // manejar la lógica de logout (borrar token, redirigir, etc)
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
