<template>
  <div class="w-full max-w-[460px] mx-auto bg-white rounded-2xl p-6 sm:p-9 border border-[#E8E3DA] shadow-sm flex flex-col gap-6 text-[#171717]">
    <!-- Institutional Header -->
    <div class="flex flex-col gap-1.5 text-left">
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-[#B69A68]"></span>
        <span class="text-[10px] tracking-[0.22em] text-[#B69A68] uppercase font-bold">
          ACESSO INSTITUCIONAL
        </span>
      </div>
      <h2 class="font-editorial text-2xl sm:text-3xl font-semibold text-[#171717] tracking-tight">
        Iniciar Sessão
      </h2>
      <p class="text-xs sm:text-sm text-[#777777] leading-relaxed">
        Aceda ao seu terminal de licitação fiduciária e gestão de lotes no MozBid.
      </p>
    </div>

    <!-- Login Form -->
    <form class="flex flex-col gap-4 text-left" @submit.prevent="handleLogin">
      <!-- Email Field -->
      <div class="flex flex-col gap-1.5">
        <label for="loginEmail" class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
          Email de Acesso
        </label>
        <div class="relative flex items-center">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777]">
            <Mail :size="18" :stroke-width="1.8" />
          </div>
          <input
            id="loginEmail"
            v-model="email"
            type="email"
            required
            placeholder="exemplo@mozbid.co.mz"
            class="w-full pl-11 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl text-sm font-mono text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white focus:ring-1 focus:ring-[#B69A68] transition-all"
          />
        </div>
      </div>

      <!-- Password Field -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <label for="loginPassword" class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
            Palavra-passe
          </label>
        </div>
        <div class="relative flex items-center">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777]">
            <Lock :size="18" :stroke-width="1.8" />
          </div>
          <input
            id="loginPassword"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="••••••••"
            class="w-full pl-11 pr-11 py-2.5 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl text-sm text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white focus:ring-1 focus:ring-[#B69A68] transition-all"
          />
          <button
            type="button"
            aria-label="Alternar visibilidade da palavra-passe"
            class="absolute right-3.5 inset-y-0 flex items-center text-[#777777] hover:text-[#171717] transition-colors cursor-pointer"
            @click="showPassword = !showPassword"
          >
            <EyeOff v-if="showPassword" :size="18" :stroke-width="1.8" />
            <Eye v-else :size="18" :stroke-width="1.8" />
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
        <AlertCircle :size="16" class="shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="authStore.loading || isSubmitting"
        class="w-full py-3.5 px-6 rounded-xl bg-[#171717] hover:bg-[#B69A68] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        <Loader2 v-if="authStore.loading || isSubmitting" :size="18" class="animate-spin text-current" />
        <LogIn v-else :size="18" :stroke-width="2.2" />
        <span>{{ authStore.loading || isSubmitting ? 'A autenticar...' : 'ENTRAR NO MOZBID' }}</span>
      </button>

      <!-- Footer Links -->
      <div class="text-center text-xs text-[#777777] pt-2">
        <span>Não tem uma conta credenciada?</span>
        <router-link to="/auth/register" class="text-[#171717] font-semibold underline hover:text-[#B69A68] ml-1">
          Registar Agora
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-vue-next';
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
const isSubmitting = ref(false);

async function handleLogin() {
  errorMessage.value = '';
  isSubmitting.value = true;
  try {
    const user = await authStore.login(email.value.trim().toLowerCase(), password.value);
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
    errorMessage.value =
      err?.response?.data?.message ||
      err?.message ||
      'Credenciais inválidas. Verifique o email e palavra-passe.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
