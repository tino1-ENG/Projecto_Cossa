<template>
  <div class="w-full bg-[#F4F1EB] text-[#171717] min-h-screen py-6 sm:py-10 pb-20 sm:pb-16">
    <div v-if="auctionStore.loading && !auction" class="max-w-[1440px] mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center gap-3">
      <q-spinner-dots color="primary" size="44px" />
      <p class="text-xs text-[#777777]">A carregar detalhes do lote em tempo real...</p>
    </div>

    <div v-else-if="!auction" class="max-w-[1440px] mx-auto px-4 sm:px-8 py-20 text-center">
      <h3 class="font-editorial text-xl font-semibold text-[#171717]">Lote não encontrado</h3>
      <router-link
        to="/catalog"
        class="inline-flex mt-4 px-5 py-2.5 rounded-lg bg-[#171717] text-white hover:bg-[#B69A68] text-xs font-semibold tracking-wide transition-colors no-underline"
      >
        Voltar ao Catálogo
      </router-link>
    </div>

    <div v-else class="max-w-[1440px] mx-auto px-4 sm:px-8">
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 text-xs text-[#777777] mb-4 flex-wrap">
        <router-link to="/" class="hover:text-[#171717] transition-colors no-underline text-[#777777]">Início</router-link>
        <span>/</span>
        <router-link to="/catalog" class="hover:text-[#171717] transition-colors no-underline text-[#777777]">Catálogo</router-link>
        <span>/</span>
        <router-link :to="`/catalog?category=${auction.category_slug}`" class="hover:text-[#171717] transition-colors no-underline text-[#777777]">{{ auction.category_name }}</router-link>
        <span>/</span>
        <span class="text-[#171717] font-semibold">Lote #{{ auction.id }}</span>
      </div>

      <!-- Lot Title Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-[#E7E3DC]">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full bg-white border border-[#E7E3DC] text-[10px] font-semibold uppercase tracking-wider text-[#171717]">
              {{ auction.category_name }}
            </span>
            <span
              v-if="auction.status === 'active'"
              class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1.5"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>LEILÃO AO VIVO</span>
            </span>
            <span
              v-else
              class="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#777777] border border-[#E7E3DC] text-[10px] font-semibold uppercase"
            >
              ENCERRADO
            </span>
            <span class="text-xs text-[#777777] uppercase tracking-wider font-mono">
              LOTE #{{ auction.id }}
            </span>
          </div>

          <h1 class="font-editorial text-2xl sm:text-4xl lg:text-[40px] font-semibold text-[#171717] tracking-tight leading-tight">
            {{ auction.title }}
          </h1>

          <div class="flex items-center gap-1.5 text-xs text-[#777777]">
            <span class="material-symbols-outlined text-[16px] text-[#B69A68]">location_on</span>
            <span>{{ auction.location_city }}, {{ auction.location_province }} • Moçambique</span>
          </div>
        </div>

        <div class="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-white border border-[#E7E3DC] hover:border-[#B69A68] hover:text-[#B69A68] text-xs font-semibold tracking-wide transition-all shadow-xs flex items-center gap-1.5 cursor-pointer text-[#171717]"
            @click="handleToggleFav"
          >
            <span class="material-symbols-outlined text-[16px]" :class="{ 'text-[#B69A68]': auction.is_watchlisted }">
              {{ auction.is_watchlisted ? 'bookmark_added' : 'bookmark' }}
            </span>
            <span>{{ auction.is_watchlisted ? 'Marcado' : 'Guardar Lote' }}</span>
          </button>
        </div>
      </div>

      <!-- ASYMMETRIC 7:5 GRID LAYOUT -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <!-- 7 COLUMNS: Gallery, Description, Specs & Provenance -->
        <div class="lg:col-span-7 flex flex-col gap-6">
          <!-- Gallery -->
          <ProductGallery :images="auction.images" :title="auction.title" />

          <!-- Quick Specs Ribbon -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl sm:rounded-2xl bg-white border border-[#E7E3DC] shadow-xs text-[#171717]">
            <div class="flex flex-col">
              <span class="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Marca</span>
              <span class="font-semibold text-xs sm:text-sm text-[#171717] truncate mt-0.5">{{ auction.brand || 'Original' }}</span>
            </div>
            <div class="flex flex-col border-l border-[#E7E3DC] pl-3">
              <span class="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Ano</span>
              <span class="font-semibold text-xs sm:text-sm text-[#171717] mt-0.5">{{ auction.year || '2023' }}</span>
            </div>
            <div class="flex flex-col border-t sm:border-t-0 sm:border-l border-[#E7E3DC] pt-3 sm:pt-0 sm:pl-3">
              <span class="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Condição</span>
              <span class="font-semibold text-xs sm:text-sm text-[#B69A68] truncate mt-0.5">{{ conditionLabel(auction.condition) }}</span>
            </div>
            <div class="flex flex-col border-t sm:border-t-0 border-l border-[#E7E3DC] pt-3 sm:pt-0 pl-3">
              <span class="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Uso / Km</span>
              <span class="font-semibold text-xs sm:text-sm text-[#171717] truncate mt-0.5">{{ auction.mileage_or_hours || 'Certificado' }}</span>
            </div>
          </div>

          <!-- Description Section with Tabs -->
          <div class="rounded-xl sm:rounded-2xl bg-white border border-[#E7E3DC] shadow-xs overflow-hidden text-[#171717]">
            <div class="flex border-b border-[#E7E3DC] bg-[#FAF8F5]">
              <button
                type="button"
                class="flex-1 py-3 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                :class="activeTab === 'specs' ? 'border-b-2 border-[#171717] text-[#171717] bg-white' : 'text-[#777777] hover:text-[#171717]'"
                @click="activeTab = 'specs'"
              >
                <span class="material-symbols-outlined text-[16px]">tune</span>
                <span>Especificações</span>
              </button>
              <button
                type="button"
                class="flex-1 py-3 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                :class="activeTab === 'inspection' ? 'border-b-2 border-[#171717] text-[#171717] bg-white' : 'text-[#777777] hover:text-[#171717]'"
                @click="activeTab = 'inspection'"
              >
                <span class="material-symbols-outlined text-[16px]">fact_check</span>
                <span>Relatório Pericial</span>
              </button>
              <button
                type="button"
                class="flex-1 py-3 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                :class="activeTab === 'legal' ? 'border-b-2 border-[#171717] text-[#171717] bg-white' : 'text-[#777777] hover:text-[#171717]'"
                @click="activeTab = 'legal'"
              >
                <span class="material-symbols-outlined text-[16px]">security</span>
                <span>Garantias & Conformidade</span>
              </button>
            </div>

            <!-- Tab Content -->
            <div class="p-5 sm:p-6 flex flex-col gap-4">
              <!-- Tab 1: Specs -->
              <div v-if="activeTab === 'specs'" class="flex flex-col gap-4">
                <div>
                  <h4 class="font-display font-semibold text-sm text-[#171717] mb-2">Descrição Editorial</h4>
                  <p class="text-xs sm:text-sm text-[#666666] leading-relaxed whitespace-pre-line">
                    {{ auction.description || 'Lote verificado presencialmente pela equipa pericial MozBid. Apresenta documentação completa em dia, comprovativos alfandegários regularizados e histórico de manutenção fidedigno.' }}
                  </p>
                </div>

                <div v-if="auction.specifications && Object.keys(auction.specifications).length > 0">
                  <h4 class="font-display font-semibold text-sm text-[#171717] mb-3">Ficha Técnica Homologada</h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div
                      v-for="(val, key) in auction.specifications"
                      :key="key"
                      class="flex items-center justify-between p-2.5 rounded bg-[#FAF8F5] border border-[#E7E3DC]"
                    >
                      <span class="text-[#777777] capitalize">{{ formatSpecKey(key) }}</span>
                      <span class="text-[#171717] font-semibold">{{ val }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab 2: Inspection -->
              <div v-else-if="activeTab === 'inspection'" class="flex flex-col gap-4">
                <div class="flex items-center justify-between pb-3 border-b border-[#E7E3DC]">
                  <div>
                    <h4 class="font-display font-semibold text-sm text-[#171717]">Certificado de Vistoria Pericial</h4>
                    <p class="text-xs text-[#777777]">Inspeção de 120 pontos executada em Maputo.</p>
                  </div>
                  <span class="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    ÍNDICE 98.4% APTO
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-semibold text-[#171717]">1. Grupo Motopropulsor</span>
                      <span class="text-emerald-700 font-bold text-xs">5.0 / 5.0</span>
                    </div>
                    <div class="w-full bg-[#E7E3DC] rounded-full h-1.5 overflow-hidden">
                      <div class="bg-emerald-600 h-full rounded-full" style="width: 100%"></div>
                    </div>
                    <p class="text-[11px] text-[#666666] leading-snug">Sem fugas de fluídos, compressão uniforme em todos os cilindros, transição de mudanças sem folgas.</p>
                  </div>

                  <div class="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] flex flex-col gap-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-semibold text-[#171717]">2. Integridade Estrutural</span>
                      <span class="text-emerald-700 font-bold text-xs">5.0 / 5.0</span>
                    </div>
                    <div class="w-full bg-[#E7E3DC] rounded-full h-1.5 overflow-hidden">
                      <div class="bg-emerald-600 h-full rounded-full" style="width: 100%"></div>
                    </div>
                    <p class="text-[11px] text-[#666666] leading-snug">Sem indícios de colisão prévia, alinhamento de chassis em conformidade com tolerâncias do fabricante.</p>
                  </div>
                </div>
              </div>

              <!-- Tab 3: Legal -->
              <div v-else class="flex flex-col gap-4">
                <div class="flex items-center justify-between pb-3 border-b border-[#E7E3DC]">
                  <div>
                    <h4 class="font-display font-semibold text-sm text-[#171717]">Garantia Notarial e Custódia Fiduciária</h4>
                    <p class="text-xs text-[#777777]">Procedimento em conformidade com a legislação de Moçambique.</p>
                  </div>
                  <span class="px-2.5 py-1 rounded bg-[#FAF8F5] border border-[#E7E3DC] text-xs font-semibold text-[#171717]">
                    REGULAMENTO MOZBID
                  </span>
                </div>

                <div class="flex flex-col gap-3 text-xs">
                  <div class="p-3 rounded bg-[#FAF8F5] border border-[#E7E3DC] flex items-start gap-3">
                    <span class="material-symbols-outlined text-[#B69A68] text-[20px]">verified_user</span>
                    <div class="flex flex-col">
                      <span class="font-semibold text-[#171717]">1. Depósito de Caução em Custódia</span>
                      <span class="text-[#666666] mt-0.5">Fundos salvaguardados em conta fiduciária com registo do lance em Meticais (MZN).</span>
                    </div>
                  </div>

                  <div class="p-3 rounded bg-[#FAF8F5] border border-[#E7E3DC] flex items-start gap-3">
                    <span class="material-symbols-outlined text-[#B69A68] text-[20px]">real_estate_agent</span>
                    <div class="flex flex-col">
                      <span class="font-semibold text-[#171717]">2. Celebração de Escritura / Transferência</span>
                      <span class="text-[#666666] mt-0.5">A titularidade do bem é formalizada com documentação definitiva em Cartório competente.</span>
                    </div>
                  </div>

                  <div class="p-3 rounded bg-[#FAF8F5] border border-[#E7E3DC] flex items-start gap-3">
                    <span class="material-symbols-outlined text-[#B69A68] text-[20px]">lock_clock</span>
                    <div class="flex flex-col">
                      <span class="font-semibold text-[#171717]">3. Prazo de Validação Pós-Arrematação</span>
                      <span class="text-[#666666] mt-0.5">O comprador dispõe de 48 horas úteis após a entrega para validar conformidade com o relatório.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Seller Profile Card -->
          <div class="p-5 rounded-xl sm:rounded-2xl bg-white border border-[#E7E3DC] shadow-xs flex flex-col gap-3 text-[#171717]">
            <div class="flex items-center gap-2 pb-2 border-b border-[#E7E3DC]">
              <span class="material-symbols-outlined text-[#B69A68] text-[20px]">storefront</span>
              <h3 class="font-display font-semibold text-sm text-[#171717]">Vendedor Credenciado</h3>
            </div>

            <div class="flex items-center gap-4 pt-1">
              <div class="w-12 h-12 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-lg">
                {{ auction.seller_display_name?.charAt(0) || 'V' }}
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="font-display font-semibold text-sm text-[#171717]">{{ auction.seller_display_name || 'Consórcio Moçambique' }}</h4>
                  <span
                    v-if="auction.seller_verified_status === 'verified'"
                    class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]"
                  >
                    Verificado
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs text-[#777777]">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-[#B69A68] text-[14px]">star</span>
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
    case 'like_new':
    case 'used_like_new': return 'Usado — Como Novo';
    case 'excellent': return 'Excelente Estado';
    case 'good':
    case 'used_good': return 'Bom Estado Operacional';
    case 'fair':
    case 'used_fair': return 'Estado Razoável';
    case 'refurbished': return 'Recondicionado Certificado';
    case 'salvage': return 'Sinistrado / Peças';
    default: return 'Excelente Estado';
  }
}

function formatSpecKey(key: string): string {
  const map: Record<string, string> = {
    engine: 'Motorização',
    power: 'Potência',
    transmission: 'Transmissão',
    drivetrain: 'Tracção',
    fuel_type: 'Combustível',
    mileage: 'Quilometragem',
    exterior_color: 'Cor Exterior',
    interior_color: 'Cor Interior',
    vin: 'Número de Chassis (VIN)',
    doors: 'Portas',
    capacity: 'Capacidade',
    weight: 'Peso Bruto',
    model: 'Modelo',
    year: 'Ano',
    brand: 'Marca',
    operating_hours: 'Horas de Operação',
    serial_number: 'Número de Série',
    movement: 'Movimento / Mecanismo',
    case_material: 'Material da Caixa',
    dial_color: 'Cor do Mostrador',
    water_resistance: 'Resistência à Água',
    condition_rating: 'Classificação de Estado'
  };
  return map[key.toLowerCase()] || key.replace(/_/g, ' ');
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
