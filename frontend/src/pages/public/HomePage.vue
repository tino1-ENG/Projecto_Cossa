<template>
  <div class="w-full bg-surface text-on-surface min-h-screen">
    <!-- SECTION 1: HERO & LIVE DISPUTE SHOWCASE -->
    <section class="relative w-full pt-space-xl pb-space-3xl overflow-hidden">
      <!-- Subtle Ambient Core Glow Behind Content -->
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[140px] pointer-events-none rounded-full"></div>

      <div class="max-w-[1440px] mx-auto px-margin relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          <!-- Left Column: Copy & Value Proposition -->
          <div class="lg:col-span-7 flex flex-col gap-space-lg">
            <!-- Origin Pill -->
            <div class="inline-flex items-center gap-space-xs px-space-md py-1 rounded bg-surface-container-high border border-white/[0.08] w-fit shadow-sm">
              <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span class="font-label-caps text-label-caps text-on-surface-variant">🇲🇿 A Principal Casa de Leilões de Luxo de Moçambique</span>
            </div>

            <!-- Main Headline -->
            <h1 class="font-headline-lg md:text-[56px] md:leading-[64px] font-bold text-on-surface tracking-tight">
              Descubra Leilões Exclusivos. <br class="hidden sm:inline" />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-fixed-dim to-on-surface">Licite com Confiança.</span>
            </h1>

            <!-- Subtitle -->
            <p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              A plataforma oficial em Moçambique para aquisição de frotas executivas, supercarros, relógios de coleção e maquinaria industrial com liquidação em Meticais (MZN).
            </p>

            <!-- Quick Metrics Bar -->
            <div class="grid grid-cols-3 gap-space-md pt-space-md border-t border-white/[0.08] max-w-lg">
              <div class="flex flex-col">
                <span class="font-headline-sm text-headline-sm text-on-surface font-semibold">2.4B MZN</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant/70">Volume Transacionado</span>
              </div>
              <div class="flex flex-col border-l border-white/[0.08] pl-space-md">
                <span class="font-headline-sm text-headline-sm text-on-surface font-semibold">100%</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant/70">Custódia em Escrow</span>
              </div>
              <div class="flex flex-col border-l border-white/[0.08] pl-space-md">
                <span class="font-headline-sm text-headline-sm text-on-surface font-semibold">14,200+</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant/70">Licitadores Ativos</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Featured Live Car HUD Card -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-2xl overflow-hidden bg-surface-container border border-white/[0.12] shadow-2xl group">
              <!-- Hero Vehicle Image -->
              <div class="relative w-full aspect-[4/3] bg-surface-container-lowest overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  :src="heroLot?.primary_image || '/images/products/porsche-911-gt3rs.jpg'"
                  :alt="heroLot?.title || 'Porsche 911 GT3 RS Clubsport'"
                  @error="(e) => ((e.target as HTMLImageElement).src = '/images/products/porsche-911-gt3rs.jpg')"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-black/40"></div>

                <!-- Header HUD on Image -->
                <div class="absolute top-space-md left-space-md right-space-md flex items-center justify-between">
                  <span class="px-space-sm py-1 rounded bg-black/60 backdrop-blur-md border border-white/[0.1] text-primary font-label-caps text-label-caps flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    LOTE #{{ heroLot?.id || '408' }} • EM DESTAQUE AO VIVO
                  </span>
                  <span class="px-space-sm py-1 rounded bg-black/60 backdrop-blur-md border border-white/[0.1] text-on-surface font-label-numeric text-[11px]">
                    {{ (heroLot?.location_city || 'ENTREPOSTO ADUANEIRO DE MAPUTO').toUpperCase() }}
                  </span>
                </div>

                <!-- Bottom Countdown Ribbon on Image -->
                <div class="absolute bottom-space-md left-space-md right-space-md flex items-end justify-between">
                  <div>
                    <span class="font-label-caps text-[10px] text-on-surface-variant uppercase">Termina em:</span>
                    <div class="font-headline-sm text-headline-sm text-primary font-bold tracking-wider">
                      <AuctionTimer v-if="heroLot" :ends-at="heroLot.ends_at" />
                      <span v-else>04h 12m 30s</span>
                    </div>
                  </div>
                  <span class="px-space-sm py-1 rounded bg-primary/20 border border-primary text-primary font-label-caps text-[11px] font-bold">
                    RESERVA ATINGIDA
                  </span>
                </div>
              </div>

              <!-- Card Info Body -->
              <div class="p-space-lg flex flex-col gap-space-md">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="font-body-sm text-body-sm text-on-surface-variant">
                      {{ heroLot?.subtitle || '2023 • 4.0L Boxer 6 • 525 CV' }}
                    </span>
                    <span class="font-label-numeric text-label-numeric text-on-surface-variant">
                      {{ heroLot?.bid_count || 38 }} Licitações
                    </span>
                  </div>
                  <h3 class="font-headline-sm text-headline-sm text-on-surface mt-1">
                    {{ heroLot?.title || 'Porsche 911 GT3 RS Clubsport' }}
                  </h3>
                </div>

                <div class="p-space-md rounded-xl bg-surface-container-low border border-white/[0.06] flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="font-label-caps text-label-caps text-on-surface-variant">Licitação Atual Mais Alta</span>
                    <span class="font-currency-display text-[26px] sm:text-[28px] text-on-surface">
                      {{ formatMoneyDigits(heroLot?.current_price || 1845000000) }}
                      <span class="text-body-sm font-label-caps text-primary">MZN</span>
                    </span>
                  </div>
                  <router-link
                    :to="heroLot ? `/auctions/${heroLot.id}` : '/catalog'"
                    class="px-space-lg py-space-sm rounded bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-caps text-label-caps uppercase transition-all shadow-lg flex items-center gap-1.5"
                  >
                    <span>Licitar em Meticais</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: FLOATING MULTI-PARAMETRIC SEARCH BAR -->
    <section class="relative z-20 max-w-[1440px] mx-auto px-margin -mt-space-md">
      <div class="w-full bg-surface-container rounded-2xl p-space-md md:p-space-lg border border-white/[0.08] shadow-2xl">
        <!-- Category Filter Tabs -->
        <div class="flex items-center gap-space-xs overflow-x-auto pb-space-sm mb-space-md scrollbar-none border-b border-white/[0.06]">
          <button
            v-for="tab in filterTabs"
            :key="tab.slug"
            type="button"
            class="px-space-md py-1.5 rounded-full font-label-caps text-label-caps whitespace-nowrap transition-colors"
            :class="selectedTab === tab.slug ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'"
            @click="selectTab(tab.slug)"
          >
            {{ tab.name }}
          </button>
        </div>

        <!-- Inputs Row -->
        <form @submit.prevent="executeSearch" class="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
          <div class="md:col-span-4 relative">
            <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              v-model="searchQuery"
              class="w-full bg-surface-container-low border border-white/[0.08] rounded-lg pl-12 pr-space-md py-space-sm text-on-surface placeholder:text-on-surface-variant/50 font-body-md text-body-md focus:outline-none focus:border-primary"
              placeholder="Marca, modelo, referência ou lote..."
              type="text"
            />
          </div>

          <div class="md:col-span-3">
            <select
              v-model="selectedCategory"
              class="w-full bg-surface-container-low border border-white/[0.08] rounded-lg px-space-md py-space-sm text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            >
              <option value="all">Todas as Categorias</option>
              <option v-for="cat in auctionStore.categories" :key="cat.id" :value="cat.slug">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="md:col-span-3">
            <select
              v-model="selectedProvince"
              class="w-full bg-surface-container-low border border-white/[0.08] rounded-lg px-space-md py-space-sm text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            >
              <option value="all">Todas as Províncias</option>
              <option value="Maputo Cidade">Maputo Cidade</option>
              <option value="Maputo Província">Matola / Maputo Prov.</option>
              <option value="Sofala">Beira / Sofala</option>
              <option value="Nampula">Nampula</option>
              <option value="Tete">Tete / Moatize</option>
              <option value="Cabo Delgado">Pemba / Cabo Delgado</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <button
              class="w-full py-space-sm rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-headline-sm text-title-md transition-all shadow-md flex items-center justify-center gap-space-xs"
              type="submit"
            >
              <span class="material-symbols-outlined text-[20px]">manage_search</span>
              <span>Pesquisar</span>
            </button>
          </div>
        </form>

        <!-- Trust Badges Under Search -->
        <div class="flex flex-wrap items-center justify-between gap-space-md pt-space-md mt-space-sm border-t border-white/[0.04] text-on-surface-variant font-body-sm text-body-sm">
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary text-[18px]">verified</span>
            <span>Vendedores Moçambicanos Verificados com NUIT</span>
          </div>
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary text-[18px]">lock</span>
            <span>Custódia de Escrow Bancário Garantida em Meticais</span>
          </div>
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            <span>Inspeção Física Notarial Pré-Leilão</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: ENDING SOON AUCTIONS (LOTES CRÍTICOS EM DISPUTA) -->
    <section class="max-w-[1440px] mx-auto px-margin py-space-3xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
        <div class="flex flex-col gap-space-xs">
          <span class="font-label-caps text-label-caps uppercase tracking-wider text-error flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-error animate-ping"></span>
            Lotes Críticos em Disputa
          </span>
          <h2 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            A Terminar em Breve
          </h2>
          <p class="font-body-md text-body-md text-on-surface-variant">
            Segundos finais para submeter licitações fiduciárias antes do fecho irrevogável dos lotes.
          </p>
        </div>
        <router-link
          to="/catalog?sort=ending_soon"
          class="font-title-md text-title-md text-primary hover:underline flex items-center gap-1"
        >
          <span>Ver Todas as Disputas</span>
          <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </router-link>
      </div>

      <!-- Grid of Ending Soon Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div v-for="item in endingSoonList" :key="item.id">
          <AuctionCard :auction="item" />
        </div>
      </div>
    </section>

    <!-- SECTION 4: FEATURED AUCTIONS (CURATED PORTFOLIO) -->
    <section class="w-full bg-surface-container-low py-space-3xl border-y border-white/[0.04]">
      <div class="max-w-[1440px] mx-auto px-margin">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
          <div class="flex flex-col gap-space-xs">
            <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary">
              Registo Institucional de Moçambique
            </span>
            <h2 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Leilões em Destaque
            </h2>
            <p class="font-body-md text-body-md text-on-surface-variant">
              Descubra artigos de referência selecionados das nossas sessões mais prestigiadas e concorridas.
            </p>
          </div>
          <router-link
            to="/catalog?status=active"
            class="font-title-md text-title-md text-primary hover:underline flex items-center gap-1"
          >
            <span>Explorar Catálogo Completo</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </router-link>
        </div>

        <!-- 4-Card Refined Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <div v-for="item in featuredList" :key="item.id">
            <AuctionCard :auction="item" />
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: CATEGORY EXPLORATION TILES -->
    <section class="w-full max-w-[1440px] mx-auto px-margin py-space-3xl">
      <div class="flex flex-col items-center text-center gap-space-xs mb-space-2xl">
        <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary">Classificação de Ativos</span>
        <h2 class="font-headline-lg text-headline-lg text-on-surface">Explorar por Categoria</h2>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-xl">
          De frotas corporativas a peças de alta joalharia e maquinaria pesada, explore listagens verificadas em Moçambique.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        <router-link
          v-for="cat in categoryTiles"
          :key="cat.slug"
          :to="`/catalog?category=${cat.slug}`"
          class="group relative flex flex-col items-center justify-center p-space-lg rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/[0.06] hover:border-primary/40 transition-all duration-300 shadow-md"
        >
          <div class="w-14 h-14 rounded-full bg-surface-container-low group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-on-primary transition-colors mb-space-sm shadow-inner">
            <span class="material-symbols-outlined text-[28px]">{{ cat.icon }}</span>
          </div>
          <span class="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors text-center">
            {{ cat.name }}
          </span>
          <span class="font-body-sm text-body-sm text-on-surface-variant/70 mt-1">
            {{ cat.count }} Lotes Ativos
          </span>
        </router-link>
      </div>
    </section>

    <!-- SECTION 6: HOW IT WORKS & SECURITY PROMISE -->
    <section class="w-full bg-surface-container-lowest py-space-3xl relative overflow-hidden border-t border-white/[0.04]" id="how-it-works">
      <div class="max-w-[1440px] mx-auto px-margin">
        <!-- Security Credential Banner -->
        <div class="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low p-space-xl rounded-2xl border border-white/[0.08] shadow-xl mb-space-3xl">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div class="lg:col-span-8 flex flex-col gap-space-sm">
              <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary">Proteção Financeira Institucional</span>
              <h3 class="font-headline-lg text-headline-lg text-on-surface">O Padrão de Escrow e Conformidade da MozBid</h3>
              <p class="font-body-lg text-body-lg text-on-surface-variant">
                Cada lance em Meticais na MozBid é totalmente respaldado por custódia fiduciária (escrow) em instituições bancárias comerciais autorizadas em Moçambique. Depósitos de licitações não vencedoras são libertados imediatamente após a conclusão do lote.
              </p>
            </div>
            <div class="lg:col-span-4 flex flex-col sm:flex-row items-center justify-end gap-space-md">
              <div class="w-full sm:w-auto p-space-md rounded-xl bg-surface-container-high/80 border border-white/[0.06] text-center flex flex-col items-center">
                <span class="material-symbols-outlined text-primary text-[32px] mb-1">lock</span>
                <span class="font-title-md text-title-md text-on-surface">Depósito Sem Risco</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">Libertação Imediata</span>
              </div>
              <div class="w-full sm:w-auto p-space-md rounded-xl bg-surface-container-high/80 border border-white/[0.06] text-center flex flex-col items-center">
                <span class="material-symbols-outlined text-primary text-[32px] mb-1">verified_user</span>
                <span class="font-title-md text-title-md text-on-surface">KYC e NUIT</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">Conforme Legislação</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3-Step Flow Heading -->
        <div class="text-center max-w-xl mx-auto mb-space-2xl">
          <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary">Execução Transparente</span>
          <h2 class="font-headline-lg text-headline-lg text-on-surface mt-1">Como Funciona</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-2">
            Processo de aquisição institucional transparente conduzido em três fases estruturadas.
          </p>
        </div>

        <!-- 3-Step Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <!-- Step 1 -->
          <div class="p-space-xl rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-space-lg relative overflow-hidden group hover:bg-surface-container-high transition-colors">
            <div class="flex items-center justify-between">
              <span class="font-headline-lg text-[48px] font-bold text-primary/30 group-hover:text-primary transition-colors">01</span>
              <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
                <span class="material-symbols-outlined text-[24px]">badge</span>
              </div>
            </div>
            <div>
              <h4 class="font-headline-sm text-headline-sm text-on-surface mb-2">Registo e Validação de Identidade</h4>
              <p class="font-body-md text-body-md text-on-surface-variant">
                Submeta o seu NUIT e documentação oficial para credenciação célere. O nosso departamento de conformidade valida licitadores nacionais e estrangeiros em minutos.
              </p>
            </div>
            <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1">
              Validação Instantânea de NUIT <span class="material-symbols-outlined text-[16px]">check</span>
            </span>
          </div>

          <!-- Step 2 -->
          <div class="p-space-xl rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-space-lg relative overflow-hidden group hover:bg-surface-container-high transition-colors">
            <div class="flex items-center justify-between">
              <span class="font-headline-lg text-[48px] font-bold text-primary/30 group-hover:text-primary transition-colors">02</span>
              <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
                <span class="material-symbols-outlined text-[24px]">gavel</span>
              </div>
            </div>
            <div>
              <h4 class="font-headline-sm text-headline-sm text-on-surface mb-2">Licitação com Garantia Fiduciária</h4>
              <p class="font-body-md text-body-md text-on-surface-variant">
                Participe em salas de leilão ao vivo com controlos de incremento em tempo real. Configure licitações automáticas ou licite diretamente em Meticais (MZN).
              </p>
            </div>
            <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1">
              Ligação Bancária Segura <span class="material-symbols-outlined text-[16px]">check</span>
            </span>
          </div>

          <!-- Step 3 -->
          <div class="p-space-xl rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-space-lg relative overflow-hidden group hover:bg-surface-container-high transition-colors">
            <div class="flex items-center justify-between">
              <span class="font-headline-lg text-[48px] font-bold text-primary/30 group-hover:text-primary transition-colors">03</span>
              <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
                <span class="material-symbols-outlined text-[24px]">handshake</span>
              </div>
            </div>
            <div>
              <h4 class="font-headline-sm text-headline-sm text-on-surface mb-2">Entrega Segura e Escritura</h4>
              <p class="font-body-md text-body-md text-on-surface-variant">
                Escritura e formalização notarial concluídas na nossa sede na Avenida Julius Nyerere, em Maputo, ou via transporte blindado porta-a-porta para Matola, Beira e Nampula.
              </p>
            </div>
            <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1">
              Transferência Oficial de Titularidade <span class="material-symbols-outlined text-[16px]">check</span>
            </span>
          </div>
        </div>

        <!-- Quick Action Lead Banner -->
        <div class="mt-space-3xl p-space-2xl rounded-2xl bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container border border-white/[0.08] text-center flex flex-col items-center gap-space-md">
          <h3 class="font-headline-lg text-headline-lg text-on-surface max-w-2xl">
            Consigne os Seus Ativos de Alto Valor na Principal Plataforma de Leilões de Moçambique
          </h3>
          <p class="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Obtenha acesso direto a colecionadores privados certificados, consórcios de mineração e compradores institucionais em Moçambique e em toda a região da SADC.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
            <router-link
              to="/seller/dashboard"
              class="px-space-xl py-space-md rounded bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-fixed-dim transition-all shadow-xl"
            >
              Solicitar Avaliação de Lote
            </router-link>
            <router-link
              to="/how-it-works"
              class="px-space-lg py-space-md rounded bg-surface-container-low border border-white/[0.08] text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest transition-all"
            >
              Consultar Regulamento Notarial
            </router-link>
          </div>
        </div>
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

const router = useRouter();
const auctionStore = useAuctionStore();

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedProvince = ref('all');
const selectedTab = ref('all');

const filterTabs = [
  { name: 'Todos os Leilões', slug: 'all' },
  { name: 'Automóvel', slug: 'automoveis-motos' },
  { name: 'Relojoaria', slug: 'relogios-joias' },
  { name: 'Imobiliário', slug: 'imobiliario-terrenos' },
  { name: 'Maquinaria Pesada', slug: 'maquinas-industriais' }
];

const categoryTiles = [
  { name: 'Automóveis', slug: 'automoveis-motos', icon: 'directions_car', count: 142 },
  { name: 'Motociclos', slug: 'automoveis-motos', icon: 'two_wheeler', count: 29 },
  { name: 'Eletrónica e TI', slug: 'tecnologia-computadores', icon: 'devices', count: 68 },
  { name: 'Relógios e Joalharia', slug: 'relogios-joias', icon: 'watch', count: 54 },
  { name: 'Imobiliário Prime', slug: 'imobiliario-terrenos', icon: 'domain', count: 18 },
  { name: 'Equipamento Industrial', slug: 'maquinas-industriais', icon: 'precision_manufacturing', count: 73 },
  { name: 'Liquidação Comercial', slug: 'outros', icon: 'storefront', count: 35 },
  { name: 'Arte e Colecionáveis', slug: 'arte-colecionaveis', icon: 'palette', count: 21 }
];

const heroLot = computed(() => {
  return auctionStore.featuredAuctions[0] || auctionStore.auctions[0];
});

const endingSoonList = computed(() => {
  return auctionStore.endingSoonAuctions.slice(0, 4);
});

const featuredList = computed(() => {
  return auctionStore.featuredAuctions.slice(0, 4);
});

function selectTab(slug: string) {
  selectedTab.value = slug;
  if (slug === 'all') {
    selectedCategory.value = 'all';
  } else {
    selectedCategory.value = slug;
  }
}

function executeSearch() {
  const query: Record<string, string> = {};
  if (searchQuery.value) query.q = searchQuery.value;
  if (selectedCategory.value !== 'all') query.category = selectedCategory.value;
  if (selectedProvince.value !== 'all') query.province = selectedProvince.value;
  router.push({ path: '/catalog', query });
}

onMounted(async () => {
  await Promise.all([
    auctionStore.fetchFeatured(),
    auctionStore.fetchEndingSoon(),
    auctionStore.fetchCategories()
  ]);
});
</script>
