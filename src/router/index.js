import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegistroView from '../views/RegistroView.vue';
import ControlAsistencia from '../views/controlAsistencia.vue';
import HistorialAcademico from '../views/historialAcademico.vue';
import JustificarAusencias from '../views/justificarAusencias.vue';
import Reportes from '../views/reportes.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/registro', name: 'Registro', component: RegistroView },
  { path: '/control-asistencia', name: 'ControlAsistencia', component: ControlAsistencia },
  { path: '/historial-academico', name: 'HistorialAcademico', component: HistorialAcademico },
  { path: '/justificar-ausencias', name: 'JustificarAusencias', component: JustificarAusencias },
  { path: '/reportes', name: 'Reportes', component: Reportes }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;