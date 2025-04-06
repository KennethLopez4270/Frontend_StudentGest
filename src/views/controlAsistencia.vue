<template>
    <div class="wrapper">
      <!-- Sidebar -->
      <div class="sidebar animate__animated animate__fadeInLeft">
        <div class="logo">Academia</div>
        <router-link to="/" :class="{ active: $route.name === 'Home' }">
            <i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
        <router-link to="/control-asistencia" :class="{ active: $route.name === 'ControlAsistencia' }">
            <i class="fas fa-users"></i> Estudiantes
        </router-link>
        <router-link to="/reportes" :class="{ active: $route.name === 'Reportes' }">
            <i class="fas fa-chart-line"></i> Reportes
        </router-link>
        <router-link to="/historial-academico" :class="{ active: $route.name === 'HistorialAcademico' }">
            <i class="fas fa-book"></i> Tareas
        </router-link>
        <router-link to="/calificaciones" :class="{ active: $route.name === 'Calificaciones' }">
            <i class="fas fa-star"></i> Calificaciones
        </router-link>
        <router-link to="/calendario" :class="{ active: $route.name === 'Calendario' }">
            <i class="fas fa-calendar-alt"></i> Calendario
        </router-link>
    </div>
  
      <!-- Main Content -->
      <div class="main-content">
        <div class="left-section">
          <!-- Header -->
          <div class="header animate__animated animate__fadeInDown">
            <h1>Student Attendance</h1>
            <a href="#" class="btn">Create New</a>
          </div>
  
          <!-- Filters -->
          <div class="filter-section animate__animated animate__fadeInUp">
            <div>
              <h2>All Students</h2>
              <div class="d-flex gap-3 align-items-center">
                <div class="filter-field">
                  <label for="filterDate">Date</label>
                  <input type="text" id="filterDate" v-model="filterDate" readonly />
                  <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="filter-field">
                  <label for="filterStatus">Status</label>
                  <select id="filterStatus" v-model="filterStatus" @change="filterByStatus">
                    <option value="Todos">Any</option>
                    <option value="Ausente">Ausente</option>
                    <option value="Tardanza">Tardanza</option>
                    <option value="Excusado">Excusado</option>
                  </select>
                  <i class="fas fa-chevron-down"></i>
                </div>
              </div>
              <a href="#" class="btn-reports mt-2 d-inline-block">View Reports</a>
            </div>
            <img src="https://i.pinimg.com/736x/32/41/e9/3241e9af352c58dddefee9bf27ccfc3a.jpg" alt="Illustration" class="rounded" />
          </div>
  
          <!-- Student Table -->
          <div class="student-table animate__animated animate__fadeIn">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Last Action</th>
                  <th>Ausencias</th>
                  <th>Tardanzas</th>
                  <th>Excusas</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in filteredStudents" :key="index" :data-dates="JSON.stringify(student.dates)">
                  <td>{{ student.name }}</td>
                  <td>{{ student.lastAction }}</td>
                  <td>{{ student.absences }}</td>
                  <td>{{ student.tardies }}</td>
                  <td>{{ student.excuses }}</td>
                  <td class="actions">
                    <button class="btn btn-danger" @click="registerAction('absence', index)">
                      <i class="fas fa-times"></i>
                    </button>
                    <button class="btn btn-warning" @click="registerAction('tardy', index)">
                      <i class="fas fa-clock"></i>
                    </button>
                    <button class="btn btn-info" @click="showExcuseModal(index)" data-bs-toggle="modal" data-bs-target="#excuseModal">
                      <i class="fas fa-note-sticky"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <!-- Right Section -->
        <div class="right-section">
          <!-- Calendar -->
          <div class="calendar-card animate__animated animate__fadeInRight">
            <div class="calendar-header">
              <h3>Calendar</h3>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-light" @click="prevMonth"><i class="fas fa-chevron-left"></i></button>
                <span id="calendarMonth">{{ calendarMonth }}</span>
                <button class="btn btn-sm btn-light" @click="nextMonth"><i class="fas fa-chevron-right"></i></button>
              </div>
            </div>
            <div class="calendar-grid">
              <div class="day" v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="day">{{ day }}</div>
              <div v-for="i in firstDayOffset" :key="'empty-' + i" class="date empty"></div>
              <div v-for="day in daysInMonth" :key="day" class="date" :class="getEventClass(day)" @click="selectDate(day)">
                {{ day }}
              </div>
            </div>
          </div>
  
          <!-- Profile Card -->
          <div class="profile-card animate__animated animate__fadeInUp">
            <img src="https://i.pinimg.com/736x/bd/42/8e/bd428e6bb156d90045700dbf3e967c3e.jpg" alt="Profile" />
            <h3>Professor Smith</h3>
            <p>Mathematics Teacher</p>
            <p><i class="fas fa-building me-1"></i> Academia Prestige</p>
            <p><i class="fas fa-calendar-alt me-1"></i> Joined: 01/01/2020</p>
            <p><i class="fas fa-users me-1"></i> 30 Students</p>
          </div>
        </div>
      </div>
  
      <!-- Floating Button -->
      <button class="floating-btn btn btn-primary btn-lg rounded-circle shadow-lg">
        <i class="fas fa-plus"></i>
      </button>
  
      <!-- Excuse Modal -->
      <div class="modal fade" id="excuseModal" tabindex="-1" aria-labelledby="excuseModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-lg">
            <div class="modal-header">
              <h5 class="modal-title" id="excuseModalLabel">Registrar Excusa</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="excuseInput" class="form-label" style="color: #4a4a4a;">Motivo de la excusa</label>
                <input type="text" class="form-control" id="excuseInput" v-model="excuseInput" placeholder="Ej: Enfermedad" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="saveExcuse">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import 'animate.css';
  import '@/assets/controlA.css'; // Importa el CSS desde assets
  
  export default {
    name: 'ControlAsistencia',
    data() {
      return {
        activeLink: 'dashboard',
        filterDate: '05/04/2025',
        filterStatus: 'Todos',
        currentMonth: 3, // April (0-based)
        currentYear: 2025,
        months: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        students: [
          { name: 'Ana Gómez', lastAction: 'Última Ausencia: 05/04/2025', absences: 2, tardies: 1, excuses: 1, dates: [{ date: '2025-04-03', type: 'absence' }, { date: '2025-04-05', type: 'tardy' }] },
          { name: 'Carlos Ruiz', lastAction: 'Última Tardanza: 04/04/2025', absences: 0, tardies: 3, excuses: 0, dates: [{ date: '2025-04-04', type: 'tardy' }] },
          { name: 'María López', lastAction: 'Última Ausencia: 02/04/2025', absences: 1, tardies: 0, excuses: 1, dates: [{ date: '2025-04-02', type: 'absence' }] }
        ],
        events: [
          { date: '2025-04-03', type: 'absence' },
          { date: '2025-04-05', type: 'tardy' },
          { date: '2025-04-02', type: 'absence' }
        ],
        currentStudentIndex: null,
        excuseInput: ''
      };
    },
    computed: {
      calendarMonth() {
        return `${this.months[this.currentMonth]} ${this.currentYear}`;
      },
      firstDayOffset() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        return (firstDay === 0 ? 6 : firstDay - 1);
      },
      daysInMonth() {
        return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      },
      filteredStudents() {
        const dateFilter = this.filterDate.split('/').reverse().join('-');
        return this.students.filter(student => {
          const hasDate = student.dates.some(event => event.date === dateFilter);
          const matchesStatus = this.filterStatus === 'Todos' ||
            (this.filterStatus === 'Ausente' && student.absences > 0) ||
            (this.filterStatus === 'Tardanza' && student.tardies > 0) ||
            (this.filterStatus === 'Excusado' && student.excuses > 0);
          return matchesStatus && (dateFilter === '2025-04-05' || hasDate);
        });
      }
    },
    mounted() {
      this.renderCalendar();
    },
    methods: {
      setActive(link) {
        this.activeLink = link;
      },
      getEventClass(day) {
        const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const event = this.events.find(e => e.date === dateStr);
        return event ? event.type : '';
      },
      renderCalendar() {
        // Calendar rendering is handled via template now
      },
      prevMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
      },
      nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        }
      },
      selectDate(day) {
        const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        this.filterDate = dateStr.split('-').reverse().join('/');
        this.filterByDate(dateStr);
      },
      registerAction(type, index) {
        const student = this.students[index];
        const currentDate = new Date().toISOString().split('T')[0];
        if (type === 'absence') student.absences++;
        else if (type === 'tardy') student.tardies++;
        student.dates.push({ date: currentDate, type });
        this.events.push({ date: currentDate, type });
        this.filterByStatus();
      },
      showExcuseModal(index) {
        this.currentStudentIndex = index;
        this.excuseInput = '';
      },
      saveExcuse() {
        if (this.excuseInput && this.currentStudentIndex !== null) {
          const student = this.students[this.currentStudentIndex];
          student.excuses++;
          const currentDate = new Date().toISOString().split('T')[0];
          student.dates.push({ date: currentDate, type: 'excuse' });
          this.events.push({ date: currentDate, type: 'excuse' });
          this.$nextTick(() => {
            bootstrap.Modal.getInstance(document.getElementById('excuseModal')).hide();
          });
          this.filterByStatus();
        }
      },
      filterByStatus() {
        this.$forceUpdate(); // Forzar actualización de la vista
      },
      filterByDate(date) {
        this.filterByStatus();
      }
    }
  };
  </script>