class SessionTimeoutManager {
    constructor() {
        this.timeout = 2 * 60 * 1000; // 15 minutos en milisegundos
        this.warningTime = 1 * 60 * 1000; // 5 minutos antes de mostrar advertencia
        this.timer = null;
        this.warningTimer = null;
        this.isWarningShown = false;
        
        this.setupEventListeners();
        this.resetTimer();
    }
    
    setupEventListeners() {
        // Reiniciar timer en cualquier interacción del usuario
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.resetTimer(), true);
        });
        
        // También reiniciar en llamadas AJAX
        this.interceptFetch();
    }
    
    interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            this.resetTimer();
            return originalFetch(...args);
        };
    }
    
    resetTimer() {
        // Limpiar timers anteriores
        if (this.timer) clearTimeout(this.timer);
        if (this.warningTimer) clearTimeout(this.warningTimer);
        
        this.isWarningShown = false;
        
        // Timer para advertencia
        this.warningTimer = setTimeout(() => {
            this.showWarning();
        }, this.timeout - this.warningTime);
        
        // Timer para logout automático
        this.timer = setTimeout(() => {
            this.logoutDueToInactivity();
        }, this.timeout);
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
        // Limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
        
        // Redirigir al login
        window.location.href = '/login?reason=inactivity';
    }
    
    // Método para detener el manager (en logout manual)
    destroy() {
        if (this.timer) clearTimeout(this.timer);
        if (this.warningTimer) clearTimeout(this.warningTimer);
    }
}

// Exportar instancia única
export const sessionTimeoutManager = new SessionTimeoutManager();