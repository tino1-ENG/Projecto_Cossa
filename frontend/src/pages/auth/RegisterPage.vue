<template>
  <q-card class="w-full max-w-lg mx-auto bg-surface-container rounded-2xl p-space-xl border border-white/[0.08] shadow-2xl flex flex-col gap-space-lg text-white" flat>
    <!-- Header -->
    <div class="flex flex-col gap-1">
      <span class="font-label-caps text-label-caps uppercase text-primary tracking-wider font-bold text-xs">Credenciação de Conta</span>
      <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold text-xl">Criar Conta Oficial</h2>
      <p class="font-body-md text-body-sm text-on-surface-variant text-xs">
        Registe-se para participar nos leilões exclusivos do MozBid com garantia fiduciária.
      </p>
    </div>

    <!-- Account Role Toggle via Quasar QBtnToggle -->
    <q-btn-toggle
      v-model="roleSelection"
      spread
      no-caps
      rounded
      unelevated
      toggle-color="primary"
      toggle-text-color="dark"
      color="surface-container-low"
      text-color="grey-5"
      class="border border-white/[0.08] p-1 font-bold text-xs"
      :options="[
        { label: 'Comprador', value: 'buyer', icon: 'person' },
        { label: 'Vendedor', value: 'seller_ind', icon: 'storefront' },
        { label: 'Empresa', value: 'seller_corp', icon: 'domain' }
      ]"
    />

    <form class="flex flex-col gap-space-md" @submit.prevent="handleRegister">
      <!-- Full Name via Quasar QInput -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
          {{ roleSelection === 'seller_corp' ? 'Nome do Representante Legal' : 'Nome Completo' }}
        </label>
        <q-input
          v-model="name"
          dark
          filled
          dense
          color="primary"
          required
          placeholder="Ex: Carlos Alberto Tembe"
          class="text-white"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="primary" />
          </template>
        </q-input>
      </div>

      <!-- Company Name (if corporate) -->
      <div v-if="roleSelection === 'seller_corp'" class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Denominação Comercial da Empresa</label>
        <q-input
          v-model="companyName"
          dark
          filled
          dense
          color="primary"
          required
          placeholder="Ex: MozEquipamentos & Logística Lda"
          class="text-white"
        >
          <template v-slot:prepend>
            <q-icon name="domain" color="primary" />
          </template>
        </q-input>
      </div>

      <!-- NUIT -->
      <div v-if="roleSelection !== 'buyer'" class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">NUIT (Número de Identificação Tributária)</label>
        <q-input
          v-model="nuit"
          dark
          filled
          dense
          color="primary"
          required
          placeholder="Ex: 400192837"
          class="text-white font-mono"
        >
          <template v-slot:prepend>
            <q-icon name="badge" color="primary" />
          </template>
        </q-input>
      </div>

      <!-- Email -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Endereço de Email</label>
        <q-input
          v-model="email"
          dark
          filled
          dense
          color="primary"
          type="email"
          required
          placeholder="seuemail@exemplo.co.mz"
          class="text-white font-mono"
        >
          <template v-slot:prepend>
            <q-icon name="mail" color="primary" />
          </template>
        </q-input>
      </div>

      <!-- Phone -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Telefone de Contacto / M-Pesa (+258)</label>
        <q-input
          v-model="phone"
          dark
          filled
          dense
          color="primary"
          type="tel"
          required
          placeholder="+258 84 123 4567"
          class="text-white font-mono"
        >
          <template v-slot:prepend>
            <q-icon name="phone" color="primary" />
          </template>
        </q-input>
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-1">
        <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Palavra-passe Segura</label>
        <q-input
          v-model="password"
          dark
          filled
          dense
          color="primary"
          :type="showPassword ? 'text' : 'password'"
          required
          placeholder="Mínimo 8 caracteres"
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

      <!-- Terms Checkbox via Quasar QCheckbox -->
      <q-checkbox
        v-model="agreedTerms"
        dark
        color="primary"
        class="text-xs text-on-surface-variant pt-1"
      >
        <span>
          Declaro que li e aceito os <router-link to="/how-it-works" class="text-primary hover:underline">Regulamentos de Leilão</router-link>, Termos de Custódia em Escrow e Políticas AML.
        </span>
      </q-checkbox>

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
        icon="how_to_reg"
        :loading="authStore.loading"
        :disabled="authStore.loading"
        label="Concluir Credenciação"
        class="w-full py-2.5 rounded-lg font-bold text-xs uppercase shadow-xl mt-2 shimmer-gold active-press"
      />

      <!-- Footer Links -->
      <div class="text-center font-body-sm text-xs text-on-surface-variant pt-space-xs">
        <span>Já possui uma conta oficial?</span>
        <router-link to="/auth/login" class="text-primary hover:underline font-bold ml-1 no-underline">
          Iniciar Sessão
        </router-link>
      </div>
    </form>
  </q-card>
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
    errorMessage.value = err?.response?.data?.error || err?.response?.data?.message || 'Erro ao criar conta. Verifique os dados introduzidos.';
  }
}
</script>
