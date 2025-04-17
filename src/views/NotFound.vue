<template>
  <div class="h-screen flex flex-col items-center justify-center bg-slate-900 text-white text-center animate__animated animate__fadeIn">
    <img
      src="https://undraw.co/api/illustrations/011cc9ef-1739-40c6-8e2e-362e8bb7ce84" 
      alt="Buscando página"
      class="w-64 md:w-80 mb-8"
    />

    <h1 class="text-6xl font-extrabold text-orange-400 mb-4">404</h1>
    <h2 class="text-2xl font-semibold mb-2">Página no encontrada</h2>
    <p class="text-gray-300 max-w-md mb-6">
      La página que buscas no existe o fue movida. Pero no te preocupes, puedes volver al inicio fácilmente.
    </p>

    <router-link to="/" class="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition">
      Volver al inicio
    </router-link>
  </div>
</template>

<script setup>
// Sin lógica por ahora
</script>

<style scoped>
.page-404 {
  background-color: var(--color-primary);
  color: var(--color-light);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  font-family: var(--font-body);
}

.page-404 h1 {
  font-size: 6rem;
  color: var(--color-accent);
  font-family: var(--font-title);
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
}

.page-404 h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--color-light);
}

.page-404 p {
  max-width: 500px;
  color: var(--color-info);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.page-404 img {
  width: 300px;
  max-width: 90%;
  margin-bottom: 2rem;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.4));
  transition: transform 0.3s ease;
}

.page-404 img:hover {
  transform: scale(1.05) rotate(2deg);
}

.page-404 .btn-home {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-accent);
  color: var(--color-light);
  border-radius: 1rem;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.page-404 .btn-home:hover {
  background-color: var(--hover-secondary);
}

</style>
