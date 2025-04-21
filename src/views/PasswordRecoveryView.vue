<template>
  <div class="wrapper">

    <!-- Main Content -->
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="login-box animate__animated animate__fadeInUp">
        <h1 class="text-center mb-4 animate__animated animate__bounceInDown">
          Recuperar Contraseña
        </h1>

        <form @submit.prevent="submitRecovery" class="p-3">
          <!-- Campo de correo -->
          <div class="input-group mb-4 animate__animated animate__fadeInUp" :class="{ 'animate__shakeX': shake }">
            <span class="input-icon"><i class="fas fa-envelope"></i></span>
            <input
              type="email"
              v-model="email"
              placeholder="Correo electrónico registrado"
              class="form-control shadow-sm"
              required
              @focus="shake = false"
            />
          </div>

          <!-- Mensaje de instrucciones -->
          <div class="alert alert-info mb-4 animate__animated animate__fadeInUp">
            <i class="fas fa-info-circle me-2"></i>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </div>

          <!-- Botón de recuperación -->
          <button type="submit" class="login-button btn w-100" :disabled="loading">
            <template v-if="!loading">
              <i class="fas fa-paper-plane me-2"></i> Enviar enlace
            </template>
            <template v-else>
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Enviando...
            </template>
          </button>
        </form>

        <!-- Enlace para volver al login -->
        <p class="text-center mt-3">
          <router-link to="/login" class="text-primary fw-bold">
            <i class="fas fa-arrow-left me-2"></i>Volver al inicio de sesión
          </router-link>
        </p>

        <!-- Mensaje de éxito -->
        <div v-if="success" class="alert alert-success mt-3 animate__animated animate__fadeIn">
          <i class="fas fa-check-circle me-2"></i>
          {{ successMessage }}
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="success" class="alert alert-success mt-3 animate__animated animate__fadeIn">
          <i class="fas fa-check-circle me-2"></i>
          {{ successMessage }}
        </div>

        <!-- Mensaje de error (nuevo) -->
        <div v-if="error" class="alert alert-danger mt-3 animate__animated animate__fadeIn">
          <i class="fas fa-exclamation-circle me-2"></i>
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/assets/passwordRecovery.css';

export default {
  name: "PasswordRecoveryView",
  data() {
    return {
      email: "",
      shake: false,
      loading: false,
      success: false,
      error: false,
      successMessage: "Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada.",
      errorMessage: ""
    };
  },
  methods: {
    async submitRecovery() {
      // Validación básica
      if (!this.email) {
        this.shake = true;
        setTimeout(() => (this.shake = false), 500);
        return;
      }

      this.loading = true;
      this.error = false;
      this.success = false;

      try {
        // 1. Buscar usuario por email
        const usersResponse = await fetch('http://localhost:8080/api/users');
        if (!usersResponse.ok) throw new Error('Error al buscar usuarios');
        
        const users = await usersResponse.json();
        const user = users.find(u => u.email === this.email);

        if (!user) {
          throw new Error('No se encontró un usuario con ese correo');
        }

        // 2. Enviar correo con enlace
        const recoveryLink = `http://localhost:5173/restaurar-password/${user.id_usuario}`;
        const emailData = {
          email: this.email
          };

        const emailResponse = await fetch('http://localhost:8080/api/users/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        });

        if (!emailResponse.ok) throw new Error('Error al enviar correo');

        // Éxito
        this.success = true;
        this.email = ""; // Limpiar campo después del envío

      } catch (error) {
        this.error = true;
        this.errorMessage = error.message;
        console.error('Error en recuperación:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>