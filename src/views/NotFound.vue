<template>
  <div class="page-404 animate__animated animate__fadeIn">
    <i class="fas fa-face-frown page-404__icon"></i>

    <h1 class="page-404__code">404</h1>
    <h2 class="page-404__title">Página no encontrada</h2>
    <p class="page-404__message">
      La página que buscas no existe o fue movida. Pero no te preocupes, puedes volver al inicio fácilmente.
    </p>

    <router-link to="/" class="page-404__button">
      Volver al inicio
    </router-link>
  </div>
</template>

<style scoped>
.page-404 {
  height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-dark);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.page-404__icon {
  font-size: 7rem;
  color: var(--color-dark);
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.4));
}

.page-404__code {
  font-size: 5rem;
  color: var(--color-dark);
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
}

.page-404__title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.page-404__message {
  color: var(--color-dark);
  font-size: 1.1rem;
  max-width: 600px;
  margin-bottom: 2rem;
}

.page-404__button {
  background-color: var(--color-accent);
  color: var(--color-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.page-404__button:hover {
  background-color: var(--hover-accent);
  color: var(--hover-primary);
}
</style>
