<template>
  <div
    class="flex flex-col bg-white rounded-xl overflow-hidden border border-[#E7E3DC] shadow-sm hover:shadow-xl transition-all duration-300 h-full relative group"
    :class="{ 'ring-1 ring-amber-500/30': isUrgent, 'opacity-75': isEnded }"
  >
    <!-- Media Aspect Container -->
    <div class="relative w-full aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
      <img
        :src="auction.primary_image || fallbackImage"
        :alt="auction.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        @error="onImgError"
      />

      <!-- Top Left Category Badge -->
      <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
        <span class="px-2 py-0.5 rounded bg-white/95 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-[#171717] border border-[#E7E3DC] shadow-xs">
          {{ auction.category_name || 'LEILÃO' }}
        </span>
      </div>

      <!-- Top Right Favourite Button -->
      <button
        type="button"
        class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#666666] hover:text-[#B69A68] flex items-center justify-center transition-all z-10 border border-[#E7E3DC] shadow-xs cursor-pointer"
        @click.stop.prevent="handleToggleFav"
        title="Guardar Lote"
      >
        <span class="material-symbols-outlined text-[18px]" :class="{ 'text-[#B69A68]': isFav }">
          {{ isFav ? 'bookmark_added' : 'bookmark' }}
        </span>
      </button>

      <!-- Bottom Right Countdown Pill -->
      <div
        class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 shadow-sm z-10"
        :class="{ 'bg-red-900/90 text-red-100': isUrgent }"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="isUrgent ? 'bg-red-400 animate-ping' : 'bg-[#B69A68]'"></span>
        <AuctionTimer :ends-at="auction.ends_at" />
      </div>
    </div>

    <!-- Details Body -->
    <div class="p-4 flex flex-col flex-1 justify-between gap-3">
      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between text-[#777777] text-[11px]">
          <span class="font-medium uppercase tracking-wider">
            {{ (auction.location_city || 'MAPUTO').toUpperCase() }}
          </span>
          <span class="font-mono text-[11px] text-[#888888]">
            {{ auction.bid_count || 0 }} {{ auction.bid_count === 1 ? 'licitação' : 'licitações' }}
          </span>
        </div>

        <h3 class="font-display font-semibold text-sm sm:text-base text-[#171717] group-hover:text-[#B69A68] transition-colors line-clamp-1 pt-0.5">
          <router-link :to="`/auctions/${auction.id}`" class="text-[#171717] hover:text-[#B69A68] transition-colors no-underline">
            {{ auction.title }}
          </router-link>
        </h3>

        <p class="text-xs text-[#777777] line-clamp-1 leading-relaxed">
          {{ auction.subtitle || auction.description || 'Activo verificado e pronto para transferência.' }}
        </p>
      </div>

      <!-- Valuation Box -->
      <div class="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] flex flex-col gap-1">
        <div class="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#777777] font-semibold">
          <span>Licitação Atual</span>
          <span class="normal-case font-medium text-[#888888]">
            +{{ formatMoneyCompact(auction.bid_increment) }} mín
          </span>
        </div>

        <div class="font-editorial text-xl sm:text-2xl font-bold text-[#171717] leading-none pt-0.5">
          {{ formatMoneyDigits(auction.current_price) }}
          <span class="text-xs font-sans font-bold text-[#B69A68] ml-1">MZN</span>
        </div>

        <div class="flex items-center justify-between text-[11px] pt-1 text-[#666666]">
          <template v-if="auction.reserve_price && auction.current_price >= auction.reserve_price">
            <span class="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Reserva Atingida
            </span>
          </template>
          <template v-else-if="auction.reserve_price">
            <span class="text-amber-700 flex items-center gap-1 text-[11px]">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Reserva Ativa
            </span>
          </template>
          <template v-else>
            <span class="text-[#B69A68] font-medium flex items-center gap-1 text-[11px]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#B69A68]"></span> Sem Reserva
            </span>
          </template>

          <span class="text-[10px] text-[#888888]">
            Lote #{{ auction.id }}
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <router-link
        :to="`/auctions/${auction.id}`"
        class="w-full py-2.5 rounded text-xs font-semibold tracking-wide transition-all text-center no-underline shadow-xs flex items-center justify-center gap-1.5"
        :class="isEnded ? 'bg-[#FAF8F5] text-[#777777] border border-[#E7E3DC] hover:bg-[#EFECE5]' : 'bg-[#171717] text-white hover:bg-[#B69A68]'"
      >
        <span>{{ isEnded ? 'Consultar Resultado' : 'Ver Leilão' }}</span>
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuctionStore } from '../../stores/auction';
import { formatMoneyDigits, formatMoneyCompact } from '../../utils/money';
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
