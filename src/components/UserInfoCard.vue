<template>
  <div class="profile-card" v-if="user">
    <img :src="user.foto" alt="Foto del usuario" />
    <h3>{{ user.nombre }} {{ user.apellido_paterno }}</h3>
    <p><i class="fas fa-envelope"></i> {{ user.email }}</p>
    <p><i class="fas fa-user-tag"></i> {{ capitalizarRol(user.rol) }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const capitalizarRol = (rol) => {
  if (!rol) return ''
  return rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase()
}
</script>

<style scoped>
/* Profile Card */
.profile-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 16px rgba(26, 46, 74, 0.2);
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .profile-card:hover {
    box-shadow: 0 6px 20px rgba(26, 46, 74, 0.25);
  }
  
  .profile-card img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .profile-card img:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(26, 46, 74, 0.5);
  }
  
  .profile-card h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    color: #1a2e4a;
    margin-bottom: 0.75rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
  }
  
  .profile-card p {
    color: #4a4a4a;
    font-size: 0.9rem;
    font-weight: 300;
  }
  
  .profile-card i {
    color: #8b2e3c;
    margin-right: 0.5rem;
  }
</style>
