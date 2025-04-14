<template>
  <div class="detalles-fecha">
    <h3 v-if="eventos.length" class="event-title">Eventos del Día</h3>
    <p v-if="mensaje" class="no-events">{{ mensaje }}</p>
    <div v-else class="event-list">
      <div v-for="evento in eventos" :key="evento.id" class="event-card">
        <div class="event-header">
          <span class="event-type" :class="evento.tipo === 'evaluación' ? 'evaluacion' : 'evento'">
            {{ evento.tipo === 'evaluación' ? 'Evaluación' : 'Evento' }}
          </span>
        </div>
        <h4>{{ evento.titulo }}</h4>
        <p class="event-description">{{ evento.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateDetails',
  props: {
    eventos: Array,
    mensaje: String,
  },
};
</script>

<style scoped>
.detalles-fecha {
  background: #f8f1e9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(26, 46, 74, 0.2);
  width: 100%;
  margin-top: 1.5rem;
}

.event-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #1a2e4a;
  margin-bottom: 1rem;
}

.no-events {
  color: #4a4a4a;
  font-size: 1rem;
  text-align: center;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(26, 46, 74, 0.1);
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(26, 46, 74, 0.2);
}

.event-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.event-type {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.evaluacion {
  background: #8b2e3c;
  color: #ffffff;
}

.evento {
  background: #355e3b;
  color: #ffffff;
}

.event-card h4 {
  font-size: 1.1rem;
  color: #1a2e4a;
  margin-bottom: 0.5rem;
}

.event-description {
  font-size: 0.9rem;
  color: #4a4a4a;
}
</style>