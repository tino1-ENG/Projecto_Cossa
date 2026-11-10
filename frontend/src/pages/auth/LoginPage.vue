<template>
  <div class="w-full max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-[#E7E3DC] shadow-lg flex flex-col gap-5 text-[#171717]">
    <!-- Header -->
    <div class="flex flex-col gap-1.5">
      <span class="text-[10px] tracking-[0.25em] text-[#B69A68] uppercase font-bold">
        ACESSO INSTITUCIONAL
      </span>
      <h2 class="font-editorial text-2xl sm:text-3xl font-semibold text-[#171717] tracking-tight">
        Iniciar Sessão
      </h2>
      <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
        Aceda ao seu terminal de licitação fiduciária e gestão de lotes no MozBid.
      </p>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
      <!-- Email Field -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
          Email de Acesso
        </label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] text-[20px]">mail</span>
          <input
            v-model="email"
            type="email"
            required
            placeholder="exemplo@mozbid.co.mz"
            class="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-sm font-mono text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <!-- Password Field -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <label class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
            Palavra-passe
          </label>
        </div>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] text-[20px]">lock</span>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••"
            class="w-full pl-11 pr-11 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-sm text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white transition-colors"
          />
          <button
            type="button"
            class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#171717] transition-colors cursor-pointer"
            @click="showPassword = !showPassword"
          >
            <span class="material-symbols-outlined text-[20px]">
              {{ showPassword ? 'visibility_off' : 'visibility' }}
            </span>
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="authStore.loading"
        class="w-full py-3 rounded-lg bg-[#171717] text-white hover:bg-[#B69A68] disabled:opacity-50 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-1"
      >
        <span class="material-symbols-outlined text-[18px]">login</span>
        <span>{{ authStore.loading ? 'A autenticar...' : 'Entrar no MozBid' }}</span>
      </button>

      <!-- Footer Links -->
      <div class="text-center text-xs text-[#666666] pt-1">
        <span>Não tem uma conta credenciada?</span>
        <router-link to="/auth/register" class="text-[#171717] font-semibold underline hover:text-[#B69A68] ml-1 no-underline">
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
    errorMessage.value = err?.response?.data?.message || err?.response?.data?.error || 'Credenciais inválidas. Verifique o email e palavra-passe.';
  }
}
</script>
