<template>
  <div class="w-full max-w-md mx-auto bg-surface-container rounded-2xl p-space-xl border border-white/[0.08] shadow-2xl flex flex-col gap-space-lg">
    <!-- Header -->
    <div class="flex flex-col gap-1">
      <span class="font-label-caps text-label-caps uppercase text-primary tracking-wider">Acesso Institucional</span>
      <h2 class="font-headline-sm text-headline-sm text-on-surface">Iniciar Sessão</h2>
      <p class="font-body-md text-body-sm text-on-surface-variant">
        Aceda ao seu terminal de licitação fiduciária e gestão de lotes.
      </p>
    </div>

    <form class="flex flex-col gap-space-md" @submit.prevent="handleLogin">
      <!-- Email Field -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Email ou Credencial</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[18px]">mail</span>
          <input
            v-model="email"
            type="text"
            required
            placeholder="exemplo@mozbid.co.mz"
            class="w-full bg-surface-container-low border border-white/[0.08] focus:border-primary rounded-lg pl-12 pr-space-md py-space-sm text-on-surface font-body-md text-body-md focus:outline-none"
          />
        </div>
      </div>

      <!-- Password Field -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Palavra-passe</label>
        </div>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[18px]">lock</span>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••"
            class="w-full bg-surface-container-low border border-white/[0.08] focus:border-primary rounded-lg pl-12 pr-10 py-space-sm text-on-surface font-body-md text-body-md focus:outline-none"
          />
          <button
            type="button"
            class="absolute right-space-md text-on-surface-variant hover:text-on-surface"
            @click="showPassword = !showPassword"
          >
            <span class="material-symbols-outlined text-[18px]">
              {{ showPassword ? 'visibility_off' : 'visibility' }}
            </span>
          </button>
        </div>
      </div>

      <div v-if="errorMessage" class="p-3 rounded-lg bg-error/10 border border-error/20 text-error font-body-sm text-xs">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full py-3 rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-caps text-label-caps uppercase transition-all shadow-xl font-bold flex items-center justify-center gap-space-xs mt-2"
        :disabled="authStore.loading"
      >
        <span class="material-symbols-outlined text-[18px]">login</span>
        <span v-if="authStore.loading">A Autenticar...</span>
        <span v-else>Entrar no MozBid</span>
      </button>

      <!-- Footer Links -->
      <div class="text-center font-body-sm text-xs text-on-surface-variant pt-space-xs">
        <span>Não tem uma conta credenciada?</span>
        <router-link to="/auth/register" class="text-primary hover:underline font-semibold ml-1">
          Registar Agora
        </router-link>
      </div>
    </form>
  </div>
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
    errorMessage.value = err?.response?.data?.error || 'Credenciais inválidas. Verifique o email e palavra-passe.';
  }
}
</script>
