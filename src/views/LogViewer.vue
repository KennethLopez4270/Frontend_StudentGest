<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h2 class="mb-0 text-white">
          <i class="fas fa-terminal me-2"></i>Visor de Logs del Sistema
        </h2>
        <div class="d-flex gap-2">
          <button 
            @click="goBack" 
            class="btn btn-outline-light"
          >
            <i class="fas fa-arrow-left me-2"></i>Volver
          </button>
          <button 
            @click="refreshLogs" 
            class="btn btn-light" 
            :disabled="loading"
          >
            <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': loading }"></i>
            Actualizar
          </button>
        </div>
      </div>
    </div>

    <div class="card bg-dark text-white border-secondary shadow-lg">
      <div class="card-header border-secondary">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <a 
              class="nav-link" 
              :class="{ active: activeTab === 'security' }"
              @click="changeTab('security')"
              href="#"
            >
              <i class="fas fa-shield-alt me-2 text-warning"></i>Auditoría de Seguridad
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link" 
              :class="{ active: activeTab === 'activity' }"
              @click="changeTab('activity')"
              href="#"
            >
              <i class="fas fa-users me-2 text-info"></i>Actividad de Usuarios
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link" 
              :class="{ active: activeTab === 'system' }"
              @click="changeTab('system')"
              href="#"
            >
              <i class="fas fa-server me-2 text-success"></i>Logs del Sistema
            </a>
          </li>
        </ul>
      </div>
      
      <div class="card-body p-0 position-relative">
        <div v-if="loading" class="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style="z-index: 10;">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div class="log-container p-3" ref="logContainer">
          <div v-if="logs.length === 0" class="text-center text-muted py-5">
            <i class="fas fa-inbox fa-3x mb-3"></i>
            <p>No hay registros disponibles o no se pudo cargar el archivo.</p>
          </div>
          
          <div v-else v-for="(line, index) in logs" :key="index" class="log-line font-monospace small">
            <span v-html="formatLogLine(line)"></span>
          </div>
        </div>
      </div>
      
      <div class="card-footer border-secondary text-muted small d-flex justify-content-between">
        <span>Archivo: {{ currentFileName }}</span>
        <span>Líneas: {{ logs.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const activeTab = ref('security');
const logs = ref([]);
const loading = ref(false);
const logContainer = ref(null);
const router = useRouter();

const API_URL = 'http://localhost:8084/api/logs';

const currentFileName = computed(() => {
  switch (activeTab.value) {
    case 'security': return 'security-audit.log';
    case 'activity': return 'user-activity.log';
    case 'system': return 'user-service.log';
    default: return '';
  }
});

const changeTab = (tab) => {
  activeTab.value = tab;
  fetchLogs();
};

const refreshLogs = () => {
  fetchLogs();
};

const goBack = () => {
  // Intentar volver atrás, si no hay historial ir al dashboard por defecto
  if (window.history.length > 2) {
    router.back();
  } else {
    router.push('/admin-dashboard');
  }
};

const fetchLogs = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await axios.get(`${API_URL}/content`, {
      params: { filename: currentFileName.value },
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.success) {
      logs.value = response.data.content;
      scrollToBottom();
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    logs.value = [];
    // No mostrar alerta si es 404 (archivo vacío/nuevo)
    if (error.response && error.response.status !== 404) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los logs. Asegúrate de tener permisos de administrador.'
      });
    }
  } finally {
    loading.value = false;
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  });
};

const formatLogLine = (line) => {
  if (!line) return '';
  
  // Colorear según nivel o contenido
  let formatted = line
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (formatted.includes('ERROR')) {
    return `<span class="text-danger">${formatted}</span>`;
  } else if (formatted.includes('WARN')) {
    return `<span class="text-warning">${formatted}</span>`;
  } else if (formatted.includes('INFO')) {
    return `<span class="text-info">${formatted}</span>`;
  } else if (formatted.includes('DEBUG')) {
    return `<span class="text-secondary">${formatted}</span>`;
  } else if (formatted.includes('| true') || formatted.includes('Exitoso')) {
    return `<span class="text-success">${formatted}</span>`;
  } else if (formatted.includes('| false') || formatted.includes('Fallido')) {
    return `<span class="text-danger fw-bold">${formatted}</span>`;
  }
  
  return `<span class="text-light">${formatted}</span>`;
};

onMounted(() => {
  fetchLogs();
});
</script>

<style scoped>
.log-container {
  height: 70vh;
  overflow-y: auto;
  background-color: #1e1e1e;
  border-radius: 0 0 4px 4px;
}

.log-line {
  white-space: pre-wrap;
  border-bottom: 1px solid #333;
  padding: 2px 0;
}

.log-line:hover {
  background-color: #2d2d2d;
}

/* Scrollbar personalizado */
.log-container::-webkit-scrollbar {
  width: 10px;
}

.log-container::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.log-container::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}

.log-container::-webkit-scrollbar-thumb:hover {
  background: #777;
}

.nav-tabs .nav-link {
  color: #aaa;
  border: none;
  border-bottom: 3px solid transparent;
}

.nav-tabs .nav-link:hover {
  color: #fff;
  border-color: transparent;
}

.nav-tabs .nav-link.active {
  background-color: transparent;
  color: #fff;
  border-bottom: 3px solid #0d6efd;
}
</style>
