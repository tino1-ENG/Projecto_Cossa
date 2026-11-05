<template>
  <footer class="w-full bg-[#0a0a0a] border-t border-white/[0.08] pt-8 sm:pt-12 pb-6 sm:pb-8 mt-12 sm:mt-16">
    <div class="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Top 3 Credential Badges -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pb-8 border-b border-white/[0.08]">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-white/[0.08] text-primary shrink-0">
            <span class="material-symbols-outlined">verified_user</span>
          </div>
          <div>
            <p class="font-bold text-sm text-white">Vendedores Moçambicanos Verificados</p>
            <p class="text-xs text-on-surface-variant">Rigorosa triagem e proveniência notarial de activos</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-white/[0.08] text-primary shrink-0">
            <span class="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <p class="font-bold text-sm text-white">Protecção de Licitação em Escrow</p>
            <p class="text-xs text-on-surface-variant">Custódia institucional de depósitos garantida em Meticais</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center border border-white/[0.08] text-primary shrink-0">
            <span class="material-symbols-outlined">handshake</span>
          </div>
          <div>
            <p class="font-bold text-sm text-white">Parceiro Industrial CCM</p>
            <p class="text-xs text-on-surface-variant">Afiliado à Câmara de Comércio de Moçambique</p>
          </div>
        </div>
      </div>

      <!-- 5-Column Navigation Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-8">
        <!-- Col 1: MozBid Bolsa Privada + VIP newsletter -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="text-xl uppercase tracking-wider text-primary font-bold font-display">MozBid</span>
            <span class="text-xs uppercase text-on-surface-variant/70 font-mono">Bolsa Privada</span>
          </div>
          <p class="text-xs text-on-surface-variant max-w-sm leading-relaxed">
            A principal plataforma institucional de leilões para veículos de luxo, maquinaria pesada e activos raros na África Austral.
          </p>
          <div class="flex flex-col gap-2 mt-2">
            <span class="text-xs uppercase font-bold text-on-surface-variant">Lançamento de Catálogo VIP</span>
            <form @submit.prevent="subscribeNewsletter" class="flex gap-2 max-w-sm">
              <q-input
                v-model="emailInput"
                dark
                filled
                dense
                color="primary"
                placeholder="Email institucional..."
                type="email"
                class="flex-1"
              />
              <q-btn
                unelevated
                no-caps
                color="primary"
                text-color="dark"
                type="submit"
                :label="subscribed ? 'Subscrito!' : 'Subscrever'"
                class="font-bold text-xs px-4 rounded-lg"
              />
            </form>
          </div>
        </div>

        <!-- Col 2: Diretório de Ativos -->
        <div class="flex flex-col gap-2">
          <span class="text-xs uppercase font-bold text-primary">Directório de Activos</span>
          <ul class="flex flex-col gap-1.5 text-xs text-on-surface-variant">
            <li class="hover:text-primary transition-colors"><router-link to="/catalog?category=automoveis-motos">Automóveis & Coleccionáveis</router-link></li>
            <li class="hover:text-primary transition-colors"><router-link to="/catalog?category=imobiliario-terrenos">Imobiliário & Lotes Comerciais</router-link></li>
            <li class="hover:text-primary transition-colors"><router-link to="/catalog?category=relogios-joias">Relojoaria & Alta Joalharia</router-link></li>
            <li class="hover:text-primary transition-colors"><router-link to="/catalog?category=maquinas-industriais">Equipamento Industrial Pesado</router-link></li>
            <li class="hover:text-primary transition-colors"><router-link to="/catalog?category=tecnologia-computadores">Tecnologia & Servidores</router-link></li>
          </ul>
        </div>

        <!-- Col 3: Institucional -->
        <div class="flex flex-col gap-2">
          <span class="text-xs uppercase font-bold text-primary">Institucional</span>
          <ul class="flex flex-col gap-1.5 text-xs text-on-surface-variant">
            <li class="hover:text-primary transition-colors"><router-link to="/how-it-works">Mesa de Gestão de Património</router-link></li>
            <li class="hover:text-primary transition-colors"><router-link to="/seller/dashboard">Avaliação de Consignação</router-link></li>
            <li class="hover:text-primary transition-colors"><router-link to="/how-it-works">Escrow & Conformidade</router-link></li>
            <li class="hover:text-primary transition-colors"><router-link to="/how-it-works">Regulamentos de Leilão</router-link></li>
            <li class="hover:text-primary transition-colors"><router-link to="/how-it-works">Tabela de Comissões</router-link></li>
          </ul>
        </div>

        <!-- Col 4: Escritório de Maputo -->
        <div class="flex flex-col gap-2">
          <span class="text-xs uppercase font-bold text-primary">Escritório de Maputo</span>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Avenida Julius Nyerere, Polana Cimento<br/>Maputo, Moçambique
          </p>
          <p class="text-xs text-on-surface-variant mt-1">
            desk@mozbid.co.mz<br/>+258 (21) 490-000
          </p>
          <div class="flex items-center gap-1.5 mt-2 flex-wrap">
            <q-badge color="positive" text-color="dark" class="font-mono text-[10px] font-bold px-2 py-0.5">M-PESA / E-MOLA</q-badge>
            <q-badge color="primary" text-color="dark" class="font-mono text-[10px] font-bold px-2 py-0.5">BCI / BIM / SB</q-badge>
          </div>
        </div>
      </div>

      <!-- Bottom Line -->
      <div class="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
        <p>© {{ new Date().getFullYear() }} MozBid Leilões Lda. Licenciado pelo Ministério da Economia e Finanças de Moçambique.</p>
        <div class="flex items-center gap-4">
          <router-link to="/how-it-works" class="hover:text-primary transition-colors">Termos do Leilão</router-link>
          <router-link to="/how-it-works" class="hover:text-primary transition-colors">Política de Privacidade</router-link>
          <router-link to="/how-it-works" class="hover:text-primary transition-colors">Prevenção de Branqueamento de Capitais</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emailInput = ref('');
const subscribed = ref(false);

function subscribeNewsletter() {
  if (!emailInput.value) return;
  subscribed.value = true;
  setTimeout(() => {
    emailInput.value = '';
    subscribed.value = false;
  }, 3500);
}
</script>
