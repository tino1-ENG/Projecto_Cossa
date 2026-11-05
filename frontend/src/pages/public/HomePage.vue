<template>
  <q-page class="w-full bg-surface text-on-surface min-h-screen">
    <!-- SECTION 1: HERO & LIVE DISPUTE SHOWCASE -->
    <section class="relative w-full pt-space-xl pb-space-3xl overflow-hidden">
      <!-- Subtle Ambient Core Glow Behind Content -->
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[140px] pointer-events-none rounded-full"></div>

      <div class="max-w-[1440px] mx-auto px-4 sm:px-margin relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">
          <!-- Left Column: Copy & Value Proposition -->
          <div class="lg:col-span-7 flex flex-col gap-space-md sm:gap-space-lg">
            <!-- Origin Pill -->
            <div class="inline-flex items-center gap-space-xs px-2.5 sm:px-space-md py-1 rounded-full bg-surface-container-high border border-white/[0.08] w-fit shadow-sm max-w-full">
              <span class="w-2 h-2 rounded-full bg-primary animate-ping shrink-0"></span>
              <span class="font-label-caps text-[10px] sm:text-label-caps text-primary tracking-widest uppercase font-bold truncate">🇲🇿 Casa Oficial de Leilões de Luxo de Moçambique</span>
            </div>

            <!-- Main Headline -->
            <h1 class="text-3xl sm:text-4xl md:text-[56px] leading-tight sm:leading-[44px] md:leading-[64px] font-bold text-on-surface tracking-tight font-display">
              Descubra Leilões Exclusivos. <br class="hidden sm:inline" />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-fixed">Licite com Confiança.</span>
            </h1>

            <!-- Subtitle -->
            <p class="font-body-md sm:font-body-lg text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
              A plataforma soberana em Moçambique para aquisição de frotas executivas, supercarros, relógios de coleção e maquinaria industrial com liquidação em Meticais (MZN) e custódia bancária fiduciária.
            </p>

            <!-- Action Buttons via Quasar -->
            <div class="flex flex-wrap items-center gap-space-md pt-2">
              <q-btn
                unelevated
                no-caps
                color="primary"
                text-color="dark"
                icon-right="arrow_forward"
                label="Explorar Leilões"
                to="/catalog"
                class="font-bold text-sm px-6 py-3 rounded-lg shadow-xl shimmer-gold active-press"
              />
              <q-btn
                outline
                no-caps
                color="primary"
                icon="verified"
                label="Começar a Vender"
                to="/seller/dashboard"
                class="font-semibold text-sm px-5 py-3 rounded-lg border border-primary/40 hover:bg-primary/10 active-press"
              />
            </div>

            <!-- Quick Metrics Bar -->
            <div class="grid grid-cols-3 gap-2 sm:gap-space-md pt-space-md border-t border-white/[0.08] max-w-lg mt-2">
              <div class="flex flex-col">
                <span class="text-lg sm:text-headline-sm text-primary font-bold font-display">2.4B MZN</span>
                <span class="text-[10px] sm:text-body-sm text-on-surface-variant/70 uppercase font-label-caps">Volume Transacionado</span>
              </div>
              <div class="flex flex-col border-l border-white/[0.08] pl-2 sm:pl-space-md">
                <span class="text-lg sm:text-headline-sm text-on-surface font-bold font-display">100%</span>
                <span class="text-[10px] sm:text-body-sm text-on-surface-variant/70 uppercase font-label-caps">Custódia Escrow</span>
              </div>
              <div class="flex flex-col border-l border-white/[0.08] pl-2 sm:pl-space-md">
                <span class="text-lg sm:text-headline-sm text-on-surface font-bold font-display">14,200+</span>
                <span class="text-[10px] sm:text-body-sm text-on-surface-variant/70 uppercase font-label-caps">Licitadores Ativos</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Featured Live Car HUD Card with Quasar Card -->
          <div class="lg:col-span-5 relative">
            <q-card class="relative rounded-2xl overflow-hidden bg-surface-container border border-white/[0.12] shadow-2xl group" flat>
              <!-- Hero Vehicle Image with Quasar Image -->
              <div class="relative w-full aspect-[4/3] bg-surface-container-lowest overflow-hidden">
                <q-img
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  :src="heroLot?.primary_image || '/images/products/porsche-911-gt3rs.jpg'"
                  :alt="heroLot?.title || 'Porsche 911 GT3 RS Clubsport'"
                  :ratio="4/3"
                >
                  <template v-slot:error>
                    <img src="/images/products/porsche-911-gt3rs.jpg" alt="" class="w-full h-full object-cover" />
                  </template>
                </q-img>
                <div class="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-black/40 pointer-events-none"></div>

                <!-- Header HUD on Image -->
                <div class="absolute top-space-md left-space-md right-space-md flex items-center justify-between z-10">
                  <q-badge
                    color="dark"
                    text-color="primary"
                    class="px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/[0.1] font-bold text-[10px] flex items-center gap-1.5"
                  >
                    <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span>LOTE #{{ heroLot?.id || '408' }} • EM DESTAQUE AO VIVO</span>
                  </q-badge>
                  <q-badge
                    color="dark"
                    text-color="white"
                    class="px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono"
                    :label="(heroLot?.location_city || 'ENTREPOSTO ADUANEIRO DE MAPUTO').toUpperCase()"
                  />
                </div>

                <!-- Bottom Countdown Ribbon on Image -->
                <div class="absolute bottom-space-md left-space-md right-space-md flex items-end justify-between z-10">
                  <div>
                    <span class="font-label-caps text-[10px] text-on-surface-variant uppercase">Termina em:</span>
                    <div class="font-headline-sm text-headline-sm text-primary font-bold tracking-wider">
                      <AuctionTimer v-if="heroLot" :ends-at="heroLot.ends_at" />
                      <span v-else>04h 12m 30s</span>
                    </div>
                  </div>
                  <q-badge
                    color="primary"
                    text-color="dark"
                    class="px-2.5 py-1 font-bold text-[11px]"
                    label="RESERVA ATINGIDA"
                  />
                </div>
              </div>

              <!-- Card Info Body -->
              <q-card-section class="p-space-lg flex flex-col gap-space-md">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="font-body-sm text-body-sm text-on-surface-variant">
                      {{ heroLot?.subtitle || '2023 • 4.0L Boxer 6 • 525 CV' }}
                    </span>
                    <span class="font-label-numeric text-label-numeric text-on-surface-variant">
                      {{ heroLot?.bid_count || 38 }} Licitações
                    </span>
                  </div>
                  <h3 class="font-headline-sm text-headline-sm text-on-surface mt-1 font-bold">
                    {{ heroLot?.title || 'Porsche 911 GT3 RS Clubsport' }}
                  </h3>
                </div>

                <!-- Bottom Valuation Row -->
                <div class="p-space-md rounded-xl bg-surface-container-low border border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div class="flex flex-col">
                    <span class="font-label-caps text-label-caps text-on-surface-variant text-[10px]">Licitação Atual Mais Alta</span>
                    <span class="font-currency-display text-[22px] sm:text-[28px] text-on-surface font-extrabold font-display">
                      {{ formatMoneyDigits(heroLot?.current_price || 1845000000) }}
                      <span class="text-body-sm font-label-caps text-primary">MZN</span>
                    </span>
                  </div>
                  <q-btn
                    :to="heroLot ? `/auctions/${heroLot.id}` : '/catalog'"
                    unelevated
                    no-caps
                    color="primary"
                    text-color="dark"
                    icon-right="arrow_forward"
                    label="Licitar em Meticais"
                    class="px-5 py-2.5 rounded-lg font-bold text-xs uppercase shadow-lg shimmer-gold active-press"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: FLOATING MULTI-PARAMETRIC SEARCH BAR WITH QUASAR CONTROLS -->
    <section class="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-margin -mt-space-md">
      <q-card class="w-full bg-surface-container rounded-2xl p-space-md sm:p-space-lg border border-white/[0.08] shadow-2xl" flat>
        <!-- Category Filter Tabs via Quasar Chips -->
        <div class="flex items-center gap-2 overflow-x-auto pb-space-sm mb-space-md scrollbar-none border-b border-white/[0.06]">
          <q-btn
            v-for="tab in filterTabs"
            :key="tab.slug"
            dense
            unelevated
            no-caps
            rounded
            :color="selectedTab === tab.slug ? 'primary' : 'surface-container-high'"
            :text-color="selectedTab === tab.slug ? 'dark' : 'white'"
            class="px-3.5 py-1 text-xs font-bold transition-all"
            :label="tab.name"
            @click="selectTab(tab.slug)"
          />
        </div>

        <!-- Inputs Row via Quasar QInput & QSelect -->
        <form @submit.prevent="executeSearch" class="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
          <div class="md:col-span-4">
            <q-input
              v-model="searchQuery"
              dark
              filled
              dense
              color="primary"
              class="text-white"
              placeholder="Marca, modelo, referência ou lote..."
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </div>

          <div class="md:col-span-3">
            <q-select
              v-model="selectedCategory"
              :options="categoryOptions"
              dark
              filled
              dense
              emit-value
              map-options
              color="primary"
            />
          </div>

          <div class="md:col-span-3">
            <q-select
              v-model="selectedProvince"
              :options="provinceOptions"
              dark
              filled
              dense
              emit-value
              map-options
              color="primary"
            />
          </div>

          <div class="md:col-span-2">
            <q-btn
              type="submit"
              unelevated
              no-caps
              color="primary"
              text-color="dark"
              icon="manage_search"
              label="Pesquisar"
              class="w-full py-2.5 rounded-lg font-bold text-sm shadow-md shimmer-gold active-press"
            />
          </div>
        </form>

        <!-- Trust Badges Under Search -->
        <div class="flex flex-wrap items-center justify-between gap-space-md pt-space-md mt-space-sm border-t border-white/[0.04] text-on-surface-variant font-body-sm text-body-sm text-xs">
          <div class="flex items-center gap-space-xs">
            <q-icon name="verified" color="primary" size="18px" />
            <span>Vendedores Moçambicanos Verificados com NUIT</span>
          </div>
          <div class="flex items-center gap-space-xs">
            <q-icon name="lock" color="primary" size="18px" />
            <span>Custódia de Escrow Bancário Garantida em Meticais</span>
          </div>
          <div class="flex items-center gap-space-xs">
            <q-icon name="verified_user" color="primary" size="18px" />
            <span>Inspeção Física Notarial Pré-Leilão</span>
          </div>
        </div>
      </q-card>
    </section>

    <!-- SECTION 3: ENDING SOON AUCTIONS (LOTES CRÍTICOS EM DISPUTA) -->
    <section class="max-w-[1440px] mx-auto px-4 sm:px-margin py-space-xl sm:py-space-3xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg sm:mb-space-xl">
        <div class="flex flex-col gap-space-xs">
          <span class="font-label-caps text-label-caps uppercase tracking-wider text-error flex items-center gap-1.5 text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-error animate-ping"></span>
            Lotes Críticos em Disputa
          </span>
          <h2 class="text-2xl sm:text-headline-lg font-bold text-on-surface tracking-tight font-display">
            A Terminar em Breve
          </h2>
          <p class="font-body-md text-sm sm:text-base text-on-surface-variant">
            Segundos finais para submeter licitações fiduciárias antes do fecho irrevogável dos lotes.
          </p>
        </div>
        <q-btn
          flat
          no-caps
          color="primary"
          icon-right="arrow_forward"
          label="Ver Todas as Disputas"
          to="/catalog?sort=ending_soon"
          class="font-semibold text-sm"
        />
      </div>

      <!-- Grid of Ending Soon Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-gutter">
        <div v-for="item in endingSoonList" :key="item.id">
          <AuctionCard :auction="item" />
        </div>
      </div>
    </section>

    <!-- SECTION 4: FEATURED AUCTIONS (CURATED PORTFOLIO) -->
    <section class="w-full bg-surface-container-low py-space-xl sm:py-space-3xl border-y border-white/[0.04]">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-margin">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg sm:mb-space-xl">
          <div class="flex flex-col gap-space-xs">
            <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary text-xs font-bold">
              Registo Institucional de Moçambique
            </span>
            <h2 class="text-2xl sm:text-headline-lg font-bold text-on-surface tracking-tight font-display">
              Leilões em Destaque
            </h2>
            <p class="font-body-md text-sm sm:text-base text-on-surface-variant">
              Descubra artigos de referência selecionados das nossas sessões mais prestigiadas e concorridas.
            </p>
          </div>
          <q-btn
            flat
            no-caps
            color="primary"
            icon-right="arrow_forward"
            label="Explorar Catálogo Completo"
            to="/catalog?status=active"
            class="font-semibold text-sm"
          />
        </div>

        <!-- 4-Card Refined Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-gutter">
          <div v-for="item in featuredList" :key="item.id">
            <AuctionCard :auction="item" />
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: CATEGORY EXPLORATION TILES -->
    <section class="w-full max-w-[1440px] mx-auto px-4 sm:px-margin py-space-xl sm:py-space-3xl">
      <div class="flex flex-col items-center text-center gap-space-xs mb-space-xl sm:mb-space-2xl">
        <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary text-xs font-bold">Classificação de Ativos</span>
        <h2 class="text-2xl sm:text-headline-lg font-bold text-on-surface font-display">Explorar por Categoria</h2>
        <p class="font-body-md text-sm sm:text-base text-on-surface-variant max-w-xl">
          De frotas corporativas a peças de alta joalharia e maquinaria pesada, explore listagens verificadas em Moçambique.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-gutter">
        <q-card
          v-for="cat in categoryTiles"
          :key="cat.slug"
          class="group relative flex flex-col items-center justify-center p-space-md sm:p-space-lg rounded-xl bg-surface-container border border-white/[0.06] hover-luxury-lift cursor-pointer transition-all duration-300 shadow-md text-white"
          flat
          @click="$router.push(`/catalog?category=${cat.slug}`)"
        >
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface-container-low group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-black transition-all duration-300 mb-space-sm shadow-inner group-hover:scale-110">
            <q-icon :name="cat.icon" size="26px" />
          </div>
          <span class="font-title-md text-sm sm:text-title-md text-on-surface group-hover:text-primary transition-colors text-center line-clamp-1 font-semibold">
            {{ cat.name }}
          </span>
          <span class="font-body-sm text-[11px] sm:text-body-sm text-on-surface-variant/70 mt-1">
            {{ cat.count }} Lotes Ativos
          </span>
        </q-card>
      </div>
    </section>

    <!-- SECTION 6: HOW IT WORKS & SECURITY PROMISE -->
    <section class="w-full bg-surface-container-lowest py-space-xl sm:py-space-3xl relative overflow-hidden border-t border-white/[0.04]" id="how-it-works">
      <div class="max-w-[1440px] mx-auto px-4 sm:px-margin">
        <!-- Security Credential Banner -->
        <q-card class="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low p-space-lg sm:p-space-xl rounded-2xl border border-white/[0.08] shadow-xl mb-space-2xl sm:mb-space-3xl text-white" flat>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div class="lg:col-span-8 flex flex-col gap-space-sm">
              <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary text-xs font-bold">Proteção Financeira Institucional</span>
              <h3 class="text-xl sm:text-headline-lg font-bold text-on-surface font-display">O Padrão de Escrow e Conformidade da MozBid</h3>
              <p class="font-body-md sm:font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Cada lance em Meticais na MozBid é totalmente respaldado por custódia fiduciária (escrow) em instituições bancárias comerciais autorizadas em Moçambique. Depósitos de licitações não vencedoras são libertados imediatamente após a conclusão do lote.
              </p>
            </div>
            <div class="lg:col-span-4 flex flex-col sm:flex-row items-center justify-end gap-space-md">
              <div class="w-full sm:w-auto p-space-md rounded-xl bg-surface-container-high/80 border border-white/[0.06] text-center flex flex-col items-center">
                <q-icon name="lock" color="primary" size="32px" class="mb-1" />
                <span class="font-title-md text-title-md text-on-surface font-bold">Depósito Sem Risco</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">Libertação Imediata</span>
              </div>
              <div class="w-full sm:w-auto p-space-md rounded-xl bg-surface-container-high/80 border border-white/[0.06] text-center flex flex-col items-center">
                <q-icon name="verified_user" color="primary" size="32px" class="mb-1" />
                <span class="font-title-md text-title-md text-on-surface font-bold">KYC e NUIT</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">Conforme Legislação</span>
              </div>
            </div>
          </div>
        </q-card>

        <!-- 3-Step Flow Heading -->
        <div class="text-center max-w-xl mx-auto mb-space-2xl">
          <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary text-xs font-bold">Execução Transparente</span>
          <h2 class="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">Como Funciona</h2>
          <p class="font-body-md text-body-md text-on-surface-variant mt-2">
            Processo de aquisição institucional transparente conduzido em três fases estruturadas.
          </p>
        </div>

        <!-- 3-Step Cards with Quasar Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <!-- Step 1 -->
          <q-card class="p-space-xl rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-space-lg relative overflow-hidden group hover:bg-surface-container-high transition-colors text-white" flat>
            <div class="flex items-center justify-between">
              <span class="font-headline-lg text-[48px] font-bold text-primary/30 group-hover:text-primary transition-colors">01</span>
              <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
                <q-icon name="badge" size="24px" />
              </div>
            </div>
            <div>
              <h4 class="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">Registo e Validação de Identidade</h4>
              <p class="font-body-md text-body-md text-on-surface-variant text-sm">
                Submeta o seu NUIT e documentação oficial para credenciação célere. O nosso departamento de conformidade valida licitadores nacionais e estrangeiros em minutos.
              </p>
            </div>
            <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1 font-bold text-xs">
              Validação Instantânea de NUIT <q-icon name="check" size="16px" />
            </span>
          </q-card>

          <!-- Step 2 -->
          <q-card class="p-space-xl rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-space-lg relative overflow-hidden group hover:bg-surface-container-high transition-colors text-white" flat>
            <div class="flex items-center justify-between">
              <span class="font-headline-lg text-[48px] font-bold text-primary/30 group-hover:text-primary transition-colors">02</span>
              <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
                <q-icon name="gavel" size="24px" />
              </div>
            </div>
            <div>
              <h4 class="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">Licitação com Garantia Fiduciária</h4>
              <p class="font-body-md text-body-md text-on-surface-variant text-sm">
                Participe em salas de leilão ao vivo com controlos de incremento em tempo real. Configure licitações automáticas ou licite diretamente em Meticais (MZN).
              </p>
            </div>
            <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1 font-bold text-xs">
              Ligação Bancária Segura <q-icon name="check" size="16px" />
            </span>
          </q-card>

          <!-- Step 3 -->
          <q-card class="p-space-xl rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-space-lg relative overflow-hidden group hover:bg-surface-container-high transition-colors text-white" flat>
            <div class="flex items-center justify-between">
              <span class="font-headline-lg text-[48px] font-bold text-primary/30 group-hover:text-primary transition-colors">03</span>
              <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
                <q-icon name="handshake" size="24px" />
              </div>
            </div>
            <div>
              <h4 class="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">Entrega Segura e Escritura</h4>
              <p class="font-body-md text-body-md text-on-surface-variant text-sm">
                Escritura e formalização notarial concluídas na nossa sede na Avenida Julius Nyerere, em Maputo, ou via transporte blindado porta-a-porta para Matola, Beira e Nampula.
              </p>
            </div>
            <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1 font-bold text-xs">
              Transferência Oficial de Titularidade <q-icon name="check" size="16px" />
            </span>
          </q-card>
        </div>
      </div>
    </section>
  </q-page>
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
const selectedTab = ref('all');
const selectedCategory = ref('all');
const selectedProvince = ref('all');

const filterTabs = [
  { name: 'Todos os Lotes', slug: 'all' },
  { name: 'Supercarros & Frotas', slug: 'automoveis-motos' },
  { name: 'Maquinaria Pesada', slug: 'maquinas-industriais' },
  { name: 'Tecnologia & TI', slug: 'tecnologia-computadores' },
  { name: 'Alta Relojoaria', slug: 'relogios-joias' },
  { name: 'Imobiliário & Concessões', slug: 'imobiliario-terrenos' }
];

const categoryOptions = computed(() => [
  { label: 'Todas as Categorias', value: 'all' },
  ...auctionStore.categories.map(c => ({ label: c.name, value: c.slug }))
]);

const provinceOptions = [
  { label: 'Todas as Províncias', value: 'all' },
  { label: 'Maputo Cidade', value: 'Maputo Cidade' },
  { label: 'Matola / Maputo Prov.', value: 'Maputo Província' },
  { label: 'Beira / Sofala', value: 'Sofala' },
  { label: 'Nampula', value: 'Nampula' },
  { label: 'Tete / Moatize', value: 'Tete' },
  { label: 'Pemba / Cabo Delgado', value: 'Cabo Delgado' }
];

const categoryTiles = computed(() => {
  return [
    { name: 'Automóveis & Colecionáveis', slug: 'automoveis-motos', icon: 'directions_car', count: 4 },
    { name: 'Maquinaria Pesada & Mineração', slug: 'maquinas-industriais', icon: 'precision_manufacturing', count: 2 },
    { name: 'Tecnologia & Servidores', slug: 'tecnologia-computadores', icon: 'devices', count: 2 },
    { name: 'Relógios & Alta Joalharia', slug: 'relogios-joias', icon: 'watch', count: 2 },
    { name: 'Imobiliário & Concessões', slug: 'imobiliario-terrenos', icon: 'domain', count: 1 },
    { name: 'Arte & Património Cultural', slug: 'arte-colecionaveis', icon: 'palette', count: 1 }
  ];
});

const heroLot = computed(() => {
  return auctionStore.activeAuctions.find((a: Auction) => a.id === 1) || auctionStore.activeAuctions[0] || null;
});

const endingSoonList = computed(() => {
  return [...auctionStore.activeAuctions]
    .sort((a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime())
    .slice(0, 4);
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

function selectTab(slug: string) {
  selectedTab.value = slug;
  selectedCategory.value = slug;
}

function executeSearch() {
  const query: Record<string, string> = {};
  if (searchQuery.value.trim()) query.search = searchQuery.value.trim();
  if (selectedCategory.value !== 'all') query.category = selectedCategory.value;
  if (selectedProvince.value !== 'all') query.province = selectedProvince.value;

  router.push({ path: '/catalog', query });
}
</script>
