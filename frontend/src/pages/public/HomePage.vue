<template>
  <div class="w-full bg-[#F4F1EB] text-[#171717] min-h-screen">
    <!-- SECTION A/B: HERO SECTION -->
    <section class="relative w-full pt-6 sm:pt-12 pb-10 sm:pb-16 overflow-hidden">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <!-- Left Column: Editorial Headline & Value Proposition -->
          <div class="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
            <!-- Subtle Mozambique identification badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E3DC] w-fit shadow-xs">
              <span class="w-1.5 h-1.5 rounded-full bg-[#B69A68]"></span>
              <span class="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#B69A68] uppercase">
                MOÇAMBIQUE • LEILÕES SELECCIONADOS
              </span>
            </div>

            <!-- Main Headline (Editorial Luxury Serif) -->
            <h1 class="font-editorial text-3xl sm:text-5xl lg:text-[58px] text-[#171717] font-semibold leading-[1.14] tracking-tight">
              Activos extraordinários.<br />
              <span class="italic font-normal text-[#B69A68]">Oportunidades exclusivas.</span>
            </h1>

            <!-- Supporting Subtitle -->
            <p class="font-sans text-sm sm:text-base text-[#666666] max-w-xl leading-relaxed">
              Descubra e participe em leilões de activos seleccionados em Moçambique. Veículos executivos, alta relojoaria, maquinaria industrial e activos corporativos liquidados em Meticais (MZN).
            </p>

            <!-- Action CTAs -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <router-link
                to="/catalog"
                class="px-6 py-3 rounded-lg bg-[#171717] text-white hover:bg-[#B69A68] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2 no-underline"
              >
                <span>Explorar Leilões</span>
                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
              </router-link>

              <router-link
                to="/how-it-works"
                class="px-6 py-3 rounded-lg bg-white text-[#171717] border border-[#E7E3DC] hover:border-[#B69A68] hover:text-[#B69A68] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs flex items-center gap-2 no-underline"
              >
                <span>Como Funciona</span>
                <span class="material-symbols-outlined text-[18px]">help_outline</span>
              </router-link>
            </div>
          </div>

          <!-- Right Column: Featured Live Car HUD Card -->
          <div class="lg:col-span-5 relative mt-4 lg:mt-0">
            <div class="relative rounded-2xl overflow-hidden bg-white border border-[#E7E3DC] shadow-lg group">
              <!-- Hero Vehicle Image -->
              <div class="relative w-full aspect-[16/10] sm:aspect-[4/3] bg-[#FAF8F5] overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  :src="heroLot?.primary_image || '/images/products/porsche-911-gt3rs.jpg'"
                  :alt="heroLot?.title || 'Porsche 911 GT3 RS Clubsport'"
                  @error="onHeroImgError"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

                <!-- Header Badge on Image -->
                <div class="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span class="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-semibold text-white tracking-wider uppercase border border-white/[0.1] flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#B69A68] animate-pulse"></span>
                    <span>LOTE #{{ heroLot?.id || '1' }} • AO VIVO</span>
                  </span>
                  <span class="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-medium text-white/90 border border-white/[0.1]">
                    {{ (heroLot?.location_city || 'MAPUTO').toUpperCase() }}
                  </span>
                </div>

                <!-- Bottom Countdown Ribbon on Image -->
                <div class="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 text-white">
                  <div>
                    <span class="text-[10px] uppercase tracking-wider text-white/70 block">Termina em:</span>
                    <div class="font-mono text-sm sm:text-base font-bold text-[#D6C4A3]">
                      <AuctionTimer v-if="heroLot" :ends-at="heroLot.ends_at" />
                      <span v-else>04h 12m 30s</span>
                    </div>
                  </div>
                  <span class="px-2.5 py-1 rounded bg-[#B69A68] text-white text-[10px] font-semibold tracking-wider uppercase">
                    RESERVA ATINGIDA
                  </span>
                </div>
              </div>

              <!-- Hero Card Footer Content -->
              <div class="p-4 sm:p-5 flex flex-col gap-3">
                <div class="flex items-center justify-between text-xs text-[#777777]">
                  <span>{{ heroLot?.category_name || 'Automóveis & Coleccionáveis' }}</span>
                  <span class="font-mono">{{ heroLot?.bid_count || 39 }} Licitações</span>
                </div>
                <h3 class="font-display font-semibold text-base sm:text-lg text-[#171717] line-clamp-1">
                  {{ heroLot?.title || 'Porsche 911 GT3 RS Clubsport 2023 — Pacote Weissach' }}
                </h3>
                <div class="flex items-center justify-between pt-1 border-t border-[#E7E3DC]">
                  <div>
                    <span class="text-[10px] uppercase tracking-wider text-[#777777] block font-semibold">Licitação Atual</span>
                    <div class="font-editorial text-xl sm:text-2xl font-bold text-[#171717]">
                      {{ formatMoneyDigits(heroLot?.current_price || 18550000) }}
                      <span class="text-xs font-sans font-bold text-[#B69A68]">MZN</span>
                    </div>
                  </div>
                  <router-link
                    :to="heroLot ? `/auctions/${heroLot.id}` : '/catalog'"
                    class="px-4 py-2 rounded bg-[#171717] text-white hover:bg-[#B69A68] text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 no-underline"
                  >
                    <span>Ver Lote</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION D: SEARCH AND FILTERS (Compact & Intuitive) -->
    <section class="w-full max-w-[1440px] mx-auto px-4 sm:px-8 -mt-2 sm:-mt-4 mb-10 sm:mb-16">
      <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#E7E3DC] shadow-sm">
        <form @submit.prevent="executeSearch" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
          <!-- Text Search (Col 1-5) -->
          <div class="lg:col-span-5 relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-[20px]">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Pesquisar por activo, marca ou nº de lote..."
              class="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-xs sm:text-sm text-[#171717] placeholder:text-[#888888] focus:outline-none focus:border-[#B69A68] transition-colors"
            />
          </div>

          <!-- Category Filter (Col 6-7) -->
          <div class="lg:col-span-3">
            <select
              v-model="selectedCategory"
              class="w-full px-3 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#B69A68] transition-colors"
            >
              <option value="all">Todas as Categorias</option>
              <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>

          <!-- Province Filter (Col 8-9) -->
          <div class="lg:col-span-2">
            <select
              v-model="selectedProvince"
              class="w-full px-3 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#B69A68] transition-colors"
            >
              <option v-for="prov in provinceOptions" :key="prov.value" :value="prov.value">
                {{ prov.label }}
              </option>
            </select>
          </div>

          <!-- Action Button (Col 10-12) -->
          <div class="lg:col-span-2">
            <button
              type="submit"
              class="w-full py-2.5 rounded-lg bg-[#171717] text-white hover:bg-[#B69A68] text-xs sm:text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span class="material-symbols-outlined text-[18px]">search</span>
              <span>Pesquisar</span>
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- SECTION C: FEATURED AUCTIONS (Max 4 active lots, no duplicates) -->
    <section class="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <span class="text-[10px] tracking-[0.25em] text-[#B69A68] uppercase font-bold block mb-1">
            LEILÕES SELECCIONADOS
          </span>
          <h2 class="font-editorial text-2xl sm:text-4xl text-[#171717] font-semibold tracking-tight">
            Leilões em Destaque
          </h2>
          <p class="text-xs sm:text-sm text-[#666666] mt-1">
            Activos com maior relevância e disputa activa neste momento.
          </p>
        </div>

        <router-link
          to="/catalog"
          class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#171717] hover:text-[#B69A68] transition-colors no-underline group self-start sm:self-auto"
        >
          <span>Ver todos os leilões</span>
          <span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </router-link>
      </div>

      <!-- 4-Card Refined Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div v-for="item in featuredList" :key="item.id">
          <AuctionCard :auction="item" />
        </div>
      </div>
    </section>

    <!-- SECTION E: CATEGORIES (Image-based cards) -->
    <section class="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 sm:py-16" id="categorias">
      <div class="text-center max-w-xl mx-auto mb-8 sm:mb-12">
        <span class="text-[10px] tracking-[0.25em] text-[#B69A68] uppercase font-bold block mb-1">
          EXPLORAR ACERVO
        </span>
        <h2 class="font-editorial text-2xl sm:text-4xl text-[#171717] font-semibold tracking-tight">
          Categorias de Activos
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] mt-1">
          Selecções especializadas por tipologia de investimento em Moçambique.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <router-link
          v-for="cat in curatedCategories"
          :key="cat.slug"
          :to="`/catalog?category=${cat.slug}`"
          class="group relative h-48 sm:h-56 rounded-xl overflow-hidden border border-[#E7E3DC] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-end p-3 sm:p-4 text-white no-underline"
        >
          <img
            :src="cat.image"
            :alt="cat.name"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

          <div class="relative z-10 flex flex-col">
            <span class="font-editorial text-sm sm:text-base font-semibold text-white group-hover:text-[#D6C4A3] transition-colors leading-snug">
              {{ cat.name }}
            </span>
            <span class="text-[10px] text-white/70 uppercase tracking-wider mt-0.5">
              {{ cat.count }} Lotes activos
            </span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- SECTION F: HOW IT WORKS (Three concise editorial steps) -->
    <section class="w-full bg-white py-12 sm:py-20 border-y border-[#E7E3DC]" id="como-funciona">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div class="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span class="text-[10px] tracking-[0.25em] text-[#B69A68] uppercase font-bold block mb-1">
            PROCEDIMENTO
          </span>
          <h2 class="font-editorial text-2xl sm:text-4xl text-[#171717] font-semibold tracking-tight">
            Como Funciona
          </h2>
          <p class="text-xs sm:text-sm text-[#666666] mt-1">
            Três etapas estruturadas para participar nos leilões da MozBid.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <!-- Step 01 -->
          <div class="p-6 sm:p-8 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC] flex flex-col gap-4">
            <span class="font-editorial text-3xl sm:text-4xl text-[#B69A68] font-bold">01</span>
            <div>
              <h3 class="font-display text-base sm:text-lg font-semibold text-[#171717] mb-1.5">
                Registo e Verificação
              </h3>
              <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
                Crie a sua conta de licitador e submeta a documentação necessária para validação da sua identidade e NUIT de forma rápida e segura.
              </p>
            </div>
          </div>

          <!-- Step 02 -->
          <div class="p-6 sm:p-8 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC] flex flex-col gap-4">
            <span class="font-editorial text-3xl sm:text-4xl text-[#B69A68] font-bold">02</span>
            <div>
              <h3 class="font-display text-base sm:text-lg font-semibold text-[#171717] mb-1.5">
                Participação nos Leilões
              </h3>
              <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
                Aceda a pregões ao vivo em tempo real e submeta as suas licitações com total transparência e incrementos regulados.
              </p>
            </div>
          </div>

          <!-- Step 03 -->
          <div class="p-6 sm:p-8 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC] flex flex-col gap-4">
            <span class="font-editorial text-3xl sm:text-4xl text-[#B69A68] font-bold">03</span>
            <div>
              <h3 class="font-display text-base sm:text-lg font-semibold text-[#171717] mb-1.5">
                Pagamento e Transferência
              </h3>
              <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
                Liquidação transparente em Meticais (MZN) através de canais bancários verificados e formalização da titularidade do activo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION G: TRUST AND SECURITY (#seguranca / #sobre-nos) -->
    <section class="max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-20" id="sobre-nos">
      <div class="text-center max-w-xl mx-auto mb-10 sm:mb-14">
        <span class="text-[10px] tracking-[0.25em] text-[#B69A68] uppercase font-bold block mb-1">
          CONFIANÇA E RIGOR
        </span>
        <h2 class="font-editorial text-2xl sm:text-4xl text-[#171717] font-semibold tracking-tight">
          Segurança e Conformidade
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] mt-1">
          Procedimentos auditáveis e protecção integral para compradores e vendedores.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div class="p-5 rounded-xl bg-white border border-[#E7E3DC] shadow-xs flex flex-col gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
            <span class="material-symbols-outlined text-[22px]">verified</span>
          </div>
          <h4 class="font-display font-semibold text-sm sm:text-base text-[#171717]">Verificação de Vendedores</h4>
          <p class="text-xs text-[#666666] leading-relaxed">
            Triagem rigorosa de proveniência de activos e identificação fiscal (NUIT) de cada consignador.
          </p>
        </div>

        <div class="p-5 rounded-xl bg-white border border-[#E7E3DC] shadow-xs flex flex-col gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
            <span class="material-symbols-outlined text-[22px]">badge</span>
          </div>
          <h4 class="font-display font-semibold text-sm sm:text-base text-[#171717]">Identificação de Licitadores</h4>
          <p class="text-xs text-[#666666] leading-relaxed">
            Credenciação individual que garante lances genuínos e a integridade competitiva do pregão.
          </p>
        </div>

        <div class="p-5 rounded-xl bg-white border border-[#E7E3DC] shadow-xs flex flex-col gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
            <span class="material-symbols-outlined text-[22px]">payments</span>
          </div>
          <h4 class="font-display font-semibold text-sm sm:text-base text-[#171717]">Procedimentos de Pagamento</h4>
          <p class="text-xs text-[#666666] leading-relaxed">
            Liquidação bancária transparente em Meticais (MZN) através de canais e prazos regulamentados.
          </p>
        </div>

        <div class="p-5 rounded-xl bg-white border border-[#E7E3DC] shadow-xs flex flex-col gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
            <span class="material-symbols-outlined text-[22px]">gavel</span>
          </div>
          <h4 class="font-display font-semibold text-sm sm:text-base text-[#171717]">Regulamento de Leilão</h4>
          <p class="text-xs text-[#666666] leading-relaxed">
            Normas contratuais claras de disputa, preço de reserva confidencial e adjudicação formal.
          </p>
        </div>
      </div>
    </section>

    <!-- SECTION H: FINAL CTA (Visually strong dark section) -->
    <section class="max-w-[1440px] mx-auto px-4 sm:px-8 pb-12 sm:pb-20">
      <div class="rounded-2xl bg-[#171717] text-white p-8 sm:p-14 text-center flex flex-col items-center justify-center gap-4 sm:gap-6 relative overflow-hidden shadow-xl">
        <div class="max-w-xl flex flex-col gap-2">
          <h2 class="font-editorial text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
            Descubra o próximo grande negócio.
          </h2>
          <p class="text-xs sm:text-base text-[#AAAAAA] leading-relaxed">
            Explore activos exclusivos e participe nos próximos leilões da MozBid.
          </p>
        </div>

        <router-link
          to="/catalog"
          class="px-8 py-3.5 rounded-lg bg-[#B69A68] text-white hover:bg-[#967B48] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md flex items-center gap-2 no-underline"
        >
          <span>Explorar Leilões</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuctionStore } from '../../stores/auction';
import { formatMoneyDigits } from '../../utils/money';
import AuctionCard from '../../components/auction/AuctionCard.vue';
import AuctionTimer from '../../components/auction/AuctionTimer.vue';
import type { Auction } from '../../types';

const router = useRouter();
const auctionStore = useAuctionStore();

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedProvince = ref('all');

const categoryOptions = computed(() => {
  return auctionStore.categories.map(c => ({ label: c.name, value: c.slug }));
});

const provinceOptions = [
  { label: 'Todas as Províncias', value: 'all' },
  { label: 'Maputo Cidade', value: 'Maputo Cidade' },
  { label: 'Maputo Província', value: 'Maputo Província' },
  { label: 'Sofala', value: 'Sofala' },
  { label: 'Nampula', value: 'Nampula' },
  { label: 'Tete', value: 'Tete' },
  { label: 'Cabo Delgado', value: 'Cabo Delgado' }
];

const curatedCategories = [
  { name: 'Automóveis & Coleccionáveis', slug: 'automoveis-motos', image: '/images/products/porsche-911-gt3rs.jpg', count: 4 },
  { name: 'Relógios & Alta Joalharia', slug: 'relogios-joias', image: '/images/products/patek-philippe.jpg', count: 2 },
  { name: 'Maquinaria Pesada', slug: 'maquinas-industriais', image: '/images/products/cat-320-excavator.jpg', count: 2 },
  { name: 'Tecnologia & Servidores', slug: 'tecnologia-computadores', image: '/images/products/studio-servers.jpg', count: 2 },
  { name: 'Imobiliário Comercial', slug: 'imobiliario-terrenos', image: '/images/products/land-cruiser-300.jpg', count: 1 },
  { name: 'Arte & Património', slug: 'arte-colecionaveis', image: '/images/products/rolex-submariner.jpg', count: 1 }
];

const heroLot = computed(() => {
  return auctionStore.activeAuctions.find((a: Auction) => a.id === 1) || auctionStore.activeAuctions[0] || null;
});

const featuredList = computed(() => {
  return auctionStore.activeAuctions.slice(0, 4);
});

onMounted(async () => {
  await Promise.all([
    auctionStore.fetchCategories(),
    auctionStore.fetchAuctions({ limit: 12 })
  ]);
});

function executeSearch() {
  const query: Record<string, string> = {};
  if (searchQuery.value.trim()) query.search = searchQuery.value.trim();
  if (selectedCategory.value !== 'all') query.category = selectedCategory.value;
  if (selectedProvince.value !== 'all') query.province = selectedProvince.value;

  router.push({ path: '/catalog', query });
}

function onHeroImgError(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.src = '/images/products/porsche-911-gt3rs.jpg';
  }
}
</script>
