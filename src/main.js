//src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'animate.css';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { initializeSessionTimeout, validateSessionOnLoad } from './utils/sessionManager'

import { Chart as ChartJS, registerables } from 'chart.js'
ChartJS.register(...registerables)

// Para colores y más >^. .^<
import './assets/themes/landing-theme.css'; // Tema para landing page 
import './assets/themes/tendant-theme.css';

const app = createApp(App);
app.use(router);
if (validateSessionOnLoad()) {
    initializeSessionTimeout()
  }
app.mount('#app');