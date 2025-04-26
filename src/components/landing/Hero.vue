<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-text">
        <h1 class="hero-title animate__animated animate__fadeInDown">
          ¡Impulsa tu institución educativa al siguiente nivel!
        </h1>
        <p class="hero-subtitle animate__animated animate__fadeInUp">
          StudentGest es la plataforma digital 
          que transforma la gestión académica con eficiencia, innovación y facilidad.
        </p>
        <div class="hero-buttons animate__animated animate__fadeInUp">
          <a href="/login" class="hero-btn primary-btn">
            Ver planes
          </a>
          <a href="/contactos" class="hero-btn secondary-btn">
            Contáctanos
          </a>
        </div>
      </div>
      <div class="hero-image animate__animated animate__fadeInRight">
        <img
          src="@/assets/images/capibara_coding.png"
          alt="Capibara usando StudentGest"
        />
      </div>
    </div>
  </section>
</template>

<script setup>

</script>

<style scoped>
.hero-section {
  background-color: var(--color-primary);
  font-family: var(--font-body);
  padding: 4rem 2rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.hero-container {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .hero-container {
    flex-direction: row;
    justify-content: space-between;
  }
}

.hero-text {
  flex: 1;
  text-align: center;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .hero-text {
    text-align: left;
    padding-left: 1.8rem;
  }
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  color: var(--color-light);
  margin-bottom: 1.5rem;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, var(--color-light), var(--color-accent));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-subtle-text, #e0e7ff);
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 768px) {
  .hero-buttons {
    justify-content: flex-start;
  }
}

.hero-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  font-weight: bold;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.primary-btn {
  background-color: var(--color-accent);
  color: var(--color-light);
}

.primary-btn:hover {
  background-color: var(--hover-accent);
  transform: scale(1.05);
}

.secondary-btn {
  background-color: transparent;
  color: var(--color-light);
  border: 2px solid var(--color-light);
}

.secondary-btn:hover {
  background-color: var(--color-light);
  color: var(--color-primary);
  transform: scale(1.05);
}

.hero-image {
  flex: 1;
  text-align: center;
}

.hero-image img {
  width: 70%;
  max-width: 400px;
  border-radius: 20px;
  transition: transform 0.4s ease;
  transform: rotate(5deg);
}

.hero-image img:hover {
  transform: rotate(0deg) scale(1.05);
}

@media (max-width: 480px) {
  .hero-image {
    display: none;
  }
}
</style>
