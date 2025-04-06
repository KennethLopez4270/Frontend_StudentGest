<template>
  <div class="container animate__animated animate__fadeIn">
    <div class="register-box card shadow-lg">
      <h1 class="text-center mb-3 animate__animated animate__fadeInDown">Crear cuenta</h1>
  
      <form @submit.prevent="submitRegister" class="p-3">
        <!-- Nombre -->
        <div class="mb-3">
          <input v-model="user.nombre" type="text" class="form-control" placeholder="Nombre" required />
        </div>

        <!-- Apellido paterno -->
        <div class="mb-3">
          <input v-model="user.apellido_paterno" type="text" class="form-control" placeholder="Apellido paterno" required />
        </div>

        <!-- Apellido materno -->
        <div class="mb-3">
          <input v-model="user.apellido_materno" type="text" class="form-control" placeholder="Apellido materno" required />
        </div>
  
        <!-- Email -->
        <div class="mb-3">
          <input v-model="user.email" type="email" class="form-control" placeholder="Correo electrónico" required />
        </div>
  
        <!-- Contraseña -->
        <div class="mb-3">
          <input v-model="user.password" type="password" class="form-control" placeholder="Contraseña" required />
        </div>
  
        <!-- Foto (opcional) -->
        <div class="mb-3">
          <input v-model="user.foto" type="url" class="form-control" placeholder="URL de foto (opcional)" />
        </div>
  
        <!-- Rol (select) -->
        <div class="mb-3">
          <select v-model="user.rol" class="form-control" required>
            <option disabled value="">Selecciona un rol</option>
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="PROFESOR">Profesor</option>
          </select>
        </div>
  
        <!-- Botón -->
        <button type="submit" class="btn btn-success w-100">
          <i class="fas fa-user-plus me-2"></i> Registrarse
        </button>
      </form>
  
      <div v-if="statusMessage" :class="['alert', statusType === 'success' ? 'alert-success' : 'alert-danger']" class="mt-3 text-center">
        {{ statusMessage }}
      </div>
  
      <p class="text-center mt-3">
        ¿Ya tienes una cuenta? <router-link to="/login" class="text-primary fw-bold">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegistroView",
  data() {
    return {
      user: {
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: "",
        password: "",
        rol: "",
        foto: "",
      },
      statusMessage: "",
      statusType: "",
    };
  },
  methods: {
    async submitRegister() {
      try {
        const response = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.user),
        });

        const data = await response.json();

        if (!response.ok) {
          this.statusType = "error";
          this.statusMessage = data.message || "Error al registrar el usuario";
          throw new Error(this.statusMessage);
        }

        this.statusType = "success";
        this.statusMessage = "Usuario registrado con éxito";

        // Opcional: redirigir al login después de registrar
        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);
      } catch (error) {
        console.error("Error en el registro:", error.message);
      }
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

.register-box {
width: 400px;
padding: 30px;
border-radius: 10px;
background: white;
}
</style>
  