<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="main-content">
      <div class="left-section">
        <!-- Reports Section -->
        <div class="form-section animate__animated animate__fadeInUp">
          <h2>Generar Informes Administrativos</h2>
          <p class="role-text">Rol: <strong>{{ adminRole.toUpperCase() }}</strong></p>

          <!-- Selector de Estudiante o Grupo -->
          <div class="selection-container">
            <div class="form-group">
              <label for="selectionType" class="form-label">Tipo de Selección</label>
              <select
                id="selectionType"
                v-model="selectionType"
                class="form-select"
                @change="resetSelection"
              >
                <option value="individual">Estudiante Individual</option>
                <option value="group">Grupo de Estudiantes</option>
              </select>
            </div>

            <!-- Selección Individual -->
            <div v-if="selectionType === 'individual'" class="form-group">
              <label for="studentSelect" class="form-label">Seleccionar Estudiante</label>
              <select
                id="studentSelect"
                v-model="selectedStudent"
                class="form-select"
                @change="fetchReports"
              >
                <option value="" disabled>-- Seleccionar --</option>
                <option v-for="student in students" :key="student.id" :value="student">
                  {{ student.name }}
                </option>
              </select>
            </div>

            <!-- Selección de Grupo -->
            <div v-if="selectionType === 'group'" class="form-group">
              <label for="groupSelect" class="form-label">Seleccionar Grupo</label>
              <select
                id="groupSelect"
                v-model="selectedGroup"
                class="form-select"
                @change="fetchGroupReports"
              >
                <option value="" disabled>-- Seleccionar --</option>
                <option v-for="group in groups" :key="group.id" :value="group">
                  {{ group.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Selección de Tipo de Informe -->
          <div class="report-type-container">
            <div class="form-check custom-radio">
              <input
                type="radio"
                id="attendance"
                value="attendance"
                v-model="reportType"
                class="form-check-input"
                @change="fetchReports"
              />
              <label for="attendance" class="form-check-label">Asistencia</label>
            </div>
            <div class="form-check custom-radio">
              <input
                type="radio"
                id="performance"
                value="performance"
                v-model="reportType"
                class="form-check-input"
                @change="fetchReports"
              />
              <label for="performance" class="form-check-label">Rendimiento</label>
            </div>
            <div class="form-check custom-radio">
              <input
                type="radio"
                id="both"
                value="both"
                v-model="reportType"
                class="form-check-input"
                @change="fetchReports"
              />
              <label for="both" class="form-check-label">Ambos</label>
            </div>
          </div>

          <!-- Resultados de Informes -->
          <div v-if="showReport" class="report-table animate__animated animate__fadeIn">
            <h3 class="report-title">
              Informe de {{ reportType === 'both' ? 'Asistencia y Rendimiento' : reportType }}
            </h3>
            <p class="report-meta">
              {{ selectionType === 'individual' ? 'Estudiante: ' + selectedStudent.name : 'Grupo: ' + selectedGroup.name }}<br />
              Fecha de Generación: <strong>{{ today }}</strong>
            </p>

            <!-- Informe de Asistencia -->
            <div v-if="reportType === 'attendance' || reportType === 'both'" class="report-section">
              <h4>Asistencia</h4>
              <div class="table-responsive">
                <table class="table-modern">
                  <thead>
                    <tr>
                      <th v-if="selectionType === 'group'">Estudiante</th>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th>Excusa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in attendanceRecords" :key="record.id" class="history-row animate__animated animate__fadeInUp">
                      <td v-if="selectionType === 'group'">{{ record.studentName }}</td>
                      <td>{{ record.date }}</td>
                      <td><span class="type-badge" :class="attendanceClass(record.type)">{{ record.type }}</span></td>
                      <td>{{ record.excuse || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Informe de Rendimiento -->
            <div v-if="reportType === 'performance' || reportType === 'both'" class="report-section">
              <h4>Rendimiento</h4>
              <div class="table-responsive">
                <table class="table-modern">
                  <thead>
                    <tr>
                      <th v-if="selectionType === 'group'">Estudiante</th>
                      <th>Materia</th>
                      <th>Calificación</th>
                      <th>Tareas Completadas</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in performanceRecords" :key="record.id" class="history-row animate__animated animate__fadeInUp">
                      <td v-if="selectionType === 'group'">{{ record.studentName }}</td>
                      <td>{{ record.subject }}</td>
                      <td><span class="type-badge grade-badge">{{ record.score }}</span></td>
                      <td>{{ record.completedTasks }} / {{ record.totalTasks }}</td>
                      <td>{{ record.date }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Botón de Exportar -->
            <div class="export-btn-container">
              <button class="btn-export" @click="exportReport">
                <i class="fas fa-download me-1"></i> Exportar Informe
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <div class="profile-card animate__animated animate__fadeInRight">
          <img src="https://i.pinimg.com/736x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg" alt="Profile" />
          <h3>{{ adminName }}</h3>
          <p>Personal Administrativo</p>
          <p><i class="fas fa-building me-1"></i> Academia Prestige</p>
          <p><i class="fas fa-calendar-alt me-1"></i> Miembro desde: 01/01/2023</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@/assets/adminReports.css';
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'AdminReportsView',
  components: { Sidebar },
  data() {
    return {
      adminName: 'Claudia Ramírez',
      adminRole: 'administrativo',
      selectionType: 'individual',
      selectedStudent: '',
      selectedGroup: '',
      reportType: '',
      today: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      students: [
        { id: 1, name: 'Ana González' },
        { id: 2, name: 'Carlos González' },
        { id: 3, name: 'Lucía González' },
      ],
      groups: [
        { id: 1, name: '5° Primaria - Sección A' },
        { id: 2, name: '2° Secundaria - Sección B' },
      ],
      attendanceRecords: [],
      performanceRecords: [],
      showReport: false,
    };
  },
  methods: {
    resetSelection() {
      this.selectedStudent = '';
      this.selectedGroup = '';
      this.reportType = '';
      this.showReport = false;
      this.attendanceRecords = [];
      this.performanceRecords = [];
    },
    fetchReports() {
      if (!this.selectedStudent || !this.reportType) {
        this.showReport = false;
        return;
      }
      this.showReport = true;

      // Datos simulados
      if (this.reportType === 'attendance' || this.reportType === 'both') {
        this.attendanceRecords = [
          { id: 1, date: '2025-04-01', type: 'presente', excuse: null },
          { id: 2, date: '2025-04-02', type: 'falta', excuse: 'Enfermedad' },
          { id: 3, date: '2025-04-03', type: 'tardanza', excuse: null },
        ];
      } else {
        this.attendanceRecords = [];
      }

      if (this.reportType === 'performance' || this.reportType === 'both') {
        this.performanceRecords = [
          { id: 1, subject: 'Matemáticas', score: 85, completedTasks: 5, totalTasks: 6, date: '2025-04-04' },
          { id: 2, subject: 'Ciencias', score: 78, completedTasks: 3, totalTasks: 4, date: '2025-04-05' },
        ];
      } else {
        this.performanceRecords = [];
      }
    },
    fetchGroupReports() {
      if (!this.selectedGroup || !this.reportType) {
        this.showReport = false;
        return;
      }
      this.showReport = true;

      // Datos simulados
      if (this.reportType === 'attendance' || this.reportType === 'both') {
        this.attendanceRecords = [
          { id: 1, studentName: 'Ana González', date: '2025-04-01', type: 'presente', excuse: null },
          { id: 2, studentName: 'Carlos González', date: '2025-04-01', type: 'falta', excuse: 'Enfermedad' },
          { id: 3, studentName: 'Lucía González', date: '2025-04-01', type: 'tardanza', excuse: null },
        ];
      } else {
        this.attendanceRecords = [];
      }

      if (this.reportType === 'performance' || this.reportType === 'both') {
        this.performanceRecords = [
          { id: 1, studentName: 'Ana González', subject: 'Matemáticas', score: 85, completedTasks: 5, totalTasks: 6, date: '2025-04-04' },
          { id: 2, studentName: 'Carlos González', subject: 'Matemáticas', score: 90, completedTasks: 6, totalTasks: 6, date: '2025-04-04' },
          { id: 3, studentName: 'Lucía González', subject: 'Matemáticas', score: 70, completedTasks: 4, totalTasks: 6, date: '2025-04-04' },
        ];
      } else {
        this.performanceRecords = [];
      }
    },
    attendanceClass(type) {
      return {
        'presente-badge': type === 'presente',
        'ausente-badge': type === 'falta',
        'tardanza-badge': type === 'tardanza',
      };
    },
    exportReport() {
      alert('Informe exportado exitosamente.');
    },
  },
};
</script>