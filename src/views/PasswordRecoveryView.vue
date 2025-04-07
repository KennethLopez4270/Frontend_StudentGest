<template>
    <div class="wrapper">
      <!-- Sidebar (opcional, lo dejo para mantener consistencia, pero podría omitirse en esta vista) -->
      <div class="sidebar animate__animated animate__fadeInLeft">
        <div class="logo">Academia</div>
        <router-link to="/" :class="{ active: $route.name === 'Home' }">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
        <router-link to="/control-asistencia" :class="{ active: $route.name === 'ControlAsistencia' }">
          <i class="fas fa-users"></i> Estudiantes
        </router-link>
        <router-link to="/reportes" :class="{ active: $route.name === 'Reportes' }">
          <i class="fas fa-chart-line"></i> Reportes
        </router-link>
        <router-link to="/historial-academico" :class="{ active: $route.name === 'HistorialAcademico' }">
          <i class="fas fa-book"></i> Tareas
        </router-link>
        <router-link to="/calificaciones" :class="{ active: $route.name === 'Calificaciones' }">
          <i class="fas fa-star"></i> Calificaciones
        </router-link>
        <router-link to="/calendario" :class="{ active: $route.name === 'Calendario' }">
          <i class="fas fa-calendar-alt"></i> Calendario
        </router-link>
        <router-link to="/justificar-ausencias" :class="{ active: $route.name === 'JustificarAusencias' }">
          <i class="fas fa-file-alt"></i> Justificar Ausencias
        </router-link>
      </div>
  
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
        successMessage: "Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada."
      };
    },
    methods: {
      submitRecovery() {
        if (!this.email) {
          this.shake = true;
          setTimeout(() => (this.shake = false), 500);
          return;
        }
  
        this.loading = true;
        
        // Simulación de envío
        setTimeout(() => {
          this.loading = false;
          this.success = true;
          console.log("Se enviaría un correo a:", this.email);
        }, 1500);
      }
    }
  };
  </script>