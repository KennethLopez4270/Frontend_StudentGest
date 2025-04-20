import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'animate.css';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { Chart as ChartJS, registerables } from 'chart.js'
ChartJS.register(...registerables)

import Swal from 'sweetalert2'

// Para colores y más >^. .^<
import './assets/themes/light-theme.css'; // Tema predeterminado

const app = createApp(App);
app.use(router);
app.mount('#app');