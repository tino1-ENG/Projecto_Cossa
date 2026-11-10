<template>
  <div
    class="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E7E3DC] shadow-xs hover:shadow-xl transition-all duration-300 h-full relative group"
    :class="{ 'ring-1 ring-amber-500/40': isUrgent, 'opacity-85': isEnded }"
  >
    <!-- Media Aspect Container -->
    <div class="relative w-full aspect-[16/10.5] overflow-hidden bg-[#171717]">
      <img
        :src="auction.primary_image || fallbackImage"
        :alt="auction.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        @error="onImgError"
      />

      <!-- Top Gradient for HUD contrast -->
      <div class="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none"></div>

      <!-- Bottom Gradient for Timer/Reserve contrast -->
      <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none"></div>

      <!-- Top Badges (Left: Lot & Status, Right: Location) -->
      <div class="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
        <span class="px-2.5 sm:px-3 py-1 rounded bg-black/75 backdrop-blur-md text-[9px] sm:text-[10px] font-semibold text-white tracking-wider uppercase border border-white/10 flex items-center gap-1.5 shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full" :class="isEnded ? 'bg-zinc-400' : 'bg-[#B69A68] animate-pulse'"></span>
          <span>LOTE #{{ auction.id }} • {{ isEnded ? 'ENCERRADO' : 'AO VIVO' }}</span>
        </span>

        <span class="px-2.5 sm:px-3 py-1 rounded bg-black/75 backdrop-blur-md text-[9px] sm:text-[10px] font-medium text-white/90 border border-white/10 truncate max-w-[190px] shadow-sm">
          {{ (auction.location_city || 'ENTREPOSTO ADUANEIRO DO PORTO DE MAPUTO').toUpperCase() }}
        </span>
      </div>

      <!-- Favourite Bookmark Button (Hover or Tap) -->
      <button
        type="button"
        class="absolute top-12 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-[#B69A68] flex items-center justify-center transition-all z-10 border border-white/10 shadow-xs cursor-pointer opacity-0 group-hover:opacity-100"
        @click.stop.prevent="handleToggleFav"
        title="Guardar Lote"
      >
        <Bookmark :size="14" :class="{ 'fill-[#B69A68] text-[#B69A68]': isFav }" />
      </button>

      <!-- Bottom Overlay HUD (Countdown on Left, Reserve Badge on Right) -->
      <div class="absolute bottom-3 inset-x-3 flex items-end justify-between z-10 gap-2">
        <div class="flex flex-col">
          <span class="text-[9px] uppercase tracking-wider font-semibold text-[#D6C4A3] leading-none mb-1">
            {{ isEnded ? 'RESULTADO:' : 'TERMINA EM:' }}
          </span>
          <div class="font-mono text-xs sm:text-sm font-bold text-white tracking-wide leading-none">
            <AuctionTimer v-if="!isEnded" :ends-at="auction.ends_at" />
            <span v-else class="text-white/70">Encerrado</span>
          </div>
        </div>

        <div>
          <span
            v-if="auction.reserve_price && auction.current_price >= auction.reserve_price"
            class="px-2.5 py-1 rounded bg-[#C4A97D] text-[#171717] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm inline-block"
          >
            RESERVA ATINGIDA
          </span>
          <span
            v-else-if="auction.reserve_price"
            class="px-2.5 py-1 rounded bg-white/20 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider border border-white/20 inline-block"
          >
            RESERVA ACTIVA
          </span>
          <span
            v-else
            class="px-2.5 py-1 rounded bg-[#B69A68]/80 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider inline-block"
          >
            SEM RESERVA
          </span>
        </div>
      </div>
    </div>

    <!-- Details Body -->
    <div class="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
      <div class="flex flex-col gap-1.5">
        <!-- Category & Bid Count Row -->
        <div class="flex items-center justify-between text-xs text-[#777777]">
          <span class="font-medium text-[#777777] truncate">
            {{ auction.category_name || 'Automóveis & Coleccionáveis' }}
          </span>
          <span class="font-mono text-[11px] text-[#777777] shrink-0">
            {{ auction.bid_count || 0 }} {{ auction.bid_count === 1 ? 'Licitação' : 'Licitações' }}
          </span>
        </div>

        <!-- Title -->
        <h3 class="font-sans font-bold text-sm sm:text-base text-[#171717] group-hover:text-[#B69A68] transition-colors line-clamp-1">
          <router-link :to="`/auctions/${auction.id}`" class="text-[#171717] hover:text-[#B69A68] transition-colors no-underline">
            {{ auction.title }}
          </router-link>
        </h3>
      </div>

      <!-- Divider -->
      <div class="border-t border-[#EAE6DF] my-1"></div>

      <!-- Footer Valuation & CTA Button -->
      <div class="flex items-center justify-between gap-3 pt-0.5">
        <div>
          <span class="text-[10px] uppercase font-semibold text-[#888888] tracking-wider block leading-none mb-1">
            LICITAÇÃO ATUAL
          </span>
          <div class="font-editorial text-xl sm:text-2xl font-bold text-[#171717] leading-none">
            {{ formatMoneyDigits(auction.current_price) }}
            <span class="text-xs font-sans font-bold text-[#B69A68] ml-0.5">MZN</span>
          </div>
        </div>

        <router-link
          :to="`/auctions/${auction.id}`"
          class="px-4 py-2.5 rounded-lg bg-[#171717] hover:bg-[#B69A68] text-white text-xs font-semibold tracking-wide transition-all shadow-xs flex items-center gap-1.5 no-underline shrink-0"
        >
          <span>Ver Lote</span>
          <ArrowRight :size="14" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Bookmark, ArrowRight } from 'lucide-vue-next';
import { useAuctionStore } from '../../stores/auction';
import { formatMoneyDigits } from '../../utils/money';
import { getTimeRemaining } from '../../utils/date';
import AuctionTimer from './AuctionTimer.vue';
import type { Auction } from '../../types';

const props = defineProps<{
  auction: Auction;
}>();

const auctionStore = useAuctionStore();
const fallbackImage = '/images/products/porsche-911-gt3rs.jpg';

const isFav = computed(() => auctionStore.watchlistIds.has(props.auction.id));
const timeInfo = computed(() => getTimeRemaining(props.auction.ends_at));
const isEnded = computed(() => props.auction.status !== 'active' || timeInfo.value.isExpired);
const isUrgent = computed(() => timeInfo.value.isUrgent && !isEnded.value);

function handleToggleFav() {
  auctionStore.toggleWatchlist(props.auction.id);
}

function onImgError(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target && target.src !== fallbackImage) {
    target.src = fallbackImage;
  }
}
</script>
