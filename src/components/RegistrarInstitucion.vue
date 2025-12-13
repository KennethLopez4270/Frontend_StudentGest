<template>
  <div class="register-glass card shadow-lg animate__animated animate__fadeIn">
    <h1 class="text-center mb-4 animate__animated animate__fadeInDown">REGISTRO DE INSTITUCIÓN Y DIRECTOR</h1>

    <div class="row">
      <!-- Columna izquierda -->
      <div class="col-md-7">
        <form @submit.prevent="submitRegister">
          <!-- Datos de la Institución -->
          <h5 class="section-title mb-3"><i class="fas fa-school me-2"></i>Datos de la Institución</h5>
          
          <!-- Nombre de la Institución -->
          <div class="mb-3 input-group">
            <span class="input-icon"><i class="fas fa-school"></i></span>
            <input 
              v-model="institution.nombre" 
              type="text" 
              class="form-control" 
              placeholder="Nombre de la institución" 
              required 
            />
          </div>

          <!-- Tipo de Institución -->
          <div class="mb-3 input-group">
            <span class="input-icon"><i class="fas fa-tag"></i></span>
            <select v-model="institution.tipo" class="form-control" required>
              <option value="" disabled selected>Tipo de institución</option>
              <option value="COLEGIO">Colegio</option>
              <option value="UNIVERSIDAD">Universidad</option>
              <option value="INSTITUTO">Instituto</option>
              <option value="ACADEMIA">Academia</option>
            </select>
          </div>

          <!-- Dirección -->
          <div class="mb-3 input-group">
            <span class="input-icon"><i class="fas fa-map-marker-alt"></i></span>
            <input 
              v-model="institution.direccion" 
              type="text" 
              class="form-control" 
              placeholder="Dirección completa" 
              required 
            />
          </div>

          <!-- Teléfono -->
          <div class="mb-3 input-group">
            <span class="input-icon"><i class="fas fa-phone"></i></span>
            <input 
              v-model="institution.telefono" 
              type="tel" 
              class="form-control" 
              placeholder="Teléfono de contacto" 
              required 
            />
          </div>

          <!-- Email Institucional -->
          <div class="mb-3 input-group">
            <span class="input-icon"><i class="fas fa-envelope"></i></span>
            <input 
              v-model="institution.email" 
              type="email" 
              class="form-control" 
              placeholder="Correo electrónico institucional" 
              required 
            />
          </div>

          <!-- Datos del Director -->
          <h5 class="section-title mb-3 mt-4"><i class="fas fa-user-tie me-2"></i>Datos del Director</h5>
          
          <!-- Nombre del Director -->
          <div class="mb-3 input-group">
            <span class="input-icon"><i class="fas fa-user"></i></span>
            <input 
              v-model="director.nombre" 
              type="text" 
              class="form-control" 
              placeholder="Nombre(s) del director" 
              required 
            />
          </div>

          <!-- Apellidos del Director -->
          <div class="mb-3 row">
            <div class="col input-group">
              <input 
                v-model="director.apellido_paterno" 
                type="text" 
                class="form-control" 
                placeholder="Apellido paterno" 
                required 
              />
            </div>
            <div class="col input-group">
              <input 
                v-model="director.apellido_materno" 
                type="text" 
                class="form-control" 
                placeholder="Apellido materno" 
                required 
              />
            </div>
          </div>

          <!-- Email del Director -->
          <div class="mb-3 input-group">
            <span class="input-icon"><i class="fas fa-envelope"></i></span>
            <input 
              v-model="director.email" 
              type="email" 
              class="form-control" 
              placeholder="Correo electrónico del director" 
              required 
            />
          </div>

          <!-- Contraseña -->
          <div class="mb-3 input-group">
            <span class="input-icon"><i class="fas fa-lock"></i></span>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="director.password"
              class="form-control"
              placeholder="Contraseña"
              required
            />
            <span class="toggle-password" @click="togglePassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>

          <!-- Confirmar Contraseña -->
          <div class="mb-3 input-group">
            <span class="input-icon"><i class="fas fa-lock"></i></span>
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              class="form-control"
              placeholder="Confirmar contraseña"
              required
            />
            <span class="toggle-password" @click="toggleConfirmPassword">
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
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

          <!-- Términos y condiciones -->
          <div class="mb-3 form-check">
            <input 
              type="checkbox" 
              class="form-check-input" 
              id="termsCheck" 
              v-model="institution.aceptaTerminos" 
              required 
            />
            <label class="form-check-label" for="termsCheck">
              Acepto los <a href="#" @click.prevent="showTerms">términos y condiciones</a>
            </label>
          </div>

          <button type="submit" class="btn btn-primary w-100">
            <i class="fas fa-user-plus me-2"></i> Registrar Institución y Director
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
          <h4><i class="fas fa-lightbulb me-2 text-warning"></i> Consejos</h4>
          <ul class="ps-3">
            <li>Usa un correo válido y accesible.</li>
            <li>Contraseña segura (mín. 8 caracteres).</li>
            <li>La imagen es opcional (máx. 2MB, formatos JPG, PNG, etc.).</li>
            <li>Puedes subirla más adelante si lo prefieres.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InstitutionRegister",
  data() {
    return {
      institution: {
        nombre: "",
        tipo: "",
        direccion: "",
        telefono: "",
        email: "",
        aceptaTerminos: false
      },
      director: {
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: "",
        password: "",
        foto: null,
        rol: "DIRECTOR",
        estado: "APROBADO",
        activo: true
      },
      confirmPassword: "",
      previewImage: null,
      imageError: "",
      showPassword: false,
      showConfirmPassword: false,
      statusMessage: "",
      statusType: "",
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
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
      this.director.foto = file;
      this.previewImage = URL.createObjectURL(file);
    },
    async submitRegister() {
      if (this.director.password !== this.confirmPassword) {
        this.statusType = "error";
        this.statusMessage = "Las contraseñas no coinciden.";
        return;
      }

      if (!this.institution.aceptaTerminos) {
        this.statusType = "error";
        this.statusMessage = "Debes aceptar los términos y condiciones.";
        return;
      }

      try {
        // Guardar institución en localStorage
        localStorage.setItem('currentInstitution', JSON.stringify(this.institution));

        // Registrar director en el endpoint
        const directorToSend = { 
          ...this.director,
          foto: null // No enviamos la foto como archivo
        };

        const response = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(directorToSend),
        });

        const data = await response.json();

        if (!response.ok) {
          this.statusType = "error";
          this.statusMessage = data.message || "Error al registrar director";
          throw new Error(this.statusMessage);
        }

        this.statusType = "success";
        this.statusMessage = "Institución y director registrados con éxito";
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
}

.input-group {
  background-color: #ffffff9c;
  position: relative;
}

.input-group input, 
.input-group select {
  background-color: #ffffff9c;
  padding-left: 40px;
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

h1 {
  font-family: 'Georgia', serif;
  font-weight: bold;
  color: #213547;
  font-size: 30px;
}

.section-title {
  color: #213547;
  font-weight: 600;
  border-bottom: 2px solid #213547;
  padding-bottom: 5px;
}

.text-primary {
  color: #213547 !important;
}
.text-primary:hover {
  color: #172b3a !important;
}

/* Consejos */
.consejos-box {
  padding: 50px;
  background-color: #213547;
  color: white;
  border-radius: 20px;
}

ul {
  margin: 0;
  padding-left: 1rem;
}

.toggle-password {
  position: absolute;
  right: 20px;
  top: 50%;
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
  }
  h1 {
    font-size: 24px;
  }
}
</style>