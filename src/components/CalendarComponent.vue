<template>
  <div class="calendario">
    <!-- Controles de mes y año -->
    <div class="calendar-header">
      <button @click="prevMonth" class="btn btn-outline-primary">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="month-year">
        {{ months[currentMonth] }} {{ currentYear }}
      </div>
      <button @click="nextMonth" class="btn btn-outline-primary">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Días de la semana -->
    <div class="days-of-week">
      <div v-for="day in days" :key="day" class="day-header">{{ day }}</div>
    </div>

    <!-- Días del mes -->
    <div class="days-grid">
      <!-- Días vacíos antes del primer día del mes -->
      <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="day empty"></div>
      <!-- Días del mes -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="day"
        :class="{ 'selected': isSelected(day), 'has-event': hasEvent(day) }"
        @click="selectDate(day)"
      >
        {{ day }}
        <span v-if="hasEvent(day)" class="event-indicator"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarComponent',
  props: {
    events: Array,
    currentYear: Number,
    currentMonth: Number,
    selectedDate: String,
  },
  data() {
    return {
      days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      months: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
    };
  },
  computed: {
    daysInMonth() {
      return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    },
    firstDayOfMonth() {
      return new Date(this.currentYear, this.currentMonth, 1).getDay();
    },
  },
  methods: {
    prevMonth() {
      let newMonth = this.currentMonth - 1;
      let newYear = this.currentYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
      this.$emit('update:month', newMonth);
      this.$emit('update:year', newYear);
    },
    nextMonth() {
      let newMonth = this.currentMonth + 1;
      let newYear = this.currentYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      this.$emit('update:month', newMonth);
      this.$emit('update:year', newYear);
    },
    selectDate(day) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      this.$emit('select-date', dateStr);
    },
    isSelected(day) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return dateStr === this.selectedDate;
    },
    hasEvent(day) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return this.events.some(event => event.date === dateStr);
    },
  },
};
</script>

<style scoped>
.calendario {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(26, 46, 74, 0.2);
  width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.month-year {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a2e4a;
}

.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 0.5rem;
}

.day-header {
  padding: 0.5rem;
  font-size: 0.9rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  text-align: center;
}

.day {
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.day:hover {
  background: #f8f1e9;
  transform: scale(1.05);
}

.day.empty {
  background: transparent;
  cursor: default;
}

.day.selected {
  background: #355e3b;
  color: #ffffff;
}

.day.has-event {
  position: relative;
}

.event-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background: #8b2e3c;
  border-radius: 50%;
}

.btn-outline-primary {
  border-color: #3b5998;
  color: #3b5998;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: #3b5998;
  color: #ffffff;
}
</style>