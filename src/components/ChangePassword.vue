<template>
    <div class="change-password-container">
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">
            <i class="fas fa-lock me-2"></i>Cambiar Contraseña
          </h5>
          <button 
            @click="goBack" 
            class="btn btn-sm btn-outline-light"
            title="Volver al dashboard"
          >
            <i class="fas fa-arrow-left me-1"></i>Volver
          </button>
        </div>
        <div class="card-body">
          <form @submit.prevent="changePassword">
            <!-- Contraseña actual -->
            <div class="mb-3">
              <label class="form-label">Contraseña actual <span class="text-danger">*</span></label>
              <div class="position-relative">
                <input
                  v-model="currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': currentPasswordError }"
                  placeholder="Ingresa tu contraseña actual"
                  required
                  @input="clearCurrentPasswordError"
                />
                <span class="toggle-password" @click="showCurrentPassword = !showCurrentPassword">
                  <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
                <div v-if="currentPasswordError" class="invalid-feedback d-block">
                  <i class="fas fa-exclamation-triangle me-1"></i>{{ currentPasswordError }}
                </div>
              </div>
            </div>
  
            <!-- Nueva contraseña -->
            <div class="mb-3">
              <label class="form-label">Nueva contraseña <span class="text-danger">*</span></label>
              <div class="position-relative">
                <input
                  v-model="newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': newPasswordError }"
                  placeholder="Ingresa nueva contraseña"
                  required
                  @input="handlePasswordInput"
                />
                <span class="toggle-password" @click="showNewPassword = !showNewPassword">
                  <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
                <div v-if="newPasswordError" class="invalid-feedback d-block">
                  <i class="fas fa-exclamation-triangle me-1"></i>{{ newPasswordError }}
                </div>
              </div>
              
              <!-- Indicador de fortaleza -->
              <div class="password-strength-container mt-2">
                <div class="password-strength-bar">
                  <div
                    :style="{ width: passwordStrength + '%', backgroundColor: passwordStrengthColor }"
                    class="strength-bar"
                  ></div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-1">
                  <small :class="passwordStrengthClass">
                    {{ passwordStrengthLabel }}
                  </small>
                  <small class="text-muted">{{ passwordStrength }}%</small>
                </div>
              </div>
  
              <!-- Requisitos de contraseña DINÁMICOS -->
              <div class="password-requirements mt-2">
                <small class="text-muted">La contraseña debe incluir:</small>
                <ul class="ps-3 mb-0 small">
                  <li :class="{'text-success': hasMinLength, 'text-danger': !hasMinLength && newPassword.length > 0}">
                    <i v-if="hasMinLength" class="fas fa-check me-1"></i>
                    <i v-else-if="!hasMinLength && newPassword.length > 0" class="fas fa-times me-1"></i>
                    Mínimo {{ currentConfig.minLength }} caracteres
                  </li>
                  <li v-if="currentConfig.requiresUppercase" 
                      :class="{'text-success': hasUppercase, 'text-danger': !hasUppercase && newPassword.length > 0}">
                    <i v-if="hasUppercase" class="fas fa-check me-1"></i>
                    <i v-else-if="!hasUppercase && newPassword.length > 0" class="fas fa-times me-1"></i>
                    Una letra mayúscula
                  </li>
                  <li v-if="currentConfig.requiresLowercase" 
                      :class="{'text-success': hasLowercase, 'text-danger': !hasLowercase && newPassword.length > 0}">
                    <i v-if="hasLowercase" class="fas fa-check me-1"></i>
                    <i v-else-if="!hasLowercase && newPassword.length > 0" class="fas fa-times me-1"></i>
                    Una letra minúscula
                  </li>
                  <li v-if="currentConfig.requiresNumbers" 
                      :class="{'text-success': hasNumber, 'text-danger': !hasNumber && newPassword.length > 0}">
                    <i v-if="hasNumber" class="fas fa-check me-1"></i>
                    <i v-else-if="!hasNumber && newPassword.length > 0" class="fas fa-times me-1"></i>
                    Un número
                  </li>
                  <li v-if="currentConfig.requiresSpecial" 
                      :class="{'text-success': hasSpecial, 'text-danger': !hasSpecial && newPassword.length > 0}">
                    <i v-if="hasSpecial" class="fas fa-check me-1"></i>
                    <i v-else-if="!hasSpecial && newPassword.length > 0" class="fas fa-times me-1"></i>
                    Un símbolo ({{ currentConfig.allowedSpecialChars }})
                  </li>
                  <li :class="{'text-success': !isPasswordInHistory, 'text-warning': isPasswordInHistory === null, 'text-danger': isPasswordInHistory === false}">
                    <i v-if="isPasswordInHistory === false" class="fas fa-times me-1"></i>
                    <i v-else-if="isPasswordInHistory" class="fas fa-check me-1"></i>
                    <i v-else class="fas fa-spinner fa-spin me-1"></i>
                    No puede ser una de las últimas 5 contraseñas
                  </li>
                </ul>
              </div>
            </div>
  
            <!-- Confirmar contraseña -->
            <div class="mb-4">
              <label class="form-label">Confirmar nueva contraseña <span class="text-danger">*</span></label>
              <div class="position-relative">
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': confirmPasswordError }"
                  placeholder="Confirma tu nueva contraseña"
                  required
                  @input="validateConfirmPassword"
                />
                <span class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                  <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
                <div v-if="confirmPasswordError" class="invalid-feedback d-block">
                  <i class="fas fa-exclamation-triangle me-1"></i>{{ confirmPasswordError }}
                </div>
                <div v-else-if="confirmPassword && newPassword === confirmPassword" class="valid-feedback d-block">
                  <i class="fas fa-check-circle me-1"></i>Las contraseñas coinciden
                </div>
              </div>
            </div>
  
            <button 
              type="submit" 
              class="btn btn-primary w-100" 
              :disabled="loading || !isFormValid"
            >
              <template v-if="!loading">
                <i class="fas fa-save me-2"></i> Cambiar contraseña
              </template>
              <template v-else>
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Cambiando...
              </template>
            </button>
  
            <div v-if="message" :class="['alert mt-3 text-center', messageType === 'success' ? 'alert-success' : 'alert-danger']">
              <i :class="messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'"></i>
              {{ message }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { showSuccess, showError } from '@/utils/useAlert'
  
  export default {
    name: 'ChangePassword',
    setup() {
      const router = useRouter()
      
      const currentPassword = ref('')
      const newPassword = ref('')
      const confirmPassword = ref('')
      const showCurrentPassword = ref(false)
      const showNewPassword = ref(false)
      const showConfirmPassword = ref(false)
      const loading = ref(false)
      const message = ref('')
      const messageType = ref('')
      
      // Errores de validación
      const currentPasswordError = ref('')
      const newPasswordError = ref('')
      const confirmPasswordError = ref('')
      
      // Password strength
      const passwordStrength = ref(0)
      const passwordFeedback = ref({
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false
      })
      const isPasswordInHistory = ref(null) // null = no verificado, true = en historial, false = no en historial
      
      // Configuración
      const currentConfig = ref({
        minLength: 12,
        requiresUppercase: true,
        requiresLowercase: true,
        requiresNumbers: true,
        requiresSpecial: true,
        allowedSpecialChars: '@$!%*?&',
        minStrength: 75
      })
  
      const passwordStrengthColor = computed(() => {
        if (!hasMinLength.value) return "#dc3545"
        if (passwordStrength.value < 40) return "#dc3545"
        if (passwordStrength.value < 75) return "#ffc107"
        return "#28a745"
      })
  
      const passwordStrengthLabel = computed(() => {
        if (!newPassword.value) return ""
        if (!hasMinLength.value) return "Débil (faltan caracteres)"
        if (passwordStrength.value < 40) return "Débil"
        if (passwordStrength.value < 75) return "Media"
        return "Fuerte"
      })
  
      const passwordStrengthClass = computed(() => {
        if (!hasMinLength.value) return "text-danger fw-bold"
        if (passwordStrength.value < 40) return "text-danger"
        if (passwordStrength.value < 75) return "text-warning"
        return "text-success"
      })
  
      const hasMinLength = computed(() => {
        if (!newPassword.value) return false
        return passwordFeedback.value.hasMinLength
      })
      
      const hasUppercase = computed(() => {
        if (!currentConfig.value.requiresUppercase) return true
        return passwordFeedback.value.hasUppercase
      })
      
      const hasLowercase = computed(() => {
        if (!currentConfig.value.requiresLowercase) return true
        return passwordFeedback.value.hasLowercase
      })
      
      const hasNumber = computed(() => {
        if (!currentConfig.value.requiresNumbers) return true
        return passwordFeedback.value.hasNumber
      })
      
      const hasSpecial = computed(() => {
        if (!currentConfig.value.requiresSpecial) return true
        return passwordFeedback.value.hasSpecial
      })
  
      const isFormValid = computed(() => {
        return currentPassword.value && 
               newPassword.value && 
               confirmPassword.value &&
               newPassword.value === confirmPassword.value &&
               passwordStrength.value >= currentConfig.value.minStrength &&
               isPasswordInHistory.value === false
      })
  
      const goBack = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const role = user.rol?.toUpperCase()
        
        const dashboardRoutes = {
          PADRE: '/parent-dashboard',
          ESTUDIANTE: '/student-dashboard',
          PROFESOR: '/teacher-dashboard',
          DIRECTOR: '/admin-dashboard',
          PERSONAL: '/personal-dashboard'
        }
        
        router.push(dashboardRoutes[role] || '/')
      }
  
      const clearCurrentPasswordError = () => {
        currentPasswordError.value = ''
      }
  
      const validateConfirmPassword = () => {
        if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
          confirmPasswordError.value = 'Las contraseñas no coinciden'
        } else {
          confirmPasswordError.value = ''
        }
      }
  
      const handlePasswordInput = () => {
        checkPasswordStrength()
        validateConfirmPassword()
        
        // Si la contraseña está vacía, resetear feedback
        if (!newPassword.value) {
          resetPasswordFeedback()
          isPasswordInHistory.value = null
        }
      }
  
      const resetPasswordFeedback = () => {
        passwordFeedback.value = {
          hasMinLength: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecial: false
        }
      }
  
      const checkPasswordStrength = async () => {
        const pwd = newPassword.value
        if (!pwd) {
          passwordStrength.value = 0
          resetPasswordFeedback()
          isPasswordInHistory.value = null
          return
        }
  
        console.log('🔍 Frontend - Evaluando contraseña:', pwd)
  
        try {
          const response = await fetch("http://localhost:8084/api/password-strength/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: pwd })
          })
  
          if (response.ok) {
            const data = await response.json()
            console.log('📊 Backend response:', data)
            
            if (data.success) {
              passwordStrength.value = data.score
              console.log('🎯 Puntuación asignada desde backend:', passwordStrength.value)
              
              processBackendFeedback(data.feedback || [])
              
              // Verificar si la contraseña está en el historial
              await checkPasswordHistory(pwd)
            } else {
              passwordStrength.value = 0
              resetPasswordFeedback()
              isPasswordInHistory.value = null
            }
          } else {
            passwordStrength.value = 0
            resetPasswordFeedback()
            isPasswordInHistory.value = null
          }
        } catch (error) {
          console.error('❌ Error de conexión:', error)
          passwordStrength.value = 0
          resetPasswordFeedback()
          isPasswordInHistory.value = null
        }
      }
  
      const processBackendFeedback = (feedback) => {
        resetPasswordFeedback()
        
        console.log('💬 Procesando feedback del backend:', feedback)
        
        if (feedback.length === 0) {
          passwordFeedback.value.hasMinLength = true
          passwordFeedback.value.hasUppercase = true
          passwordFeedback.value.hasLowercase = true
          passwordFeedback.value.hasNumber = true
          passwordFeedback.value.hasSpecial = true
          console.log('✅ Todos los requisitos cumplidos (feedback vacío)')
          return
        }
        
        const hasLengthError = feedback.some(item => 
          item.toLowerCase().includes('mínimo') && item.toLowerCase().includes('caracteres')
        )
        passwordFeedback.value.hasMinLength = !hasLengthError
        
        const hasUppercaseError = feedback.some(item => 
          item.toLowerCase().includes('mayúscula')
        )
        passwordFeedback.value.hasUppercase = !hasUppercaseError
        
        const hasLowercaseError = feedback.some(item => 
          item.toLowerCase().includes('minúscula')
        )
        passwordFeedback.value.hasLowercase = !hasLowercaseError
        
        const hasNumberError = feedback.some(item => 
          item.toLowerCase().includes('número') || item.toLowerCase().includes('numero')
        )
        passwordFeedback.value.hasNumber = !hasNumberError
        
        const hasSpecialError = feedback.some(item => 
          item.toLowerCase().includes('símbolo') || item.toLowerCase().includes('simbolo') || 
          item.toLowerCase().includes('especial')
        )
        passwordFeedback.value.hasSpecial = !hasSpecialError
        
        console.log('📋 Estado de requisitos procesados:', passwordFeedback.value)
      }
  
      const checkPasswordHistory = async (password) => {
        if (!password) {
            isPasswordInHistory.value = null
            return
        }

        try {
            const token = localStorage.getItem('authToken')
            const response = await fetch("http://localhost:8084/api/password-change/check-history", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ password: password })
            })

            if (response.ok) {
            const data = await response.json()
            isPasswordInHistory.value = data.isInHistory
            console.log('📋 Estado en historial:', isPasswordInHistory.value)
            
            // Actualizar mensaje de error si está en historial
            if (isPasswordInHistory.value) {
                newPasswordError.value = 'Esta contraseña ha sido utilizada anteriormente'
            } else {
                newPasswordError.value = ''
            }
            } else {
            isPasswordInHistory.value = null
            }
        } catch (error) {
            console.error('❌ Error verificando historial:', error)
            isPasswordInHistory.value = null
        }
        }
  
      const loadPasswordPolicy = async () => {
        try {
          const response = await fetch("http://localhost:8084/api/password-change/policy")
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              currentConfig.value = {
                minLength: data.policy.minLength,
                requiresUppercase: data.policy.requiresUppercase,
                requiresLowercase: data.policy.requiresLowercase,
                requiresNumbers: data.policy.requiresNumbers,
                requiresSpecial: data.policy.requiresSpecial,
                allowedSpecialChars: data.policy.allowedSpecialChars,
                minStrength: 75
              }
              console.log("🎯 Configuración cargada:", currentConfig.value)
            }
          }
        } catch (error) {
          console.error("❌ Error al cargar política:", error)
        }
      }
  
      const changePassword = async () => {
        // Validaciones frontend
        if (newPassword.value !== confirmPassword.value) {
            confirmPasswordError.value = 'Las contraseñas no coinciden'
            showError('Error', 'Las contraseñas no coinciden')
            return
        }

        if (passwordStrength.value < currentConfig.value.minStrength) {
            newPasswordError.value = 'La contraseña no es lo suficientemente fuerte'
            showError('Error', 'La contraseña no es lo suficientemente fuerte')
            return
        }

        // ✅ NUEVO: Verificar si ya sabemos que está en el historial
        if (isPasswordInHistory.value === true) {
            newPasswordError.value = 'No puede reutilizar las últimas 5 contraseñas'
            showError('Error', 'No puede reutilizar las últimas 5 contraseñas')
            return
        }

        // ✅ NUEVO: Si no hemos verificado el historial, verificarlo ahora
        if (isPasswordInHistory.value === null && newPassword.value) {
            await checkPasswordHistory(newPassword.value)
            if (isPasswordInHistory.value === true) {
            newPasswordError.value = 'No puede reutilizar las últimas 5 contraseñas'
            showError('Error', 'No puede reutilizar las últimas 5 contraseñas')
            return
            }
        }

        loading.value = true
        message.value = ''
        currentPasswordError.value = ''
        newPasswordError.value = ''
        confirmPasswordError.value = ''
  
        try {
          const token = localStorage.getItem('authToken')
          const response = await fetch('http://localhost:8084/api/password-change', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              currentPassword: currentPassword.value,
              newPassword: newPassword.value,
              confirmPassword: confirmPassword.value
            })
          })
  
          const data = await response.json()
  
          if (data.success) {
            messageType.value = 'success'
            message.value = data.message
            showSuccess('Éxito', data.message)
            
            // Limpiar formulario
            currentPassword.value = ''
            newPassword.value = ''
            confirmPassword.value = ''
            passwordStrength.value = 0
            isPasswordInHistory.value = null
            resetPasswordFeedback()
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
              goBack()
            }, 2000)
          } else {
            messageType.value = 'error'
            message.value = data.message
            showError('Error', data.message)
            
            // Mostrar errores específicos
            if (data.message.includes('actual es incorrecta')) {
              currentPasswordError.value = data.message
            } else if (data.message.includes('reutilizar')) {
              newPasswordError.value = data.message
            } else if (data.message.includes('políticas')) {
              newPasswordError.value = data.message
            }
          }
        } catch (error) {
          console.error('Error:', error)
          messageType.value = 'error'
          message.value = 'Error de conexión. Intenta más tarde.'
          showError('Error', 'Error de conexión. Intenta más tarde.')
        } finally {
          loading.value = false
        }
      }
  
      onMounted(() => {
        loadPasswordPolicy()
      })
  
      return {
        currentPassword,
        newPassword,
        confirmPassword,
        showCurrentPassword,
        showNewPassword,
        showConfirmPassword,
        loading,
        message,
        messageType,
        passwordStrength,
        passwordFeedback,
        isPasswordInHistory,
        currentConfig,
        passwordStrengthColor,
        passwordStrengthLabel,
        passwordStrengthClass,
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial,
        isFormValid,
        currentPasswordError,
        newPasswordError,
        confirmPasswordError,
        goBack,
        clearCurrentPasswordError,
        validateConfirmPassword,
        handlePasswordInput,
        changePassword
      }
    }
  }
  </script>
  
  <style scoped>
  .change-password-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  .card {
    border: none;
    border-radius: 15px;
    overflow: hidden;
  }
  
  .card-header {
    background: linear-gradient(135deg, #213547 0%, #2c3e50 100%);
    border-bottom: none;
    padding: 1.5rem;
  }
  
  .card-body {
    padding: 2rem;
  }
  
  .form-label {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  .form-control {
    border: 2px solid #e9ecef;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
  }
  
  .form-control:focus {
    border-color: #213547;
    box-shadow: 0 0 0 0.2rem rgba(33, 53, 71, 0.25);
  }
  
  .form-control.is-invalid {
    border-color: #dc3545;
  }
  
  .toggle-password {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #6c757d;
    transition: color 0.3s ease;
  }
  
  .toggle-password:hover {
    color: #213547;
  }
  
  .password-strength-container {
    margin-top: 0.5rem;
  }
  
  .password-strength-bar {
    height: 8px;
    background-color: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  
  .strength-bar {
    height: 100%;
    transition: all 0.5s ease;
    border-radius: 10px;
  }
  
  .password-requirements {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 1rem;
    border-left: 4px solid #213547;
  }
  
  .password-requirements ul {
    list-style: none;
    padding-left: 0;
    margin-bottom: 0;
  }
  
  .password-requirements li {
    margin-bottom: 0.25rem;
    transition: color 0.3s ease;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #213547 0%, #2c3e50 100%);
    border: none;
    border-radius: 10px;
    padding: 0.75rem 2rem;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(33, 53, 71, 0.3);
  }
  
  .btn-primary:disabled {
    background: #6c757d;
    transform: none;
    box-shadow: none;
  }
  
  .btn-outline-light {
    border-radius: 8px;
    padding: 0.375rem 0.75rem;
  }
  
  .alert {
    border-radius: 10px;
    border: none;
    padding: 1rem;
  }
  
  .valid-feedback {
    color: #28a745;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .invalid-feedback {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  /* Animaciones */
  .card {
    animation: slideInUp 0.5s ease;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .change-password-container {
      margin: 1rem auto;
      padding: 0 0.5rem;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .card-header {
      padding: 1rem 1.5rem;
    }
  }
  </style>