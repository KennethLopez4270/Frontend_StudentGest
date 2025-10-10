<template>
    <div v-if="showTimeoutWarning" class="timeout-warning-overlay">
      <div class="timeout-warning-modal">
        <div class="warning-icon">⏰</div>
        <h3>Sesión por expirar</h3>
        <p>Su sesión expirará en {{ countdown }} segundos debido a inactividad.</p>
        <div class="warning-actions">
          <button @click="continueSession" class="btn-continue">Continuar sesión</button>
          <button @click="logoutNow" class="btn-logout">Cerrar sesión</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'SessionTimeout',
    setup() {
      const showTimeoutWarning = ref(false)
      const countdown = ref(300) // 5 minutos en segundos
      const countdownInterval = ref(null)
      const router = useRouter()
  
      const showWarning = () => {
        showTimeoutWarning.value = true
        countdown.value = 300
        
        countdownInterval.value = setInterval(() => {
          countdown.value--
          if (countdown.value <= 0) {
            logoutDueToInactivity()
          }
        }, 1000)
      }
  
      const continueSession = () => {
        showTimeoutWarning.value = false
        clearInterval(countdownInterval.value)
        
        // Emitir evento para resetear timer
        window.dispatchEvent(new CustomEvent('resetInactivityTimer'))
      }
  
      const logoutNow = () => {
        logoutDueToInactivity()
      }
  
      const logoutDueToInactivity = () => {
        clearInterval(countdownInterval.value)
        
        // Limpiar datos de sesión
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        localStorage.removeItem('lastActivity')
        
        // Redirigir al login
        router.push('/login?reason=inactivity')
      }
  
      onMounted(() => {
        // Escuchar evento para mostrar advertencia
        window.addEventListener('showInactivityWarning', showWarning)
      })
  
      onUnmounted(() => {
        window.removeEventListener('showInactivityWarning', showWarning)
        clearInterval(countdownInterval.value)
      })
  
      return {
        showTimeoutWarning,
        countdown,
        continueSession,
        logoutNow
      }
    }
  }
  </script>
  
  <style scoped>
  .timeout-warning-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .timeout-warning-modal {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .warning-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .warning-actions {
    margin-top: 1.5rem;
  }
  
  .btn-continue {
    background: #213547;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    margin: 0 5px;
    cursor: pointer;
  }
  
  .btn-logout {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    margin: 0 5px;
    cursor: pointer;
  }
  
  .btn-continue:hover {
    background: #172b3a;
  }
  
  .btn-logout:hover {
    background: #c82333;
  }
  </style>