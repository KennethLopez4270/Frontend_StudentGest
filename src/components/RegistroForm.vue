<template>
  <div class="register-glass card shadow-lg animate__animated animate__fadeIn">
    <h1 class="text-center mb-4 animate__animated animate__fadeInDown">REGISTRO PARA STUDENT-GEST</h1>

    <div class="row">
      <!-- Columna izquierda -->
      <div class="col-md-7">
        <form @submit.prevent="submitRegister">
          <!-- Nombre -->
          <div class="mb-3 input-group">
            <input 
              v-model="user.nombre" 
              type="text" 
              class="form-control" 
              placeholder="Nombre(s)" 
              required 
              maxlength="100"
            />
          </div>

          <!-- Apellidos -->
          <div class="mb-3 row">
            <div class="col input-group">
              <input 
                v-model="user.apellido_paterno" 
                type="text" 
                class="form-control" 
                placeholder="Apellido Paterno" 
                required 
                maxlength="100"
              />
            </div>
            <div class="col input-group">
              <input 
                v-model="user.apellido_materno" 
                type="text" 
                class="form-control" 
                placeholder="Apellido Materno" 
                required 
                maxlength="100"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3 input-group">
            <input 
              v-model="user.email" 
              type="email" 
              class="form-control" 
              :class="{ 'is-invalid': showDomainError }"
              placeholder="Correo electrónico" 
              required 
              maxlength="100"
              @blur="validateEmailRealTime"
              @input="showDomainError = false"
            />
            <div v-if="showDomainError" class="invalid-feedback d-block">
              <i class="fas fa-exclamation-triangle me-1"></i>
              {{ domainErrorMessage }}
            </div>
          </div>

          <!-- Contraseñas -->
          <div class="mb-3">
            <div class="row">
              <div class="col position-relative input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="user.password"
                  class="form-control"
                  :placeholder="`Contraseña (mín. ${currentConfig.minLength} caracteres)`"
                  @input="handlePasswordInput"
                  required
                  :minlength="currentConfig.minLength"
                  maxlength="100"
                />
                
                <span class="toggle-password" @click="togglePassword">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
              </div>
              <div class="col position-relative input-group">
                <input
                  :type="showConfirm ? 'text' : 'password'"
                  v-model="confirmPassword"
                  class="form-control"
                  :placeholder="`Confirmar (mín. ${currentConfig.minLength} caracteres)`"
                  required
                  :minlength="currentConfig.minLength"
                  maxlength="100"
                />
                <span class="toggle-password" @click="toggleConfirm">
                  <i :class="showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
              </div>
            </div>
            
            <!-- Mensaje de aviso constante para longitud de contraseña -->
            <div class="password-length-warning mt-2">
              <small :class="passwordLengthWarningClass">
                <i :class="passwordLengthWarningIcon"></i>
                {{ passwordLengthWarningText }}
              </small>
            </div>
            
            <!-- Indicador de fuerza de contraseña -->
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
                <li :class="{'text-success': hasMinLength, 'text-danger': !hasMinLength && user.password.length > 0}">
                  <i v-if="hasMinLength" class="fas fa-check me-1"></i>
                  <i v-else-if="!hasMinLength && user.password.length > 0" class="fas fa-times me-1"></i>
                  Mínimo {{ currentConfig.minLength }} caracteres
                </li>
                <li v-if="currentConfig.requiresUppercase" 
                    :class="{'text-success': hasUppercase, 'text-danger': !hasUppercase && user.password.length > 0}">
                  <i v-if="hasUppercase" class="fas fa-check me-1"></i>
                  <i v-else-if="!hasUppercase && user.password.length > 0" class="fas fa-times me-1"></i>
                  Una letra mayúscula
                </li>
                <li v-if="currentConfig.requiresLowercase" 
                    :class="{'text-success': hasLowercase, 'text-danger': !hasLowercase && user.password.length > 0}">
                  <i v-if="hasLowercase" class="fas fa-check me-1"></i>
                  <i v-else-if="!hasLowercase && user.password.length > 0" class="fas fa-times me-1"></i>
                  Una letra minúscula
                </li>
                <li v-if="currentConfig.requiresNumbers" 
                    :class="{'text-success': hasNumber, 'text-danger': !hasNumber && user.password.length > 0}">
                  <i v-if="hasNumber" class="fas fa-check me-1"></i>
                  <i v-else-if="!hasNumber && user.password.length > 0" class="fas fa-times me-1"></i>
                  Un número
                </li>
                <li v-if="currentConfig.requiresSpecial" 
                    :class="{'text-success': hasSpecial, 'text-danger': !hasSpecial && user.password.length > 0}">
                  <i v-if="hasSpecial" class="fas fa-check me-1"></i>
                  <i v-else-if="!hasSpecial && user.password.length > 0" class="fas fa-times me-1"></i>
                  Un símbolo ({{ currentConfig.allowedSpecialChars }})
                </li>
              </ul>
            </div>
          </div>

          <!-- Rol -->
          <div class="mb-3">
            <label class="form-label" v-if="loadingRoles"><small>Cargando roles...</small></label>
            <select v-model="selectedRoleId" class="form-control input-group" required :disabled="loadingRoles">
              <option disabled value="">Seleccione un Rol:</option>
              <option v-for="role in rolesList" :key="role.id_rol" :value="role.id_rol">
                {{ role.nombre }}
              </option>
            </select>
            <div v-if="rolesError" class="text-danger small">{{ rolesError }}</div>
          </div>

          <!-- Google reCAPTCHA -->
          <div v-if="captchaEnabled" class="mb-3">
            <div class="captcha-container">
              <VueRecaptcha
                :sitekey="recaptchaSiteKey"
                :loadRecaptchaScript="true"
                @verify="onCaptchaVerified"
                @error="onCaptchaError"
                @expire="onCaptchaExpired"
              />
              <div v-if="captchaError" class="text-danger small mt-2">
                <i class="fas fa-exclamation-triangle me-1"></i>{{ captchaError }}
              </div>
              <small class="text-muted mt-2 d-block">
                Este sitio está protegido por reCAPTCHA y se aplican la 
                <a href="https://policies.google.com/privacy" target="_blank">Política de Privacidad</a> y 
                <a href="https://policies.google.com/terms" target="_blank">Términos de Servicio</a> de Google.
              </small>
            </div>
          </div>

          <!-- Términos y condiciones -->
          <div class="mb-3 form-check">
            <input 
              type="checkbox" 
              class="form-check-input" 
              id="terms" 
              v-model="acceptedTerms"
              required
            >
            <label class="form-check-label small" for="terms">
              Acepto los <a href="#" @click.prevent="showTerms = true">términos y condiciones</a> y la <a href="#" @click.prevent="showPrivacy = true">política de privacidad</a>
            </label>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-100"
            :disabled="!acceptedTerms || passwordStrength < currentConfig.minStrength || (captchaEnabled && !captchaVerified)"
          >
            <i class="fas fa-user-plus me-2"></i> 
            {{ loading ? 'Registrando...' : 'Registrarse' }}
          </button>

          <p class="text-center mt-3">
            ¿Ya tienes una cuenta?
            <router-link to="/login" class="text-primary fw-bold">Inicia Sesión</router-link>
          </p>

          <div v-if="statusMessage" :class="['alert mt-3 text-center', statusType === 'success' ? 'alert-success' : 'alert-danger']">
            {{ statusMessage }}
          </div>
        </form>
      </div>

      <!-- Columna derecha -->
      <div class="col-md-5">
        <div class="consejos-box">
          <h4><i class="fas fa-lightbulb me-2 text-warning"></i> Consejos de Seguridad</h4>
          <ul class="ps-3">
            <li>Usa un correo con dominio permitido: 
              <strong>gmail.com, hotmail.com, yahoo.com, outlook.com, edu.bo</strong>
            </li>
            <li>El correo debe ser válido y accesible para verificación</li>
            <li>Contraseña segura (mín. {{ currentConfig.minLength }} caracteres)</li>
            <li><strong>IMPORTANTE:</strong> La contraseña será débil si no alcanza los 12 caracteres</li>
            <li v-if="currentConfig.requiresUppercase || currentConfig.requiresLowercase">Incluye mayúsculas y minúsculas</li>
            <li v-if="currentConfig.requiresNumbers">Incluye números</li>
            <li v-if="currentConfig.requiresSpecial">Incluye símbolos ({{ currentConfig.allowedSpecialChars }})</li>
            <li>No reutilices contraseñas de otras cuentas</li>
            <li>Confirma tu contraseña correctamente</li>
            <li>Tu cuenta requiere <strong>aprobación administrativa</strong> y <strong>verificación de email</strong></li>
          </ul>
          
          <div class="security-features mt-3 pt-3 border-top">
            <h6><i class="fas fa-shield-alt me-2 text-info"></i> Proceso de Verificación</h6>
            <ul class="ps-3 small">
              <li>✅ Registro exitoso</li>
              <li>📧 Verificación de email requerida</li>
              <li>👨‍💼 Aprobación administrativa pendiente</li>
              <li>🔑 Acceso al sistema después de ambas verificaciones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Términos -->
    <div v-if="showTerms" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Términos y Condiciones</h5>
            <button type="button" class="btn-close" @click="showTerms = false"></button>
          </div>
          <div class="modal-body">
            <p>Contenido de términos y condiciones...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showSuccess, showError } from '@/utils/useAlert'
import VueRecaptcha from 'vue3-recaptcha2'

export default {
  name: "RegistroForm",
  components: {
    VueRecaptcha
  },
  data() {
    return {
      user: {
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: "",
        password: "",
        /* rol: "", // Removed */
      },
      selectedRoleId: "",
      rolesList: [],
      loadingRoles: false,
      rolesError: "",
      confirmPassword: "",
      showPassword: false,
      showConfirm: false,
      passwordStrength: 0,
      statusMessage: "",
      statusType: "",
      loading: false,
      acceptedTerms: false,
      showTerms: false,
      showPrivacy: false,
      
      // reCAPTCHA
      captchaEnabled: false,
      recaptchaSiteKey: "",
      captchaVerified: false,
      captchaToken: "",
      captchaError: "",
      showDomainError: false,
      domainErrorMessage: '',
      emailValid: false,

      passwordFeedback: {
      hasMinLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false
    },
      // Configuración por defecto (se actualizará desde BD)
      currentConfig: {
        minLength: 12,
        requiresUppercase: true,
        requiresLowercase: true,
        requiresNumbers: true,
        requiresSpecial: true,
        allowedSpecialChars: '@$!%*?&',
        minStrength: 75
      }
      
    };
  },
  async mounted() {
    await this.loadPasswordPolicy();
    await this.loadCaptchaConfig();
    this.fetchRoles();
  },
  computed: {
    passwordLengthWarningText() {
      const currentLength = this.user.password.length;
      const requiredLength = this.currentConfig.minLength;
      
      if (currentLength === 0) {
        return `La contraseña debe tener al menos ${requiredLength} caracteres para ser segura`;
      } else if (currentLength < requiredLength) {
        const remaining = requiredLength - currentLength;
        return `Contraseña DÉBIL - Te faltan ${remaining} caracteres para los ${requiredLength} requeridos`;
      } else {
        return `¡Longitud adecuada! Tu contraseña tiene ${currentLength} caracteres`;
      }
    },
    
    passwordLengthWarningClass() {
      const currentLength = this.user.password.length;
      const requiredLength = this.currentConfig.minLength;
      
      if (currentLength === 0) {
        return 'text-info';
      } else if (currentLength < requiredLength) {
        return 'text-danger fw-bold';
      } else {
        return 'text-success';
      }
    },

    passwordLengthWarningIcon() {
      const currentLength = this.user.password.length;
      const requiredLength = this.currentConfig.minLength;
      
      if (currentLength === 0) {
        return 'fas fa-info-circle me-1';
      } else if (currentLength < requiredLength) {
        return 'fas fa-exclamation-triangle me-1';
      } else {
        return 'fas fa-check-circle me-1';
      }
    },
    
    passwordStrengthColor() {
      // Si no tiene la longitud mínima, siempre es rojo
      if (!this.hasMinLength) return "#dc3545";
      if (this.passwordStrength < 40) return "#dc3545";
      if (this.passwordStrength < 75) return "#ffc107";
      return "#28a745";
    },

    passwordStrengthLabel() {
      if (!this.user.password) return "";
      // Si no tiene la longitud mínima, siempre es débil
      if (!this.hasMinLength) return "Débil (faltan caracteres)";
      if (this.passwordStrength < 40) return "Débil";
      if (this.passwordStrength < 75) return "Media";
      return "Fuerte";
    },

    passwordStrengthClass() {
      // Si no tiene la longitud mínima, siempre es danger
      if (!this.hasMinLength) return "text-danger fw-bold";
      if (this.passwordStrength < 40) return "text-danger";
      if (this.passwordStrength < 75) return "text-warning";
      return "text-success";
    },

    // ✅ MODIFICADO: Usar feedback del backend en lugar de cálculo local
    hasMinLength() {
      if (!this.user.password) return false;
      if (this.passwordFeedback.hasMinLength) return true;
      return this.user.password.length >= this.currentConfig.minLength;
    },
    
    hasUppercase() {
      if (!this.currentConfig.requiresUppercase) return true;
      return this.passwordFeedback.hasUppercase;
    },
    
    hasLowercase() {
      if (!this.currentConfig.requiresLowercase) return true;
      return this.passwordFeedback.hasLowercase;
    },
    
    hasNumber() {
      if (!this.currentConfig.requiresNumbers) return true;
      return this.passwordFeedback.hasNumber;
    },
    
    hasSpecial() {
      if (!this.currentConfig.requiresSpecial) return true;
      return this.passwordFeedback.hasSpecial;
    },
  },
  methods: {
    async fetchRoles() {
      console.log("🚀 fetchRoles llamado");
      this.loadingRoles = true;
      this.rolesError = "";
      try {
        console.log("🌐 Solicitando roles a: http://localhost:8084/api/roles");
        const response = await fetch("http://localhost:8084/api/roles");
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Datos de roles parseados:", data); // DEBUG LOG
          this.rolesList = data;
        } else {
          console.error("❌ Respuesta no ok:", response.status);
          this.rolesError = "No se pudieron cargar los roles.";
        }
      } catch (error) {
        console.error("❌ Error fetching roles (exception):", error);
        this.rolesError = "Error de conexión al cargar roles.";
      } finally {
        this.loadingRoles = false;
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirm() {
      this.showConfirm = !this.showConfirm;
    },
    
    // reCAPTCHA METHODS
    async loadCaptchaConfig() {
      try {
        const response = await fetch("http://localhost:8084/api/captcha/config");
        if (response.ok) {
          const data = await response.json();
          this.captchaEnabled = data.enabled;
          this.recaptchaSiteKey = data.siteKey;
          console.log('🎯 reCAPTCHA Config Registro:', data);
        }
      } catch (error) {
        console.warn('⚠️ No se pudo cargar config reCAPTCHA registro:', error);
        this.captchaEnabled = false;
      }
    },

    onCaptchaVerified(response) {
      console.log('✅ reCAPTCHA verificado:', response);
      this.captchaToken = response;
      this.captchaVerified = true;
      this.captchaError = '';
    },

    onCaptchaError() {
      console.error('❌ Error en reCAPTCHA');
      this.captchaVerified = false;
      this.captchaToken = '';
      this.captchaError = 'Error verificando reCAPTCHA. Intenta de nuevo.';
    },

    onCaptchaExpired() {
      console.warn('⚠️ reCAPTCHA expirado');
      this.captchaVerified = false;
      this.captchaToken = '';
      this.captchaError = 'reCAPTCHA expirado. Completa el desafío nuevamente.';
    },

    async validateCaptcha() {
      if (!this.captchaToken) {
        this.captchaError = 'Por favor, completa el reCAPTCHA';
        return false;
      }

      try {
        const response = await fetch("http://localhost:8084/api/captcha/verify", {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            recaptchaResponse: this.captchaToken,
            clientIp: '' // El backend puede obtener la IP
          })
        });

        const data = await response.json();
        
        if (response.ok && data.valid) {
          this.captchaError = '';
          return true;
        } else {
          this.captchaError = data.message || 'Error validando reCAPTCHA. Intenta de nuevo.';
          this.captchaVerified = false;
          this.captchaToken = '';
          return false;
        }
      } catch (error) {
        this.captchaError = 'Error validando reCAPTCHA';
        this.captchaVerified = false;
        this.captchaToken = '';
        return false;
      }
    },

    // MÉTODOS EXISTENTES
    async loadPasswordPolicy() {
      try {
        console.log("🔄 Cargando política de contraseñas...");
        const response = await fetch("http://localhost:8084/api/users/public/password-policy");
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Datos recibidos del backend:", data);
          
          if (data.success) {
            this.currentConfig = {
              minLength: data.minLength,
              requiresUppercase: data.requiresUppercase,
              requiresLowercase: data.requiresLowercase,
              requiresNumbers: data.requiresNumbers,
              requiresSpecial: data.requiresSpecial,
              allowedSpecialChars: data.allowedSpecialChars,
              minStrength: 75
            };
            console.log("🎯 Configuración actualizada desde BD:", this.currentConfig);
            
            // DEBUG: Verificar configuración
            console.log("🔍 Configuración final cargada:", {
              minLength: this.currentConfig.minLength,
              requiresUppercase: this.currentConfig.requiresUppercase,
              requiresLowercase: this.currentConfig.requiresLowercase, 
              requiresNumbers: this.currentConfig.requiresNumbers,
              requiresSpecial: this.currentConfig.requiresSpecial,
              allowedSpecialChars: this.currentConfig.allowedSpecialChars
            });
            return;
          }
        }
        
        console.warn("⚠️ No se pudo cargar política desde BD, usando valores por defecto");
        // Fallback a valores por defecto
        this.currentConfig = {
          minLength: 12,
          requiresUppercase: true,
          requiresLowercase: true,
          requiresNumbers: true,
          requiresSpecial: true,
          allowedSpecialChars: '@$!%*?&',
          minStrength: 75
        };
        
      } catch (error) {
        console.error("❌ Error al cargar política:", error);
        this.currentConfig = {
          minLength: 12,
          requiresUppercase: true,
          requiresLowercase: true,
          requiresNumbers: true,
          requiresSpecial: true,
          allowedSpecialChars: '@$!%*?&',
          minStrength: 75
        };
      }
    },

    async validateEmailRealTime() {
      if (!this.user.email) return;
      
      try {
        const email = this.user.email.trim();
        if (email.length < 5) return;
        
        console.log('📧 Validando email en tiempo real:', email);
        const response = await fetch("http://localhost:8084/api/email/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
        console.log('🔍 Respuesta validación tiempo real:', data);
        
        if (!data.valid) {
          // Mostrar tooltip o mensaje con dominios permitidos
          this.showDomainError = true;
          this.domainErrorMessage = data.requirements || 'Dominio no permitido';
        } else {
          this.showDomainError = false;
        }
        
      } catch (error) {
        console.error("Error validando email en tiempo real:", error);
      }
    },
    handlePasswordInput() {
      this.checkPasswordStrength();
      // Si la contraseña está vacía, resetear feedback
      if (!this.user.password) {
        this.resetPasswordFeedback();
      }
    },

    async validateEmail() {
      try {
        console.log('📧 Email a validar:', this.user.email); 
        const response = await fetch("http://localhost:8084/api/email/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.user.email })
        });
        
        const data = await response.json();
        console.log('🔍 Respuesta validación email:', data);
        return data.valid;
      } catch (error) {
        console.error("Error validando email:", error);
        return false;
      }
    },

    async checkPasswordStrength() {
      const pwd = this.user.password;
      if (!pwd) {
        this.passwordStrength = 0;
        this.resetPasswordFeedback();
        return;
      }

      console.log('🔍 Frontend - Evaluando contraseña:', pwd);

      try {
        const response = await fetch("http://localhost:8084/api/password-strength/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pwd })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('📊 Backend response:', data);
          
          if (data.success) {
            // USAR SIEMPRE LA RESPUESTA DEL BACKEND
            this.passwordStrength = data.score;
            console.log('🎯 Puntuación asignada desde backend:', this.passwordStrength);
            
            this.processBackendFeedback(data.feedback || []);
          } else {
            this.passwordStrength = 0;
            this.resetPasswordFeedback();
            console.warn('⚠️ Backend respondió con error');
          }
        } else {
          console.warn('⚠️ Backend falló, usando fuerza 0');
          this.passwordStrength = 0;
          this.resetPasswordFeedback();
        }
      } catch (error) {
        console.error('❌ Error de conexión, usando fuerza 0:', error);
        this.passwordStrength = 0;
        this.resetPasswordFeedback();
      }
    },

   
    processBackendFeedback(feedback) {
      // Resetear todos los valores
      this.resetPasswordFeedback();
      
      console.log('💬 Procesando feedback del backend:', feedback);
      
      // Si el array de feedback está vacío, significa que TODOS los requisitos se cumplen
      if (feedback.length === 0) {
        this.passwordFeedback.hasMinLength = true;
        this.passwordFeedback.hasUppercase = true;
        this.passwordFeedback.hasLowercase = true;
        this.passwordFeedback.hasNumber = true;
        this.passwordFeedback.hasSpecial = true;
        console.log('✅ Todos los requisitos cumplidos (feedback vacío)');
        return;
      }
      
      // Analizar el feedback para determinar qué requisitos NO se cumplen
      // Si un requisito NO aparece en el feedback, significa que SÍ se cumple
      
      // Verificar longitud mínima
      const hasLengthError = feedback.some(item => 
        item.toLowerCase().includes('mínimo') && item.toLowerCase().includes('caracteres')
      );
      this.passwordFeedback.hasMinLength = !hasLengthError;
      
      // Verificar mayúsculas
      const hasUppercaseError = feedback.some(item => 
        item.toLowerCase().includes('mayúscula')
      );
      this.passwordFeedback.hasUppercase = !hasUppercaseError;
      
      // Verificar minúsculas
      const hasLowercaseError = feedback.some(item => 
        item.toLowerCase().includes('minúscula')
      );
      this.passwordFeedback.hasLowercase = !hasLowercaseError;
      
      // Verificar números
      const hasNumberError = feedback.some(item => 
        item.toLowerCase().includes('número') || item.toLowerCase().includes('numero')
      );
      this.passwordFeedback.hasNumber = !hasNumberError;
      
      // Verificar símbolos
      const hasSpecialError = feedback.some(item => 
        item.toLowerCase().includes('símbolo') || item.toLowerCase().includes('simbolo') || 
        item.toLowerCase().includes('especial')
      );
      this.passwordFeedback.hasSpecial = !hasSpecialError;
      
      console.log('📋 Estado de requisitos procesados:', this.passwordFeedback);
      console.log('🔍 Análisis de errores:', {
        hasLengthError,
        hasUppercaseError, 
        hasLowercaseError,
        hasNumberError,
        hasSpecialError
      });
    },


    resetPasswordFeedback() {
      this.passwordFeedback = {
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false
      };
    },
    
    recalculatePasswordStrength(config) {
      const pwd = this.user.password;
      if (!pwd) {
        this.passwordStrength = 0;
        return;
      }
      
      // Si no tiene la longitud mínima, fuerza baja automáticamente
      if (!this.hasMinLength) {
        this.passwordStrength = Math.min(30, Math.floor((pwd.length / config.minLength) * 30));
        return;
      }
      
      let strength = 0;
      
      // Base por longitud (ya tenemos la longitud mínima)
      strength += 40;
      
      // Verificar cada requisito individualmente
      const hasUppercase = /[A-Z]/.test(pwd);
      const hasLowercase = /[a-z]/.test(pwd);
      const hasNumber = /[0-9]/.test(pwd);
      
      const specialCharsRegex = new RegExp(`[${this.escapeRegExp(config.allowedSpecialChars || '@$!%*?&')}]`);
      const hasSpecial = specialCharsRegex.test(pwd);
      
      // Asignar puntos solo si el requisito está habilitado Y se cumple
      if (config.requiresUppercase && hasUppercase) strength += 15;
      if (config.requiresLowercase && hasLowercase) strength += 15;
      if (config.requiresNumbers && hasNumber) strength += 15;
      if (config.requiresSpecial && hasSpecial) strength += 15;
      
      // Asegurar que no exceda 100%
      this.passwordStrength = Math.min(strength, 100);
      
      console.log('🔍 Cálculo de fuerza:', {
        password: pwd,
        length: pwd.length,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial,
        strength,
        requiresUppercase: config.requiresUppercase,
        requiresLowercase: config.requiresLowercase,
        requiresNumbers: config.requiresNumbers,
        requiresSpecial: config.requiresSpecial
      });
    },
    
    escapeRegExp(string) {
      if (!string) return '';
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
    
    async submitRegister() {
      // Validar reCAPTCHA si está habilitado
      if (this.captchaEnabled) {
        const isValidCaptcha = await this.validateCaptcha();
        if (!isValidCaptcha) {
          return;
        }
      }

      // Validaciones básicas
      if (this.user.password !== this.confirmPassword) {
        showError('Error', 'Las contraseñas no coinciden.');
        return;
      }

      // Validar longitud mínima primero
      if (this.user.password.length < this.currentConfig.minLength) {
        showError('Error', `La contraseña debe tener al menos ${this.currentConfig.minLength} caracteres para ser considerada segura.`);
        return;
      }

      console.log('📧 Validando email antes del registro...');
      if (!await this.validateEmail()) {
        showError('Error', 'El email no es válido o no está permitido.');
        return;
      }

      if (this.passwordStrength < this.currentConfig.minStrength) {
        showError('Error', 'La contraseña no es lo suficientemente fuerte.');
        return;
      }

      if (!this.acceptedTerms) {
        showError('Error', 'Debe aceptar los términos y condiciones.');
        return;
      }

      if (!this.selectedRoleId) {
        showError('Error', 'Por favor seleccione un rol');
        return;
      }

      this.loading = true;

      const payload = {
        ...this.user,
        id_rol: this.selectedRoleId
      };
      
      console.log("📤 Payload enviado al registro:", JSON.stringify(payload, null, 2));

      try {
        const response = await fetch("http://localhost:8084/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("❌ Error response payload:", data); // DEBUG LOG
          throw new Error(data.error || data.message || "Error al registrar usuario");
        }

        showSuccess('Éxito', 'Usuario registrado correctamente. Será activado después de la verificación.');
        setTimeout(() => this.$router.push("/login"), 2000);
      } catch (error) {
        console.error("Registro fallido:", error.message);
        showError('Error', error.message);
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    console.log("🔌 RegistroForm MOUNTED iniciado");
    try {
      await this.loadPasswordPolicy();
      console.log("🔌 loadPasswordPolicy completado");
      await this.loadCaptchaConfig();
      console.log("🔌 loadCaptchaConfig completado");
      
      console.log("🔌 Llamando a fetchRoles...");
      this.fetchRoles(); 
    } catch (err) {
      console.error("❌ Error en MOUNTED:", err);
    }
  }
};
</script>

<style scoped>
/* Estilos reCAPTCHA */
.captcha-container {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  background: #f8f9fa;
  text-align: center;
}

/* Estilos para el mensaje de longitud de contraseña */
.password-length-warning {
  padding: 8px 12px;
  border-radius: 6px;
  background-color: #f8f9fa;
  border-left: 4px solid #17a2b8;
}

.password-length-warning .text-info {
  border-left-color: #17a2b8;
  background-color: #d1ecf1;
}

.password-length-warning .text-danger {
  border-left-color: #dc3545;
  background-color: #f8d7da;
}

.password-length-warning .text-success {
  border-left-color: #28a745;
  background-color: #d4edda;
}

/* Estilos existentes se mantienen igual */
.register-glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 900px;
  color: #000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.input-group {
  background-color: #ffffff9c;
}
.input-group input, .input-group select {
  background-color: #ffffff9c;
}

h1 {
  font-family: 'Georgia', serif;
  font-weight: bold;
  color: #213547;
  font-size: 30px;
}

.text-primary {
  color: #213547 !important;
}
.text-primary:hover {
  color: #172b3a !important;
}

.consejos-box {
  padding: 30px;
  background-color: #213547;
  color: white;
  border-radius: 20px;
  height: 100%;
}

.security-features {
  border-color: rgba(255,255,255,0.2) !important;
}

ul {
  margin: 0;
  padding-left: 1rem;
}

.toggle-password {
  position: absolute;
  right: 20px;
  top: 45%;
  transform: translateY(-50%);
  cursor: pointer;
  color: gray;
  z-index: 10;
}
.toggle-password:hover {
  color: #213547;
}

.password-strength-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.password-strength-bar {
  height: 6px;
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}
.strength-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.password-requirements ul {
  list-style: none;
  padding-left: 0;
}
.password-requirements li {
  transition: color 0.3s ease;
}

.btn-primary {
  background-color: #213547 !important;
  border-color: #213547 !important;
}
.btn-primary:disabled {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}

@media (max-width: 768px) {
  .register-glass {
    padding: 30px 20px;
    max-width: 95%;
  }
  
  .consejos-box {
    margin-top: 20px;
    padding: 20px;
  }
  
  h1 {
    font-size: 24px;
  }
}

.modal {
  background-color: rgba(0,0,0,0.5);
}
</style>