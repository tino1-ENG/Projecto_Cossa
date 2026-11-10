<template>
  <div class="w-full bg-[#F4F1EB] text-[#171717] min-h-screen">
    <!-- SECTION A/B: HERO SECTION (FLUSH LUXURY SHOWCASE) -->
    <section class="relative w-full border-b border-[#E7E3DC] overflow-hidden bg-[#F4F1EB]">
      <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px]">
        <!-- Left Column: Editorial Headline, CTAs & Metrics -->
        <div class="lg:col-span-6 xl:col-span-6 flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-8 lg:pl-12 lg:pr-10 xl:pl-20 xl:pr-14">
          <!-- Subtle Mozambique identification badge -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E7E3DC] w-fit shadow-xs mb-4 sm:mb-6">
            <span class="w-2 h-2 rounded-full bg-[#B69A68] animate-pulse"></span>
            <span class="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#B69A68] uppercase">
              44 LEILÕES DE LUXO • MOÇAMBIQUE
            </span>
          </div>

          <!-- Main Headline (Editorial Luxury Serif) -->
          <h1 class="font-editorial text-3xl sm:text-5xl lg:text-[54px] text-[#171717] font-semibold leading-[1.12] tracking-tight">
            Descubra Leilões Exclusivos.<br />
            <span class="text-[#B69A68] italic font-normal">Licite com Confiança.</span>
          </h1>

          <!-- Supporting Subtitle -->
          <p class="font-sans text-sm sm:text-base text-[#666666] max-w-lg leading-relaxed pt-3 sm:pt-4">
            A plataforma soberana em Moçambique para aquisição de frotas executivas, supercarros, relógios de colecção e maquinaria industrial com liquidação em Meticais (MZN) e custódia bancária fiduciária.
          </p>

          <!-- Action CTAs -->
          <div class="flex flex-wrap items-center gap-3.5 pt-6 sm:pt-8">
            <router-link
              to="/catalog"
              class="px-6 py-3.5 rounded-lg bg-[#E5A855] hover:bg-[#D49845] text-[#171717] text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm flex items-center gap-2 no-underline"
            >
              <span>Explorar Leilões</span>
              <ArrowRight :size="16" />
            </router-link>

            <router-link
              to="/seller/dashboard"
              class="px-6 py-3.5 rounded-lg bg-white text-[#171717] border border-[#E5A855]/70 hover:border-[#E5A855] hover:bg-[#FAF8F5] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs flex items-center gap-2 no-underline"
            >
              <Store :size="16" class="text-[#E5A855]" />
              <span>Começar a Vender</span>
            </router-link>
          </div>

          <!-- Platform Metrics (Volume, Escrow, Licitadores) -->
          <div class="grid grid-cols-3 gap-4 pt-8 sm:pt-10 border-t border-[#E7E3DC] mt-6 sm:mt-8">
            <div>
              <div class="font-editorial text-xl sm:text-2xl font-bold text-[#171717]">
                2.4B <span class="text-xs font-sans text-[#B69A68] font-bold">MZN</span>
              </div>
              <div class="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#777777] font-semibold mt-0.5">
                Volume Total
              </div>
            </div>
            <div>
              <div class="font-editorial text-xl sm:text-2xl font-bold text-[#171717]">
                100%
              </div>
              <div class="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#777777] font-semibold mt-0.5">
                Escrow Bancário
              </div>
            </div>
            <div>
              <div class="font-editorial text-xl sm:text-2xl font-bold text-[#171717]">
                14,200+
              </div>
              <div class="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#777777] font-semibold mt-0.5">
                Licitadores
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Flush Hero Showcase (Colado com a Tela, Sem Borda, Não Flutuante) -->
        <div class="lg:col-span-6 xl:col-span-6 relative w-full h-[460px] sm:h-[520px] lg:h-auto min-h-[460px] lg:min-h-full overflow-hidden bg-[#171717] group">
          <!-- Vehicle Photograph flush to edges -->
          <img
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
            :src="heroLot?.primary_image || '/images/products/porsche-911-gt3rs.jpg'"
            :alt="heroLot?.title || 'Porsche 911 GT3 RS Clubsport'"
            @error="onHeroImgError"
          />

          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 pointer-events-none"></div>

          <!-- Top HUD directly on photo -->
          <div class="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10 gap-2">
            <span class="px-3 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] sm:text-[11px] font-semibold text-white tracking-wider uppercase border border-white/10 flex items-center gap-2 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-[#B69A68] animate-pulse"></span>
              <span>LOTE #{{ heroLot?.id || '1' }} • AO VIVO</span>
            </span>
            <span class="px-3 py-1 rounded bg-black/75 backdrop-blur-md text-[10px] sm:text-[11px] font-medium text-white/90 border border-white/10 truncate max-w-[220px] shadow-sm">
              {{ (heroLot?.location_city || 'ENTREPOSTO ADUANEIRO DO PORTO DE MAPUTO').toUpperCase() }}
            </span>
          </div>

          <!-- Bottom Ribbon Flush inside photo -->
          <div class="absolute bottom-0 inset-x-0 p-5 sm:p-7 lg:p-8 z-10 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2.5 sm:gap-3 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-[9px] uppercase tracking-wider text-[#D6C4A3] font-semibold">TERMINA EM:</span>
                <span class="font-mono text-xs sm:text-sm font-bold text-[#E5A855]">
                  <AuctionTimer v-if="heroLot" :ends-at="heroLot.ends_at" />
                  <span v-else>02h 11m 56s</span>
                </span>
              </div>
              <span class="px-2.5 py-1 rounded bg-[#C4A97D] text-[#171717] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                RESERVA ATINGIDA
              </span>
            </div>

            <div class="flex items-center justify-between text-xs text-white/75 pt-1">
              <span>{{ heroLot?.category_name || '2023 • 4.0L Boxer 6 • 525 CV' }}</span>
              <span class="font-mono text-[#D6C4A3]">{{ heroLot?.bid_count || 39 }} Licitações</span>
            </div>

            <h3 class="font-display font-semibold text-base sm:text-xl text-white line-clamp-1">
              {{ heroLot?.title || 'Porsche 911 GT3 RS Clubsport 2023 — Pacote Weissach' }}
            </h3>

            <div class="flex items-center justify-between pt-2 border-t border-white/15">
              <div>
                <span class="text-[10px] uppercase tracking-wider text-white/70 block">Licitação Atual</span>
                <div class="font-editorial text-2xl sm:text-3xl font-bold text-white">
                  {{ formatMoneyDigits(heroLot?.current_price || 18550000) }}
                  <span class="text-xs font-sans font-bold text-[#E5A855] ml-0.5">MZN</span>
                </div>
              </div>

              <router-link
                :to="heroLot ? `/auctions/${heroLot.id}` : '/catalog'"
                class="px-5 py-2.5 rounded-lg bg-[#E5A855] hover:bg-[#D49845] text-[#171717] text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md flex items-center gap-1.5 no-underline"
              >
                <span>Licitar</span>
                <ArrowRight :size="16" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION D: QUICK CATEGORY PILLS & ADVANCED SEARCH (Image 1 & 2 Reference) -->
    <section class="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10">
      <!-- Quick Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
        <button
          v-for="pill in quickCategoryPills"
          :key="pill.slug"
          type="button"
          @click="selectQuickPill(pill.slug)"
          class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0"
          :class="selectedCategory === pill.slug ? 'bg-[#E5A855] text-[#171717] border-[#E5A855] shadow-xs font-bold' : 'bg-white text-[#555555] border-[#E7E3DC] hover:bg-[#FAF8F5] hover:text-[#171717]'"
        >
          {{ pill.label }}
        </button>
      </div>

      <!-- Main Search Container -->
      <div class="bg-white rounded-2xl p-4 sm:p-6 border border-[#E7E3DC] shadow-sm">
        <form @submit.prevent="executeSearch" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
          <!-- Text Search (Col 1-5) -->
          <div class="lg:col-span-5 relative">
            <Search :size="18" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Pesquisar por activo, marca ou nº de lote..."
              class="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC] text-xs sm:text-sm text-[#171717] placeholder:text-[#888888] focus:outline-none focus:border-[#B69A68] transition-colors"
            />
          </div>

          <!-- Category Filter (Col 6-7) -->
          <div class="lg:col-span-3">
            <select
              v-model="selectedCategory"
              class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC] hover:border-[#B69A68] text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#B69A68] transition-colors cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              <option value="automoveis-motos">Automóveis & Colecionáveis</option>
              <option value="maquinas-industriais">Maquinaria Pesada & Mineração</option>
              <option value="tecnologia-computadores">Tecnologia & Servidores</option>
              <option value="relogios-joias">Relógios & Alta Joalharia</option>
              <option value="imobiliario-terrenos">Imobiliário & Concessões</option>
              <option value="arte-colecionaveis">Arte & Património Cultural</option>
            </select>
          </div>

          <!-- Province Filter (Col 8-9) -->
          <div class="lg:col-span-2">
            <select
              v-model="selectedProvince"
              class="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC] hover:border-[#B69A68] text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#B69A68] transition-colors cursor-pointer"
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
              class="w-full py-2.5 sm:py-3 rounded-xl bg-[#E5A855] hover:bg-[#D49845] text-[#171717] text-xs sm:text-sm font-bold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Search :size="18" />
              <span>Pesquisar</span>
            </button>
          </div>
        </form>

        <!-- 3 Trust Badges directly below search -->
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 pt-4 mt-4 border-t border-[#E7E3DC]/70 text-xs font-medium text-[#666666]">
          <div class="flex items-center gap-1.5">
            <CheckCircle2 :size="15" class="text-[#E5A855]" />
            <span>Vendedores Verificados (NUIT)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <ShieldCheck :size="15" class="text-[#E5A855]" />
            <span>Custódia Escrow em Meticais</span>
          </div>
          <div class="flex items-center gap-1.5">
            <FileCheck :size="15" class="text-[#E5A855]" />
            <span>Inspeção Notarial Prévia</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION C: FEATURED AUCTIONS (Image 3 Grid Style) -->
    <section class="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-10">
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
          <ArrowRight :size="16" class="group-hover:translate-x-1 transition-transform" />
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
            <ShieldCheck :size="22" />
          </div>
          <h4 class="font-display font-semibold text-sm sm:text-base text-[#171717]">Verificação de Vendedores</h4>
          <p class="text-xs text-[#666666] leading-relaxed">
            Triagem rigorosa de proveniência de activos e identificação fiscal (NUIT) de cada consignador.
          </p>
        </div>

        <div class="p-5 rounded-xl bg-white border border-[#E7E3DC] shadow-xs flex flex-col gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
            <CheckCircle2 :size="22" />
          </div>
          <h4 class="font-display font-semibold text-sm sm:text-base text-[#171717]">Identificação de Licitadores</h4>
          <p class="text-xs text-[#666666] leading-relaxed">
            Credenciação individual que garante lances genuínos e a integridade competitiva do pregão.
          </p>
        </div>

        <div class="p-5 rounded-xl bg-white border border-[#E7E3DC] shadow-xs flex flex-col gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
            <FileCheck :size="22" />
          </div>
          <h4 class="font-display font-semibold text-sm sm:text-base text-[#171717]">Procedimentos de Pagamento</h4>
          <p class="text-xs text-[#666666] leading-relaxed">
            Liquidação bancária transparente em Meticais (MZN) através de canais e prazos regulamentados.
          </p>
        </div>

        <div class="p-5 rounded-xl bg-white border border-[#E7E3DC] shadow-xs flex flex-col gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
            <HelpCircle :size="22" />
          </div>
          <h4 class="font-display font-semibold text-sm sm:text-base text-[#171717]">Regulamento de Leilão</h4>
          <p class="text-xs text-[#666666] leading-relaxed">
            Normas contratuais claras de disputa, preço de reserva confidencial e adjudicação formal.
          </p>
        </div>
      </div>
    </section>

    <!-- SECTION H: FINAL CTA -->
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
          class="px-8 py-3.5 rounded-lg bg-[#E5A855] hover:bg-[#D49845] text-[#171717] text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md flex items-center gap-2 no-underline"
        >
          <span>Explorar Leilões</span>
          <ArrowRight :size="18" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowRight,
  Store,
  Search,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  HelpCircle
} from 'lucide-vue-next';
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

const quickCategoryPills = [
  { label: 'Todos os Lotes', slug: 'all' },
  { label: 'Supercarros & Frotas', slug: 'automoveis-motos' },
  { label: 'Maquinaria Pesada', slug: 'maquinas-industriais' },
  { label: 'Tecnologia & TI', slug: 'tecnologia-computadores' },
  { label: 'Alta Relojoaria', slug: 'relogios-joias' },
  { label: 'Imobiliário & Concessões', slug: 'imobiliario-terrenos' }
];

function selectQuickPill(slug: string) {
  selectedCategory.value = slug;
  executeSearch();
}

// All official provinces of Mozambique
const provinceOptions = [
  { label: 'Todas as Províncias', value: 'all' },
  { label: 'Maputo Cidade', value: 'Maputo Cidade' },
  { label: 'Maputo Província', value: 'Maputo Província' },
  { label: 'Gaza', value: 'Gaza' },
  { label: 'Inhambane', value: 'Inhambane' },
  { label: 'Sofala (Beira)', value: 'Sofala' },
  { label: 'Manica (Chimoio)', value: 'Manica' },
  { label: 'Tete (Moatize)', value: 'Tete' },
  { label: 'Zambézia', value: 'Zambézia' },
  { label: 'Nampula', value: 'Nampula' },
  { label: 'Cabo Delgado (Pemba)', value: 'Cabo Delgado' },
  { label: 'Niassa', value: 'Niassa' }
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
  if (selectedCategory.value && selectedCategory.value !== 'all') query.category = selectedCategory.value;
  if (selectedProvince.value && selectedProvince.value !== 'all') query.province = selectedProvince.value;

  router.push({ path: '/catalog', query });
}

function onHeroImgError(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target) {
    target.src = '/images/products/porsche-911-gt3rs.jpg';
  }
}
</script>
