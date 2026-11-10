<template>
  <div class="w-full max-w-lg mx-auto bg-white rounded-2xl p-6 sm:p-10 border border-[#E7E3DC] shadow-lg flex flex-col gap-5 text-[#171717]">
    <!-- Header -->
    <div class="flex flex-col gap-1.5">
      <span class="text-[10px] tracking-[0.25em] text-[#B69A68] uppercase font-bold">
        CREDENCIAÇÃO DE CONTA
      </span>
      <h2 class="font-editorial text-2xl sm:text-3xl font-semibold text-[#171717] tracking-tight">
        Criar Conta Oficial
      </h2>
      <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
        Registe-se para participar nos leilões exclusivos do MozBid com garantia fiduciária e liquidação em Meticais (MZN).
      </p>
    </div>

    <!-- Account Role Toggle -->
    <div class="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
      <button
        type="button"
        class="py-2 px-1 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        :class="roleSelection === 'buyer' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#666666] hover:text-[#171717]'"
        @click="roleSelection = 'buyer'"
      >
        <span class="material-symbols-outlined text-[16px]">person</span>
        <span>Comprador</span>
      </button>

      <button
        type="button"
        class="py-2 px-1 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        :class="roleSelection === 'seller_ind' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#666666] hover:text-[#171717]'"
        @click="roleSelection = 'seller_ind'"
      >
        <span class="material-symbols-outlined text-[16px]">storefront</span>
        <span>Vendedor</span>
      </button>

      <button
        type="button"
        class="py-2 px-1 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        :class="roleSelection === 'seller_corp' ? 'bg-[#171717] text-white shadow-xs' : 'text-[#666666] hover:text-[#171717]'"
        @click="roleSelection = 'seller_corp'"
      >
        <span class="material-symbols-outlined text-[16px]">domain</span>
        <span>Empresa</span>
      </button>
    </div>

    <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
      <!-- Full Name -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
          {{ roleSelection === 'seller_corp' ? 'Nome do Representante Legal' : 'Nome Completo' }}
        </label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] text-[20px]">person</span>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Ex: Carlos Alberto Tembe"
            class="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-sm text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <!-- Company Name (if corporate) -->
      <div v-if="roleSelection === 'seller_corp'" class="flex flex-col gap-1.5">
        <label class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
          Denominação Comercial da Empresa
        </label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] text-[20px]">domain</span>
          <input
            v-model="companyName"
            type="text"
            required
            placeholder="Ex: MozEquipamentos & Logística Lda"
            class="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-sm text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <!-- NUIT (if seller) -->
      <div v-if="roleSelection !== 'buyer'" class="flex flex-col gap-1.5">
        <label class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
          NUIT (Número de Identificação Tributária)
        </label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] text-[20px]">badge</span>
          <input
            v-model="nuit"
            type="text"
            required
            placeholder="Ex: 400192837"
            class="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-sm font-mono text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <!-- Email Address -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
          Endereço de Email
        </label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] text-[20px]">mail</span>
          <input
            v-model="email"
            type="email"
            required
            placeholder="seuemail@exemplo.co.mz"
            class="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-sm font-mono text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <!-- Phone Number -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
          Telefone de Contacto / M-Pesa (+258)
        </label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] text-[20px]">phone</span>
          <input
            v-model="phone"
            type="tel"
            required
            placeholder="+258 84 123 4567"
            class="w-full pl-11 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-sm font-mono text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
          Palavra-passe Segura
        </label>
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888] text-[20px]">lock</span>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Mínimo 8 caracteres"
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

      <!-- Terms Checkbox -->
      <div class="flex items-start gap-2 pt-1">
        <input
          id="terms"
          v-model="agreedTerms"
          type="checkbox"
          class="mt-1 w-4 h-4 rounded border-[#E7E3DC] text-[#B69A68] focus:ring-[#B69A68] cursor-pointer"
        />
        <label for="terms" class="text-xs text-[#666666] leading-relaxed cursor-pointer select-none">
          Declaro que li e aceito o
          <router-link to="/how-it-works" class="text-[#171717] font-semibold underline hover:text-[#B69A68]">
            Regulamento de Leilões
          </router-link>,
          as Políticas de Verificação de Identidade e os Procedimentos de Liquidação em Meticais.
        </label>
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
        <span class="material-symbols-outlined text-[18px]">how_to_reg</span>
        <span>{{ authStore.loading ? 'A credenciar conta...' : 'Concluir Credenciação' }}</span>
      </button>

      <!-- Footer Link -->
      <div class="text-center text-xs text-[#666666] pt-1">
        <span>Já possui uma conta oficial?</span>
        <router-link to="/auth/login" class="text-[#171717] font-semibold underline hover:text-[#B69A68] ml-1 no-underline">
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
    errorMessage.value = 'Por favor, confirme a aceitação do regulamento de leilões para prosseguir.';
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
    errorMessage.value = err?.response?.data?.error || err?.response?.data?.message || 'Erro ao criar conta. Verifique os dados introduzidos.';
  }
}
</script>
