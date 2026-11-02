<template>
  <div class="w-full max-w-lg mx-auto bg-surface-container rounded-2xl p-space-xl border border-white/[0.08] shadow-2xl flex flex-col gap-space-lg">
    <!-- Header -->
    <div class="flex flex-col gap-1">
      <span class="font-label-caps text-label-caps uppercase text-primary tracking-wider">Credenciação de Conta</span>
      <h2 class="font-headline-sm text-headline-sm text-on-surface">Criar Conta Oficial</h2>
      <p class="font-body-md text-body-sm text-on-surface-variant">
        Registe-se para participar nos leilões exclusivos do MozBid com garantia fiduciária.
      </p>
    </div>

    <!-- Account Role Tabs -->
    <div class="grid grid-cols-3 gap-1 p-1 rounded-xl bg-surface-container-low border border-white/[0.06]">
      <button
        type="button"
        class="py-2 rounded-lg font-label-caps text-[11px] transition-all text-center flex items-center justify-center gap-1"
        :class="roleSelection === 'buyer' ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'"
        @click="roleSelection = 'buyer'"
      >
        <span class="material-symbols-outlined text-[16px]">person</span>
        <span>Comprador</span>
      </button>
      <button
        type="button"
        class="py-2 rounded-lg font-label-caps text-[11px] transition-all text-center flex items-center justify-center gap-1"
        :class="roleSelection === 'seller_ind' ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'"
        @click="roleSelection = 'seller_ind'"
      >
        <span class="material-symbols-outlined text-[16px]">storefront</span>
        <span>Vendedor</span>
      </button>
      <button
        type="button"
        class="py-2 rounded-lg font-label-caps text-[11px] transition-all text-center flex items-center justify-center gap-1"
        :class="roleSelection === 'seller_corp' ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:text-on-surface'"
        @click="roleSelection = 'seller_corp'"
      >
        <span class="material-symbols-outlined text-[16px]">domain</span>
        <span>Empresa</span>
      </button>
    </div>

    <form class="flex flex-col gap-space-md" @submit.prevent="handleRegister">
      <!-- Full Name -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">
          {{ roleSelection === 'seller_corp' ? 'Nome do Representante Legal' : 'Nome Completo' }}
        </label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[18px]">person</span>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Ex: Carlos Alberto Tembe"
            class="w-full bg-surface-container-low border border-white/[0.08] focus:border-primary rounded-lg pl-12 pr-space-md py-space-sm text-on-surface font-body-md text-body-md focus:outline-none"
          />
        </div>
      </div>

      <!-- Company Name (if corporate) -->
      <div v-if="roleSelection === 'seller_corp'" class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Denominação Comercial da Empresa</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[18px]">domain</span>
          <input
            v-model="companyName"
            type="text"
            required
            placeholder="Ex: MozEquipamentos & Logística Lda"
            class="w-full bg-surface-container-low border border-white/[0.08] focus:border-primary rounded-lg pl-12 pr-space-md py-space-sm text-on-surface font-body-md text-body-md focus:outline-none"
          />
        </div>
      </div>

      <!-- NUIT -->
      <div v-if="roleSelection !== 'buyer'" class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">NUIT (Número de Identificação Tributária)</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[18px]">badge</span>
          <input
            v-model="nuit"
            type="text"
            required
            placeholder="Ex: 400192837"
            class="w-full bg-surface-container-low border border-white/[0.08] focus:border-primary rounded-lg pl-12 pr-space-md py-space-sm text-on-surface font-body-md text-body-md focus:outline-none font-mono"
          />
        </div>
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Endereço de Email</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[18px]">mail</span>
          <input
            v-model="email"
            type="email"
            required
            placeholder="seuemail@exemplo.co.mz"
            class="w-full bg-surface-container-low border border-white/[0.08] focus:border-primary rounded-lg pl-12 pr-space-md py-space-sm text-on-surface font-body-md text-body-md focus:outline-none"
          />
        </div>
      </div>

      <!-- Phone -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Telefone de Contacto / M-Pesa (+258)</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[18px]">phone</span>
          <input
            v-model="phone"
            type="tel"
            required
            placeholder="+258 84 123 4567"
            class="w-full bg-surface-container-low border border-white/[0.08] focus:border-primary rounded-lg pl-12 pr-space-md py-space-sm text-on-surface font-body-md text-body-md focus:outline-none font-mono"
          />
        </div>
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Palavra-passe Segura</label>
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[18px]">lock</span>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Mínimo 8 caracteres"
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

      <!-- Terms Checkbox -->
      <label class="flex items-start gap-2 cursor-pointer pt-1">
        <input
          v-model="agreedTerms"
          type="checkbox"
          required
          class="mt-1 rounded bg-surface-container-low border-white/[0.1] text-primary focus:ring-primary"
        />
        <span class="font-body-sm text-xs text-on-surface-variant">
          Declaro que li e aceito os <router-link to="/how-it-works" class="text-primary hover:underline">Regulamentos de Leilão</router-link>, Termos de Custódia em Escrow e Políticas de Prevenção ao Branqueamento de Capitais.
        </span>
      </label>

      <div v-if="errorMessage" class="p-3 rounded-lg bg-error/10 border border-error/20 text-error font-body-sm text-xs">
        {{ errorMessage }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full py-3 rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-caps text-label-caps uppercase transition-all shadow-xl font-bold flex items-center justify-center gap-space-xs mt-2"
        :disabled="authStore.loading"
      >
        <span class="material-symbols-outlined text-[18px]">how_to_reg</span>
        <span v-if="authStore.loading">A Criar Registo...</span>
        <span v-else>Concluir Credenciação</span>
      </button>

      <!-- Footer Links -->
      <div class="text-center font-body-sm text-xs text-on-surface-variant pt-space-xs">
        <span>Já possui uma conta oficial?</span>
        <router-link to="/auth/login" class="text-primary hover:underline font-semibold ml-1">
          Iniciar Sessão
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const roleSelection = ref<'buyer' | 'seller_ind' | 'seller_corp'>('buyer');
const name = ref('');
const companyName = ref('');
const nuit = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const showPassword = ref(false);
const agreedTerms = ref(false);
const errorMessage = ref('');

async function handleRegister() {
  if (!agreedTerms.value) {
    errorMessage.value = 'Por favor, aceite os termos e regulamentos de leilão para prosseguir.';
    return;
  }

  errorMessage.value = '';
  const actualRole = roleSelection.value === 'buyer' ? 'buyer' : 'seller';
  const displayName = roleSelection.value === 'seller_corp' ? companyName.value : name.value;

  try {
    const user = await authStore.register({
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      role: actualRole,
      seller_type: roleSelection.value === 'seller_corp' ? 'corporate' : (roleSelection.value === 'seller_ind' ? 'individual' : undefined),
      company_name: roleSelection.value === 'seller_corp' ? companyName.value : undefined,
      display_name: displayName,
      nuit: nuit.value || undefined
    });

    if (user.role === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/buyer/dashboard');
    }
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.error || 'Erro ao criar conta. Verifique os dados introduzidos.';
  }
}
</script>
