<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <Sidebar :class="{ 'mobile-sidebar': isMobile, 'active': sidebarOpen }" />

    <!-- Main Content -->
    <div class="main-content" :class="{ 'sidebar-collapsed': !sidebarOpen && isMobile }">
      <!-- Mobile sidebar toggle button -->
      <button class="mobile-sidebar-toggle btn btn-light" @click="toggleSidebar" v-if="isMobile">
        <i class="fas fa-bars"></i>
      </button>

      <div class="left-section">
        <!-- Header -->
        <div class="header animate__animated animate__fadeInDown">
          <h1>Notas & Tareas</h1>
          <a href="#" class="btn btn-view-reports">View Reports</a>
        </div>

        <!-- Form Section -->
        <div class="form-section animate__animated animate__fadeInUp">
          <h2>Registrar Notas y Tareas</h2>
          <div class="row g-3">
            <div class="col-md-4 col-12">
              <label for="studentSelect" class="form-label">Student</label>
              <select id="studentSelect" class="form-select" v-model="selectedStudent" @change="filterByStudent">
                <option value="Ana Gómez">Ana Gómez</option>
                <option value="Carlos Ruiz">Carlos Ruiz</option>
                <option value="María López">María López</option>
              </select>
            </div>
            <div class="col-md-4 col-12">
              <label for="typeSelect" class="form-label">Type</label>
              <select id="typeSelect" class="form-select" v-model="entryType" @change="toggleInputFields">
                <option value="grade">Grade</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
            <div class="col-md-4 col-12" :class="{ 'd-none': entryType !== 'grade' }">
              <label for="gradeInput" class="form-label">Grade (0-100)</label>
              <input type="number" id="gradeInput" class="form-control" v-model="gradeInput" min="0" max="100" placeholder="Enter grade">
            </div>
            <div class="col-md-4 col-12" :class="{ 'd-none': entryType !== 'assignment' }">
              <label for="assignmentInput" class="form-label">Assignment Title</label>
              <input type="text" id="assignmentInput" class="form-control" v-model="assignmentInput" placeholder="Enter assignment title">
            </div>
            <div class="col-md-4 col-12">
              <label for="dateInput" class="form-label">Date</label>
              <input type="date" id="dateInput" class="form-control" v-model="dateInput" @change="filterByDate">
            </div>
            <div class="col-12">
              <button class="btn btn-submit" @click="registerEntry">Register</button>
            </div>
          </div>
        </div>

        <!-- History Table -->
        <div class="history-table animate__animated animate__fadeIn">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Type</th>
                  <th>Detail</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in filteredHistory" :key="index" :data-student="entry.student" :data-date="entry.date">
                  <td>{{ entry.student }}</td>
                  <td>{{ entry.type }}</td>
                  <td>{{ entry.detail }}</td>
                  <td>{{ entry.formattedDate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
    <button class="floating-btn btn btn-primary rounded-circle shadow-lg">
      <i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
import 'animate.css';
import '@/assets/historialA.css';
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'HistorialAcademico',
  components: { Sidebar },
  data() {
    return {
      selectedStudent: 'Ana Gómez',
      entryType: 'grade',
      gradeInput: '',
      assignmentInput: '',
      dateInput: '2025-04-05',
      currentMonth: 3,
      currentYear: 2025,
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      history: [
        { student: 'Ana Gómez', type: 'Grade', detail: '85', date: '2025-04-03', formattedDate: '03/04/2025' },
        { student: 'Carlos Ruiz', type: 'Assignment', detail: 'Math Homework', date: '2025-04-04', formattedDate: '04/04/2025' },
        { student: 'María López', type: 'Grade', detail: '92', date: '2025-04-02', formattedDate: '02/04/2025' }
      ],
      events: [
        { date: '2025-04-04', type: 'task' },
        { date: '2025-04-10', type: 'task' }
      ],
      sidebarOpen: false,
      isMobile: false
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
    filteredHistory() {
      return this.history.filter(entry => {
        const matchesStudent = this.selectedStudent === entry.student || !this.selectedStudent;
        const matchesDate = this.dateInput === entry.date || !this.dateInput;
        return matchesStudent && matchesDate;
      });
    }
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
    this.renderCalendar();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
  },
  methods: {
    checkIfMobile() {
      this.isMobile = window.innerWidth < 992;
      if (!this.isMobile) {
        this.sidebarOpen = true;
      }
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    toggleInputFields() {
      // La visibilidad se maneja con v-bind:class en el template
    },
    getEventClass(day) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const event = this.events.find(e => e.date === dateStr);
      return event ? event.type : '';
    },
    renderCalendar() {
      // Rendering is handled via template
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
      this.dateInput = dateStr;
      this.filterByDate();
    },
    registerEntry() {
      if (!this.selectedStudent || !this.dateInput || (this.entryType === 'grade' && !this.gradeInput) || (this.entryType === 'assignment' && !this.assignmentInput)) {
        alert('Please fill in all required fields.');
        return;
      }

      const detail = this.entryType === 'grade' ? this.gradeInput : this.assignmentInput;
      const formattedDate = this.dateInput.split('-').reverse().join('/');

      this.history.unshift({
        student: this.selectedStudent,
        type: this.entryType === 'grade' ? 'Grade' : 'Assignment',
        detail: detail,
        date: this.dateInput,
        formattedDate: formattedDate
      });

      if (this.entryType === 'assignment') {
        this.events.push({ date: this.dateInput, type: 'task' });
      }

      this.gradeInput = '';
      this.assignmentInput = '';
      this.$forceUpdate(); // Forzar actualización de la vista
    },
    filterByDate() {
      this.$forceUpdate();
    },
    filterByStudent() {
      this.$forceUpdate();
    }
  }
};
</script>