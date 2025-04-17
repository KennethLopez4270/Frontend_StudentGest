<template>
  <div class="profile-card">
    <img :src="user.foto" alt="Foto del usuario" />
    <h3>{{ user.nombre }} {{ user.apellido_paterno }}</h3>
    <p><i class="fas fa-envelope"></i> {{ user.email }}</p>
    <p><i class="fas fa-user-tag"></i> {{ user.rol }}</p>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.profile-card {
  background-color: var(--color-light);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: var(--font-body);
  color: var(--color-dark);
}

.profile-card img {
  width: 100px;
  height: 100px;
  border-radius: 9999px;
  object-fit: cover;
  margin-bottom: 1rem;
}

.profile-card h3 {
  font-family: var(--font-title);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.profile-card p {
  margin: 0.25rem 0;
  font-size: 0.95rem;
}

.profile-card i {
  margin-right: 0.5rem;
  color: var(--color-primary);
}
</style>
