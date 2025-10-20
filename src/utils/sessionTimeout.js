class SessionTimeoutManager {
    constructor() {
        console.log('🔄 SessionTimeoutManager constructor llamado');
        this.timeout = 15 * 60 * 1000; // 15 minutos
        this.warningTime = 5 * 60 * 1000; // 5 minutos
        this.verificationInterval = 2 * 60 * 1000; 
        this.timer = null;
        this.warningTimer = null;
        this.verificationTimer = null; 
        this.isWarningShown = false;
        
        this.initialize();
    }
    
    initialize() {
        const authToken = localStorage.getItem('authToken');
        console.log('🔐 Verificando autenticación:', {
            hasToken: !!authToken,
            tokenLength: authToken ? authToken.length : 0
        });
        
        if (!authToken) {
            console.log('👤 Usuario no autenticado, timeout desactivado');
            return;
        }
        
        console.log('✅ Usuario autenticado, iniciando timeout manager');
        this.setupEventListeners();
        this.resetTimer();
        this.startPeriodicVerification(); // ✅ INICIAR VERIFICACIÓN PERIÓDICA
    }
    
    // ✅ NUEVO MÉTODO: Verificación periódica con backend
    startPeriodicVerification() {
        console.log('🔄 Iniciando verificación periódica de sesión');
        
        // Verificar inmediatamente
        this.verifySessionWithBackend();
        
        // Y luego cada 2 minutos
        this.verificationTimer = setInterval(() => {
            this.verifySessionWithBackend();
        }, this.verificationInterval);
    }

    async verifySessionWithBackend() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.log('🚫 No hay token, cancelando verificación');
            return false;
        }
        
        try {
            const response = await fetch('http://localhost:8084/api/users/verify-session', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.ok) {
                const sessionData = await response.json();
                console.log('✅ Sesión verificada con backend:', sessionData.valid);
                
                // ✅ ACTUALIZAR TOKEN SI VIENE NUEVO
                const newToken = response.headers.get('X-New-Token');
                if (newToken) {
                    console.log('🔄 Token actualizado recibido en verificación periódica');
                    localStorage.setItem('authToken', newToken);
                }
                
                return true;
            } else {
                console.warn('⚠️ Sesión inválida en backend, haciendo logout');
                this.logoutDueToInvalidSession();
                return false;
            }
        } catch (error) {
            console.error('❌ Error en verificación periódica:', error);
            return false;
        }
    }
    logoutDueToInvalidSession() {
        console.log('🚫 Sesión invalidada por el backend');
        
        // Limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
        
        // Redirigir al login
        window.location.href = '/login?reason=invalid_session';
    }
    
    destroy() {
        console.log('🛑 Destruyendo SessionTimeoutManager');
        if (this.timer) clearTimeout(this.timer);
        if (this.warningTimer) clearTimeout(this.warningTimer);
        if (this.verificationTimer) { // ✅ LIMPIAR TIMER DE VERIFICACIÓN
            clearInterval(this.verificationTimer);
            console.log('✅ Timer de verificación destruido');
        }
    }
    
    setupEventListeners() {
        console.log('🎯 Configurando event listeners');
        // Reiniciar timer en cualquier interacción del usuario
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, () => {
                console.log(`🖱️ Evento ${event} detectado, reiniciando timer`);
                this.resetTimer();
            }, true);
        });
        
        // También reiniciar en llamadas AJAX
        this.interceptFetch();
    }
    
    interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            console.log('🌐 Fetch interceptado, reiniciando timer');
            this.resetTimer();
            return originalFetch(...args);
        };
    }
    
    resetTimer() {
        console.log('⏰ Resetando timer de sesión');
        
        // Limpiar timers anteriores
        if (this.timer) {
            clearTimeout(this.timer);
            console.log('🧹 Timer principal limpiado');
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            console.log('🧹 Timer de advertencia limpiado');
        }
        
        this.isWarningShown = false;
        
        // Verificar que aún hay sesión
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.log('🚫 No hay token, cancelando timers');
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
        
        console.log(`✅ Timers configurados: Advertencia en ${(this.timeout - this.warningTime) / 1000}s, Logout en ${this.timeout / 1000}s`);
    }
    
    showWarning() {
        if (this.isWarningShown) return;
        
        this.isWarningShown = true;
        
        // Crear modal de advertencia
        const warningModal = document.createElement('div');
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
            document.body.removeChild(warningModal);
            this.resetTimer();
        });
        
        document.getElementById('logoutNow').addEventListener('click', () => {
            this.logoutDueToInactivity();
        });
    }
    
    logoutDueToInactivity() {
        console.log('🚪 Cerrando sesión por inactividad');
        
        // Limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
        
        console.log('🧹 Datos de sesión limpiados');
        
        // Redirigir al login
        window.location.href = '/login?reason=inactivity';
    }
    
    // Método para detener el manager (en logout manual)
    destroy() {
        console.log('🛑 Destruyendo SessionTimeoutManager');
        if (this.timer) {
            clearTimeout(this.timer);
            console.log('✅ Timer principal destruido');
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            console.log('✅ Timer de advertencia destruido');
        }
    }
}

// Exportar instancia única
console.log('📦 Creando instancia de SessionTimeoutManager');
export const sessionTimeoutManager = new SessionTimeoutManager();