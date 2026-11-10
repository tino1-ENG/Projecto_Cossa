<template>
  <div class="flex flex-col bg-white rounded-xl sm:rounded-2xl border border-[#E7E3DC] shadow-lg p-4 sm:p-6 gap-4 text-[#171717]">
    <!-- Header: Status Badge & Live Clock -->
    <div class="flex items-center justify-between pb-3 border-b border-[#E7E3DC]">
      <div class="flex items-center gap-1.5 flex-wrap">
        <span
          v-if="auction.status === 'active' && !isExpired"
          class="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E7E3DC] text-[10px] font-semibold text-[#171717] flex items-center gap-1.5"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-[#B69A68] animate-pulse"></span>
          <span>AO VIVO</span>
        </span>
        <span
          v-else
          class="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#777777] border border-[#E7E3DC] text-[10px] font-semibold uppercase"
        >
          ENCERRADO
        </span>

        <!-- Reserve Status Badge -->
        <span
          v-if="auction.reserve_price && auction.current_price >= auction.reserve_price"
          class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]"
        >
          RESERVA ATINGIDA
        </span>
        <span
          v-else-if="!auction.reserve_price"
          class="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#777777] border border-[#E7E3DC] text-[10px]"
        >
          SEM RESERVA
        </span>
        <span
          v-else
          class="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#777777] border border-[#E7E3DC] text-[10px]"
        >
          RESERVA CONFIDENCIAL
        </span>
      </div>

      <!-- Countdown -->
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E3DC] text-xs font-mono text-[#171717]">
        <span class="material-symbols-outlined text-[15px] text-[#B69A68]">alarm</span>
        <AuctionTimer :ends-at="auction.ends_at" />
      </div>
    </div>

    <!-- Live Valuation Block -->
    <div
      class="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC] flex flex-col gap-1 transition-all duration-300"
      :class="{ 'ring-2 ring-[#B69A68]': isPriceFlash }"
    >
      <div class="flex items-center justify-between text-xs text-[#777777]">
        <span class="uppercase font-semibold tracking-wider text-[10px]">Licitação Mais Alta</span>
        <span class="flex items-center gap-1 text-[11px]">
          <span class="material-symbols-outlined text-[14px] text-[#B69A68]">groups</span>
          <span>{{ auction.bid_count || 0 }} {{ auction.bid_count === 1 ? 'lance' : 'lances' }}</span>
        </span>
      </div>

      <div class="font-editorial text-2xl sm:text-4xl font-bold text-[#171717] leading-tight">
        {{ formatMoneyDigits(auction.current_price) }}
        <span class="text-sm font-sans font-bold text-[#B69A68]">MZN</span>
      </div>

      <!-- User Leading / Outbid Alert -->
      <div v-if="authStore.isAuthenticated" class="mt-2">
        <div
          v-if="auction.is_leading"
          class="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">verified</span>
          <span>É atualmente o licitador líder com a oferta mais alta!</span>
        </div>
        <div
          v-else-if="userHasBid"
          class="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">priority_high</span>
          <span>A sua oferta foi superada. Aumente o lance para recuperar a liderança.</span>
        </div>
      </div>
    </div>

    <!-- Live Bidding Interactive Area (Only if active) -->
    <div v-if="auction.status === 'active' && !isExpired" class="flex flex-col gap-3">
      <div class="flex items-center justify-between text-xs text-[#777777]">
        <span class="text-[11px] font-medium uppercase tracking-wider">Próximo Lance Mínimo:</span>
        <span class="font-mono text-[#171717] font-semibold text-sm">
          {{ formatMoneyDigits(minNextBid) }} MZN
        </span>
      </div>

      <!-- Quick Preset Increments -->
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="mult in [1, 2, 5]"
          :key="mult"
          type="button"
          class="py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] hover:border-[#B69A68] hover:text-[#B69A68] text-xs font-semibold text-[#171717] transition-all cursor-pointer"
          @click="selectPreset(auction.bid_increment * mult)"
        >
          +{{ formatMoneyCompact(auction.bid_increment * mult) }}
        </button>
      </div>

      <!-- Custom Amount Input -->
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#777777]">MZN</span>
        <input
          v-model.number="bidInputMeticais"
          type="number"
          step="1000"
          :min="centavosToMeticais(minNextBid)"
          placeholder="Valor em Meticais"
          class="w-full pl-14 pr-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-sm text-[#171717] font-mono focus:outline-none focus:border-[#B69A68] transition-colors"
        />
      </div>

      <!-- Bid Button -->
      <button
        v-if="authStore.isAuthenticated"
        type="button"
        :disabled="isSubmitting || !isValidBid"
        class="w-full py-3 rounded-lg bg-[#171717] text-white hover:bg-[#B69A68] disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        @click="submitBid"
      >
        <span class="material-symbols-outlined text-[18px]">gavel</span>
        <span>{{ isSubmitting ? 'A processar...' : 'Submeter Licitação' }}</span>
      </button>

      <router-link
        v-else
        :to="`/auth/login?redirect=/auctions/${auction.id}`"
        class="w-full py-3 rounded-lg bg-[#171717] text-white hover:bg-[#B69A68] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 no-underline text-center"
      >
        <span class="material-symbols-outlined text-[18px]">login</span>
        <span>Iniciar Sessão Para Licitar</span>
      </router-link>

      <!-- Feedback Alert -->
      <div
        v-if="feedbackMsg"
        class="p-2.5 rounded text-xs leading-relaxed"
        :class="feedbackIsError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
      >
        {{ feedbackMsg }}
      </div>
    </div>

    <!-- Escrow Protection Box -->
    <div class="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] flex items-center gap-3">
      <span class="material-symbols-outlined text-[#B69A68] text-[24px]">verified_user</span>
      <div class="flex flex-col">
        <span class="text-xs font-semibold text-[#171717]">Procedimento Seguro de Licitação</span>
        <span class="text-[11px] text-[#777777]">
          Regras contratuais de adjudicação com liquidação bancária em Meticais (MZN).
        </span>
      </div>
    </div>

    <!-- Live Bid Stream Table -->
    <div class="flex flex-col gap-2 pt-2 border-t border-[#E7E3DC]">
      <div class="flex items-center justify-between text-[#777777] text-xs pb-1">
        <span class="text-[10px] uppercase font-semibold tracking-wider">Histórico de Licitações</span>
        <span class="text-[11px] font-mono text-[#888888]">{{ bidsList.length }} Registos</span>
      </div>

      <div v-if="bidsList.length === 0" class="py-4 text-center text-xs text-[#888888]">
        Sem licitações anteriores. Seja o primeiro a licitar!
      </div>
      <div v-else class="flex flex-col max-h-56 overflow-y-auto divide-y divide-[#E7E3DC]">
        <div
          v-for="(bid, idx) in bidsList"
          :key="bid.id || idx"
          class="py-2.5 px-2 flex items-center justify-between transition-colors"
          :class="idx === 0 ? 'bg-[#FAF8F5] font-semibold' : ''"
        >
          <div class="flex flex-col">
            <span class="text-xs text-[#171717] flex items-center gap-1.5">
              <span>{{ bid.bidder_name || (bid.bidder_id ? `Licitador #MZ-${String(bid.bidder_id).padStart(4, '0')}` : 'Licitador Verificado') }}</span>
              <span v-if="idx === 0" class="px-1.5 py-0.2 rounded bg-[#171717] text-white text-[9px] font-bold">LÍDER</span>
            </span>
            <span class="text-[10px] text-[#888888]">
              {{ formatTimeAgo(bid.created_at) }}
            </span>
          </div>

          <div class="font-mono text-xs text-[#171717] text-right font-bold">
            {{ formatMoneyDigits(bid.amount) }} <span class="text-[10px] text-[#B69A68]">MZN</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth';
import { useAuctionStore } from '../../stores/auction';
import { formatMoneyDigits, formatMoneyCompact, centavosToMeticais, meticaisToCentavos } from '../../utils/money';
import { getTimeRemaining, formatTimeAgo } from '../../utils/date';
import AuctionTimer from './AuctionTimer.vue';
import type { Auction, Bid } from '../../types';

const props = defineProps<{
  auction: Auction;
}>();

const $q = useQuasar();
const authStore = useAuthStore();
const auctionStore = useAuctionStore();

const isSubmitting = ref(false);
const feedbackMsg = ref('');
const feedbackIsError = ref(false);
const isPriceFlash = ref(false);

const timeInfo = computed(() => getTimeRemaining(props.auction.ends_at));
const isExpired = computed(() => timeInfo.value.isExpired);

const minNextBid = computed(() => {
  return props.auction.current_price + props.auction.bid_increment;
});

const bidInputMeticais = ref<number>(centavosToMeticais(minNextBid.value));

watch(() => props.auction.current_price, (newPrice, oldPrice) => {
  bidInputMeticais.value = centavosToMeticais(minNextBid.value);
  if (oldPrice !== undefined && newPrice !== oldPrice) {
    isPriceFlash.value = true;
    setTimeout(() => {
      isPriceFlash.value = false;
    }, 1200);
  }
});

const isValidBid = computed(() => {
  if (!bidInputMeticais.value) return false;
  const inCentavos = meticaisToCentavos(bidInputMeticais.value);
  return inCentavos >= minNextBid.value;
});

const userHasBid = computed(() => {
  if (!authStore.user) return false;
  return props.auction.bids?.some(b => b.bidder_id === authStore.user?.id) || false;
});

const bidsList = computed<Bid[]>(() => {
  return props.auction.bids || [];
});

function selectPreset(incrementCentavos: number) {
  const currentCentavos = props.auction.current_price;
  const targetCentavos = currentCentavos + incrementCentavos;
  bidInputMeticais.value = centavosToMeticais(Math.max(targetCentavos, minNextBid.value));
}

async function submitBid() {
  if (!isValidBid.value || isSubmitting.value) return;

  isSubmitting.value = true;
  feedbackMsg.value = '';
  feedbackIsError.value = false;

  const amountCentavos = meticaisToCentavos(bidInputMeticais.value);

  try {
    const res = await auctionStore.placeBid(props.auction.id, amountCentavos);
    feedbackMsg.value = res.message || 'Licitação registada com sucesso!';
    feedbackIsError.value = false;

    $q.notify({
      type: 'positive',
      message: 'Licitação registada com sucesso!',
      caption: `Oferta líder de ${formatMoneyDigits(amountCentavos)} MZN confirmada.`,
      icon: 'gavel',
      position: 'top-right'
    });
  } catch (err: any) {
    feedbackMsg.value = err.message || 'Erro ao processar licitação';
    feedbackIsError.value = true;

    $q.notify({
      type: 'negative',
      message: err.message || 'Falha na licitação',
      icon: 'error',
      position: 'top-right'
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
