<template>
  <div class="login-container">
    <!-- Main Content -->
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
            <i class="fas fa-paper-plane me-2"></i> Enviar enlace de recuperación
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

      <!-- Mensaje de error -->
      <div v-if="error" class="alert alert-danger mt-3 animate__animated animate__fadeIn">
        <i class="fas fa-exclamation-circle me-2"></i>
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/assets/passwordRecovery.css';
import { showSuccess, showError } from '@/utils/useAlert';

export default {
  name: "PasswordRecoveryView",
  data() {
    return {
      email: "",
      shake: false,
      loading: false,
      success: false,
      error: false,
      successMessage: "",
      errorMessage: ""
    };
  },
  methods: {
    async submitRecovery() {
      if (!this.email) {
        this.shake = true;
        setTimeout(() => (this.shake = false), 500);
        showError('Error', 'Por favor ingresa tu correo electrónico');
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.shake = true;
        setTimeout(() => (this.shake = false), 500);
        showError('Error', 'Por favor ingresa un correo electrónico válido');
        return;
      }

      this.loading = true;
      this.error = false;
      this.success = false;
      this.errorMessage = "";
      this.successMessage = "";

      try {
        console.log('🔄 Enviando solicitud de recuperación para:', this.email);
        
        // ✅ USAR EL ENDPOINT CORRECTO de PasswordRecoveryController
        const response = await fetch('http://localhost:8084/api/password-recovery/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email: this.email 
          })
        });

        console.log('📡 Respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        const data = await response.json();
        console.log('📊 Datos recibidos:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Error del servidor');
        }

        if (data.success) {
          this.success = true;
          this.successMessage = data.message || "Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada.";
          showSuccess('Éxito', this.successMessage);
          this.email = ""; // Limpiar campo después del envío
        } else {
          throw new Error(data.message || 'Error al procesar la solicitud');
        }

      } catch (error) {
        console.error('❌ Error en recuperación:', error);
        this.error = true;
        this.errorMessage = error.message || 'Error de conexión. Intenta más tarde.';
        
        // Mostrar mensajes específicos según el tipo de error
        if (error.message.includes('conexión') || error.message.includes('Failed to fetch')) {
          this.errorMessage = 'Error de conexión. Verifica que el servidor esté ejecutándose en el puerto 8084.';
          showError('Error de conexión', 'No se pudo conectar al servidor. Verifica que esté ejecutándose.');
        } else {
          showError('Error', this.errorMessage);
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 15px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group input {
  padding-left: 45px;
  border-radius: 10px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  z-index: 10;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  background: #6c757d;
  transform: none;
  box-shadow: none;
}

.alert {
  border-radius: 10px;
  border: none;
}

.text-primary {
  color: #667eea !important;
}

.text-primary:hover {
  color: #5a6fd8 !important;
}

h1 {
  color: #2c3e50;
  font-weight: 700;
}
</style>