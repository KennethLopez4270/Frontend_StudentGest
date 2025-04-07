<template>
  <div class="home-page">
    <!-- Navbar -->
    <nav class="navbar animate__animated animate__fadeInDown">
      <div class="navbar-brand">
        <span class="logo">StudentGest</span>
      </div>
      <div class="navbar-links">
        <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
        <router-link to="/registro" class="nav-link btn">Registrarse</router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero animate__animated animate__zoomIn">
      <div class="hero-overlay"></div>
      <div class="hero-shapes">
        <div class="shape shape-1 animate__animated animate__rotateIn animate__delay-1s"></div>
        <div class="shape shape-2 animate__animated animate__rotateIn animate__delay-2s"></div>
        <div class="shape shape-3 animate__animated animate__rotateIn animate__delay-3s"></div>
        <div class="shape shape-4 animate__animated animate__bounceIn animate__delay-2s"></div>
      </div>
      <div class="hero-content animate__animated animate__bounceInLeft">
        <h1>¡Revoluciona la Educación con StudentGest!</h1>
        <p>La plataforma más innovadora para gestionar tu institución escolar.</p>
        <router-link to="/login" class="btn animate__animated animate__pulse animate__infinite">
          <i class="fas fa-rocket"></i> Explora Ahora
        </router-link>
      </div>
      <img src="https://img.freepik.com/vector-premium/ilustracion-concepto-clase-online_701961-20.jpg" class="hero-img animate__animated animate__flipInX animate__delay-2s" />
    </section>

    <!-- Features Section (Centrada) -->
    <section class="features">
      <h2 class="section-title animate__animated animate__fadeInDown">Funcionalidades que Transforman</h2>
      <div class="features-grid">
        <div class="feature-card animate__animated animate__flipInX animate__delay-1s">
          <i class="fas fa-users"></i>
          <h3>Colaboración Total</h3>
          <p>Conecta a estudiantes, profesores y padres en tiempo real.</p>
        </div>
        <div class="feature-card animate__animated animate__flipInX animate__delay-2s">
          <i class="fas fa-shield-alt"></i>
          <h3>Seguridad Máxima</h3>
          <p>Protege los datos de tu institución con tecnología avanzada.</p>
        </div>
        <div class="feature-card animate__animated animate__flipInX animate__delay-3s">
          <i class="fas fa-cogs"></i>
          <h3>Personalización</h3>
          <p>Adapta la plataforma a las necesidades de tu escuela.</p>
        </div>
        <div class="feature-card animate__animated animate__flipInX animate__delay-4s">
          <i class="fas fa-trophy"></i>
          <h3>Reconocimientos</h3>
          <p>Premia el esfuerzo y logros de tus estudiantes.</p>
        </div>
      </div>
    </section>

    <!-- Plans Section -->
    <section class="plans">
      <h2 class="section-title animate__animated animate__fadeInDown">Elige el Plan Perfecto para tu Escuela</h2>
      <div class="plans-grid">
        <div class="plan-card animate__animated animate__zoomIn animate__delay-1s">
          <h3>Básico</h3>
          <p class="price">$9/mes</p>
          <ul>
            <li><i class="fas fa-check-circle"></i> Gestión de hasta 100 estudiantes</li>
            <li><i class="fas fa-check-circle"></i> Informes básicos</li>
            <li><i class="fas fa-check-circle"></i> Soporte por correo</li>
          </ul>
          <router-link to="/registro" class="btn-plan"><i class="fas fa-star"></i> Seleccionar</router-link>
        </div>
        <div class="plan-card premium animate__animated animate__zoomIn animate__delay-2s">
          <h3>Premium</h3>
          <p class="price">$29/mes</p>
          <ul>
            <li><i class="fas fa-check-circle"></i> Gestión de hasta 500 estudiantes</li>
            <li><i class="fas fa-check-circle"></i> Informes avanzados</li>
            <li><i class="fas fa-check-circle"></i> Soporte 24/7</li>
            <li><i class="fas fa-check-circle"></i> Calendario integrado</li>
          </ul>
          <router-link to="/registro" class="btn-plan"><i class="fas fa-star"></i> Seleccionar</router-link>
        </div>
        <div class="plan-card vip animate__animated animate__zoomIn animate__delay-3s">
          <h3>VIP</h3>
          <p class="price">$99/mes</p>
          <ul>
            <li><i class="fas fa-check-circle"></i> Estudiantes ilimitados</li>
            <li><i class="fas fa-check-circle"></i> Informes personalizados</li>
            <li><i class="fas fa-check-circle"></i> Soporte prioritario</li>
            <li><i class="fas fa-check-circle"></i> Funcionalidades exclusivas</li>
            <li><i class="fas fa-check-circle"></i> Integraciones avanzadas</li>
          </ul>
          <router-link to="/registro" class="btn-plan"><i class="fas fa-star"></i> Seleccionar</router-link>
        </div>
      </div>
    </section>

    <!-- Benefits Section (Centrada) -->
    <section class="benefits">
      <h2 class="section-title animate__animated animate__fadeInDown">Beneficios de StudentGest</h2>
      <div class="benefits-grid">
        <div class="benefit-item animate__animated animate__slideInLeft animate__delay-1s">
          <i class="fas fa-rocket"></i>
          <h3>Rápido y Eficiente</h3>
          <p>Optimiza la gestión escolar en minutos.</p>
        </div>
        <div class="benefit-item animate__animated animate__slideInRight animate__delay-2s">
          <i class="fas fa-mobile-alt"></i>
          <h3>Acceso Móvil</h3>
          <p>Gestiona desde cualquier dispositivo.</p>
        </div>
        <div class="benefit-item animate__animated animate__slideInLeft animate__delay-3s">
          <i class="fas fa-globe"></i>
          <h3>Multi-Idioma</h3>
          <p>Disponible en varios idiomas.</p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <h2 class="section-title animate__animated animate__fadeInDown">Nuestra Huella en la Educación</h2>
      <div class="stats-grid">
        <div class="stat-card animate__animated animate__bounceIn animate__delay-1s">
          <h3>98%</h3>
          <p>Satisfacción</p>
        </div>
        <div class="stat-card animate__animated animate__bounceIn animate__delay-2s">
          <h3>10K+</h3>
          <p>Estudiantes</p>
        </div>
        <div class="stat-card animate__animated animate__bounceIn animate__delay-3s">
          <h3>500+</h3>
          <p>Instituciones</p>
        </div>
        <div class="stat-card animate__animated animate__bounceIn animate__delay-4s">
          <h3>24/7</h3>
          <p>Soporte</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
      <h2 class="section-title animate__animated animate__fadeInDown">Voces de Nuestra Comunidad</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card animate__animated animate__fadeInUp animate__delay-1s">
          <p>"StudentGest ha transformado nuestra escuela. ¡Es increíble!"</p>
          <h4>– Prof. Marta Pérez</h4>
        </div>
        <div class="testimonial-card animate__animated animate__fadeInUp animate__delay-2s">
          <p>"Puedo seguir el progreso de mi hijo desde cualquier lugar."</p>
          <h4>– Laura Rodríguez, Madre</h4>
        </div>
        <div class="testimonial-card animate__animated animate__fadeInUp animate__delay-3s">
          <p>"La plataforma es rápida, segura y fácil de usar."</p>
          <h4>– Juan Morales, IT Manager</h4>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-content animate__animated animate__fadeInRight">
        <h2>¡Lleva tu Escuela al Siguiente Nivel!</h2>
        <p>Únete a StudentGest y descubre un mundo de posibilidades.</p>
        <router-link to="/login" class="btn animate__animated animate__pulse animate__infinite">
          <i class="fas fa-rocket"></i> Comenzar Ahora
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-shapes">
        <div class="shape shape-1 animate__animated animate__rotateIn animate__delay-1s"></div>
        <div class="shape shape-2 animate__animated animate__rotateIn animate__delay-2s"></div>
      </div>
      <div class="footer-content">
        <div class="footer-section">
          <h3>StudentGest</h3>
          <p>Transformando la educación con tecnología innovadora.</p>
        </div>
        <div class="footer-section">
          <h3>Enlaces Rápidos</h3>
          <div class="footer-links">
            <a href="#"><i class="fas fa-lock"></i> Política de Privacidad</a>
            <a href="#"><i class="fas fa-file-alt"></i> Términos del Servicio</a>
            <a href="#"><i class="fas fa-envelope"></i> Contacto</a>
          </div>
        </div>
        <div class="footer-section">
          <h3>Síguenos</h3>
          <div class="footer-social">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 StudentGest. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@/assets/home.css';

export default {
  name: 'HomeView'
};
</script>