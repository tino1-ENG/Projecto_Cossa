<template>
  <q-card
    class="flex flex-col bg-surface-container rounded-xl overflow-hidden border border-white/[0.08] shadow-lg group hover-luxury-lift transition-all duration-300 h-full relative"
    :class="{ 'border-error/50 shadow-error/10': isUrgent, 'opacity-80': isEnded }"
    flat
  >
    <!-- Media aspect ratio container with Quasar Image -->
    <div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container-lowest">
      <q-img
        :src="auction.primary_image || fallbackImage"
        :alt="auction.title"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        :ratio="16/10"
      >
        <template v-slot:error>
          <img :src="fallbackImage" alt="" class="w-full h-full object-cover" />
        </template>
      </q-img>
      
      <!-- Top Left Category / Verified Badges -->
      <div class="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap z-10">
        <q-badge
          color="dark"
          text-color="primary"
          class="px-2 py-0.5 font-bold text-[10px] uppercase tracking-wider border border-white/[0.1] bg-black/75 backdrop-blur-md"
          :label="auction.category_name || 'LEILÃO'"
        />
        <q-badge
          v-if="auction.seller_verified_status === 'verified'"
          color="dark"
          text-color="white"
          class="px-2 py-0.5 text-[10px] flex items-center gap-1 border border-white/[0.1] bg-black/75 backdrop-blur-md"
        >
          <q-icon name="verified" size="12px" class="text-primary" />
          <span>Parceiro</span>
        </q-badge>
      </div>

      <!-- Top Right Favourite Button (Quasar Btn) -->
      <q-btn
        round
        flat
        dense
        size="sm"
        class="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-on-surface-variant hover:text-error transition-all z-10 active-press"
        @click.stop.prevent="handleToggleFav"
        title="Guardar Lote"
      >
        <q-icon
          :name="isFav ? 'bookmark_added' : 'bookmark'"
          size="18px"
          :class="{ 'text-primary scale-110': isFav }"
        />
      </q-btn>

      <!-- Bottom Right Countdown Pill -->
      <div 
        class="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/85 backdrop-blur-md font-label-numeric text-label-numeric flex items-center gap-1 border border-white/[0.1] shadow-sm z-10"
        :class="{ 'animate-urgent border-error/50 text-error': isUrgent }"
      >
        <q-icon name="alarm" size="14px" :class="isUrgent ? 'text-error animate-pulse' : 'text-primary'" />
        <AuctionTimer :ends-at="auction.ends_at" />
      </div>
    </div>

    <!-- Details Body -->
    <q-card-section class="p-space-md flex flex-col flex-1 justify-between gap-space-md">
      <div class="flex flex-col gap-space-xs">
        <div class="flex items-center justify-between text-on-surface-variant">
          <span class="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[10px]">
            LOTE #{{ auction.id }} • {{ (auction.location_city || 'MAPUTO').toUpperCase() }}
          </span>
          <span class="font-label-numeric text-[11px] text-on-surface-variant/70">
            {{ auction.bid_count || 0 }} Licitações
          </span>
        </div>
        <h3 class="font-title-md text-title-md text-on-surface group-hover:text-primary transition-colors line-clamp-1 font-bold">
          <router-link :to="`/auctions/${auction.id}`" class="text-white hover:text-primary transition-colors no-underline">
            {{ auction.title }}
          </router-link>
        </h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant/80 line-clamp-1">
          {{ auction.subtitle || auction.description || 'Garantia Fiduciária de Procedência Notarial' }}
        </p>
      </div>

      <!-- Valuation Box -->
      <div class="p-space-sm rounded-lg bg-surface-container-low border border-white/[0.04] flex flex-col gap-1">
        <div class="flex justify-between items-center text-body-sm">
          <span class="text-on-surface-variant font-label-caps text-label-caps text-[10px]">Licitação Atual</span>
          <span class="text-on-surface-variant font-label-numeric text-[11px]">
            +{{ formatMoneyCompact(auction.bid_increment) }} mín
          </span>
        </div>
        <div class="font-currency-display text-[22px] text-on-surface font-extrabold font-display">
          {{ formatMoneyDigits(auction.current_price) }} <span class="text-body-sm font-label-caps text-primary">MZN</span>
        </div>
        <div class="flex items-center justify-between text-[11px] text-on-surface-variant/80">
          <div>
            <template v-if="auction.reserve_price && auction.current_price >= auction.reserve_price">
              <span class="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 radar-ring"></span> Reserva Atingida
              </span>
            </template>
            <template v-else-if="auction.reserve_price">
              <span class="text-amber-300 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400 radar-ring"></span> Reserva Ativa
              </span>
            </template>
            <template v-else>
              <span class="text-primary font-semibold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-primary radar-ring"></span> Sem Reserva
              </span>
            </template>
          </div>
          <span class="font-label-caps text-[10px] text-on-surface-variant/70 uppercase">
            {{ auction.bid_count > 0 ? 'Disputa Ativa' : 'Aguardando 1º Lance' }}
          </span>
        </div>
      </div>

      <!-- Action Button via Quasar -->
      <q-btn
        :to="`/auctions/${auction.id}`"
        unelevated
        no-caps
        :color="isEnded ? 'grey-9' : 'primary'"
        :text-color="isEnded ? 'white' : 'dark'"
        :icon="isEnded ? 'visibility' : 'gavel'"
        :label="isEnded ? 'Consultar Resultado' : 'Licitar Agora'"
        class="w-full font-bold text-xs py-2 shadow-md active-press"
        :class="{ 'shimmer-gold': !isEnded }"
      />
    </q-card-section>
  </q-card>
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
