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

        <!-- Indicador con ícono según el tipo de evento -->
        <span v-if="hasEvent(day)" class="event-indicator">
          <i :class="getIconForDate(day)" :style="{ color: getColorForDate(day) }"></i>
        </span>
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
      return this.getEventsForDate(day).length > 0;
    },
    getEventsForDate(day) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return this.events.filter(event => dateStr >= event.fechaInicio && dateStr <= event.fechaFin);
    },
    getIconForDate(day) {
      const eventos = this.getEventsForDate(day);
      if (!eventos.length) return '';
      const tipo = eventos[0].tipo;
      switch (tipo) {
        case 'evaluación': return 'fas fa-star';
        case 'evento': return 'fas fa-calendar-check';
        case 'taller': return 'fas fa-tools';
        default: return 'fas fa-circle';
      }
    },
    getColorForDate(day) {
      const eventos = this.getEventsForDate(day);
      if (!eventos.length) return '#888';
      const tipo = eventos[0].tipo;
      switch (tipo) {
        case 'evaluación': return '#dc3545'; // rojo
        case 'evento': return '#007bff';     // azul
        case 'taller': return '#28a745';     // verde
        default: return '#6c757d';           // gris
      }
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
  font-size: 0.8rem;
}

.btn-outline-primary {
  border-color: #3b5998;
  color: #3b5998;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: #3b5998;
  color: #ffffff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .calendario {
    padding: 1rem;
  }

  .calendar-header {
    margin-bottom: 0.75rem;
  }

  .month-year {
    font-size: 1.3rem;
  }

  .btn-outline-primary {
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
  }

  .days-of-week {
    margin-bottom: 0.3rem;
  }

  .day-header {
    padding: 0.4rem;
    font-size: 0.8rem;
  }

  .days-grid {
    gap: 1px;
  }

  .day {
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .event-indicator {
    bottom: 3px;
    right: 3px;
    font-size: 0.7rem;
  }
}

@media (max-width: 576px) {
  .calendario {
    padding: 0.75rem;
  }

  .calendar-header {
    margin-bottom: 0.5rem;
  }

  .month-year {
    font-size: 1.1rem;
  }

  .btn-outline-primary {
    padding: 0.3rem 0.5rem;
    font-size: 0.8rem;
  }

  .days-of-week {
    margin-bottom: 0.2rem;
  }

  .day-header {
    padding: 0.3rem;
    font-size: 0.7rem;
  }

  .days-grid {
    gap: 1px;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .day {
    padding: 0.4rem;
    font-size: 0.85rem;
  }

  .event-indicator {
    bottom: 2px;
    right: 2px;
    font-size: 0.6rem;
  }
}
</style>
