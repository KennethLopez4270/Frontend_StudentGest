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
          @focus="shake = false"
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
          @focus="shake = false"
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

    <!-- Estado -->
    <div
      v-if="statusMessage"
      :class="['alert', statusType === 'success' ? 'alert-success' : 'alert-danger']"
      class="mt-3 text-center"
    >
      {{ statusMessage }}
    </div>

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

<script>
export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      shake: false,
      statusMessage: "",
      statusType: "",
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    submitLogin() {
      if (!this.email || !this.password) {
        this.shake = true;
        setTimeout(() => (this.shake = false), 500);
        return;
      }

      fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email, password: this.password }),
      })
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok || data.message) {
            this.statusType = "error";
            this.statusMessage = data.message || "Usuario o contraseña incorrectos";
            throw new Error(this.statusMessage);
          }

          this.statusType = "success";
          this.statusMessage = "Inicio de sesión exitoso";

          localStorage.setItem("user", JSON.stringify(data));

          // Redirección
          this.$router.push("/parent-dashboard");
        })
        .catch((error) => {
          console.error("Error en el login:", error.message);
        });
    },
  },
};
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
  color: #172b3a;
  font-size: 16px;
  z-index: 10; /* Asegura que los íconos estén por encima del input */
}

h1 {
  font-family: 'Georgia', serif;
  font-weight: bold;
  color: #213547;
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
  z-index: 10; /* Asegura que esté por encima del input */
}

.toggle-password:hover {
  color: #172b3a;
}

/* --- Botón de inicio de sesión --- */
.btn-primary {
  background-color: #213547 !important;
  border-color: #213547 !important;
}

.btn-primary:hover {
  background-color: #172b3a !important;
  border-color: #172b3a !important;
}

/* --- Estilos de los enlaces --- */
.text-primary {
  color: #213547 !important;
}

.text-primary:hover {
  color: #172b3a !important;
}

/* --- Estilo Glassmorphism --- */
.login-glass {
  /*background: rgba(255, 255, 255, 0.25);*/ /*quitar comentado para tener efecto de vidrio*/ 
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  color: #000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* --- RESPONSIVE --- */
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
