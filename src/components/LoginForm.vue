<template>
  <div class="login-glass card shadow-lg animate__animated animate__fadeIn">
    <h1 class="text-center mb-3 animate__bounceInDown">BIENVENIDO A STUDENT-GEST</h1>

    <form @submit.prevent="submitLogin" class="p-3">
      <!-- Institución -->
      <div class="input-group mb-3">
        <span class="input-icon"><i class="fas fa-school"></i></span>
        <select 
          v-model="institution" 
          class="form-control" 
          required
          style="padding-left: 40px; appearance: none;"
        >
          <option value="" disabled selected>Seleccione institución</option>
          <option v-if="savedInstitution" :value="savedInstitution.nombre" selected>{{ savedInstitution.nombre }}</option>
          <option v-for="(inst, index) in institutions" :key="index" :value="inst">
            {{ inst }}
          </option>
        </select>
      </div>

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
          maxlength="100"
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
          maxlength="100"
        />
        <span class="toggle-password" @click="togglePassword">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>

      <!-- Recordar sesión (opcional) -->
      <div class="mb-3 form-check">
        <input 
          type="checkbox" 
          class="form-check-input" 
          id="rememberMe" 
          v-model="rememberMe"
        >
        <label class="form-check-label small" for="rememberMe">
          Recordar esta sesión
        </label>
      </div>

      <!-- Botón -->
      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        <i class="fas fa-sign-in-alt me-2"></i> 
        {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
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

    <!-- Información de seguridad -->
    <div class="security-info mt-3 p-3 bg-light rounded">
      <small class="text-muted">
        <i class="fas fa-info-circle me-1"></i>
        Por seguridad, tu sesión se cerrará automáticamente después de 15 minutos de inactividad.
      </small>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccess, showError } from '@/utils/useAlert'
import { sessionTimeoutManager } from '@/utils/sessionTimeout' 

const email = ref('')
const password = ref('')
const institution = ref('')
const showPassword = ref(false)
const shake = ref(false)
const savedInstitution = ref(null)
const rememberMe = ref(false)
const loading = ref(false)
const institutions = ref(['Colegio 1', 'Colegio 2', 'Colegio 3'])
const router = useRouter()

// Cargar institución guardada al montar el componente
onMounted(() => {
  const savedData = localStorage.getItem('currentInstitution')
  if (savedData) {
    savedInstitution.value = JSON.parse(savedData)
    institution.value = savedInstitution.value.nombre
  }

  // ✅ SOLUCIÓN: Solo inicializar, NO destruir
  initializeSessionTimeout()
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

function resetShake() {
  shake.value = false
}

function initializeSessionTimeout() {
  console.log('✅ Sistema de timeout de sesión inicializado en Login')
}

async function submitLogin() {
  if (!email.value || !password.value || !institution.value) {
    shake.value = true
    setTimeout(() => (shake.value = false), 500)
    showError('Error', 'Por favor complete todos los campos.')
    return
  }

  loading.value = true

  try {
    const response = await fetch("http://localhost:8084/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: email.value, 
        password: password.value,
        institution: institution.value 
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      let errorMessage = data.message || 'Correo o contraseña incorrectos'
      
      if (data.message && data.message.includes('bloqueada')) {
        errorMessage = 'Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador.'
      } else if (data.message && data.message.includes('no activa')) {
        errorMessage = 'Cuenta pendiente de aprobación. Contacte al administrador.'
      }
      
      showError('Error de inicio de sesión', errorMessage)
      throw new Error(errorMessage)
    }

    showSuccess('¡Bienvenido!', `Has iniciado sesión como ${data.rol.toLowerCase()}`)

    // ✅ GUARDAR TOKEN Y DATOS CORRECTAMENTE
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("user", JSON.stringify(data))
    localStorage.setItem("institution", institution.value)
    localStorage.setItem("lastActivity", Date.now().toString())
    
    // ✅ CONFIGURAR INTERCEPTOR DE FETCH PRIMERO
    setupAuthHeader(data.token)
    
    // ✅ INICIAR EL MONITOR DE INACTIVIDAD DESPUÉS DE GUARDAR EL TOKEN
    console.log('🎯 Iniciando session timeout manager después del login')
    if (typeof sessionTimeoutManager !== 'undefined' && sessionTimeoutManager.resetTimer) {
      sessionTimeoutManager.resetTimer()
    } else {
      console.warn('❌ SessionTimeoutManager no disponible')
    }

    // ✅ VERIFICAR INMEDIATAMENTE CON EL BACKEND
    await verifyTokenWithBackend(data.token)

    // Si requiere cambio de contraseña, redirigir a esa página
    if (data.requiresPasswordChange) {
      router.push("/cambio-contrasena-forzado")
      return
    }

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
    // ❌ LIMPIAR DATOS EN CASO DE ERROR
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    localStorage.removeItem("lastActivity")
  } finally {
    loading.value = false
  }
}

// ✅ NUEVA FUNCIÓN: Verificar token con backend inmediatamente
async function verifyTokenWithBackend(token) {
  try {
    console.log('🔐 Verificando token con backend...');
    
    const response = await fetch('http://localhost:8084/api/users/verify-session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('🔍 Respuesta de verify-session:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (response.ok) {
      const sessionData = await response.json();
      console.log('✅ Sesión verificada:', sessionData);
      
      // ✅ ACTUALIZAR EL TOKEN SI VIENE UNO NUEVO
      const newToken = response.headers.get('X-New-Token');
      if (newToken) {
        console.log('🔄 Token actualizado recibido');
        localStorage.setItem('authToken', newToken);
      }
      
      return true;
    } else {
      console.warn('⚠️ Error en verificación de sesión:', response.status);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error verificando sesión:', error);
    return false;
  }
}

function setupAuthHeader(token) {
  console.log('🔧 Configurando interceptor de fetch con token')
  
  // Guardar el token original para referencia
  const originalToken = token
  
  // Interceptar futuras requests para agregar el token
  const originalFetch = window.fetch
  window.fetch = function(...args) {
    const [url, options = {}] = args
    
    // Solo agregar header a requests a nuestro backend
    if (typeof url === 'string' && url.startsWith('http://localhost:8084')) {
      const currentToken = localStorage.getItem('authToken') || originalToken
      
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${currentToken}`
      }
      
      console.log(`🌐 Request a: ${url}`, {
        hasToken: !!currentToken,
        tokenLength: currentToken ? currentToken.length : 0
      })
    }
    
    return originalFetch(url, options)
  }
}
</script>

<style scoped>
.input-group {
  position: relative;
}

.input-group input, .input-group select {
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
.btn-primary:disabled {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}

.btn-primary:hover:not(:disabled) {
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

.security-info {
  background-color: rgba(255, 255, 255, 0.7) !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
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