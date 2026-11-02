<template>
  <footer class="w-full bg-[#0a0a0a] border-t border-white/[0.08] pt-space-2xl pb-space-xl mt-space-3xl">
    <div class="w-full max-w-[1440px] mx-auto px-margin">
      <!-- Top 3 Credential Badges -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter pb-space-xl border-b border-white/[0.08]">
        <div class="flex items-center gap-space-md">
          <div class="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center border border-white/[0.08] text-primary">
            <span class="material-symbols-outlined">verified_user</span>
          </div>
          <div>
            <p class="font-title-md text-title-md text-on-surface">Vendedores Moçambicanos Verificados</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Rigorosa triagem e proveniência notarial de ativos</p>
          </div>
        </div>
        <div class="flex items-center gap-space-md">
          <div class="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center border border-white/[0.08] text-primary">
            <span class="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <p class="font-title-md text-title-md text-on-surface">Proteção de Licitação em Escrow</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Custódia institucional de depósitos garantida em Meticais</p>
          </div>
        </div>
        <div class="flex items-center gap-space-md">
          <div class="w-10 h-10 rounded bg-surface-container-low flex items-center justify-center border border-white/[0.08] text-primary">
            <span class="material-symbols-outlined">handshake</span>
          </div>
          <div>
            <p class="font-title-md text-title-md text-on-surface">Parceiro Industrial CCM</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant">Afiliado à Câmara de Comércio de Moçambique</p>
          </div>
        </div>
      </div>

      <!-- 5-Column Navigation Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter py-space-xl">
        <!-- Col 1: MozBid Bolsa Privada + VIP newsletter -->
        <div class="lg:col-span-2 flex flex-col gap-space-md">
          <div class="flex items-center gap-space-sm">
            <span class="font-headline-sm text-headline-sm uppercase tracking-wider text-primary font-bold">MozBid</span>
            <span class="font-label-caps text-label-caps uppercase text-on-surface-variant/70">Bolsa Privada</span>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant max-w-sm">
            A principal plataforma institucional de leilões para veículos de luxo, maquinaria pesada e ativos raros na África Austral.
          </p>
          <div class="flex flex-col gap-space-xs mt-space-sm">
            <span class="font-label-caps text-label-caps uppercase text-on-surface-variant">Lançamento de Catálogo VIP</span>
            <form @submit.prevent="subscribeNewsletter" class="flex gap-space-xs max-w-sm">
              <input
                v-model="emailInput"
                class="flex-1 bg-surface-container-low border border-white/[0.08] px-space-md py-space-xs rounded text-on-surface placeholder:text-on-surface-variant/40 font-body-sm text-body-sm focus:outline-none focus:border-primary"
                placeholder="Introduza o email institucional"
                type="email"
                required
              />
              <button
                class="bg-primary text-on-primary px-space-md py-space-xs rounded font-label-caps text-label-caps uppercase hover:bg-primary-fixed-dim transition-colors"
                type="submit"
              >
                {{ subscribed ? 'Subscrito!' : 'Subscrever' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Col 2: Diretório de Ativos -->
        <div class="flex flex-col gap-space-sm">
          <span class="font-label-caps text-label-caps uppercase text-primary">Diretório de Ativos</span>
          <ul class="flex flex-col gap-space-xs font-body-md text-body-md text-on-surface-variant">
            <li class="hover:text-on-surface transition-colors"><router-link to="/catalog?category=automoveis-motos">Automóveis & Colecionáveis</router-link></li>
            <li class="hover:text-on-surface transition-colors"><router-link to="/catalog?category=imobiliario-terrenos">Imobiliário & Lotes Comerciais</router-link></li>
            <li class="hover:text-on-surface transition-colors"><router-link to="/catalog?category=relogios-joias">Relojoaria & Alta Joalharia</router-link></li>
            <li class="hover:text-on-surface transition-colors"><router-link to="/catalog?category=maquinas-industriais">Equipamento Industrial Pesado</router-link></li>
            <li class="hover:text-on-surface transition-colors"><router-link to="/catalog?category=tecnologia-computadores">Tecnologia & Servidores</router-link></li>
          </ul>
        </div>

        <!-- Col 3: Institucional -->
        <div class="flex flex-col gap-space-sm">
          <span class="font-label-caps text-label-caps uppercase text-primary">Institucional</span>
          <ul class="flex flex-col gap-space-xs font-body-md text-body-md text-on-surface-variant">
            <li class="hover:text-on-surface transition-colors"><router-link to="/how-it-works">Mesa de Gestão de Património</router-link></li>
            <li class="hover:text-on-surface transition-colors"><router-link to="/seller/dashboard">Avaliação de Consignação</router-link></li>
            <li class="hover:text-on-surface transition-colors"><router-link to="/how-it-works">Escrow & Conformidade</router-link></li>
            <li class="hover:text-on-surface transition-colors"><router-link to="/how-it-works">Regulamentos de Leilão</router-link></li>
            <li class="hover:text-on-surface transition-colors"><router-link to="/how-it-works">Tabela de Comissões</router-link></li>
          </ul>
        </div>

        <!-- Col 4: Escritório de Maputo -->
        <div class="flex flex-col gap-space-sm">
          <span class="font-label-caps text-label-caps uppercase text-primary">Escritório de Maputo</span>
          <p class="font-body-sm text-body-sm text-on-surface-variant">
            Avenida Julius Nyerere, Polana Cimento<br/>Maputo, Moçambique
          </p>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
            desk@mozbid.co.mz<br/>+258 (21) 490-000
          </p>
          <div class="flex items-center gap-1.5 mt-2 flex-wrap">
            <span class="px-2 py-0.5 rounded bg-surface-container border border-white/[0.08] text-[10px] font-mono text-emerald-400">M-PESA / E-MOLA</span>
            <span class="px-2 py-0.5 rounded bg-surface-container border border-white/[0.08] text-[10px] font-mono text-primary">BCI / BIM / SB</span>
          </div>
        </div>
      </div>

      <!-- Bottom Line -->
      <div class="pt-space-lg border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-on-surface-variant">
        <p>© {{ new Date().getFullYear() }} MozBid Leilões Lda. Licenciado pelo Ministério da Economia e Finanças de Moçambique.</p>
        <div class="flex items-center gap-space-lg">
          <router-link to="/how-it-works" class="hover:text-on-surface transition-colors">Termos do Leilão</router-link>
          <router-link to="/how-it-works" class="hover:text-on-surface transition-colors">Política de Privacidade</router-link>
          <router-link to="/how-it-works" class="hover:text-on-surface transition-colors">Prevenção de Branqueamento de Capitais</router-link>
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
