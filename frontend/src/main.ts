import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

// Quasar Integration
import { Quasar, Notify, Dialog, Loading } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css';
import 'quasar/dist/quasar.css';

// App CSS & Editorial Luxury Design System
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
    dark: false,
    brand: {
      primary: '#B69A68',
      secondary: '#967B48',
      accent: '#B69A68',
      dark: '#171717',
      'dark-page': '#171717',
      positive: '#10b981',
      negative: '#ef4444',
      info: '#3b82f6',
      warning: '#f59e0b'
    }
  }
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[MozBid PWA] Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[MozBid PWA] Service Worker registration failed:', err);
      });
  });
}

app.mount('#app');
