<template>
  <div class="container animate__animated animate__fadeIn">
    <div class="login-box card shadow-lg">
      <h1 class="text-center mb-2 animate__animated animate__bounceInDown">
        Bienvenido
      </h1>

      <form @submit.prevent="submitLogin" class="p-3">
        <!-- Campo de correo -->
        <div class="input-group mb-4 animate__animated animate__fadeInUp" :class="{ 'animate__shakeX': shake }">
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

        <!-- Campo de contraseña -->
        <div class="input-group mb-4 animate__animated animate__fadeInUp" :class="{ 'animate__shakeX': shake }">
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

        <!-- Botón de inicio de sesión -->
        <button type="submit" class="login-button btn btn-primary w-100 ">
          <i class="fas fa-sign-in-alt me-2"></i> Iniciar sesión
        </button>
      </form>

      <!-- Enlaces de registro y recuperación -->
      <p class="text-center mt-3">
        ¿No tienes una cuenta? <router-link to="/registro" class="text-primary fw-bold">Regístrate</router-link>
      </p>
      <p class="text-center mt-2">
        <router-link to="/recuperar-contraseña" class="text-primary fw-bold">Olvidé mi contraseña</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      shake: false,
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

      fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email, password: this.password }),
      })
        .then(async (response) => {
          const data = await response.json();

          if (!response.ok || data.status === "ERROR") {
            throw new Error(data.mensaje || "Usuario o contraseña incorrectos");
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.usuario));

          // Redirección única a la página principal
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error en el login:", error);
          alert(error.message);
        });
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f4f4f4;
}

.login-box {
  width: 400px;
  padding: 30px;
  border-radius: 10px;
  background: white;
}

.input-group {
  position: relative;
  width: 100%;
}

.input-group input {
  padding-left: 40px;
  padding-right: 45px; /* Espacio para el icono del ojo */
}

.input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
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
  color: black;
}

.login-button {
  background: #007bff;
  border: none;
  padding: 10px;
  font-size: 16px;
}

.login-button:hover {
  background: #0056b3;
}
</style>
