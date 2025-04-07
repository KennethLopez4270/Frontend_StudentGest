<template>
  <div class="register-glass card shadow-lg animate__animated animate__fadeIn">
    <h1 class="text-center mb-4 animate__animated animate__fadeInDown">REGISTRO PARA STUDENT-GEST</h1>

    <div class="row">
      <!-- Columna izquierda -->
      <div class="col-md-7">
        <form @submit.prevent="submitRegister">
          <!-- Nombre -->
          <div class="mb-3">
            <input v-model="user.nombre" type="text" class="form-control" placeholder="Nombre(s)" required />
          </div>

          <!-- Apellidos -->
          <div class="mb-3 row">
            <div class="col">
              <input v-model="user.apellido_paterno" type="text" class="form-control" placeholder="Apellido Paterno" required />
            </div>
            <div class="col">
              <input v-model="user.apellido_materno" type="text" class="form-control" placeholder="Apellido Materno" required />
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <input v-model="user.email" type="email" class="form-control" placeholder="Correo electrónico" required />
          </div>

          <!-- Contraseñas -->
          <div class="mb-3 row">
            <div class="col position-relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="user.password"
                class="form-control"
                placeholder="Contraseña"
                @input="checkPasswordStrength"
                required
              />
              <span class="toggle-password" @click="togglePassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>
              <div class="password-strength mt-1">
                <div :style="{ width: passwordStrength + '%'}" class="strength-bar"></div>
              </div>
            </div>
            <div class="col position-relative">
              <input
                :type="showConfirm ? 'text' : 'password'"
                v-model="confirmPassword"
                class="form-control"
                placeholder="Confirmar contraseña"
                required
              />
              <span class="toggle-password" @click="toggleConfirm">
                <i :class="showConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>
            </div>
          </div>

          <!-- Subida de imagen -->
          <div
            class="mb-3 upload-area"
            @dragover.prevent
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <p class="text-muted mb-1" v-if="!previewImage">Selecciona o arrastra una imagen</p>
            <input type="file" ref="fileInput" class="d-none" @change="handleImageUpload" accept="image/*" />
            <div class="preview-img mt-2" v-if="previewImage">
              <img :src="previewImage" class="img-fluid rounded" alt="Previsualización" />
            </div>
            <div class="text-danger" v-if="imageError">{{ imageError }}</div>
          </div>

          <!-- Rol -->
          <div class="mb-3">
            <select v-model="user.rol" class="form-control" required>
              <option disabled value="">Selecciona un rol</option>
              <option value="ESTUDIANTE">Estudiante</option>
              <option value="PROFESOR">Profesor</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary w-100">
          <i class="fas fa-user-plus me-2"></i> Registrarse
        </button>
        <p class="text-center mt-3">
          ¿Ya tienes una cuenta? <router-link to="/login" class="text-primary fw-bold">Inicia Sesión</router-link>
        </p>

          <div v-if="statusMessage" :class="['alert mt-3 text-center', statusType === 'success' ? 'alert-success' : 'alert-danger']">
            {{ statusMessage }}
          </div>
        </form>
      </div>

      <!-- Columna derecha -->
      <div class="col-md-5 consejos-box">
        <h4><i class="fas fa-lightbulb me-2 text-warning"></i> Consejos</h4>
        <ul class="ps-3">
          <li>Usa un correo válido y accesible.</li>
          <li>Contraseña segura (mín. 8 caracteres).</li>
          <li>Incluye mayúsculas, minúsculas, números y símbolos.</li>
          <li>Confirma tu contraseña correctamente.</li>
          <li>La imagen es opcional (máx. 2MB, formatos JPG, PNG, etc.).</li>
          <li>Puedes subirla más adelante si lo prefieres.</li>
        </ul>

        
      </div>
    </div>
  </div>
</template>

<script>
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
        foto: null,
      },
      confirmPassword: "",
      previewImage: null,
      imageError: "",
      showPassword: false,
      showConfirm: false,
      passwordStrength: 0,
      statusMessage: "",
      statusType: "",
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirm() {
      this.showConfirm = !this.showConfirm;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.validateImage(file);
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      this.validateImage(file);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    validateImage(file) {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        this.imageError = "Formato no válido. Usa JPG, PNG, etc.";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.imageError = "La imagen no debe superar los 2MB.";
        return;
      }

      this.imageError = "";
      this.user.foto = file;
      this.previewImage = URL.createObjectURL(file);
    },
    checkPasswordStrength() {
      const pwd = this.user.password;
      let strength = 0;
      if (pwd.length >= 8) strength += 25;
      if (/[A-Z]/.test(pwd)) strength += 25;
      if (/[a-z]/.test(pwd)) strength += 20;
      if (/[0-9]/.test(pwd)) strength += 15;
      if (/[\W_]/.test(pwd)) strength += 15;
      this.passwordStrength = Math.min(strength, 100);
    },
    async submitRegister() {
      if (this.user.password !== this.confirmPassword) {
        this.statusType = "error";
        this.statusMessage = "Las contraseñas no coinciden.";
        return;
      }

      // Simulación sin envío real de imagen
      const formData = new FormData();
      for (const key in this.user) {
        formData.append(key, this.user[key]);
      }

      try {
        const response = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (!response.ok) {
          this.statusType = "error";
          this.statusMessage = data.message || "Error al registrar usuario";
          throw new Error(this.statusMessage);
        }

        this.statusType = "success";
        this.statusMessage = "Usuario registrado con éxito";
        setTimeout(() => this.$router.push("/login"), 1500);
      } catch (error) {
        console.error("Registro fallido:", error.message);
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
  /*background: rgba(255, 255, 255, 0.25);*/
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
  padding-left: 30px;
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

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
}

.upload-area:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.preview-img img {
  max-height: 120px;
  object-fit: contain;
}

/* Barra de fuerza de contraseña */
.password-strength {
  height: 5px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 5px;
}

.strength-bar {
  height: 100%;
  transition: width 0.3s ease;
  background-color: #28a745;
}

.btn-primary {
  background-color: #213547 !important;
  border-color: #213547 !important;
}

@media (max-width: 526px) {
  .register-glass {
    padding: 30px 20px;
    max-width: 90%;
  }
  .consejos-box {
    margin-top: 20px;
    padding-left: 0;
  }
  h1 {
    font-size: 24px;
  }
}
</style>
