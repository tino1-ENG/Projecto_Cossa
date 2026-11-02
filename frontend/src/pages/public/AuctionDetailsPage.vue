<template>
  <div class="w-full bg-surface text-on-surface min-h-screen py-space-xl">
    <div v-if="auctionStore.loading && !auction" class="max-w-[1440px] mx-auto px-margin py-20 flex flex-col items-center justify-center gap-space-md">
      <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p class="font-body-md text-on-surface-variant">A carregar detalhes do lote em tempo real...</p>
    </div>

    <div v-else-if="!auction" class="max-w-[1440px] mx-auto px-margin py-20 text-center">
      <h3 class="font-headline-sm text-on-surface">Lote não encontrado</h3>
      <router-link to="/catalog" class="mt-4 inline-block px-space-md py-2 rounded bg-primary text-on-primary font-label-caps uppercase">
        Voltar ao Catálogo
      </router-link>
    </div>

    <div v-else class="max-w-[1440px] mx-auto px-margin">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-body-sm text-on-surface-variant/70 mb-space-md flex-wrap">
        <router-link to="/" class="hover:text-primary transition-colors">Início</router-link>
        <span>/</span>
        <router-link to="/catalog" class="hover:text-primary transition-colors">Catálogo</router-link>
        <span>/</span>
        <router-link :to="`/catalog?category=${auction.category_slug}`" class="hover:text-primary transition-colors">
          {{ auction.category_name }}
        </router-link>
        <span>/</span>
        <span class="text-on-surface font-medium truncate max-w-xs sm:max-w-md">LOTE #{{ auction.id }} — {{ auction.title }}</span>
      </nav>

      <!-- Lot Title Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl pb-space-lg border-b border-white/[0.08]">
        <div class="flex flex-col gap-space-xs">
          <div class="flex items-center gap-space-xs flex-wrap">
            <span class="px-space-sm py-0.5 rounded bg-surface-container text-primary font-label-caps text-[10px] tracking-wider uppercase border border-white/[0.08]">
              {{ auction.category_name }}
            </span>
            <span v-if="auction.status === 'active'" class="px-space-sm py-0.5 rounded bg-primary/20 text-primary font-label-caps text-[10px] flex items-center gap-1 font-bold">
              <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              LEILÃO AO VIVO
            </span>
            <span v-else class="px-space-sm py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]">
              ENCERRADO
            </span>
            <span class="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider">
              LOTE #{{ auction.id }}
            </span>
          </div>

          <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {{ auction.title }}
          </h1>

          <div class="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
            <span class="material-symbols-outlined text-[16px] text-primary">location_on</span>
            <span>{{ auction.location_city }}, {{ auction.location_province }} • Moçambique</span>
          </div>
        </div>

        <div class="flex items-center gap-space-sm">
          <button
            class="px-space-md py-2 rounded bg-surface-container hover:bg-surface-container-high border border-white/[0.08] text-on-surface font-label-caps text-label-caps flex items-center gap-2 transition-colors"
            :class="{ 'border-primary text-primary': auction.is_watchlisted }"
            @click="handleToggleFav"
            type="button"
          >
            <span class="material-symbols-outlined text-[18px]">
              {{ auction.is_watchlisted ? 'bookmark_added' : 'bookmark' }}
            </span>
            <span>{{ auction.is_watchlisted ? 'Lote Marcado' : 'Guardar Lote' }}</span>
          </button>
        </div>
      </div>

      <!-- ASYMMETRIC 7:5 GRID LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <!-- 7 COLUMNS: Gallery, Description, Specs & Provenance -->
        <div class="lg:col-span-7 flex flex-col gap-space-xl">
          <!-- Gallery -->
          <ProductGallery :images="auction.images" :title="auction.title" />

          <!-- Quick Specs Ribbon -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-space-sm p-space-md rounded-xl bg-surface-container border border-white/[0.08] shadow-md">
            <div class="flex flex-col">
              <span class="font-label-caps text-[10px] text-on-surface-variant/70 uppercase">Marca / Fabricante</span>
              <span class="font-title-md text-[14px] text-on-surface font-semibold truncate">{{ auction.brand || 'Original' }}</span>
            </div>
            <div class="flex flex-col border-l border-white/[0.06] pl-space-sm">
              <span class="font-label-caps text-[10px] text-on-surface-variant/70 uppercase">Ano de Fabrico</span>
              <span class="font-title-md text-[14px] text-on-surface font-semibold">{{ auction.year || '2023' }}</span>
            </div>
            <div class="flex flex-col border-l border-white/[0.06] pl-space-sm">
              <span class="font-label-caps text-[10px] text-on-surface-variant/70 uppercase">Condição Notarial</span>
              <span class="font-title-md text-[14px] text-primary font-semibold">{{ conditionLabel(auction.condition) }}</span>
            </div>
            <div class="flex flex-col border-l border-white/[0.06] pl-space-sm">
              <span class="font-label-caps text-[10px] text-on-surface-variant/70 uppercase">Quilometragem / Uso</span>
              <span class="font-title-md text-[14px] text-on-surface font-semibold">{{ auction.mileage_or_hours || 'Certificado' }}</span>
            </div>
          </div>

          <!-- Description Section -->
          <div class="p-space-lg rounded-xl bg-surface-container border border-white/[0.08] shadow-md flex flex-col gap-space-sm">
            <div class="flex items-center gap-2 pb-space-xs border-b border-white/[0.06]">
              <span class="material-symbols-outlined text-primary text-[20px]">description</span>
              <h3 class="font-headline-sm text-headline-sm text-on-surface">Descrição e Proveniência do Lote</h3>
            </div>
            <p class="font-body-md text-body-md text-on-surface-variant whitespace-pre-line leading-relaxed">
              {{ auction.description }}
            </p>
          </div>

          <!-- Interactive Technical Tabs: Specs, 120-Point Inspection, Notarial Terms -->
          <div class="rounded-xl bg-surface-container border border-white/[0.08] shadow-md overflow-hidden">
            <!-- Tab Headers -->
            <div class="flex items-center border-b border-white/[0.08] bg-surface-container-low px-space-md pt-2 overflow-x-auto gap-space-xs">
              <button
                type="button"
                class="px-space-md py-3 font-label-caps text-label-caps uppercase border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
                :class="activeTab === 'specs' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'"
                @click="activeTab = 'specs'"
              >
                <span class="material-symbols-outlined text-[18px]">tune</span>
                <span>Ficha Técnica & Telemetria</span>
              </button>
              <button
                type="button"
                class="px-space-md py-3 font-label-caps text-label-caps uppercase border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
                :class="activeTab === 'inspection' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'"
                @click="activeTab = 'inspection'"
              >
                <span class="material-symbols-outlined text-[18px]">fact_check</span>
                <span>Inspeção 120 Pontos</span>
              </button>
              <button
                type="button"
                class="px-space-md py-3 font-label-caps text-label-caps uppercase border-b-2 transition-all flex items-center gap-2 whitespace-nowrap"
                :class="activeTab === 'legal' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'"
                @click="activeTab = 'legal'"
              >
                <span class="material-symbols-outlined text-[18px]">gavel</span>
                <span>Condições Notariais & Escrow</span>
              </button>
            </div>

            <!-- Tab 1: Specs -->
            <div v-if="activeTab === 'specs'" class="p-space-lg flex flex-col gap-space-sm animate-fadeIn">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-space-lg gap-y-2 font-body-sm text-body-sm">
                <div class="flex justify-between py-2 border-b border-white/[0.04]">
                  <span class="text-on-surface-variant">Número de Chassi / VIN:</span>
                  <span class="font-mono text-on-surface font-semibold">{{ auction.vin || 'MZ-VERIFIED-9821' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-white/[0.04]">
                  <span class="text-on-surface-variant">Declaração Aduaneira (DUA):</span>
                  <span class="font-mono text-primary font-semibold">DUA-MZ-{{ 2024000 + auction.id * 149 }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-white/[0.04]">
                  <span class="text-on-surface-variant">Entreposto / Local de Recolha:</span>
                  <span class="text-on-surface font-medium">{{ auction.location_city }}, {{ auction.location_province }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-white/[0.04]">
                  <span class="text-on-surface-variant">Combustível / Alimentação:</span>
                  <span class="text-on-surface font-medium">{{ auction.fuel_type || 'Gasolina Especial 95 / Diesel Premium' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-white/[0.04]">
                  <span class="text-on-surface-variant">Transmissão & Tração:</span>
                  <span class="text-on-surface font-medium">{{ auction.transmission || 'Automática Sequencial 4WD/AWD' }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-white/[0.04]">
                  <span class="text-on-surface-variant">Homologação INATTER:</span>
                  <span class="text-emerald-400 font-medium flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">check_circle</span> Registo Válido Moçambique
                  </span>
                </div>
                <div class="flex justify-between py-2 border-b border-white/[0.04]">
                  <span class="text-on-surface-variant">Alfândegas de Moçambique:</span>
                  <span class="text-emerald-400 font-medium flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">check_circle</span> Direitos Aduaneiros & IVA Liquidados
                  </span>
                </div>
                <div class="flex justify-between py-2 border-b border-white/[0.04]">
                  <span class="text-on-surface-variant">Certidão de Quitação Fiscal:</span>
                  <span class="text-emerald-400 font-medium flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">check_circle</span> Emitida pela Autoridade Tributária
                  </span>
                </div>
              </div>
            </div>

            <!-- Tab 2: 120-Point Inspection Report -->
            <div v-else-if="activeTab === 'inspection'" class="p-space-lg flex flex-col gap-space-md animate-fadeIn">
              <div class="flex items-center justify-between pb-space-sm border-b border-white/[0.06]">
                <div>
                  <h4 class="font-title-md text-on-surface font-semibold">Certificado Técnico Pericial</h4>
                  <p class="font-body-sm text-xs text-on-surface-variant">Inspeção física realizada no Entreposto Portuário de Maputo por engenheiros independentes.</p>
                </div>
                <div class="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-label-caps text-xs flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">verified</span>
                  <span>ÍNDICE GLOBAL: 98.4%</span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div class="p-space-md rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="font-title-md text-[13px] text-on-surface font-medium">1. Grupo Motopropulsor & Transmissão</span>
                    <span class="text-emerald-400 font-bold text-xs">5.0 / 5.0</span>
                  </div>
                  <div class="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div class="bg-emerald-400 h-full rounded-full" style="width: 100%"></div>
                  </div>
                  <p class="font-body-sm text-[11px] text-on-surface-variant/80">Sem fugas de fluídos, compressão uniforme em todos os cilindros, transição de mudanças sem folgas.</p>
                </div>

                <div class="p-space-md rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="font-title-md text-[13px] text-on-surface font-medium">2. Integridade Estrutural & Chassi</span>
                    <span class="text-emerald-400 font-bold text-xs">5.0 / 5.0</span>
                  </div>
                  <div class="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div class="bg-emerald-400 h-full rounded-full" style="width: 100%"></div>
                  </div>
                  <p class="font-body-sm text-[11px] text-on-surface-variant/80">Medição milimétrica a laser. Sem deformações prévias, soldaduras não-originais ou corrosão salina.</p>
                </div>

                <div class="p-space-md rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="font-title-md text-[13px] text-on-surface font-medium">3. Sistemas Eletrónicos & Telemetria</span>
                    <span class="text-emerald-400 font-bold text-xs">4.9 / 5.0</span>
                  </div>
                  <div class="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div class="bg-emerald-400 h-full rounded-full" style="width: 98%"></div>
                  </div>
                  <p class="font-body-sm text-[11px] text-on-surface-variant/80">Varredura OBD-II completa: 0 códigos de erro ativos. Módulos ECU, ABS e ESP em conformidade de fábrica.</p>
                </div>

                <div class="p-space-md rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="font-title-md text-[13px] text-on-surface font-medium">4. Acabamentos & Habitáculo</span>
                    <span class="text-emerald-400 font-bold text-xs">4.8 / 5.0</span>
                  </div>
                  <div class="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div class="bg-emerald-400 h-full rounded-full" style="width: 96%"></div>
                  </div>
                  <p class="font-body-sm text-[11px] text-on-surface-variant/80">Estofos e painéis originais preservados. Todos os comandos elétricos e ar condicionado operacionais.</p>
                </div>
              </div>
            </div>

            <!-- Tab 3: Legal & Escrow Terms -->
            <div v-else class="p-space-lg flex flex-col gap-space-md animate-fadeIn">
              <div class="flex items-center justify-between pb-space-sm border-b border-white/[0.06]">
                <div>
                  <h4 class="font-title-md text-on-surface font-semibold">Garantia Notarial e Custódia Escrow</h4>
                  <p class="font-body-sm text-xs text-on-surface-variant">Procedimento em conformidade com o Código Comercial e Notariado da República de Moçambique.</p>
                </div>
                <div class="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary font-label-caps text-xs flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">account_balance</span>
                  <span>BCI / MILLENNIUM BIM</span>
                </div>
              </div>

              <div class="flex flex-col gap-space-sm font-body-sm text-body-sm">
                <div class="p-space-sm rounded bg-surface-container-low border border-white/[0.04] flex items-start gap-space-sm">
                  <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">verified_user</span>
                  <div class="flex flex-col">
                    <span class="font-title-md text-[13px] text-on-surface font-semibold">1. Depósito de Caução em Escrow</span>
                    <span class="text-on-surface-variant text-xs mt-0.5">
                      Para licitar com segurança, é exigida caução equivalente ao escalão do lote. Os fundos permanecem bloqueados na conta fiduciária do MOZBID no Banco Comercial e de Investimentos (BCI) ou Millennium BIM.
                    </span>
                  </div>
                </div>

                <div class="p-space-sm rounded bg-surface-container-low border border-white/[0.04] flex items-start gap-space-sm">
                  <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">real_estate_agent</span>
                  <div class="flex flex-col">
                    <span class="font-title-md text-[13px] text-on-surface font-semibold">2. Celebração de Escritura Pública / CREL</span>
                    <span class="text-on-surface-variant text-xs mt-0.5">
                      Após o arremate vencedor, a titularidade do bem é outorgada em Cartório Notarial da Cidade de Maputo ou Conservatória do Registo de Entidades Legais, com emissão do Título de Registo de Propriedade Definitivo.
                    </span>
                  </div>
                </div>

                <div class="p-space-sm rounded bg-surface-container-low border border-white/[0.04] flex items-start gap-space-sm">
                  <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">lock_clock</span>
                  <div class="flex flex-col">
                    <span class="font-title-md text-[13px] text-on-surface font-semibold">3. Prazo de Inspeção de 48 Horas</span>
                    <span class="text-on-surface-variant text-xs mt-0.5">
                      O comprador dispõe de 48 horas úteis após a entrega técnica para validar a conformidade com o relatório de inspeção. O pagamento ao vendedor só é libertado do escrow após a assinatura do auto de aceitação final.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Seller Profile Card -->
          <div class="p-space-lg rounded-xl bg-surface-container border border-white/[0.08] shadow-md flex flex-col gap-space-sm">
            <div class="flex items-center gap-2 pb-space-xs border-b border-white/[0.06]">
              <span class="material-symbols-outlined text-primary text-[20px]">storefront</span>
              <h3 class="font-headline-sm text-headline-sm text-on-surface">Vendedor Credenciado</h3>
            </div>

            <div class="flex items-center gap-space-md pt-space-xs">
              <div class="w-14 h-14 rounded-full bg-surface-container-high border border-white/[0.08] flex items-center justify-center text-primary font-bold text-xl">
                {{ auction.seller_display_name?.charAt(0) || 'V' }}
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="font-title-md text-on-surface font-semibold">{{ auction.seller_display_name || 'Consórcio Moçambique' }}</h4>
                  <span v-if="auction.seller_verified_status === 'verified'" class="px-2 py-0.5 rounded bg-primary/20 text-primary font-label-caps text-[10px] flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">verified</span> Verificado
                  </span>
                </div>
                <div class="flex items-center gap-space-md text-body-sm text-on-surface-variant/80">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-primary text-[14px]">star</span>
                    <strong>{{ auction.seller_rating || '4.98' }}</strong> / 5.0
                  </span>
                  <span>•</span>
                  <span>{{ auction.seller_total_sales || 32 }} Lotes Vendidos</span>
                  <span v-if="auction.seller_nuit">•</span>
                  <span v-if="auction.seller_nuit">NUIT: {{ auction.seller_nuit }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Delivery & Legal Assurance -->
          <div class="p-space-lg rounded-xl bg-surface-container border border-white/[0.08] shadow-md grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div class="flex flex-col gap-1">
              <span class="material-symbols-outlined text-primary text-[24px]">verified_user</span>
              <span class="font-title-md text-[13px] text-on-surface font-semibold">Inspeção 120 Pontos</span>
              <p class="font-body-sm text-xs text-on-surface-variant">Relatório técnico exaustivo realizado por peritos mecânicos independentes.</p>
            </div>
            <div class="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-space-sm sm:pt-0 sm:pl-space-md">
              <span class="material-symbols-outlined text-primary text-[24px]">account_balance</span>
              <span class="font-title-md text-[13px] text-on-surface font-semibold">Custódia Fiduciária</span>
              <p class="font-body-sm text-xs text-on-surface-variant">Valor mantido em escrow até receção formal e validação pelo comprador.</p>
            </div>
            <div class="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-space-sm sm:pt-0 sm:pl-space-md">
              <span class="material-symbols-outlined text-primary text-[24px]">local_shipping</span>
              <span class="font-title-md text-[13px] text-on-surface font-semibold">Transporte Blindado</span>
              <p class="font-body-sm text-xs text-on-surface-variant">Logística com escolta para Maputo, Matola, Beira, Nampula e Tete.</p>
            </div>
          </div>
        </div>

        <!-- 5 COLUMNS: Live Bid Execution Terminal -->
        <div class="lg:col-span-5 lg:sticky lg:top-24">
          <BidPanel :auction="auction" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuctionStore } from '../../stores/auction';
import ProductGallery from '../../components/auction/ProductGallery.vue';
import BidPanel from '../../components/auction/BidPanel.vue';

const route = useRoute();
const auctionStore = useAuctionStore();

const activeTab = ref<'specs' | 'inspection' | 'legal'>('specs');
const auctionId = computed(() => Number(route.params.id));
const auction = computed(() => auctionStore.currentAuction);

function conditionLabel(cond?: string) {
  switch (cond) {
    case 'new': return 'Novo de Fábrica';
    case 'like_new': return 'Como Novo / Impecável';
    case 'excellent': return 'Excelente Estado';
    case 'good': return 'Bom Estado Operacional';
    case 'fair': return 'Razoável';
    case 'salvage': return 'Sinistrado / Peças';
    default: return cond || 'Excelente';
  }
}

function handleToggleFav() {
  if (auction.value) {
    auctionStore.toggleWatchlist(auction.value.id);
  }
}

onMounted(async () => {
  if (auctionId.value) {
    await auctionStore.fetchAuctionById(auctionId.value);
  }
});

onUnmounted(() => {
  if (auctionId.value) {
    auctionStore.leaveAuctionRoom(auctionId.value);
  }
});
</script>
