<template>
  <div
    class="flex flex-col bg-surface-container rounded-xl overflow-hidden border border-white/[0.08] shadow-lg group hover:bg-surface-container-high hover:border-primary/40 transition-all duration-300 h-full"
    :class="{ 'border-error/40': isUrgent, 'opacity-80': isEnded }"
  >
    <!-- Media aspect ratio container -->
    <div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container-lowest">
      <img
        :src="auction.primary_image || fallbackImage"
        :alt="auction.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="(e) => ((e.target as HTMLImageElement).src = fallbackImage)"
      />
      
      <!-- Top Left Category / Verified Badges -->
      <div class="absolute top-space-sm left-space-sm flex items-center gap-space-xs flex-wrap">
        <span class="px-space-sm py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-caps text-[10px] tracking-wider uppercase">
          {{ auction.category_name || 'LEILÃO' }}
        </span>
        <span
          v-if="auction.seller_verified_status === 'verified'"
          class="px-space-sm py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-caps text-[10px] flex items-center gap-0.5"
        >
          <span class="material-symbols-outlined text-[12px] text-primary">verified</span> Parceiro
        </span>
      </div>

      <!-- Top Right Favourite Button -->
      <button
        class="absolute top-space-sm right-space-sm w-8 h-8 rounded-full bg-surface-container-lowest/70 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:text-error transition-colors"
        @click.stop.prevent="handleToggleFav"
        type="button"
        title="Guardar Lote"
      >
        <span
          class="material-symbols-outlined text-[18px]"
          :class="{ 'text-primary': isFav }"
        >
          {{ isFav ? 'bookmark_added' : 'bookmark' }}
        </span>
      </button>

      <!-- Bottom Right Countdown Pill -->
      <div class="absolute bottom-space-sm right-space-sm px-space-sm py-1 rounded bg-surface-container-lowest/90 backdrop-blur-md font-label-numeric text-label-numeric flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px] text-primary">alarm</span>
        <AuctionTimer :ends-at="auction.ends_at" />
      </div>
    </div>

    <!-- Details Body -->
    <div class="p-space-md flex flex-col flex-1 justify-between gap-space-md">
      <div class="flex flex-col gap-space-xs">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            LOTE #{{ auction.id }} • {{ (auction.location_city || 'MAPUTO').toUpperCase() }}
          </span>
          <span class="font-label-numeric text-[11px] text-on-surface-variant/70">
            {{ auction.bid_count || 0 }} Licitações
          </span>
        </div>
        <h3 class="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors line-clamp-1">
          <router-link :to="`/auctions/${auction.id}`">
            {{ auction.title }}
          </router-link>
        </h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant/80 line-clamp-1">
          {{ auction.subtitle || auction.description || 'Garantia Fiduciária de Procedência Notarial' }}
        </p>
      </div>

      <!-- Valuation Box -->
      <div class="p-space-sm rounded bg-surface-container-low border border-white/[0.04] flex flex-col gap-1">
        <div class="flex justify-between items-center text-body-sm">
          <span class="text-on-surface-variant font-label-caps text-label-caps">Licitação Atual</span>
          <span class="text-on-surface-variant font-label-numeric text-[11px]">
            +{{ formatMoneyCompact(auction.bid_increment) }} mín
          </span>
        </div>
        <div class="font-currency-display text-[22px] text-on-surface">
          {{ formatMoneyDigits(auction.current_price) }} <span class="text-body-sm font-label-caps text-primary">MZN</span>
        </div>
        <div class="flex items-center justify-between text-[11px] text-on-surface-variant/80">
          <div>
            <template v-if="auction.reserve_price && auction.current_price >= auction.reserve_price">
              <span class="text-emerald-400 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Reserva Atingida
              </span>
            </template>
            <template v-else-if="auction.reserve_price">
              <span class="text-amber-300 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-300"></span> Reserva Ativa
              </span>
            </template>
            <template v-else>
              <span class="text-primary font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-primary"></span> Sem Reserva
              </span>
            </template>
          </div>
          <span class="font-label-caps text-[10px] text-on-surface-variant/70 uppercase">
            {{ auction.bid_count > 0 ? 'Disputa Ativa' : 'Aguardando 1º Lance' }}
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <router-link
        :to="`/auctions/${auction.id}`"
        class="w-full py-space-sm rounded font-label-caps text-label-caps uppercase transition-colors flex items-center justify-center gap-space-xs shadow-md"
        :class="isEnded ? 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest' : 'bg-primary hover:bg-primary-fixed-dim text-on-primary'"
      >
        <span class="material-symbols-outlined text-[16px]">{{ isEnded ? 'visibility' : 'gavel' }}</span>
        <span>{{ isEnded ? 'Consultar Resultado' : 'Licitar Agora' }}</span>
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
</script>
