<template>
  <q-page class="w-full bg-surface text-on-surface min-h-screen">
    <!-- SECTION 1: HERO & LIVE DISPUTE SHOWCASE -->
    <section class="relative w-full pt-4 sm:pt-space-xl pb-6 sm:pb-space-3xl overflow-hidden">
      <!-- Subtle Ambient Core Glow Behind Content -->
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 blur-[140px] pointer-events-none rounded-full"></div>

      <div class="max-w-[1440px] mx-auto px-3 sm:px-margin relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-space-lg lg:gap-space-xl items-center">
          <!-- Left Column: Copy & Value Proposition -->
          <div class="lg:col-span-7 flex flex-col gap-3 sm:gap-space-md">
            <!-- Origin Pill -->
            <div class="inline-flex items-center gap-1.5 px-2.5 sm:px-space-md py-1 rounded-full bg-surface-container-high border border-white/[0.08] w-fit shadow-sm max-w-full">
              <span class="w-2 h-2 rounded-full bg-primary animate-ping shrink-0"></span>
              <span class="font-label-caps text-[9px] sm:text-label-caps text-primary tracking-widest uppercase font-bold truncate">🇲🇿 Leilões de Luxo • Moçambique</span>
            </div>

            <!-- Main Headline -->
            <h1 class="text-2xl sm:text-4xl md:text-[52px] leading-tight sm:leading-[44px] md:leading-[60px] font-bold text-on-surface tracking-tight font-display">
              Descubra Leilões Exclusivos. <br class="hidden sm:inline" />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-fixed">Licite com Confiança.</span>
            </h1>

            <!-- Subtitle -->
            <p class="font-body-md text-xs sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
              A plataforma soberana em Moçambique para aquisição de frotas executivas, supercarros, relógios de coleção e maquinaria industrial com liquidação em Meticais (MZN) e custódia bancária fiduciária.
            </p>

            <!-- Action Buttons via Quasar -->
            <div class="flex flex-wrap items-center gap-2 sm:gap-space-md pt-1">
              <q-btn
                unelevated
                no-caps
                color="primary"
                text-color="dark"
                icon-right="arrow_forward"
                label="Explorar Leilões"
                to="/catalog"
                class="font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-xl shimmer-gold active-press"
              />
              <q-btn
                outline
                no-caps
                color="primary"
                icon="verified"
                label="Começar a Vender"
                to="/seller/dashboard"
                class="font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-3 rounded-lg border border-primary/40 hover:bg-primary/10 active-press"
              />
            </div>

            <!-- Quick Metrics Bar -->
            <div class="grid grid-cols-3 gap-2 sm:gap-space-md pt-2 sm:pt-space-md border-t border-white/[0.08] max-w-lg mt-1">
              <div class="flex flex-col">
                <span class="text-base sm:text-headline-sm text-primary font-bold font-display">2.4B MZN</span>
                <span class="text-[9px] sm:text-body-sm text-on-surface-variant/70 uppercase font-label-caps truncate">Volume Total</span>
              </div>
              <div class="flex flex-col border-l border-white/[0.08] pl-2 sm:pl-space-md">
                <span class="text-base sm:text-headline-sm text-on-surface font-bold font-display">100%</span>
                <span class="text-[9px] sm:text-body-sm text-on-surface-variant/70 uppercase font-label-caps truncate">Escrow Bancário</span>
              </div>
              <div class="flex flex-col border-l border-white/[0.08] pl-2 sm:pl-space-md">
                <span class="text-base sm:text-headline-sm text-on-surface font-bold font-display">14,200+</span>
                <span class="text-[9px] sm:text-body-sm text-on-surface-variant/70 uppercase font-label-caps truncate">Licitadores</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Featured Live Car HUD Card with Quasar Card -->
          <div class="lg:col-span-5 relative mt-3 lg:mt-0">
            <q-card class="relative rounded-xl sm:rounded-2xl overflow-hidden bg-surface-container border border-white/[0.12] shadow-2xl group" flat>
              <!-- Hero Vehicle Image with Quasar Image -->
              <div class="relative w-full aspect-[16/10] sm:aspect-[4/3] bg-surface-container-lowest overflow-hidden">
                <q-img
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  :src="heroLot?.primary_image || '/images/products/porsche-911-gt3rs.jpg'"
                  :alt="heroLot?.title || 'Porsche 911 GT3 RS Clubsport'"
                  :ratio="16/10"
                >
                  <template v-slot:error>
                    <img src="/images/products/porsche-911-gt3rs.jpg" alt="" class="w-full h-full object-cover" />
                  </template>
                </q-img>
                <div class="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-black/40 pointer-events-none"></div>

                <!-- Header HUD on Image -->
                <div class="absolute top-2 sm:top-space-md left-2 sm:left-space-md right-2 sm:right-space-md flex items-center justify-between z-10 gap-1">
                  <q-badge
                    color="dark"
                    text-color="primary"
                    class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-black/80 backdrop-blur-md border border-white/[0.1] font-bold text-[9px] sm:text-[10px] flex items-center gap-1.5"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span>LOTE #{{ heroLot?.id || '408' }} • AO VIVO</span>
                  </q-badge>
                  <q-badge
                    color="dark"
                    text-color="white"
                    class="hidden xs:inline-flex sm:inline-flex px-2 py-0.5 sm:px-2 sm:py-1 rounded bg-black/80 backdrop-blur-md border border-white/[0.1] text-[9px] sm:text-[10px] font-mono truncate max-w-[140px]"
                    :label="(heroLot?.location_city || 'MAPUTO').toUpperCase()"
                  />
                </div>

                <!-- Bottom Countdown Ribbon on Image -->
                <div class="absolute bottom-2 sm:bottom-space-md left-2 sm:left-space-md right-2 sm:right-space-md flex items-end justify-between z-10">
                  <div>
                    <span class="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant uppercase">Termina em:</span>
                    <div class="font-headline-sm text-sm sm:text-headline-sm text-primary font-bold tracking-wider">
                      <AuctionTimer v-if="heroLot" :ends-at="heroLot.ends_at" />
                      <span v-else>04h 12m 30s</span>
                    </div>
                  </div>
                  <q-badge
                    color="primary"
                    text-color="dark"
                    class="px-2 py-0.5 sm:px-2.5 sm:py-1 font-bold text-[9px] sm:text-[11px]"
                    label="RESERVA ATINGIDA"
                  />
                </div>
              </div>

              <!-- Card Info Body -->
              <q-card-section class="p-3 sm:p-space-lg flex flex-col gap-2.5 sm:gap-space-md">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="font-body-sm text-xs sm:text-body-sm text-on-surface-variant">
                      {{ heroLot?.subtitle || '2023 • 4.0L Boxer 6 • 525 CV' }}
                    </span>
                    <span class="font-label-numeric text-[11px] sm:text-label-numeric text-on-surface-variant">
                      {{ heroLot?.bid_count || 38 }} Licitações
                    </span>
                  </div>
                  <h3 class="font-headline-sm text-sm sm:text-headline-sm text-on-surface mt-0.5 font-bold line-clamp-1">
                    {{ heroLot?.title || 'Porsche 911 GT3 RS Clubsport' }}
                  </h3>
                </div>

                <!-- Bottom Valuation Row -->
                <div class="p-2.5 sm:p-space-md rounded-xl bg-surface-container-low border border-white/[0.06] flex items-center justify-between gap-2">
                  <div class="flex flex-col">
                    <span class="font-label-caps text-label-caps text-on-surface-variant text-[9px] sm:text-[10px]">Licitação Atual</span>
                    <span class="font-currency-display text-base sm:text-[24px] text-on-surface font-extrabold font-display">
                      {{ formatMoneyDigits(heroLot?.current_price || 1845000000) }}
                      <span class="text-xs font-label-caps text-primary">MZN</span>
                    </span>
                  </div>
                  <q-btn
                    :to="heroLot ? `/auctions/${heroLot.id}` : '/catalog'"
                    unelevated
                    no-caps
                    color="primary"
                    text-color="dark"
                    icon-right="arrow_forward"
                    label="Licitar"
                    class="px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase shadow-lg shimmer-gold active-press"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: FLOATING MULTI-PARAMETRIC SEARCH BAR WITH QUASAR CONTROLS -->
    <section class="relative z-20 max-w-[1440px] mx-auto px-3 sm:px-margin -mt-2 sm:-mt-space-md">
      <q-card class="w-full bg-surface-container rounded-xl sm:rounded-2xl p-3 sm:p-space-lg border border-white/[0.08] shadow-2xl" flat>
        <!-- Category Filter Tabs via Quasar Chips -->
        <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none border-b border-white/[0.06]">
          <q-btn
            v-for="tab in filterTabs"
            :key="tab.slug"
            dense
            unelevated
            no-caps
            rounded
            :color="selectedTab === tab.slug ? 'primary' : 'surface-container-high'"
            :text-color="selectedTab === tab.slug ? 'dark' : 'white'"
            class="px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold transition-all shrink-0"
            :label="tab.name"
            @click="selectTab(tab.slug)"
          />
        </div>

        <!-- Inputs Row via Quasar QInput & QSelect -->
        <form @submit.prevent="executeSearch" class="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-space-md items-center">
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
              class="w-full py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow-md shimmer-gold active-press"
            />
          </div>
        </form>

        <!-- Trust Badges Under Search -->
        <div class="flex flex-wrap items-center justify-start sm:justify-between gap-2 sm:gap-space-md pt-2.5 mt-2 border-t border-white/[0.04] text-on-surface-variant text-[10px] sm:text-xs">
          <div class="flex items-center gap-1.5">
            <q-icon name="verified" color="primary" size="14px" />
            <span>Vendedores Verificados (NUIT)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <q-icon name="lock" color="primary" size="14px" />
            <span>Custódia Escrow em Meticais</span>
          </div>
          <div class="flex items-center gap-1.5">
            <q-icon name="verified_user" color="primary" size="14px" />
            <span>Inspeção Notarial Prévia</span>
          </div>
        </div>
      </q-card>
    </section>

    <!-- SECTION 3: ENDING SOON AUCTIONS (LOTES CRÍTICOS EM DISPUTA) -->
    <section class="max-w-[1440px] mx-auto px-3 sm:px-margin py-6 sm:py-space-2xl">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-space-md mb-4 sm:mb-space-xl">
        <div class="flex flex-col gap-1">
          <span class="font-label-caps text-label-caps uppercase tracking-wider text-error flex items-center gap-1.5 text-[10px] sm:text-xs font-bold">
            <span class="w-2 h-2 rounded-full bg-error animate-ping"></span>
            Lotes Críticos em Disputa
          </span>
          <h2 class="text-xl sm:text-headline-lg font-bold text-on-surface tracking-tight font-display">
            A Terminar em Breve
          </h2>
          <p class="font-body-md text-xs sm:text-base text-on-surface-variant">
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
          class="font-semibold text-xs sm:text-sm self-start md:self-auto p-0 md:p-2"
        />
      </div>

      <!-- Grid of Ending Soon Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-gutter">
        <div v-for="item in endingSoonList" :key="item.id">
          <AuctionCard :auction="item" />
        </div>
      </div>
    </section>

    <!-- SECTION 4: FEATURED AUCTIONS (CURATED PORTFOLIO) -->
    <section class="w-full bg-surface-container-low py-6 sm:py-space-2xl border-y border-white/[0.04]">
      <div class="max-w-[1440px] mx-auto px-3 sm:px-margin">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-space-md mb-4 sm:mb-space-xl">
          <div class="flex flex-col gap-1">
            <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary text-[10px] sm:text-xs font-bold">
              Registo Institucional de Moçambique
            </span>
            <h2 class="text-xl sm:text-headline-lg font-bold text-on-surface tracking-tight font-display">
              Leilões em Destaque
            </h2>
            <p class="font-body-md text-xs sm:text-base text-on-surface-variant">
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
            class="font-semibold text-xs sm:text-sm self-start md:self-auto p-0 md:p-2"
          />
        </div>

        <!-- 4-Card Refined Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-gutter">
          <div v-for="item in featuredList" :key="item.id">
            <AuctionCard :auction="item" />
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: CATEGORY EXPLORATION TILES -->
    <section class="w-full max-w-[1440px] mx-auto px-3 sm:px-margin py-6 sm:py-space-2xl">
      <div class="flex flex-col items-center text-center gap-1 mb-6 sm:mb-space-2xl">
        <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary text-[10px] sm:text-xs font-bold">Classificação de Ativos</span>
        <h2 class="text-xl sm:text-headline-lg font-bold text-on-surface font-display">Explorar por Categoria</h2>
        <p class="font-body-md text-xs sm:text-base text-on-surface-variant max-w-xl">
          De frotas corporativas a peças de alta joalharia e maquinaria pesada, explore listagens verificadas em Moçambique.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-gutter">
        <q-card
          v-for="cat in categoryTiles"
          :key="cat.slug"
          class="group relative flex flex-col items-center justify-center p-3 sm:p-space-lg rounded-xl bg-surface-container border border-white/[0.06] hover-luxury-lift cursor-pointer transition-all duration-300 shadow-md text-white"
          flat
          @click="$router.push(`/catalog?category=${cat.slug}`)"
        >
          <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-surface-container-low group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-black transition-all duration-300 mb-2 sm:mb-space-sm shadow-inner group-hover:scale-110">
            <q-icon :name="cat.icon" size="22px" />
          </div>
          <span class="font-title-md text-xs sm:text-title-md text-on-surface group-hover:text-primary transition-colors text-center line-clamp-1 font-semibold">
            {{ cat.name }}
          </span>
          <span class="font-body-sm text-[10px] sm:text-body-sm text-on-surface-variant/70 mt-0.5">
            {{ cat.count }} Lotes Ativos
          </span>
        </q-card>
      </div>
    </section>

    <!-- SECTION 6: HOW IT WORKS & SECURITY PROMISE -->
    <section class="w-full bg-surface-container-lowest py-6 sm:py-space-2xl relative overflow-hidden border-t border-white/[0.04]" id="how-it-works">
      <div class="max-w-[1440px] mx-auto px-3 sm:px-margin">
        <!-- Security Credential Banner -->
        <q-card class="bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low p-4 sm:p-space-xl rounded-xl sm:rounded-2xl border border-white/[0.08] shadow-xl mb-6 sm:mb-space-3xl text-white" flat>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-space-lg items-center">
            <div class="lg:col-span-8 flex flex-col gap-2">
              <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary text-[10px] sm:text-xs font-bold">Proteção Financeira Institucional</span>
              <h3 class="text-lg sm:text-headline-lg font-bold text-on-surface font-display leading-tight">O Padrão de Escrow e Conformidade da MozBid</h3>
              <p class="font-body-md text-xs sm:text-base text-on-surface-variant leading-relaxed">
                Cada lance em Meticais na MozBid é totalmente respaldado por custódia fiduciária (escrow) em instituições bancárias comerciais autorizadas em Moçambique. Depósitos de licitações não vencedoras são libertados imediatamente após a conclusão do lote.
              </p>
            </div>
            <div class="lg:col-span-4 flex flex-row items-center justify-end gap-2 sm:gap-space-md mt-2 lg:mt-0">
              <div class="flex-1 sm:flex-initial p-2.5 sm:p-space-md rounded-xl bg-surface-container-high/80 border border-white/[0.06] text-center flex flex-col items-center">
                <q-icon name="lock" color="primary" size="24px" class="mb-1" />
                <span class="font-title-md text-xs sm:text-title-md text-on-surface font-bold">Depósito Sem Risco</span>
                <span class="font-body-sm text-[10px] sm:text-body-sm text-on-surface-variant">Libertação Imediata</span>
              </div>
              <div class="flex-1 sm:flex-initial p-2.5 sm:p-space-md rounded-xl bg-surface-container-high/80 border border-white/[0.06] text-center flex flex-col items-center">
                <q-icon name="verified_user" color="primary" size="24px" class="mb-1" />
                <span class="font-title-md text-xs sm:text-title-md text-on-surface font-bold">KYC e NUIT</span>
                <span class="font-body-sm text-[10px] sm:text-body-sm text-on-surface-variant">Conforme Legislação</span>
              </div>
            </div>
          </div>
        </q-card>

        <!-- 3-Step Flow Heading -->
        <div class="text-center max-w-xl mx-auto mb-6 sm:mb-space-2xl">
          <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary text-[10px] sm:text-xs font-bold">Execução Transparente</span>
          <h2 class="font-headline-lg text-xl sm:text-headline-lg text-on-surface mt-1 font-bold">Como Funciona</h2>
          <p class="font-body-md text-xs sm:text-body-md text-on-surface-variant mt-1">
            Processo de aquisição institucional transparente conduzido em três fases estruturadas.
          </p>
        </div>

        <!-- 3-Step Cards with Quasar Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-gutter">
          <!-- Step 1 -->
          <q-card class="p-4 sm:p-space-xl rounded-xl sm:rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-3 sm:gap-space-lg relative overflow-hidden group hover:bg-surface-container-high transition-colors text-white" flat>
            <div class="flex items-center justify-between">
              <span class="font-headline-lg text-3xl sm:text-[48px] font-bold text-primary/30 group-hover:text-primary transition-colors">01</span>
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
                <q-icon name="badge" size="20px" />
              </div>
            </div>
            <div>
              <h4 class="font-headline-sm text-sm sm:text-headline-sm text-on-surface mb-1 font-bold">Registo e Validação de Identidade</h4>
              <p class="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Submeta o seu NUIT e documentação oficial para credenciação célere. O nosso departamento de conformidade valida licitadores nacionais e estrangeiros em minutos.
              </p>
            </div>
            <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1 font-bold text-[10px] sm:text-xs">
              Validação Instantânea de NUIT <q-icon name="check" size="14px" />
            </span>
          </q-card>

          <!-- Step 2 -->
          <q-card class="p-4 sm:p-space-xl rounded-xl sm:rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-3 sm:gap-space-lg relative overflow-hidden group hover:bg-surface-container-high transition-colors text-white" flat>
            <div class="flex items-center justify-between">
              <span class="font-headline-lg text-3xl sm:text-[48px] font-bold text-primary/30 group-hover:text-primary transition-colors">02</span>
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
                <q-icon name="gavel" size="20px" />
              </div>
            </div>
            <div>
              <h4 class="font-headline-sm text-sm sm:text-headline-sm text-on-surface mb-1 font-bold">Licitação com Garantia Fiduciária</h4>
              <p class="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Participe em salas de leilão ao vivo com controlos de incremento em tempo real. Configure licitações automáticas ou licite diretamente em Meticais (MZN).
              </p>
            </div>
            <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1 font-bold text-[10px] sm:text-xs">
              Ligação Bancária Segura <q-icon name="check" size="14px" />
            </span>
          </q-card>

          <!-- Step 3 -->
          <q-card class="p-4 sm:p-space-xl rounded-xl sm:rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-3 sm:gap-space-lg relative overflow-hidden group hover:bg-surface-container-high transition-colors text-white" flat>
            <div class="flex items-center justify-between">
              <span class="font-headline-lg text-3xl sm:text-[48px] font-bold text-primary/30 group-hover:text-primary transition-colors">03</span>
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
                <q-icon name="handshake" size="20px" />
              </div>
            </div>
            <div>
              <h4 class="font-headline-sm text-sm sm:text-headline-sm text-on-surface mb-1 font-bold">Entrega Segura e Escritura</h4>
              <p class="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Escritura e formalização notarial concluídas na nossa sede na Avenida Julius Nyerere, em Maputo, ou via transporte blindado porta-a-porta para Matola, Beira e Nampula.
              </p>
            </div>
            <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1 font-bold text-[10px] sm:text-xs">
              Transferência Oficial de Titularidade <q-icon name="check" size="14px" />
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
