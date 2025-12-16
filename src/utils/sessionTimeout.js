class SessionTimeoutManager {
  constructor() {
    console.log('🔄 SessionTimeoutManager instancia creada');
    this.timeout = 15 * 60 * 1000; // 15 minutos
    this.warningTime = 5 * 60 * 1000; // 5 minutos
    this.timer = null;
    this.warningTimer = null;
    this.isWarningShown = false;
    this.isRunning = false;

    // Bind methods to this
    this.resetTimer = this.resetTimer.bind(this);
  }

  startMonitoring() {
    if (this.isRunning) return;

    const authToken = localStorage.getItem('authToken');
    console.log('🔐 Iniciando monitoreo de sesión:', {
      hasToken: !!authToken
    });

    if (!authToken) {
      console.log('👤 Usuario no autenticado, no se inicia el monitoreo');
      return;
    }

    this.isRunning = true;
    console.log('✅ Usuario autenticado, activando listeners y timers');
    this.setupEventListeners();
    this.resetTimer();
  }

  stopMonitoring() {
    console.log('🛑 Deteniendo monitoreo de sesión');
    this.isRunning = false;
    this.removeEventListeners();
    this.clearTimers();
  }

  setupEventListeners() {
    console.log('🎯 Configurando event listeners');
    // Reiniciar timer en cualquier interacción del usuario
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, this.resetTimer, true);
    });

    // También reiniciar en llamadas AJAX
    this.interceptFetch();
  }

  removeEventListeners() {
    console.log('🗑️ Eliminando event listeners');
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.removeEventListener(event, this.resetTimer, true);
    });
  }

  interceptFetch() {
    // Guardar referencia original si no existe ya
    if (!this.originalFetch) {
      this.originalFetch = window.fetch;
      window.fetch = (...args) => {
        // Solo reiniciar si está corriendo
        if (this.isRunning) {
          // console.log('🌐 Fetch interceptado, reiniciando timer'); // Comentado para reducir ruido
          this.resetTimer();
        }
        return this.originalFetch(...args);
      };
    }
  }

  clearTimers() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  resetTimer() {
    if (!this.isRunning) return;

    // console.log('⏰ Resetando timer de sesión'); // Comentado para reducir ruido

    this.clearTimers();
    this.isWarningShown = false;

    // Verificar que aún hay sesión
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.log('🚫 No hay token, deteniendo monitoreo');
      this.stopMonitoring();
      return;
    }

    // Timer para advertencia (10 minutos)
    this.warningTimer = setTimeout(() => {
      console.log('⚠️ Mostrando advertencia de sesión');
      this.showWarning();
    }, this.timeout - this.warningTime);

    // Timer para logout automático (15 minutos)
    this.timer = setTimeout(() => {
      console.log('🔒 Tiempo de sesión agotado, haciendo logout');
      this.logoutDueToInactivity();
    }, this.timeout);
  }

  showWarning() {
    if (this.isWarningShown) return;

    this.isWarningShown = true;

    // Crear modal de advertencia
    const warningModal = document.createElement('div');
    warningModal.id = 'session-warning-modal';
    warningModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      `;

    warningModal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; max-width: 400px;">
          <h3 style="color: #ff9800;">⚠️ Sesión por expirar</h3>
          <p>Su sesión expirará en 5 minutos debido a inactividad.</p>
          <p>¿Desea continuar?</p>
          <button id="continueSession" style="
            background: #213547; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            margin: 5px;
            cursor: pointer;
          ">Continuar sesión</button>
          <button id="logoutNow" style="
            background: #dc3545; 
            color: white; 
            border: none; 
            padding: 10px 20px; 
            border-radius: 5px; 
            margin: 5px;
            cursor: pointer;
          ">Cerrar sesión</button>
        </div>
      `;

    document.body.appendChild(warningModal);

    document.getElementById('continueSession').addEventListener('click', () => {
      const modal = document.getElementById('session-warning-modal');
      if (modal) document.body.removeChild(modal);
      this.resetTimer();
    });

    document.getElementById('logoutNow').addEventListener('click', () => {
      this.logoutDueToInactivity();
    });
  }

  logoutDueToInactivity() {
    console.log('🚪 Cerrando sesión por inactividad');
    this.stopMonitoring();

    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');

    // Eliminar modal si existe
    const modal = document.getElementById('session-warning-modal');
    if (modal) document.body.removeChild(modal);

    console.log('🧹 Datos de sesión limpiados');

    // Redirigir al login
    window.location.href = '/login?reason=inactivity';
  }

  // Método para detener el manager (en logout manual)
  destroy() {
    this.stopMonitoring();
  }
}

// Exportar instancia única
export const sessionTimeoutManager = new SessionTimeoutManager();