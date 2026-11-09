<template>
  <q-card class="w-full max-w-md mx-auto bg-surface-container rounded-xl sm:rounded-2xl p-4 sm:p-space-xl border border-white/[0.08] shadow-2xl flex flex-col gap-3 sm:gap-space-lg text-white" flat>
    <!-- Header -->
    <div class="flex flex-col gap-1">
      <span class="font-label-caps text-label-caps uppercase text-primary tracking-wider font-bold text-xs">Acesso Institucional</span>
      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold text-xl">Iniciar Sessão</h2>
      <p class="font-body-md text-body-sm text-on-surface-variant text-xs">
        Aceda ao seu terminal de licitação fiduciária e gestão de lotes.
      </p>
    </div>

    <form class="flex flex-col gap-space-md" @submit.prevent="handleLogin">
      <!-- Email Field via Quasar QInput -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Email Institucional</label>
        <q-input
          v-model="email"
          dark
          filled
          dense
          color="primary"
          type="email"
          required
          placeholder="exemplo@mozbid.co.mz"
          class="text-white font-mono"
        >
          <template v-slot:prepend>
            <q-icon name="mail" color="primary" />
          </template>
        </q-input>
      </div>

      <!-- Password Field via Quasar QInput -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Palavra-passe</label>
        <q-input
          v-model="password"
          dark
          filled
          dense
          color="primary"
          :type="showPassword ? 'text' : 'password'"
          required
          placeholder="••••••••"
          class="text-white"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="primary" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </div>

      <div v-if="errorMessage" class="p-3 rounded-lg bg-error/10 border border-error/20 text-error font-body-sm text-xs">
        {{ errorMessage }}
      </div>

      <!-- Submit Button via Quasar QBtn -->
      <q-btn
        type="submit"
        unelevated
        no-caps
        color="primary"
        text-color="dark"
        icon="login"
        :loading="authStore.loading"
        :disabled="authStore.loading"
        label="Entrar no MozBid"
        class="w-full py-2.5 rounded-lg font-bold text-xs uppercase shadow-xl mt-2 shimmer-gold active-press"
      />

      <!-- Footer Links -->
      <div class="text-center font-body-sm text-xs text-on-surface-variant pt-space-xs">
        <span>Não tem uma conta credenciada?</span>
        <router-link to="/auth/register" class="text-primary hover:underline font-bold ml-1 no-underline">
          Registar Agora
        </router-link>
      </div>
    </form>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useNotificationStore } from '../../stores/notification';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  errorMessage.value = '';
  try {
    const user = await authStore.login(email.value, password.value);
    await notificationStore.fetchNotifications();

    const redirect = (route.query.redirect as string) || '';
    if (redirect) {
      router.push(redirect);
    } else if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (user.role === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/buyer/dashboard');
    }
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message || err?.response?.data?.error || 'Credenciais inválidas. Verifique o email e palavra-passe.';
  }
}
</script>
