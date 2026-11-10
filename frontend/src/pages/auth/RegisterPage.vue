<template>
  <div class="w-full max-w-[540px] mx-auto bg-white rounded-2xl p-6 sm:p-9 border border-[#E8E3DA] shadow-sm flex flex-col gap-6 text-[#171717]">
    <!-- Institutional Header -->
    <div class="flex flex-col gap-1.5 text-left">
      <div class="flex items-center gap-2">
        <span class="w-1.5 h-1.5 rounded-full bg-[#B69A68]"></span>
        <span class="text-[10px] tracking-[0.22em] text-[#B69A68] uppercase font-bold">
          CREDENCIAÇÃO DE CONTA
        </span>
      </div>
      <h2 class="font-editorial text-2xl sm:text-3xl font-semibold text-[#171717] tracking-tight">
        Criar Conta Oficial
      </h2>
      <p class="text-xs sm:text-sm text-[#777777] leading-relaxed">
        Registe-se para participar nos leilões exclusivos da MozBid com segurança, transparência e liquidação em Meticais (MZN).
      </p>
    </div>

    <!-- Account Type Selector (3 Equal Segments) -->
    <div class="flex flex-col gap-1.5">
      <label class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
        Tipo de Conta
      </label>
      <div class="grid grid-cols-3 gap-1.5 p-1 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl" role="tablist" aria-label="Tipo de Conta">
        <!-- Comprador -->
        <button
          type="button"
          role="tab"
          :aria-selected="roleSelection === 'buyer'"
          class="flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#B69A68]/40"
          :class="roleSelection === 'buyer'
            ? 'bg-[#171717] text-white shadow-xs'
            : 'text-[#777777] hover:text-[#171717] hover:bg-white/70'"
          @click="roleSelection = 'buyer'"
        >
          <UserRound :size="16" :stroke-width="roleSelection === 'buyer' ? 2.2 : 1.8" />
          <span>Comprador</span>
        </button>

        <!-- Vendedor -->
        <button
          type="button"
          role="tab"
          :aria-selected="roleSelection === 'seller_ind'"
          class="flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#B69A68]/40"
          :class="roleSelection === 'seller_ind'
            ? 'bg-[#171717] text-white shadow-xs'
            : 'text-[#777777] hover:text-[#171717] hover:bg-white/70'"
          @click="roleSelection = 'seller_ind'"
        >
          <Store :size="16" :stroke-width="roleSelection === 'seller_ind' ? 2.2 : 1.8" />
          <span>Vendedor</span>
        </button>

        <!-- Empresa -->
        <button
          type="button"
          role="tab"
          :aria-selected="roleSelection === 'seller_corp'"
          class="flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#B69A68]/40"
          :class="roleSelection === 'seller_corp'
            ? 'bg-[#171717] text-white shadow-xs'
            : 'text-[#777777] hover:text-[#171717] hover:bg-white/70'"
          @click="roleSelection = 'seller_corp'"
        >
          <Building2 :size="16" :stroke-width="roleSelection === 'seller_corp' ? 2.2 : 1.8" />
          <span>Empresa</span>
        </button>
      </div>
    </div>

    <!-- Registration Form -->
    <form class="flex flex-col gap-4 text-left" @submit.prevent="handleRegister">
      <!-- Empresa: Denominação Comercial -->
      <div v-if="roleSelection === 'seller_corp'" class="flex flex-col gap-1.5">
        <label for="companyName" class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider flex items-center justify-between">
          <span>Denominação Comercial da Entidade</span>
          <span class="text-[10px] text-[#B69A68] lowercase font-normal">*obrigatório</span>
        </label>
        <div class="relative flex items-center">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777]">
            <Building2 :size="18" :stroke-width="1.8" />
          </div>
          <input
            id="companyName"
            v-model="companyName"
            type="text"
            required
            placeholder="Ex: Cossa & Filhos Logística, S.A."
            class="w-full pl-11 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl text-sm text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white focus:ring-1 focus:ring-[#B69A68] transition-all"
            @blur="touched.companyName = true"
          />
        </div>
        <p v-if="touched.companyName && !companyName.trim()" class="text-xs text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle :size="13" /> A denominação social da empresa é obrigatória.
        </p>
      </div>

      <!-- Nome Completo / Representante Legal -->
      <div class="flex flex-col gap-1.5">
        <label for="fullName" class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider flex items-center justify-between">
          <span>{{ roleSelection === 'seller_corp' ? 'Nome do Representante Legal' : 'Nome Completo' }}</span>
          <span class="text-[10px] text-[#B69A68] lowercase font-normal">*obrigatório</span>
        </label>
        <div class="relative flex items-center">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777]">
            <UserRound :size="18" :stroke-width="1.8" />
          </div>
          <input
            id="fullName"
            v-model="name"
            type="text"
            required
            :placeholder="roleSelection === 'seller_corp' ? 'Ex: Dr. Armando Cossa' : 'Ex: Carlos Alberto Tembe'"
            class="w-full pl-11 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl text-sm text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white focus:ring-1 focus:ring-[#B69A68] transition-all"
            @blur="touched.name = true"
          />
        </div>
        <p v-if="touched.name && !name.trim()" class="text-xs text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle :size="13" /> O nome completo é obrigatório.
        </p>
      </div>

      <!-- NUIT (para Vendedor Individual e Empresa) -->
      <div v-if="roleSelection !== 'buyer'" class="flex flex-col gap-1.5">
        <label for="nuit" class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider flex items-center justify-between">
          <span>NUIT (Número de Identificação Tributária)</span>
          <span class="text-[10px] text-[#777777] font-normal">9 dígitos</span>
        </label>
        <div class="relative flex items-center">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777]">
            <FileText :size="18" :stroke-width="1.8" />
          </div>
          <input
            id="nuit"
            v-model="nuit"
            type="text"
            inputmode="numeric"
            maxlength="9"
            required
            placeholder="Ex: 400192837"
            class="w-full pl-11 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl text-sm font-mono text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white focus:ring-1 focus:ring-[#B69A68] transition-all"
            @input="onNuitInput"
            @blur="touched.nuit = true"
          />
        </div>
        <p v-if="touched.nuit && nuit && nuit.length !== 9" class="text-xs text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle :size="13" /> O NUIT moçambicano deve conter exactamente 9 dígitos.
        </p>
      </div>

      <!-- Endereço de Email -->
      <div class="flex flex-col gap-1.5">
        <label for="email" class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider flex items-center justify-between">
          <span>{{ roleSelection === 'seller_corp' ? 'Email Institucional / Corporativo' : 'Endereço de Email' }}</span>
          <span class="text-[10px] text-[#B69A68] lowercase font-normal">*obrigatório</span>
        </label>
        <div class="relative flex items-center">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777]">
            <Mail :size="18" :stroke-width="1.8" />
          </div>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="seuemail@exemplo.co.mz"
            class="w-full pl-11 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl text-sm font-mono text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white focus:ring-1 focus:ring-[#B69A68] transition-all"
            @blur="touched.email = true"
          />
        </div>
        <p v-if="touched.email && email && !isEmailValid" class="text-xs text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle :size="13" /> Introduza um endereço de email válido.
        </p>
      </div>

      <!-- Telefone de Contacto (+258) com validação e operadora -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <label for="phone" class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
            Telefone Móvel Moçambicano
          </label>
          <span v-if="detectedOperator" class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="operatorBadgeClass">
            {{ detectedOperator }}
          </span>
          <span v-else class="text-[10px] text-[#777777]">M-Pesa / e-Mola / mKesh</span>
        </div>
        <div class="relative flex items-center">
          <!-- Prefixo Fixo Moçambicano -->
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-semibold text-[#171717] gap-1.5 border-r border-[#E8E3DA] pr-2.5 my-1.5">
            <Phone :size="16" class="text-[#777777]" :stroke-width="1.8" />
            <span>+258</span>
          </div>
          <input
            id="phone"
            v-model="rawPhone"
            type="tel"
            inputmode="numeric"
            required
            placeholder="84 123 4567"
            class="w-full pl-[88px] pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl text-sm font-mono text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white focus:ring-1 focus:ring-[#B69A68] transition-all"
            @input="onPhoneInput"
            @blur="touched.phone = true"
          />
        </div>
        <p v-if="touched.phone && rawPhone && !isPhoneValid" class="text-xs text-red-600 flex items-center gap-1 mt-0.5">
          <AlertCircle :size="13" /> Número moçambicano inválido. Deve iniciar por 82, 83, 84, 85, 86 ou 87 e ter 9 dígitos.
        </p>
      </div>

      <!-- Palavra-passe -->
      <div class="flex flex-col gap-1.5">
        <label for="password" class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider flex items-center justify-between">
          <span>Palavra-passe</span>
          <span class="text-[10px] text-[#777777]">Mínimo 8 caracteres</span>
        </label>
        <div class="relative flex items-center">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777]">
            <Lock :size="18" :stroke-width="1.8" />
          </div>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Introduza uma palavra-passe segura"
            class="w-full pl-11 pr-11 py-2.5 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl text-sm text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white focus:ring-1 focus:ring-[#B69A68] transition-all"
            @input="onPasswordInput"
            @blur="touched.password = true"
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

        <!-- Indicador de Força da Palavra-passe -->
        <div v-if="password" class="flex flex-col gap-1 pt-1">
          <div class="flex items-center gap-1.5 h-1.5 w-full">
            <div class="h-full flex-1 rounded-full transition-all duration-300" :class="strengthScore >= 1 ? strengthColorClass : 'bg-gray-200'"></div>
            <div class="h-full flex-1 rounded-full transition-all duration-300" :class="strengthScore >= 2 ? strengthColorClass : 'bg-gray-200'"></div>
            <div class="h-full flex-1 rounded-full transition-all duration-300" :class="strengthScore >= 3 ? strengthColorClass : 'bg-gray-200'"></div>
          </div>
          <div class="flex items-center justify-between text-[10px] text-[#777777]">
            <span>Segurança: <strong :class="strengthTextColorClass">{{ strengthLabel }}</strong></span>
            <span>Use letras, números e símbolos</span>
          </div>
        </div>
      </div>

      <!-- Confirmar Palavra-passe -->
      <div class="flex flex-col gap-1.5">
        <label for="confirmPassword" class="text-[11px] font-semibold text-[#171717] uppercase tracking-wider">
          Confirmar Palavra-passe
        </label>
        <div class="relative flex items-center">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#777777]">
            <Lock :size="18" :stroke-width="1.8" />
          </div>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            placeholder="Repita a palavra-passe"
            class="w-full pl-11 pr-11 py-2.5 bg-[#FAF9F6] border border-[#E8E3DA] rounded-xl text-sm text-[#171717] placeholder:text-[#999999] focus:outline-none focus:border-[#B69A68] focus:bg-white focus:ring-1 focus:ring-[#B69A68] transition-all"
            @blur="touched.confirmPassword = true"
          />
          <button
            type="button"
            aria-label="Alternar visibilidade da confirmação da palavra-passe"
            class="absolute right-3.5 inset-y-0 flex items-center text-[#777777] hover:text-[#171717] transition-colors cursor-pointer"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <EyeOff v-if="showConfirmPassword" :size="18" :stroke-width="1.8" />
            <Eye v-else :size="18" :stroke-width="1.8" />
          </button>
        </div>

        <!-- Feedback de Coincidência -->
        <div v-if="confirmPassword" class="pt-0.5">
          <p v-if="password === confirmPassword" class="text-xs text-emerald-700 flex items-center gap-1">
            <CheckCircle2 :size="13" /> As palavras-passe coincidem perfeitamente.
          </p>
          <p v-else class="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle :size="13" /> As palavras-passe não coincidem.
          </p>
        </div>
      </div>

      <!-- Legal Consent & Checkbox -->
      <div class="flex items-start gap-3 pt-2">
        <div class="flex items-center h-5">
          <input
            id="terms"
            v-model="agreedTerms"
            type="checkbox"
            required
            class="w-4 h-4 rounded border-[#E8E3DA] text-[#B69A68] focus:ring-[#B69A68] cursor-pointer accent-[#B69A68]"
            @change="touched.terms = true"
          />
        </div>
        <label for="terms" class="text-xs text-[#777777] leading-relaxed select-none cursor-pointer">
          Declaro que li e aceito os
          <button
            type="button"
            class="text-[#171717] font-semibold underline hover:text-[#B69A68] cursor-pointer inline"
            @click.stop="openLegalModal('regulations')"
          >
            Regulamentos de Leilão
          </button>,
          as
          <button
            type="button"
            class="text-[#171717] font-semibold underline hover:text-[#B69A68] cursor-pointer inline"
            @click.stop="openLegalModal('verification')"
          >
            Políticas de Verificação de Identidade
          </button>
          e os
          <button
            type="button"
            class="text-[#171717] font-semibold underline hover:text-[#B69A68] cursor-pointer inline"
            @click.stop="openLegalModal('settlement')"
          >
            Procedimentos de Liquidação em Meticais
          </button>.
        </label>
      </div>
      <p v-if="touched.terms && !agreedTerms" class="text-xs text-red-600 flex items-center gap-1 -mt-2">
        <AlertCircle :size="13" /> É obrigatório aceitar os termos e regulamentos para credenciar a sua conta.
      </p>

      <!-- Error Alert Message -->
      <div v-if="errorMessage" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
        <AlertCircle :size="16" class="shrink-0 mt-0.5" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Primary CTA: CONCLUIR CREDENCIAÇÃO -->
      <button
        type="submit"
        :disabled="isSubmitDisabled"
        class="w-full py-3.5 px-6 rounded-xl bg-[#B69A68] hover:bg-[#967B48] active:scale-[0.99] text-[#171717] hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
      >
        <Loader2 v-if="authStore.loading || isSubmitting" :size="18" class="animate-spin text-current" />
        <BadgeCheck v-else :size="18" :stroke-width="2.2" />
        <span>{{ authStore.loading || isSubmitting ? 'A credenciar conta...' : 'CONCLUIR CREDENCIAÇÃO' }}</span>
      </button>

      <!-- Login Alternative -->
      <div class="text-center text-xs text-[#777777] pt-2">
        <span>Já possui uma conta oficial?</span>
        <router-link to="/auth/login" class="text-[#171717] font-semibold underline hover:text-[#B69A68] ml-1">
          Iniciar Sessão
        </router-link>
      </div>
    </form>

    <!-- Modal de Leitura de Documentos Legais -->
    <div
      v-if="activeLegalModal"
      class="fixed inset-0 z-50 bg-[#171717]/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="activeLegalModal = null"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col border border-[#E8E3DA] shadow-2xl text-left">
        <div class="p-5 border-b border-[#E8E3DA] flex items-center justify-between bg-[#FAF9F6]">
          <div class="flex items-center gap-2">
            <ShieldCheck :size="20" class="text-[#B69A68]" />
            <h3 class="font-editorial text-lg font-semibold text-[#171717]">
              {{ legalTitle }}
            </h3>
          </div>
          <button
            type="button"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] hover:text-[#171717] hover:bg-gray-100 cursor-pointer"
            @click="activeLegalModal = null"
          >
            ✕
          </button>
        </div>

        <div class="p-6 overflow-y-auto text-xs sm:text-sm text-[#555555] leading-relaxed space-y-4">
          <p>{{ legalBody }}</p>
          <div class="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E3DA] text-xs text-[#777777]">
            Versão do documento: <strong>v1.2 (Moçambique)</strong> | Válido a partir de Novembro de 2026.
          </div>
        </div>

        <div class="p-4 border-t border-[#E8E3DA] bg-[#FAF9F6] flex justify-end">
          <button
            type="button"
            class="py-2 px-5 bg-[#171717] hover:bg-[#B69A68] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            @click="activeLegalModal = null"
          >
            Compreendido e Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  UserRound,
  Store,
  Building2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeCheck,
  ShieldCheck,
  Loader2
} from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Form State
const roleSelection = ref<'buyer' | 'seller_ind' | 'seller_corp'>('buyer');
const name = ref('');
const companyName = ref('');
const nuit = ref('');
const email = ref('');
const rawPhone = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreedTerms = ref(false);
const errorMessage = ref('');
const isSubmitting = ref(false);

// Touched state for live inline validation
const touched = reactive({
  name: false,
  companyName: false,
  nuit: false,
  email: false,
  phone: false,
  password: false,
  confirmPassword: false,
  terms: false
});

// Modal State
const activeLegalModal = ref<'regulations' | 'verification' | 'settlement' | null>(null);

function openLegalModal(doc: 'regulations' | 'verification' | 'settlement') {
  activeLegalModal.value = doc;
}

const legalTitle = computed(() => {
  switch (activeLegalModal.value) {
    case 'regulations':
      return 'Regulamentos Oficiais de Leilão';
    case 'verification':
      return 'Políticas de Verificação de Identidade (KYC)';
    case 'settlement':
      return 'Procedimentos de Liquidação em Meticais (MZN)';
    default:
      return 'Termos MozBid';
  }
});

const legalBody = computed(() => {
  switch (activeLegalModal.value) {
    case 'regulations':
      return 'Todos os lances registados na plataforma MozBid constituem compromissos vinculativos de aquisição nos termos do Código Comercial de Moçambique. Lances vencedores garantem a titularidade do lote mediante liquidação financeira dentro dos prazos estipulados no catálogo do leilão.';
    case 'verification':
      return 'Para assegurar a idoneidade do marketplace, vendedores e licitadores institucionais devem submeter prova de NUIT válido, documento de identificação (BI, DIRE ou Passaporte) ou Certidão Comercial definitiva emitida pelas autoridades da República de Moçambique.';
    case 'settlement':
      return 'As liquidações são processadas em Meticais (MZN) através de canais bancários autorizados pelo Banco de Moçambique ou serviços de moeda electrónica auditados (M-Pesa, e-Mola, mKesh). Os fundos são retidos sob custódia fiduciária até à libertação e vistoria final do lote.';
    default:
      return '';
  }
});

// Mozambican Phone Formatting & Operator Detection
function onPhoneInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const digits = target.value.replace(/\D/g, '').slice(0, 9);

  // Format as XX XXX XXXX
  if (digits.length <= 2) {
    rawPhone.value = digits;
  } else if (digits.length <= 5) {
    rawPhone.value = `${digits.slice(0, 2)} ${digits.slice(2)}`;
  } else {
    rawPhone.value = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
  }
}

const cleanPhoneDigits = computed(() => rawPhone.value.replace(/\D/g, ''));

const detectedOperator = computed(() => {
  const p = cleanPhoneDigits.value;
  if (p.startsWith('84') || p.startsWith('85')) return 'Vodacom M-Pesa';
  if (p.startsWith('82') || p.startsWith('83')) return 'Tmcel mKesh';
  if (p.startsWith('86') || p.startsWith('87')) return 'Movitel e-Mola';
  return null;
});

const operatorBadgeClass = computed(() => {
  const p = cleanPhoneDigits.value;
  if (p.startsWith('84') || p.startsWith('85')) return 'bg-red-50 text-red-700 border border-red-200';
  if (p.startsWith('82') || p.startsWith('83')) return 'bg-amber-50 text-amber-800 border border-amber-200';
  if (p.startsWith('86') || p.startsWith('87')) return 'bg-orange-50 text-orange-800 border border-orange-200';
  return 'bg-gray-100 text-gray-700';
});

const isPhoneValid = computed(() => {
  const p = cleanPhoneDigits.value;
  if (p.length !== 9) return false;
  return ['82', '83', '84', '85', '86', '87'].some(prefix => p.startsWith(prefix));
});

// NUIT numeric input filter
function onNuitInput(e: Event) {
  const target = e.target as HTMLInputElement;
  nuit.value = target.value.replace(/\D/g, '').slice(0, 9);
}

// Email Validation
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value.trim());
});

// Password Strength
function onPasswordInput() {
  // Real-time calculation triggers computed
}

const strengthScore = computed(() => {
  const pwd = password.value;
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[0-9]/.test(pwd) && /[a-zA-Z]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd) || (/[A-Z]/.test(pwd) && pwd.length >= 10)) score++;
  return score;
});

const strengthLabel = computed(() => {
  switch (strengthScore.value) {
    case 1:
      return 'Fraca';
    case 2:
      return 'Média';
    case 3:
      return 'Forte';
    default:
      return 'Muito Curta';
  }
});

const strengthColorClass = computed(() => {
  switch (strengthScore.value) {
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-amber-500';
    case 3:
      return 'bg-emerald-600';
    default:
      return 'bg-gray-200';
  }
});

const strengthTextColorClass = computed(() => {
  switch (strengthScore.value) {
    case 1:
      return 'text-red-600 font-semibold';
    case 2:
      return 'text-amber-600 font-semibold';
    case 3:
      return 'text-emerald-700 font-semibold';
    default:
      return 'text-gray-500';
  }
});

// Form overall validity
const isSubmitDisabled = computed(() => {
  if (authStore.loading || isSubmitting.value) return true;
  if (!agreedTerms.value) return true;
  if (!name.value.trim()) return true;
  if (!isEmailValid.value) return true;
  if (!isPhoneValid.value) return true;
  if (password.value.length < 8) return true;
  if (password.value !== confirmPassword.value) return true;

  if (roleSelection.value === 'seller_corp') {
    if (!companyName.value.trim()) return true;
    if (nuit.value.length !== 9) return true;
  }

  if (roleSelection.value === 'seller_ind') {
    if (nuit.value.length !== 9) return true;
  }

  return false;
});

// Handle Register Action
async function handleRegister() {
  if (!agreedTerms.value) {
    errorMessage.value = 'É obrigatório aceitar os Regulamentos de Leilão e Termos para prosseguir.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As palavras-passe introduzidas não coincidem.';
    return;
  }

  if (!isPhoneValid.value) {
    errorMessage.value = 'Por favor introduza um número de telefone moçambicano válido (+258 8X XXX XXXX).';
    return;
  }

  errorMessage.value = '';
  isSubmitting.value = true;

  const actualRole = roleSelection.value === 'buyer' ? 'buyer' : 'seller';
  const businessType = roleSelection.value === 'seller_corp' ? 'company' : 'individual';
  const fullPhone = `+258${cleanPhoneDigits.value}`;
  const legalAcceptedTimestamp = new Date().toISOString();

  try {
    const user = await authStore.register({
      name: roleSelection.value === 'seller_corp' ? name.value.trim() : name.value.trim(),
      companyName: roleSelection.value === 'seller_corp' ? companyName.value.trim() : undefined,
      email: email.value.trim().toLowerCase(),
      phone: fullPhone,
      password: password.value,
      role: actualRole,
      businessType: businessType,
      nuit: nuit.value ? nuit.value.trim() : undefined,
      terms_accepted_at: legalAcceptedTimestamp,
      terms_version: 'v1.2'
    });

    if (user.role === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/buyer/dashboard');
    }
  } catch (err: any) {
    errorMessage.value =
      err?.response?.data?.message ||
      err?.message ||
      'Ocorreu um erro ao criar a conta. Por favor verifique os dados introduzidos.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
