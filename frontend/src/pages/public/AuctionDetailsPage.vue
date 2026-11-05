<template>
  <q-page class="w-full bg-surface text-on-surface min-h-screen py-space-md sm:py-space-xl">
    <div v-if="auctionStore.loading && !auction" class="max-w-[1440px] mx-auto px-4 sm:px-margin py-20 flex flex-col items-center justify-center gap-space-md">
      <q-spinner-dots color="primary" size="48px" />
      <p class="font-body-md text-on-surface-variant">A carregar detalhes do lote em tempo real...</p>
    </div>

    <div v-else-if="!auction" class="max-w-[1440px] mx-auto px-4 sm:px-margin py-20 text-center">
      <h3 class="font-headline-sm text-on-surface font-bold">Lote não encontrado</h3>
      <q-btn
        to="/catalog"
        unelevated
        no-caps
        color="primary"
        text-color="dark"
        label="Voltar ao Catálogo"
        class="mt-4 font-bold text-xs"
      />
    </div>

    <div v-else class="max-w-[1440px] mx-auto px-4 sm:px-margin">
      <!-- Breadcrumbs via Quasar -->
      <q-breadcrumbs class="text-xs sm:text-sm text-on-surface-variant/70 mb-space-md flex-wrap" active-color="primary">
        <q-breadcrumbs-el label="Início" to="/" icon="home" />
        <q-breadcrumbs-el label="Catálogo" to="/catalog" icon="gavel" />
        <q-breadcrumbs-el :label="auction.category_name" :to="`/catalog?category=${auction.category_slug}`" />
        <q-breadcrumbs-el :label="`LOTE #${auction.id} — ${auction.title}`" class="truncate max-w-xs sm:max-w-md text-on-surface font-medium" />
      </q-breadcrumbs>

      <!-- Lot Title Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg sm:mb-space-xl pb-space-md sm:pb-space-lg border-b border-white/[0.08]">
        <div class="flex flex-col gap-space-xs">
          <div class="flex items-center gap-space-xs flex-wrap">
            <q-badge
              color="dark"
              text-color="primary"
              class="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-white/[0.08]"
              :label="auction.category_name"
            />
            <q-badge
              v-if="auction.status === 'active'"
              color="primary"
              text-color="dark"
              class="px-2.5 py-0.5 text-[10px] flex items-center gap-1.5 font-bold"
            >
              <span class="w-2 h-2 rounded-full bg-dark radar-ring"></span>
              <span>LEILÃO AO VIVO</span>
            </q-badge>
            <q-badge
              v-else
              color="grey-9"
              class="px-2.5 py-0.5 text-[10px]"
              label="ENCERRADO"
            />
            <span class="font-label-caps text-[10px] sm:text-[11px] text-on-surface-variant uppercase tracking-wider">
              LOTE #{{ auction.id }}
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl md:text-headline-lg font-bold text-on-surface tracking-tight font-display leading-tight mt-1">
            {{ auction.title }}
          </h1>

          <div class="flex items-center gap-1.5 text-xs sm:text-body-sm text-on-surface-variant mt-0.5">
            <q-icon name="location_on" size="16px" color="primary" />
            <span>{{ auction.location_city }}, {{ auction.location_province }} • Moçambique</span>
          </div>
        </div>

        <div class="flex items-center gap-space-sm">
          <q-btn
            outline
            no-caps
            :color="auction.is_watchlisted ? 'primary' : 'grey-5'"
            :icon="auction.is_watchlisted ? 'bookmark_added' : 'bookmark'"
            :label="auction.is_watchlisted ? 'Lote Marcado' : 'Guardar Lote'"
            class="px-4 py-2 text-xs font-bold transition-all active-press"
            @click="handleToggleFav"
          />
        </div>
      </div>

      <!-- ASYMMETRIC 7:5 GRID LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-start">
        <!-- 7 COLUMNS: Gallery, Description, Specs & Provenance -->
        <div class="lg:col-span-7 flex flex-col gap-space-lg lg:gap-space-xl">
          <!-- Gallery -->
          <ProductGallery :images="auction.images" :title="auction.title" />

          <!-- Quick Specs Ribbon via Quasar Card -->
          <q-card class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-space-sm p-3 sm:p-space-md rounded-xl bg-surface-container border border-white/[0.08] shadow-md text-white" flat>
            <div class="flex flex-col">
              <span class="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant/70 uppercase font-bold">Marca</span>
              <span class="font-title-md text-[13px] sm:text-[14px] text-on-surface font-semibold truncate">{{ auction.brand || 'Original' }}</span>
            </div>
            <div class="flex flex-col border-l border-white/[0.06] pl-2 sm:pl-space-sm">
              <span class="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant/70 uppercase font-bold">Ano</span>
              <span class="font-title-md text-[13px] sm:text-[14px] text-on-surface font-semibold">{{ auction.year || '2023' }}</span>
            </div>
            <div class="flex flex-col border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-2 sm:pt-0 sm:pl-space-sm">
              <span class="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant/70 uppercase font-bold">Condição</span>
              <span class="font-title-md text-[13px] sm:text-[14px] text-primary font-semibold truncate">{{ conditionLabel(auction.condition) }}</span>
            </div>
            <div class="flex flex-col border-t sm:border-t-0 border-l border-white/[0.06] pt-2 sm:pt-0 pl-2 sm:pl-space-sm">
              <span class="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant/70 uppercase font-bold">Uso / Km</span>
              <span class="font-title-md text-[13px] sm:text-[14px] text-on-surface font-semibold truncate">{{ auction.mileage_or_hours || 'Certificado' }}</span>
            </div>
          </q-card>

          <!-- Description Section with Quasar Tabs -->
          <q-card class="rounded-xl bg-surface-container border border-white/[0.08] shadow-md overflow-hidden text-white" flat>
            <q-tabs
              v-model="activeTab"
              dark
              dense
              active-color="primary"
              indicator-color="primary"
              align="justify"
              class="border-b border-white/[0.08] bg-surface-container-low"
            >
              <q-tab name="specs" icon="tune" label="Especificações" no-caps class="text-xs font-bold" />
              <q-tab name="inspection" icon="fact_check" label="Relatório de Inspeção" no-caps class="text-xs font-bold" />
              <q-tab name="legal" icon="security" label="Garantias & Escrow" no-caps class="text-xs font-bold" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" animated dark class="bg-transparent">
              <!-- Tab 1: Specs -->
              <q-tab-panel name="specs" class="p-space-lg flex flex-col gap-space-md">
                <div>
                  <h4 class="font-title-md text-on-surface font-semibold mb-2">Descrição Editorial</h4>
                  <p class="font-body-md text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {{ auction.description || 'Lote verificado presencialmente pela equipa pericial MozBid. Apresenta documentação completa em dia, comprovativos alfandegários regularizados e histórico de manutenção fidedigno.' }}
                  </p>
                </div>

                <div v-if="auction.specifications && Object.keys(auction.specifications).length > 0">
                  <h4 class="font-title-md text-on-surface font-semibold mb-3">Ficha Técnica Homologada</h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div
                      v-for="(val, key) in auction.specifications"
                      :key="key"
                      class="flex items-center justify-between p-2.5 rounded bg-surface-container-low border border-white/[0.04]"
                    >
                      <span class="text-on-surface-variant text-xs capitalize">{{ key }}</span>
                      <span class="text-on-surface font-semibold text-xs">{{ val }}</span>
                    </div>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Tab 2: Inspection Report -->
              <q-tab-panel name="inspection" class="p-space-lg flex flex-col gap-space-md">
                <div class="flex items-center justify-between pb-space-sm border-b border-white/[0.06]">
                  <div>
                    <h4 class="font-title-md text-on-surface font-semibold">Certificado de Vistoria Pericial</h4>
                    <p class="font-body-sm text-xs text-on-surface-variant">Inspeção presencial de 120 pontos executada em Maputo.</p>
                  </div>
                  <q-badge color="emerald-9" text-color="emerald-3" class="px-2 py-1 font-bold text-xs" label="ÍNDICE 98.4% APTO" />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div class="p-space-md rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                      <span class="font-title-md text-[13px] text-on-surface font-medium">1. Grupo Motopropulsor</span>
                      <span class="text-emerald-400 font-bold text-xs">5.0 / 5.0</span>
                    </div>
                    <div class="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                      <div class="bg-emerald-400 h-full rounded-full" style="width: 100%"></div>
                    </div>
                    <p class="font-body-sm text-[11px] text-on-surface-variant/80">Sem fugas de fluídos, compressão uniforme em todos os cilindros, transição de mudanças sem folgas.</p>
                  </div>

                  <div class="p-space-md rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                      <span class="font-title-md text-[13px] text-on-surface font-medium">2. Integridade Estrutural</span>
                      <span class="text-emerald-400 font-bold text-xs">5.0 / 5.0</span>
                    </div>
                    <div class="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                      <div class="bg-emerald-400 h-full rounded-full" style="width: 100%"></div>
                    </div>
                    <p class="font-body-sm text-[11px] text-on-surface-variant/80">Medição milimétrica a laser. Sem deformações prévias, soldaduras não-originais ou corrosão salina.</p>
                  </div>

                  <div class="p-space-md rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                      <span class="font-title-md text-[13px] text-on-surface font-medium">3. Sistemas Eletrónicos</span>
                      <span class="text-emerald-400 font-bold text-xs">4.9 / 5.0</span>
                    </div>
                    <div class="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                      <div class="bg-emerald-400 h-full rounded-full" style="width: 98%"></div>
                    </div>
                    <p class="font-body-sm text-[11px] text-on-surface-variant/80">Varredura OBD-II completa: 0 códigos de erro ativos. Módulos ECU, ABS e ESP em conformidade.</p>
                  </div>

                  <div class="p-space-md rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                      <span class="font-title-md text-[13px] text-on-surface font-medium">4. Habitáculo & Interior</span>
                      <span class="text-emerald-400 font-bold text-xs">4.8 / 5.0</span>
                    </div>
                    <div class="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                      <div class="bg-emerald-400 h-full rounded-full" style="width: 96%"></div>
                    </div>
                    <p class="font-body-sm text-[11px] text-on-surface-variant/80">Estofos e painéis originais preservados. Todos os comandos elétricos e ar condicionado operacionais.</p>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Tab 3: Legal & Escrow Terms -->
              <q-tab-panel name="legal" class="p-space-lg flex flex-col gap-space-md">
                <div class="flex items-center justify-between pb-space-sm border-b border-white/[0.06]">
                  <div>
                    <h4 class="font-title-md text-on-surface font-semibold">Garantia Notarial e Custódia Escrow</h4>
                    <p class="font-body-sm text-xs text-on-surface-variant">Procedimento em conformidade com a legislação de Moçambique.</p>
                  </div>
                  <q-badge outline color="primary" class="px-2.5 py-1 text-xs font-bold" label="BCI / MILLENNIUM BIM" />
                </div>

                <div class="flex flex-col gap-space-sm font-body-sm text-body-sm">
                  <div class="p-space-sm rounded bg-surface-container-low border border-white/[0.04] flex items-start gap-space-sm">
                    <q-icon name="verified_user" size="20px" color="primary" class="mt-0.5" />
                    <div class="flex flex-col">
                      <span class="font-title-md text-[13px] text-on-surface font-semibold">1. Depósito de Caução em Escrow</span>
                      <span class="text-on-surface-variant text-xs mt-0.5">
                        Fundos salvaguardados em conta fiduciária do MOZBID no Banco Comercial e de Investimentos (BCI) ou Millennium BIM.
                      </span>
                    </div>
                  </div>

                  <div class="p-space-sm rounded bg-surface-container-low border border-white/[0.04] flex items-start gap-space-sm">
                    <q-icon name="real_estate_agent" size="20px" color="primary" class="mt-0.5" />
                    <div class="flex flex-col">
                      <span class="font-title-md text-[13px] text-on-surface font-semibold">2. Celebração de Escritura Pública / CREL</span>
                      <span class="text-on-surface-variant text-xs mt-0.5">
                        A titularidade do bem é outorgada em Cartório Notarial da Cidade de Maputo com emissão do Título Definitivo.
                      </span>
                    </div>
                  </div>

                  <div class="p-space-sm rounded bg-surface-container-low border border-white/[0.04] flex items-start gap-space-sm">
                    <q-icon name="lock_clock" size="20px" color="primary" class="mt-0.5" />
                    <div class="flex flex-col">
                      <span class="font-title-md text-[13px] text-on-surface font-semibold">3. Prazo de Inspeção de 48 Horas</span>
                      <span class="text-on-surface-variant text-xs mt-0.5">
                        O comprador dispõe de 48 horas úteis após a entrega para validar conformidade com o relatório de inspeção.
                      </span>
                    </div>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>

          <!-- Seller Profile Card with Quasar Card & Avatar -->
          <q-card class="p-space-lg rounded-xl bg-surface-container border border-white/[0.08] shadow-md flex flex-col gap-space-sm text-white" flat>
            <div class="flex items-center gap-2 pb-space-xs border-b border-white/[0.06]">
              <q-icon name="storefront" size="20px" color="primary" />
              <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">Vendedor Credenciado</h3>
            </div>

            <div class="flex items-center gap-space-md pt-space-xs">
              <q-avatar size="56px" color="primary" text-color="dark" class="font-bold text-xl shadow-md">
                {{ auction.seller_display_name?.charAt(0) || 'V' }}
              </q-avatar>
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="font-title-md text-on-surface font-bold">{{ auction.seller_display_name || 'Consórcio Moçambique' }}</h4>
                  <q-badge
                    v-if="auction.seller_verified_status === 'verified'"
                    color="primary"
                    text-color="dark"
                    class="px-2 py-0.5 font-bold text-[10px]"
                    label="Verificado"
                  />
                </div>
                <div class="flex items-center gap-space-md text-body-sm text-on-surface-variant/80 text-xs">
                  <span class="flex items-center gap-1">
                    <q-icon name="star" color="primary" size="14px" />
                    <strong>{{ auction.seller_rating || '4.98' }}</strong> / 5.0
                  </span>
                  <span>•</span>
                  <span>{{ auction.seller_total_sales || 32 }} Lotes Vendidos</span>
                  <span v-if="auction.seller_nuit">•</span>
                  <span v-if="auction.seller_nuit">NUIT: {{ auction.seller_nuit }}</span>
                </div>
              </div>
            </div>
          </q-card>

          <!-- Delivery & Legal Assurance with Quasar Card -->
          <q-card class="p-space-lg rounded-xl bg-surface-container border border-white/[0.08] shadow-md grid grid-cols-1 sm:grid-cols-3 gap-space-md text-white" flat>
            <div class="flex flex-col gap-1">
              <q-icon name="verified_user" size="24px" color="primary" />
              <span class="font-title-md text-[13px] text-on-surface font-bold">Inspeção 120 Pontos</span>
              <p class="font-body-sm text-xs text-on-surface-variant">Relatório técnico exaustivo realizado por peritos independentes.</p>
            </div>
            <div class="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-space-sm sm:pt-0 sm:pl-space-md">
              <q-icon name="account_balance" size="24px" color="primary" />
              <span class="font-title-md text-[13px] text-on-surface font-bold">Custódia Fiduciária</span>
              <p class="font-body-sm text-xs text-on-surface-variant">Valor mantido em escrow até receção formal e validação pelo comprador.</p>
            </div>
            <div class="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-space-sm sm:pt-0 sm:pl-space-md">
              <q-icon name="local_shipping" size="24px" color="primary" />
              <span class="font-title-md text-[13px] text-on-surface font-bold">Transporte Blindado</span>
              <p class="font-body-sm text-xs text-on-surface-variant">Logística com escolta para Maputo, Matola, Beira, Nampula e Tete.</p>
            </div>
          </q-card>
        </div>

        <!-- 5 COLUMNS: Live Bid Execution Terminal with Quasar -->
        <div class="lg:col-span-5 lg:sticky lg:top-24">
          <BidPanel :auction="auction" />
        </div>
      </div>
    </div>
  </q-page>
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
