import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'animate.css';
import 'font-awesome/css/font-awesome.min.css';

const app = createApp(App);
app.use(router);
app.mount('#app');