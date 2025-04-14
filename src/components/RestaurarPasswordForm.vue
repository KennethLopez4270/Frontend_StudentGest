<template>
    <div class="background-container">
      <div class="register-glass card shadow-lg animate__animated animate__fadeIn">
        <h1 class="text-center mb-4 animate__animated animate__fadeInDown">RESTABLECER CONTRASEÑA</h1>
  
        <form @submit.prevent="submitForm" class="password-form">
          <!-- Email (no editable) -->
          <div class="mb-3 input-group">
            <input 
              type="email" 
              :value="userData.email" 
              class="form-control" 
              readonly 
              disabled
            />
          </div>
  
          <!-- Nueva contraseña -->
          <div class="mb-3 position-relative input-group">
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
          </div>
  
          <!-- Confirmar contraseña -->
          <div class="mb-4 position-relative input-group">
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Confirmar contraseña"
              required
              @keyup.enter="submitForm"
            />
            <span class="toggle-password" @click="togglePassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
  
          <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
            <template v-if="!isSubmitting">
              <i class="fas fa-save me-2"></i> Guardar nueva contraseña
            </template>
            <template v-else>
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Guardando...
            </template>
          </button>
  
          <p class="text-center mt-3">
            <router-link to="/login" class="text-primary fw-bold">
              <i class="fas fa-arrow-left me-2"></i>Volver al inicio de sesión
            </router-link>
          </p>
  
          <div v-if="statusMessage" :class="['alert mt-3 text-center', statusType === 'success' ? 'alert-success' : 'alert-danger']">
            {{ statusMessage }}
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        userData: {
          email: '',
        },
        newPassword: '',
        confirmPassword: '',
        showPassword: false,
        isSubmitting: false,
        passwordStrength: 0,
        statusMessage: '',
        statusType: ''
      }
    },
    computed: {
      passwordStrengthColor() {
        if (this.passwordStrength < 40) return "#dc3545";
        if (this.passwordStrength < 75) return "#ffc107";
        return "#28a745";
      },
      passwordStrengthLabel() {
        if (!this.newPassword) return "";
        if (this.passwordStrength < 40) return "Contraseña débil";
        if (this.passwordStrength < 75) return "Contraseña media";
        return "Contraseña fuerte";
      },
      passwordStrengthClass() {
        if (this.passwordStrength < 40) return "text-danger";
        if (this.passwordStrength < 75) return "text-warning";
        return "text-success";
      },
    },
    async created() {
      await this.fetchUserData();
    },
    methods: {
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
      checkPasswordStrength() {
        const pwd = this.newPassword;
        let strength = 0;
        if (pwd.length >= 8) strength += 25;
        if (/[A-Z]/.test(pwd)) strength += 25;
        if (/[a-z]/.test(pwd)) strength += 20;
        if (/[0-9]/.test(pwd)) strength += 15;
        if (/[\W_]/.test(pwd)) strength += 15;
        this.passwordStrength = Math.min(strength, 100);
      },
      async fetchUserData() {
        try {
          const response = await fetch(`http://localhost:8080/api/users/${this.id}`);
          if (!response.ok) throw new Error('Error al obtener usuario');
          
          this.userData = await response.json();
        } catch (error) {
          console.error('Error:', error);
          this.statusType = 'error';
          this.statusMessage = 'No se pudo cargar la información del usuario';
        }
      },
      async submitForm() {
        if (this.newPassword !== this.confirmPassword) {
          this.statusType = 'error';
          this.statusMessage = 'Las contraseñas no coinciden';
          return;
        }
        
        if (this.newPassword.length < 8) {
          this.statusType = 'error';
          this.statusMessage = 'La contraseña debe tener al menos 8 caracteres';
          return;
        }
        
        this.isSubmitting = true;
        
        try {
          const updatedUser = { ...this.userData };
          updatedUser.password = this.newPassword;
  
          const response = await fetch(`http://localhost:8080/api/users/${this.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
          });
          
          if (!response.ok) throw new Error('Error al actualizar');
          
          this.statusType = 'success';
          this.statusMessage = 'Contraseña actualizada correctamente';
          
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
          
        } catch (error) {
          console.error('Error:', error);
          this.statusType = 'error';
          this.statusMessage = 'Error al actualizar la contraseña';
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    watch: {
      newPassword() {
        this.checkPasswordStrength();
      }
    }
  }
  </script>
  
  <style scoped>
  .background-container {
    background-image: url('https://i.pinimg.com/736x/77/ed/d4/77edd4126a0d719976473933f4042f38.jpg'); /* Asegúrate de tener esta imagen */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .register-glass {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 20px;
    padding: 30px;
    width: 100%;
    max-width: 500px; /* Más delgado que el original */
    color: #000;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    background-color: rgb(255, 255, 255);
  }
  
  .password-form {
    width: 100%;
  }
  
  h1 {
    font-family: 'Georgia', serif;
    font-weight: bold;
    color: #213547;
    font-size: 24px; /* Tamaño más pequeño */
    margin-bottom: 20px;
  }
  
  .input-group {
    background-color: #ffffff9c;
    border-radius: 8px;
    margin-bottom: 15px; /* Espaciado reducido */
  }
  
  .input-group input {
    background-color: transparent;
    border: none;
    padding: 12px 15px;
  }
  
  .toggle-password {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: gray;
    z-index: 10;
  }
  
  .password-strength-container {
    margin-top: -10px;
    margin-bottom: 15px;
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
  
  .btn-primary {
    background-color: #213547 !important;
    border: none !important;
    padding: 10px;
    font-weight: 500;
  }
  
  .text-primary {
    color: #213547 !important;
  }
  
  .alert {
    padding: 10px;
    border-radius: 8px;
    font-size: 14px;
  }
  
  @media (max-width: 576px) {
    .register-glass {
      padding: 25px 20px;
      max-width: 95%;
    }
    
    h1 {
      font-size: 20px;
    }
  }
  </style>