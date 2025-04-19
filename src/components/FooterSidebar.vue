<template>
  <div class="footer-sidebar">
    <div class="footer-user" title="Información del usuario">
      <i class="fas fa-user-circle"></i>
      <div class="user-info label">
        <div class="user-name">{{ userName }}</div>
        <div class="user-role">{{ userRole }}</div>
      </div>
    </div>

    <button class="footer-link" @click="handleLogout" title="Cerrar sesión">
      <i class="fas fa-sign-out-alt"></i>
      <span class="label">Salir</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('')
const userRole = ref('')

const handleLogout = () => {
  localStorage.clear()
  router.push('/')
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  userName.value = [user.nombre, user.apellido_paterno, user.apellido_materno].filter(Boolean).join(' ')
  userRole.value = user.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1).toLowerCase() : ''
})
</script>

<style scoped>
.footer-sidebar {
  padding: 1rem 0.5rem;
  border-top: 1px solid var(--color-dark);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-user {
  display: flex;
  align-items: center;
  padding: 0.6rem;
  color: var(--color-text);
  border-radius: 6px;
  transition: background 0.3s ease;
}

.footer-user:hover {
  background-color: var(--hover-primary);
  color: var(--hover-secondary);
}

.footer-link {
  display: flex;
  align-items: center;
  padding: 0.6rem;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.footer-link:hover {
  background-color: var(--hover-primary);
  color: var(--hover-secondary);
}

.footer-user i,
.footer-link i {
  min-width: 30px;
  text-align: center;
  font-size: 1.4rem;
  color: var(--color-icon);
}

.label {
  opacity: 1;
  transition: opacity 0.3s ease, margin-left 0.3s ease;
  margin-left: 0.5rem;
  font-family: var(--font-title);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.8rem;
  color: var(--color-icon);
}

/* Oculta texto cuando sidebar colapsa */
.sidebar.collapsed .label {
  opacity: 0;
}
</style>
