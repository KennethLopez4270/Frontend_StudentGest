<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm custom-navbar">
    <div class="container">
      <!-- Logo -->
      <RouterLink to="/" class="navbar-brand d-flex align-items-center">
        <img src="@/assets/images/logo.png" alt="StudentGest Logo" class="navbar-logo" />
        <span class="ms-2 fw-bold brand-name">StudentGest</span>
      </RouterLink>

      <!-- Botón Hamburguesa -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Contenido Navbar -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto align-items-lg-center text-center">
          <li class="nav-item my-2 my-lg-0">
            <RouterLink to="/login" class="btn btn-outline-primary me-lg-2 w-100 w-lg-auto animate__animated animate__fadeInDown">
              <i class="fas fa-sign-in-alt"></i> Iniciar sesión
            </RouterLink>
          </li>
          <li class="nav-item my-2 my-lg-0">
            <RouterLink to="/registro" class="btn btn-primary w-100 w-lg-auto animate__animated animate__fadeInDown animate__delay-1s">
              <i class="fas fa-user-plus"></i> Registrarse
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Nada extra que importar, todo se maneja con Bootstrap, FontAwesome y Animate.css que ya tienes configurado.
// Importante: uso <RouterLink> para no recargar la página (SPA).
</script>

<style scoped>
.custom-navbar {
  background: var(--color-light, #ffffff);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  font-family: var(--font-body, 'Poppins', sans-serif);
}

.navbar-logo {
  height: 40px;
  width: auto;
}

.brand-name {
  font-size: 1.5rem;
  color: var(--color-primary, #2c3e50);
  font-family: 'Playfair Display', serif;
}

.btn {
  border-radius: 999px;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s ease;
}

.btn-outline-primary {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-outline-primary:hover {
  background-color: var(--color-primary);
  color: #fff;
}

.btn-primary {
  background-color: var(--color-accent, #ffb347);
  border-color: var(--color-accent, #ffb347);
}

.btn-primary:hover {
  background-color: var(--hover-accent, #ff9f1c);
  border-color: var(--hover-accent, #ff9f1c);
}

/* Mobile Optimization */
@media (max-width: 991px) {
  .navbar-collapse {
    background: var(--color-light);
    border-radius: 0.75rem;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-top: 0.5rem;
  }

  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style>
