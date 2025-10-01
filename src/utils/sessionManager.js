let inactivityTimer
const SESSION_TIMEOUT = 15 * 60 * 1000 // 15 minutos

export const initializeSessionTimeout = () => {
  resetInactivityTimer()
  
  // Eventos que resetearán el timer
  const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart']
  
  events.forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true)
  })
}

export const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer)
  localStorage.setItem('lastActivity', Date.now().toString())
  
  inactivityTimer = setTimeout(() => {
    logoutDueToInactivity()
  }, SESSION_TIMEOUT)
}

const logoutDueToInactivity = () => {
  // Guardar la ruta actual para posible redirección después del login
  const currentRoute = window.location.pathname
  localStorage.setItem('redirectAfterLogin', currentRoute)
  
  // Limpiar datos de sesión
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  localStorage.removeItem('lastActivity')
  
  // Mostrar mensaje y redirigir
  alert('Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.')
  window.location.href = '/login'
}

export const checkSession = () => {
  const lastActivity = localStorage.getItem('lastActivity')
  const authToken = localStorage.getItem('authToken')
  
  if (!authToken) return false
  
  if (lastActivity) {
    const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      logoutDueToInactivity()
      return false
    }
  }
  
  resetInactivityTimer()
  return true
}

// Verificar sesión al cargar la aplicación
export const validateSessionOnLoad = () => {
  return checkSession()
}