<template>
  <div class="login-glass card shadow-lg animate__animated animate__fadeIn">
    <h1 class="text-center mb-3 animate__bounceInDown">BIENVENIDO A STUDENT-GEST</h1>

    <form @submit.prevent="submitLogin" class="p-3">
      <!-- Email -->
      <div class="input-group mb-3" :class="{ 'animate__shakeX': shake }">
        <span class="input-icon"><i class="fas fa-envelope"></i></span>
        <input
          type="email"
          v-model="email"
          placeholder="Correo electrónico"
          class="form-control"
          required
          @focus="resetShake"
        />
      </div>

      <!-- Contraseña -->
      <div class="input-group mb-3" :class="{ 'animate__shakeX': shake }">
        <span class="input-icon"><i class="fas fa-lock"></i></span>
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Contraseña"
          class="form-control"
          required
          @focus="resetShake"
        />
        <span class="toggle-password" @click="togglePassword">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>

      <!-- Botón -->
      <button type="submit" class="btn btn-primary w-100">
        <i class="fas fa-sign-in-alt me-2"></i> Iniciar sesión
      </button>
    </form>

    <!-- Enlaces -->
    <p class="text-center mt-3">
      ¿No tienes una cuenta?
      <router-link to="/registro" class="text-primary fw-bold">Regístrate</router-link>
    </p>
    <p class="text-center">
      <router-link to="/recuperar-contrasena" class="text-primary fw-bold">Olvidé mi contraseña</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccess, showError } from '@/utils/useAlert'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const shake = ref(false)
const router = useRouter()

function togglePassword() {
  showPassword.value = !showPassword.value
}

function resetShake() {
  shake.value = false
}

async function submitLogin() {
  if (!email.value || !password.value) {
    shake.value = true
    setTimeout(() => (shake.value = false), 500)
    return
  }

  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    const data = await response.json()

    if (!response.ok || data.message) {
      showError('Error de inicio de sesión', data.message || 'Correo o contraseña incorrectos')
      throw new Error(data.message || 'Credenciales inválidas')
    }

    showSuccess('¡Bienvenido!', `Has iniciado sesión como ${data.rol.toLowerCase()}`)

    localStorage.setItem("user", JSON.stringify(data))

    const routeByRole = {
      PROFESOR: "/teacher-dashboard", 
      DIRECTOR: "/admin-dashboard", 
      PADRE: "/parent-dashboard", 
      ESTUDIANTE: "/student-dashboard", 
      PERSONAL: "/personal-dashboard", 
      
    }

    router.push(routeByRole[data.rol] || "/inicio")
  } catch (error) {
    console.error("Error en el login:", error.message)
  }
}
</script>

<style scoped>
.input-group {
  position: relative;
}

.input-group input {
  padding-left: 40px;
  padding-right: 45px;
  background-color: #ffffff9c;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primary);
  font-size: 16px;
  z-index: 10;
}

h1 {
  font-family: var(--font-title);
  font-weight: bold;
  color: var(--color-primary);
  text-align: center;
  font-size: 32px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: gray;
  z-index: 10;
}

.toggle-password:hover {
  color: var(--color-primary);
}

.btn-primary {
  background-color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
}

.btn-primary:hover {
  background-color: var(--hover-primary) !important;
  border-color: var(--hover-primary) !important;
}

.text-primary {
  color: #213547 !important;
}

.text-primary:hover {
  color: var(--hover-primary) !important;
}

.login-glass {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  color: #000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

@media (max-width: 526px) {
  .login-glass {
    padding: 30px 20px;
    max-width: 85%;
  }

  h1 {
    font-size: 24px;
  }

  .btn {
    font-size: 16px;
  }
}
</style>
