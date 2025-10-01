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
              placeholder="Correo electrónico" 
              required 
              maxlength="100"
            />
          </div>

          <!-- Contraseñas -->
          <div class="mb-3">
            <div class="row">
              <div class="col position-relative input-group">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="user.password"
                  class="form-control"
                  placeholder="Contraseña"
                  @input="checkPasswordStrength"
                  required
                  minlength="8"
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
                  placeholder="Confirmar contraseña"
                  required
                  minlength="8"
                  maxlength="100"
                />
                <span class="toggle-password" @click="toggleConfirm">
                  <i :class="showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </span>
              </div>
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

            <!-- Requisitos de contraseña -->
            <div class="password-requirements mt-2">
              <small class="text-muted">La contraseña debe incluir:</small>
              <ul class="ps-3 mb-0 small">
                <li :class="{'text-success': hasMinLength}">Mínimo 12 caracteres</li>
                <li :class="{'text-success': hasUppercase}">Una letra mayúscula</li>
                <li :class="{'text-success': hasLowercase}">Una letra minúscula</li>
                <li :class="{'text-success': hasNumber}">Un número</li>
                <li :class="{'text-success': hasSpecial}">Un símbolo (@$!%*?&)</li>
              </ul>
            </div>
          </div>

          <!-- Rol -->
          <div class="mb-3">
            <select v-model="user.rol" class="form-control input-group" required>
              <option disabled value="">Registrarse como:</option>
              <option value="ESTUDIANTE">Estudiante</option>
              <option value="PROFESOR">Profesor</option>
              <option value="DIRECTOR">Director</option>
              <option value="PADRE">Padre/Madre</option>
            </select>
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
            :disabled="!acceptedTerms || passwordStrength < 75"
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
            <li>Usa un correo válido y accesible.</li>
            <li>Contraseña segura (mín. 12 caracteres).</li>
            <li>Incluye mayúsculas, minúsculas, números y símbolos.</li>
            <li>No reutilices contraseñas de otras cuentas.</li>
            <li>Confirma tu contraseña correctamente.</li>
            <li>Tu cuenta será verificada antes de la activación.</li>
          </ul>
          
          <div class="security-features mt-3 pt-3 border-top">
            <h6><i class="fas fa-shield-alt me-2 text-info"></i> Características de Seguridad</h6>
            <ul class="ps-3 small">
              <li>Autenticación segura con JWT</li>
              <li>Contraseñas encriptadas</li>
              <li>Protección contra ataques</li>
              <li>Sesión automática de 15 minutos</li>
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

export default {
  name: "RegistroForm",
  data() {
    return {
      user: {
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: "",
        password: "",
        rol: "",
        minPasswordLength: 12
      },
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
    };
  },
  computed: {
    passwordStrengthColor() {
      if (this.passwordStrength < 40) return "#dc3545";
      if (this.passwordStrength < 75) return "#ffc107";
      return "#28a745";
    },
    passwordStrengthLabel() {
      if (!this.user.password) return "";
      if (this.passwordStrength < 40) return "Débil";
      if (this.passwordStrength < 75) return "Media";
      return "Fuerte";
    },
    passwordStrengthClass() {
      if (this.passwordStrength < 40) return "text-danger";
      if (this.passwordStrength < 75) return "text-warning";
      return "text-success";
    },
    hasMinLength() {
      return this.user.password.length >= 12;
    },
    hasUppercase() {
      return /[A-Z]/.test(this.user.password);
    },
    hasLowercase() {
      return /[a-z]/.test(this.user.password);
    },
    hasNumber() {
      return /[0-9]/.test(this.user.password);
    },
    hasSpecial() {
      return /[@$!%*?&]/.test(this.user.password);
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirm() {
      this.showConfirm = !this.showConfirm;
    },
    checkPasswordStrength() {
      const pwd = this.user.password;
      let strength = 0;
      if (this.hasMinLength) strength += 25;
      if (this.hasUppercase) strength += 25;
      if (this.hasLowercase) strength += 20;
      if (this.hasNumber) strength += 15;
      if (this.hasSpecial) strength += 15;
      this.passwordStrength = Math.min(strength, 100);
    },
    async submitRegister() {
      if (this.user.password !== this.confirmPassword) {
        showError('Error', 'Las contraseñas no coinciden.');
        return;
      }

      if (this.passwordStrength < 75) {
        showError('Error', 'La contraseña no es lo suficientemente fuerte.');
        return;
      }

      if (!this.acceptedTerms) {
        showError('Error', 'Debe aceptar los términos y condiciones.');
        return;
      }

      this.loading = true;

      try {
        const response = await fetch("http://localhost:8084/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.user),
        });

        const data = await response.json();

        if (!response.ok) {
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
};
</script>

<style scoped>
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

/* Consejos */
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

/* Fuerza de contraseña */
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

@media (max-width: 526px) {
  .register-glass {
    padding: 30px 20px;
    max-width: 90%;
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