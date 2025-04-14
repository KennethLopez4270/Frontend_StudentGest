import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegistroView from '../views/RegistroView.vue';
import ControlAsistencia from '../views/controlAsistencia.vue';
import HistorialAcademico from '../views/historialAcademico.vue';
import JustificarAusencias from '../views/justificarAusencias.vue';
import Reportes from '../views/reportes.vue';
import ParentDashboard from '../views/ParentDashboard.vue';
import PasswordRecoveryView from '../views/PasswordRecoveryView.vue';
import ForumView from '../views/ForumView.vue';
import AdminReportsView from '../views/AdminReportsView.vue';
import TaskDetailsView from '../views/TaskDetailsView.vue';
import TeacherTasksView from '../views/TeacherTasksView.vue';
import AcademicCalendar from '../views/AcademicCalendar.vue';
import TeacherPerformanceReports from '../views/TeacherPerformanceReports.vue'; // Nueva vista

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/registro', name: 'Registro', component: RegistroView },
  { path: '/control-asistencia', name: 'ControlAsistencia', component: ControlAsistencia },
  { path: '/historial-academico', name: 'HistorialAcademico', component: HistorialAcademico },
  { path: '/justificar-ausencias', name: 'JustificarAusencias', component: JustificarAusencias },
  { path: '/reportes', name: 'Reportes', component: Reportes },
  { path: '/parent-dashboard', name: 'ParentDashboard', component: ParentDashboard },
  { path: '/recuperar-contrasena', name: 'PasswordRecovery', component: PasswordRecoveryView },
  { path: '/foro', name: 'Forum', component: ForumView },
  { path: '/admin-reports', name: 'AdminReports', component: AdminReportsView },
  { path: '/task-details', name: 'TaskDetails', component: TaskDetailsView },
  { path: '/teacher-tasks', name: 'TeacherTasks', component: TeacherTasksView },
  { path: '/calendario', name: 'AcademicCalendar', component: AcademicCalendar },
  { path: '/teacher-performance-reports', name: 'TeacherPerformanceReports', component: TeacherPerformanceReports }, // Nueva ruta
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;