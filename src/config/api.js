/**
 * =====================================================
 * Configuración de API para StudentGest
 * =====================================================
 * Este archivo centraliza todas las URLs de la API.
 * Las URLs se obtienen de las variables de entorno de Vite.
 * En desarrollo usa localhost, en producción usa los dominios configurados.
 */

// URL base del API Gateway (punto de entrada principal)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// URLs de servicios específicos (para acceso directo si es necesario)
const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8084';
const FORO_SERVICE_URL = import.meta.env.VITE_FORO_SERVICE_URL || 'http://localhost:8088';

/**
 * Configuración exportada de la API
 */
export const API = {
  // API Gateway - Punto de entrada principal
  GATEWAY: API_URL,
  
  // Endpoints específicos a través del Gateway
  STUDENTS: `${API_URL}/api/students`,
  USERS: `${API_URL}/api/users`,
  HOMEWORK: `${API_URL}/api/homework`,
  ATTENDANCE: `${API_URL}/api/asistencia`,
  NOTIFICATIONS: `${API_URL}/api/notificaciones`,
  EMAIL: `${API_URL}/api/email`,
  FORO: `${API_URL}/api/foro`,
  CALENDAR: `${API_URL}/api/calendario`,
  
  // Acceso directo a servicios (útil si el gateway no está disponible)
  DIRECT: {
    USER_SERVICE: USER_SERVICE_URL,
    FORO_SERVICE: FORO_SERVICE_URL,
  }
};

/**
 * URL base de la API (export por defecto)
 */
export default API_URL;
