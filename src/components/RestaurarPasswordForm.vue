<template>
  <div class="background-container">
    <div class="recovery-glass card shadow-lg animate__animated animate__fadeIn">
      <h1 class="text-center mb-4">{{ isResetView ? 'RESTABLECER CONTRASEÑA' : 'RECUPERAR CONTRASEÑA' }}</h1>

      <!-- Vista de solicitud de recuperación -->
      <div v-if="!isResetView" class="recovery-form">
        <div class="mb-4">
          <p class="text-muted text-center">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <div class="mb-3 input-group">
          <span class="input-icon"><i class="fas fa-envelope"></i></span>
          <input
            type="email"
            v-model="email"
            placeholder="Correo electrónico"
            class="form-control"
            required
          />
        </div>

        <button 
          type="button" 
          class="btn btn-primary w-100" 
          @click="requestRecovery"
          :disabled="loading"
        >
          <i class="fas fa-paper-plane me-2"></i>
          {{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
        </button>
      </div>

      <!-- Vista de restablecimiento -->
      <div v-else class="reset-form">
        <div class="mb-4">
          <p class="text-muted text-center">
            Ingresa tu nueva contraseña para la cuenta: <strong>{{ userEmail }}</strong>
          </p>
        </div>

        <!-- Nueva contraseña -->
        <div class="mb-3 position-relative input-group">
          <span class="input-icon"><i class="fas fa-lock"></i></span>
          <input
            v-model="newPassword"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            placeholder="Nueva contraseña"
            required
            @input="checkPasswordStrength"
          />
          <span class="toggle-password" @click="togglePassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
        
        <!-- Indicador de fortaleza -->
        <div class="password-strength-container mb-3">
          <div class="password-strength-bar">
            <div
              :style="{ width: passwordStrength + '%', backgroundColor: passwordStrengthColor }"
              class="strength-bar"
            ></div>
          </div>
          <p class="password-strength-text mt-1" :class="passwordStrengthClass">
            {{ passwordStrengthLabel }}
          </p>
          
          <!-- Políticas de contraseña -->
          <div class="password-policies mt-2">
            <small class="text-muted">La contraseña debe:</small>
            <ul class="list-unstyled mt-1">
              <li v-for="requirement in passwordRequirements" :key="requirement" 
                  class="small" :class="isRequirementMet(requirement) ? 'text-success' : 'text-muted'">
                <i :class="isRequirementMet(requirement) ? 'fas fa-check' : 'fas fa-times'"></i>
                {{ requirement }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Confirmar contraseña -->
        <div class="mb-4 position-relative input-group">
          <span class="input-icon"><i class="fas fa-lock"></i></span>
          <input
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            placeholder="Confirmar contraseña"
            required
          />
          <span class="toggle-password" @click="togglePassword">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>

        <button 
          type="button" 
          class="btn btn-primary w-100" 
          @click="resetPassword"
          :disabled="isSubmitting || !isFormValid"
        >
          <template v-if="!isSubmitting">
            <i class="fas fa-save me-2"></i> Restablecer contraseña
          </template>
          <template v-else>
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Restableciendo...
          </template>
        </button>
      </div>

      <p class="text-center mt-3">
        <router-link to="/login" class="text-primary fw-bold">
          <i class="fas fa-arrow-left me-2"></i>Volver al inicio de sesión
        </router-link>
      </p>

      <div v-if="statusMessage" :class="['alert mt-3 text-center', statusType === 'success' ? 'alert-success' : 'alert-danger']">
        {{ statusMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showSuccess, showError } from '@/utils/useAlert'

export default {
  name: 'PasswordRecoveryView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const email = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')
    const showPassword = ref(false)
    const loading = ref(false)
    const isSubmitting = ref(false)
    const isResetView = ref(false)
    const userEmail = ref('')
    const statusMessage = ref('')
    const statusType = ref('')
    
    // Password strength
    const passwordStrength = ref(0)
    const passwordRequirements = ref([
      'Mínimo 12 caracteres',
      'Al menos una letra mayúscula',
      'Al menos una letra minúscula', 
      'Al menos un número',
      'Al menos un símbolo especial (@$!%*?&)'
    ])

    const passwordStrengthColor = computed(() => {
      if (passwordStrength.value < 40) return "#dc3545"
      if (passwordStrength.value < 75) return "#ffc107"
      return "#28a745"
    })

    const passwordStrengthLabel = computed(() => {
      if (!newPassword.value) return ""
      if (passwordStrength.value < 40) return "Contraseña débil"
      if (passwordStrength.value < 75) return "Contraseña media" 
      return "Contraseña fuerte"
    })

    const passwordStrengthClass = computed(() => {
      if (passwordStrength.value < 40) return "text-danger"
      if (passwordStrength.value < 75) return "text-warning"
      return "text-success"
    })

    const isFormValid = computed(() => {
      return newPassword.value && 
             confirmPassword.value && 
             newPassword.value === confirmPassword.value &&
             passwordStrength.value >= 40
    })

    const checkPasswordStrength = () => {
      const pwd = newPassword.value
      let strength = 0
      
      // Longitud
      if (pwd.length >= 12) strength += 25
      else if (pwd.length >= 8) strength += 15
      
      // Complejidad
      if (/[A-Z]/.test(pwd)) strength += 20
      if (/[a-z]/.test(pwd)) strength += 20  
      if (/[0-9]/.test(pwd)) strength += 15
      if (/[@$!%*?&]/.test(pwd)) strength += 20
      
      passwordStrength.value = Math.min(strength, 100)
    }

    const isRequirementMet = (requirement) => {
      const pwd = newPassword.value
      
      if (requirement.includes('12 caracteres')) return pwd.length >= 12
      if (requirement.includes('mayúscula')) return /[A-Z]/.test(pwd)
      if (requirement.includes('minúscula')) return /[a-z]/.test(pwd)
      if (requirement.includes('número')) return /[0-9]/.test(pwd)
      if (requirement.includes('símbolo')) return /[@$!%*?&]/.test(pwd)
      
      return false
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const requestRecovery = async () => {
      if (!email.value) {
        showError('Error', 'Por favor ingresa tu correo electrónico')
        return
      }

      loading.value = true
      statusMessage.value = ''

      try {
        console.log('🔄 Enviando solicitud de recuperación a:', email.value)
        
        const response = await fetch('http://localhost:8084/api/password-recovery/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email.value })
        })

        console.log('📡 Respuesta del servidor:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        })

        // Si hay error HTTP, mostrar detalles
        if (!response.ok) {
          console.error('❌ Error HTTP:', response.status)
          let errorText = await response.text()
          console.error('📄 Contenido del error:', errorText)
          
          statusType.value = 'error'
          statusMessage.value = `Error del servidor (${response.status}): ${response.statusText}`
          showError('Error', `Error del servidor: ${response.status}`)
          return
        }

        const data = await response.json()
        console.log('📊 Datos recibidos:', data)

        if (data.success) {
          statusType.value = 'success'
          statusMessage.value = data.message
          showSuccess('Éxito', data.message)
        } else {
          statusType.value = 'error'
          statusMessage.value = data.message
          showError('Error', data.message)
        }
      } catch (error) {
        console.error('💥 Error de conexión:', error)
        statusType.value = 'error'
        statusMessage.value = 'Error de conexión. Verifica que el servidor esté ejecutándose.'
        showError('Error de conexión', 'No se pudo conectar al servidor. Verifica que esté ejecutándose en http://localhost:8084')
      } finally {
        loading.value = false
      }
    }

    const resetPassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        showError('Error', 'Las contraseñas no coinciden')
        return
      }

      if (passwordStrength.value < 40) {
        showError('Error', 'La contraseña es demasiado débil')
        return
      }

      isSubmitting.value = true
      statusMessage.value = ''

      try {
        const response = await fetch('http://localhost:8084/api/password-recovery/reset', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: route.query.token,
            newPassword: newPassword.value,
            confirmPassword: confirmPassword.value
          })
        })

        const data = await response.json()

        if (data.success) {
          statusType.value = 'success'
          statusMessage.value = data.message
          showSuccess('Éxito', data.message)
          
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          statusType.value = 'error'
          statusMessage.value = data.message
          showError('Error', data.message)
        }
      } catch (error) {
        console.error('Error:', error)
        statusType.value = 'error'
        statusMessage.value = 'Error de conexión. Intenta más tarde.'
        showError('Error', 'Error de conexión. Intenta más tarde.')
      } finally {
        isSubmitting.value = false
      }
    }

    const verifyToken = async () => {
      const token = route.query.token
      if (token) {
        isResetView.value = true
        loading.value = true

        try {
          const response = await fetch(`http://localhost:8084/api/password-recovery/verify-token?token=${token}`)
          const data = await response.json()

          if (data.success) {
            userEmail.value = data.email
          } else {
            statusType.value = 'error'
            statusMessage.value = data.message
            showError('Error', data.message)
            
            setTimeout(() => {
              router.push('/password-recovery')
            }, 3000)
          }
        } catch (error) {
          console.error('Error:', error)
          statusType.value = 'error'
          statusMessage.value = 'Error verificando el token'
          showError('Error', 'Error verificando el token')
        } finally {
          loading.value = false
        }
      }
    }

    onMounted(() => {
      if (route.query.token) {
        verifyToken()
      }
    })

    return {
      email,
      newPassword,
      confirmPassword,
      showPassword,
      loading,
      isSubmitting,
      isResetView,
      userEmail,
      statusMessage,
      statusType,
      passwordStrength,
      passwordRequirements,
      passwordStrengthColor,
      passwordStrengthLabel,
      passwordStrengthClass,
      isFormValid,
      checkPasswordStrength,
      isRequirementMet,
      togglePassword,
      requestRecovery,
      resetPassword
    }
  }
}
</script>

<style scoped>
.background-container {
  background-image: url('https://i.pinimg.com/736x/77/ed/d4/77edd4126a0d719976473933f4042f38.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.recovery-glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  color: #000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9);
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group input {
  padding-left: 40px;
  padding-right: 45px;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #213547;
  font-size: 16px;
  z-index: 10;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: gray;
  z-index: 10;
}

.password-strength-container {
  margin-top: -10px;
}

.password-strength-bar {
  height: 5px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.password-policies {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 10px;
  border-left: 4px solid #213547;
}

.password-policies ul li {
  margin-bottom: 5px;
}

.btn-primary {
  background-color: #213547 !important;
  border: none !important;
  padding: 12px;
  font-weight: 500;
}

.btn-primary:disabled {
  background-color: #6c757d !important;
}

.text-primary {
  color: #213547 !important;
}

.alert {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

@media (max-width: 576px) {
  .recovery-glass {
    padding: 30px 20px;
    max-width: 95%;
  }
}
</style>