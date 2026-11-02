import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

// Quasar Integration
import { Quasar, Notify, Dialog, Loading } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css';
import 'quasar/dist/quasar.css';

// App CSS & Obsidian Reserve Design System
import './css/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading
  },
  config: {
    dark: true,
    brand: {
      primary: '#ffc374',
      secondary: '#ffba43',
      accent: '#f5a000',
      dark: '#131313',
      'dark-page': '#0e0e0e',
      positive: '#22c55e',
      negative: '#ffb4ab',
      info: '#38bdf8',
      warning: '#f59e0b'
    }
  }
});

app.mount('#app');
