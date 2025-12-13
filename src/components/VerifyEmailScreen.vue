<template>
  <div class="verify-email-container">
    <div class="verify-card">
      <div v-if="verifying">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <h2>Verificando tu email...</h2>
        <p>Por favor espera mientras verificamos tu cuenta.</p>
      </div>
      <div v-else-if="success">
        <div class="success-icon mb-3">
          <i class="fas fa-check-circle" style="font-size: 4rem; color: #28a745;"></i>
        </div>
        <h2>¡Email Verificado!</h2>
        <p>Tu email ha sido verificado exitosamente. Ya puedes iniciar sesión.</p>
        <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
      </div>
      <div v-else>
        <div class="error-icon mb-3">
          <i class="fas fa-times-circle" style="font-size: 4rem; color: #dc3545;"></i>
        </div>
        <h2>Error de Verificación</h2>
        <p>{{ errorMessage }}</p>
        <div class="d-flex gap-2 justify-content-center">
          <button @click="resendVerification" class="btn btn-secondary" :disabled="resending">
            {{ resending ? 'Enviando...' : 'Solicitar nuevo enlace' }}
          </button>
          <router-link to="/login" class="btn btn-outline-primary">
            Ir al Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API_URL from '@/config/api'
export default {
  name: 'VerifyEmail',
  data() {
    return {
      verifying: true,
      success: false,
      errorMessage: 'El enlace de verificación es inválido o ha expirado.',
      resending: false,
      userEmail: null
    }
  },
  async mounted() {
    const token = this.$route.query.token;
    if (token) {
      await this.verifyEmail(token);
    } else {
      this.verifying = false;
      this.errorMessage = 'Token de verificación no proporcionado.';
    }
  },
  methods: {
    async verifyEmail(token) {
      try {
        console.log('🔐 Verificando token:', token);
        const response = await fetch(`http://localhost:8084/api/email-verification/verify?token=${token}`);
        const data = await response.json();
        
        console.log('📧 Respuesta verificación:', data);
        this.success = data.success;
        
        if (!data.success) {
          this.errorMessage = data.message || 'Error al verificar el email.';
        }
      } catch (error) {
        console.error('❌ Error verificando email:', error);
        this.success = false;
        this.errorMessage = 'Error de conexión. Intenta más tarde.';
      } finally {
        this.verifying = false;
      }
    },
    
    async resendVerification() {
      if (!this.userEmail) {
        this.errorMessage = 'No se puede reenviar verificación sin email. Regístrese nuevamente.';
        return;
      }
      
      this.resending = true;
      try {
        const response = await fetch(`${API_URL}/api/email-verification/resend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.userEmail })
        });
        
        const data = await response.json();
        if (data.success) {
          alert('✅ Nuevo enlace de verificación enviado a tu email.');
        } else {
          alert('❌ Error: ' + data.message);
        }
      } catch (error) {
        alert('❌ Error al reenviar verificación.');
      } finally {
        this.resending = false;
      }
    }
  }
}
</script>

<style scoped>
.verify-email-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.verify-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

h2 {
  color: #213547;
  margin-bottom: 15px;
}

.btn {
  margin-top: 10px;
  min-width: 150px;
}
</style>