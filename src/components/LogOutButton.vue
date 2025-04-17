<template>
  <button class="btn-logout" @click="handleClick">
    <i class="fas fa-sign-out-alt"></i> Cerrar sesión
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const emit = defineEmits(['logout']);

function handleClick() {
  router.push('/login');
}
</script>

<style scoped>
.btn-logout {
  background-color: var(--color-accent);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.btn-logout:hover {
  background-color: var(--hover-secondary);
}

.btn-logout i {
  font-size: 1rem;
}
</style>
