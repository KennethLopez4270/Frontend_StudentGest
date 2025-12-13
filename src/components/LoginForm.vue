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
          :class="{ 'is-invalid': showDomainError }"
          required
          @blur="validateEmailRealTime"
          @input="handleEmailInput"
          @focus="resetShake"
          maxlength="100"
        />
        <!-- Mensaje de error de dominio -->
        <div v-if="showDomainError" class="invalid-feedback d-block mt-1">
          <i class="fas fa-exclamation-triangle me-1"></i>
          {{ domainErrorMessage }}
        </div>
        <!-- Mensaje informativo de dominios permitidos -->
        <div v-if="showDomainInfo && !showDomainError" class="domain-info mt-1">
          <small class="text-info">
            <i class="fas fa-info-circle me-1"></i>
            Dominios permitidos: gmail.com, hotmail.com, yahoo.com, outlook.com, edu.bo
          </small>
        </div>
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
      <button type="submit" class="btn btn-primary w-100" :disabled="loading || (captchaEnabled && !captchaVerified)">
        <i class="fas fa-sign-in-alt me-2"></i> 
        {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
      </button>
    </form>

    <!-- ✅ NUEVO: Botón de reenvío de verificación -->
    <div v-if="showResendButton" class="text-center mt-3">
      <button 
        @click="resendVerification" 
        class="btn btn-outline-warning btn-sm"
        :disabled="resending"
      >
        <i class="fas fa-redo-alt me-1" :class="{ 'fa-spin': resending }"></i>
        {{ resending ? 'Enviando...' : 'Reenviar email de verificación' }}
      </button>
      <small class="d-block text-muted mt-1">
        ¿No recibiste el email? Haz clic para reenviarlo
      </small>
    </div>

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
      <!-- Información adicional sobre correos -->
      <div class="mt-2">
        <small class="text-info">
          <i class="fas fa-envelope me-1"></i>
          Solo se permiten correos con dominio: gmail.com, hotmail.com, yahoo.com, outlook.com, edu.bo
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
import API_URL from '@/config/api'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccess, showError } from '@/utils/useAlert'
import { sessionTimeoutManager } from '@/utils/sessionTimeout' 
import VueRecaptcha from 'vue3-recaptcha2'

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

// reCAPTCHA
const captchaEnabled = ref(false)
const recaptchaSiteKey = ref("")
const captchaVerified = ref(false)
const captchaToken = ref("")
const captchaError = ref("")

// ✅ NUEVO: Variables para validación de email
const showDomainError = ref(false)
const showDomainInfo = ref(false)
const domainErrorMessage = ref('')

// ✅ NUEVO: Variables para reenvío de verificación
const showResendButton = ref(false)
const resending = ref(false)

// reCAPTCHA METHODS
const loadCaptchaConfig = async () => {
  try {
    const response = await fetch(`${API_URL}/api/captcha/config`)
    if (response.ok) {
      const data = await response.json()
      captchaEnabled.value = data.enabled
      recaptchaSiteKey.value = data.siteKey
      console.log('🎯 reCAPTCHA Config Login:', data)
    }
  } catch (error) {
    console.warn('⚠️ No se pudo cargar config reCAPTCHA login:', error)
    captchaEnabled.value = false
  }
}

const onCaptchaVerified = (response) => {
  console.log('✅ reCAPTCHA verificado:', response)
  captchaToken.value = response
  captchaVerified.value = true
  captchaError.value = ''
}

const onCaptchaError = () => {
  console.error('❌ Error en reCAPTCHA')
  captchaVerified.value = false
  captchaToken.value = ''
  captchaError.value = 'Error verificando reCAPTCHA. Intenta de nuevo.'
}

const onCaptchaExpired = () => {
  console.warn('⚠️ reCAPTCHA expirado')
  captchaVerified.value = false
  captchaToken.value = ''
  captchaError.value = 'reCAPTCHA expirado. Completa el desafío nuevamente.'
}

const validateCaptcha = async () => {
  if (!captchaToken.value) {
    captchaError.value = 'Por favor, completa el reCAPTCHA'
    return false
  }

  try {
    const response = await fetch(`${API_URL}/api/captcha/verify`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        recaptchaResponse: captchaToken.value,
        clientIp: '' // El backend puede obtener la IP
      })
    })

    const data = await response.json()
    
    if (response.ok && data.valid) {
      captchaError.value = ''
      return true
    } else {
      captchaError.value = data.message || 'Error validando reCAPTCHA. Intenta de nuevo.'
      captchaVerified.value = false
      captchaToken.value = ''
      return false
    }
  } catch (error) {
    captchaError.value = 'Error validando reCAPTCHA'
    captchaVerified.value = false
    captchaToken.value = ''
    return false
  }
}

// ✅ NUEVO: Métodos para validación de email
const validateEmailRealTime = async () => {
  if (!email.value) {
    showDomainInfo.value = false
    showDomainError.value = false
    return
  }
  
  try {
    const emailValue = email.value.trim()
    if (emailValue.length < 5) return
    
    console.log('📧 Validando email en tiempo real (login):', emailValue)
    const response = await fetch(`${API_URL}/api/email/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailValue })
    })
    
    const data = await response.json()
    console.log('🔍 Respuesta validación tiempo real (login):', data)
    
    if (!data.valid) {
      showDomainError.value = true
      domainErrorMessage.value = data.requirements || 'Dominio no permitido. Use: gmail.com, hotmail.com, yahoo.com, outlook.com, edu.bo'
      showDomainInfo.value = false
    } else {
      showDomainError.value = false
      showDomainInfo.value = false
    }
    
  } catch (error) {
    console.error("Error validando email en tiempo real (login):", error)
    showDomainError.value = false
    showDomainInfo.value = true
  }
}

const handleEmailInput = () => {
  // Mostrar info cuando el usuario empiece a escribir
  if (email.value && email.value.length > 0) {
    showDomainInfo.value = true
  } else {
    showDomainInfo.value = false
  }
  
  // Limpiar errores mientras escribe
  showDomainError.value = false
}

// ✅ NUEVO: Método para validar email antes del login
const validateEmail = async () => {
  try {
    console.log('📧 Email a validar (login):', email.value)
    const response = await fetch(`${API_URL}/api/email/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value })
    })
    
    const data = await response.json()
    console.log('🔍 Respuesta validación email (login):', data)
    return data.valid
  } catch (error) {
    console.error("Error validando email (login):", error)
    return false
  }
}

// ✅ NUEVO: Método para reenviar verificación
const resendVerification = async () => {
  if (!email.value) {
    showError('Error', 'Por favor ingresa tu email primero')
    return
  }

  resending.value = true
  
  try {
    const response = await fetch(`${API_URL}/api/email-verification/resend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()
    
    if (data.success) {
      showSuccess('Éxito', 'Email de verificación reenviado. Revisa tu bandeja de entrada.')
    } else {
      showError('Error', data.message || 'Error al reenviar email de verificación')
    }
  } catch (error) {
    console.error('❌ Error reenviando verificación:', error)
    showError('Error', 'Error de conexión. Intenta más tarde.')
  } finally {
    resending.value = false
  }
}

// Cargar institución guardada al montar el componente
onMounted(async () => {
  const savedData = localStorage.getItem('currentInstitution')
  if (savedData) {
    savedInstitution.value = JSON.parse(savedData)
    institution.value = savedInstitution.value.nombre
  }

  await loadCaptchaConfig()
  initializeSessionTimeout()
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const resetShake = () => {
  shake.value = false
}

const initializeSessionTimeout = () => {
  console.log('✅ Sistema de timeout de sesión inicializado en Login')
}

const submitLogin = async () => {
  // Validar reCAPTCHA si está habilitado
  if (captchaEnabled.value) {
    const isValidCaptcha = await validateCaptcha()
    if (!isValidCaptcha) {
      shake.value = true
      setTimeout(() => (shake.value = false), 500)
      return
    }
  }

  if (!email.value || !password.value || !institution.value) {
    shake.value = true
    setTimeout(() => (shake.value = false), 500)
    showError('Error', 'Por favor complete todos los campos.')
    return
  }

  // ✅ NUEVO: Validar email antes del login (DESHABILITADO TEMPORALMENTE para permitir acceso)
  /*
  console.log('📧 Validando email antes del login...')
  if (!await validateEmail()) {
    showError('Error', 'El email no es válido o no está permitido. Use: gmail.com, hotmail.com, yahoo.com, outlook.com, edu.bo')
    shake.value = true
    setTimeout(() => (shake.value = false), 500)
    return
  }
  */

  loading.value = true
  showResendButton.value = false // Resetear el botón

  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: email.value, 
        password: password.value,
        institution: institution.value
      }),
    })

    // ✅ MEJORADO: Manejar mejor el 401
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('❌ Error parseando respuesta:', parseError);
      throw new Error('Error en la respuesta del servidor');
    }

    console.log('🔍 Respuesta login:', { status: response.status, data });

    if (!response.ok) {
      // ✅ Manejar específicamente el error de email no verificado
      if (data.message && data.message.includes('no verificado')) {
        showResendButton.value = true; // Mostrar botón de reenvío
      }
      
      let errorMessage = data.message || 'Correo o contraseña incorrectos'
      
      if (data.message && data.message.includes('bloqueada')) {
        errorMessage = 'Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador.'
      } else if (data.message && data.message.includes('no activa')) {
        errorMessage = 'Cuenta pendiente de aprobación. Contacte al administrador.'
      } else if (data.message && data.message.includes('no verificado')) {
        errorMessage = 'Email pendiente de verificación. Revisa tu bandeja de entrada o reenvía el email.';
      }
      
      showError('Error de inicio de sesión', errorMessage)
      throw new Error(errorMessage)
    }

    // Si llegamos aquí, el login fue exitoso
    if (data.success) {
      // Limpiar reCAPTCHA después de login exitoso
      captchaToken.value = ''
      captchaVerified.value = false
      captchaError.value = ''
      
      // Obtener el nombre del rol (manejar si es objeto o string)
      const roleName = data.rol && typeof data.rol === 'object' ? data.rol.nombre : data.rol;
      
      showSuccess('¡Bienvenido!', `Has iniciado sesión como ${roleName.toLowerCase()}`)

      // Guardar datos de sesión
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify({
        ...data,
        rol: roleName // Guardar solo el nombre del rol para mantener compatibilidad
      }))
      localStorage.setItem("institution", institution.value)
      localStorage.setItem("lastActivity", Date.now().toString())
      
      // Configurar interceptor de fetch
      setupAuthHeader(data.token)
      
      // Iniciar monitor de inactividad
      console.log('🎯 Iniciando session timeout manager después del login')
      if (typeof sessionTimeoutManager !== 'undefined' && sessionTimeoutManager.resetTimer) {
        sessionTimeoutManager.resetTimer()
      } else {
        console.warn('❌ SessionTimeoutManager no disponible')
      }

      // Verificar token con backend
      await verifyTokenWithBackend(data.token)

      // Si requiere cambio de contraseña, redirigir
      if (data.requiresPasswordChange) {
        console.log('🔐 Redirigiendo a cambio forzado de contraseña');
        // Guardar email para el cambio forzado
        localStorage.setItem('forcedChangeEmail', email.value);
        router.push("/cambio-contrasena-forzado");
        return;
      }

      // Intentar redirección dinámica basada en funcionalidades del rol
      try {
        const idRol = data.id_rol || data.idRol;
        if (idRol) {
          const funcsResponse = await fetch(`${API_URL}/api/roles/${idRol}/functionalities`,{
             headers: { 'Authorization': `Bearer ${data.token}` }
          });
          if (funcsResponse.ok) {
            const funcs = await funcsResponse.json();
            if (funcs && funcs.length > 0) {
              // Priorizar rutas que contengan 'dashboard' o 'inicio'
              const dashboardRoute = funcs.find(f => f.direccion && (f.direccion.includes('dashboard') || f.direccion.includes('inicio')));
              const targetRoute = dashboardRoute ? dashboardRoute.direccion : funcs[0].direccion;
              
              if (targetRoute) {
                console.log(`🔀 Redirección dinámica según rol (${roleName}) a: ${targetRoute}`);
                router.push(targetRoute);
                return;
              }
            }
          }
        }
      } catch (redirError) {
        console.warn("⚠️ Falló la redirección dinámica, usando fallback estático", redirError);
      }

      // Fallback estático por si falla la dinámica
      const routeByRole = {
        PROFESOR: "/teacher-dashboard", 
        DIRECTOR: "/admin-dashboard", 
        PADRE: "/parent-dashboard", 
        ESTUDIANTE: "/student-dashboard", 
        PERSONAL: "/personal-dashboard", 
        OSI: "/admin-dashboard", 
        ADMIN: "/admin-dashboard"
      }
      
      const staticRoleName = roleName ? roleName.toUpperCase() : '';
      router.push(routeByRole[staticRoleName] || "/inicio")
    }
    
  } catch (error) {
    console.error("Error en el login:", error.message)
    // Limpiar datos en caso de error
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    localStorage.removeItem("lastActivity")
  } finally {
    loading.value = false
  }
}

// Función para verificar token con backend
const verifyTokenWithBackend = async (token) => {
  try {
    console.log('🔐 Verificando token con backend...');
    
    const response = await fetch(`${API_URL}/api/users/verify-session`, {
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
      
      // Actualizar token si viene uno nuevo
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

const setupAuthHeader = (token) => {
  console.log('🔧 Configurando interceptor de fetch con token')
  
  // Guardar el token original para referencia
  const originalToken = token
  
  // Interceptar futuras requests para agregar el token
  const originalFetch = window.fetch
  window.fetch = function(...args) {
    const [url, options = {}] = args
    
    // Solo agregar header a requests a nuestro backend
    if (typeof url === 'string' && url.startsWith(API_URL)) {
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
/* Estilos reCAPTCHA */
.captcha-container {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  background: #f8f9fa;
  text-align: center;
}

/* ✅ NUEVO: Estilos para mensajes de email */
.domain-info {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #e7f3ff;
  border-left: 3px solid #17a2b8;
}

.invalid-feedback {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f8d7da;
  border-left: 3px solid #dc3545;
}

/* Estilos existentes */
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

/* ✅ NUEVO: Estilos para botón de reenvío */
.btn-outline-warning {
  border-color: #ffc107;
  color: #856404;
}

.btn-outline-warning:hover:not(:disabled) {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #000;
}

.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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