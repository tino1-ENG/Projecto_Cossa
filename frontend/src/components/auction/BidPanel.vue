<template>
  <div class="flex flex-col bg-surface-container rounded-2xl border border-white/[0.08] shadow-2xl p-space-md sm:p-space-lg gap-space-md amber-glow">
    <!-- Header: Status Badge & Live Clock -->
    <div class="flex items-center justify-between pb-space-sm border-b border-white/[0.06]">
      <div class="flex items-center gap-space-xs">
        <span
          v-if="auction.status === 'active' && !isExpired"
          class="px-space-sm py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-label-caps text-[10px] flex items-center gap-1.5"
        >
          <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          SESSÃO AO VIVO
        </span>
        <span
          v-else
          class="px-space-sm py-1 rounded bg-surface-container-highest text-on-surface-variant font-label-caps text-[10px]"
        >
          ENCERRADO
        </span>

        <!-- Reserve Status Badge -->
        <span
          v-if="auction.reserve_price && auction.current_price >= auction.reserve_price"
          class="px-space-sm py-1 rounded bg-primary/15 border border-primary/40 text-primary font-label-caps text-[10px] font-bold"
        >
          RESERVA ATINGIDA
        </span>
        <span
          v-else-if="!auction.reserve_price"
          class="px-space-sm py-1 rounded bg-white/[0.08] text-on-surface font-label-caps text-[10px]"
        >
          SEM RESERVA
        </span>
        <span
          v-else
          class="px-space-sm py-1 rounded bg-surface-container-low text-on-surface-variant/70 font-label-caps text-[10px]"
        >
          RESERVA CONFIDENCIAL
        </span>
      </div>

      <!-- Countdown -->
      <div class="flex items-center gap-1 px-space-sm py-1 rounded bg-surface-container-low border border-white/[0.06] text-primary">
        <span class="material-symbols-outlined text-[14px]">alarm</span>
        <AuctionTimer :ends-at="auction.ends_at" />
      </div>
    </div>

    <!-- Live Valuation Block -->
    <div class="p-space-md rounded-xl bg-surface-container-low border border-white/[0.06] flex flex-col gap-1">
      <div class="flex items-center justify-between text-body-sm text-on-surface-variant">
        <span class="font-label-caps text-label-caps uppercase">Licitação Atual Mais Alta</span>
        <span class="font-label-numeric text-[12px] flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px] text-primary">groups</span>
          {{ auction.bid_count || 0 }} {{ auction.bid_count === 1 ? 'licitação' : 'licitações' }}
        </span>
      </div>

      <div class="font-currency-display text-2xl sm:text-[32px] md:text-[36px] text-on-surface leading-tight mt-1 break-words">
        {{ formatMoneyDigits(auction.current_price) }}
        <span class="text-sm sm:text-title-md font-label-caps text-primary">MZN</span>
      </div>

      <!-- User Leading / Outbid Alert -->
      <div v-if="authStore.isAuthenticated" class="mt-2">
        <div
          v-if="auction.is_leading"
          class="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-body-sm text-xs flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[16px]">verified</span>
          <span>É atualmente o licitador líder com a oferta mais alta!</span>
        </div>
        <div
          v-else-if="userHasBid"
          class="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-body-sm text-xs flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-[16px]">priority_high</span>
          <span>A sua oferta foi superada. Aumente o lance para recuperar a liderança.</span>
        </div>
      </div>
    </div>

    <!-- Live Bidding Interactive Area (Only if active) -->
    <div v-if="auction.status === 'active' && !isExpired" class="flex flex-col gap-space-sm">
      <div class="flex items-center justify-between text-body-sm">
        <span class="text-on-surface-variant font-label-caps text-[11px]">Próximo Lance Mínimo:</span>
        <span class="font-label-numeric text-on-surface font-bold">
          {{ formatMoneyDigits(minNextBid) }} MZN
        </span>
      </div>

      <!-- Quick Preset Increments -->
      <div class="grid grid-cols-3 gap-space-xs">
        <button
          v-for="mult in [1, 2, 5]"
          :key="mult"
          type="button"
          class="py-1.5 px-space-xs rounded bg-surface-container-high hover:bg-surface-container-highest border border-white/[0.08] hover:border-primary/40 text-on-surface font-label-numeric text-[12px] text-center transition-colors"
          @click="selectPreset(auction.bid_increment * mult)"
        >
          +{{ formatMoneyCompact(auction.bid_increment * mult) }}
        </button>
      </div>

      <!-- Custom Amount Input -->
      <div class="relative flex items-center">
        <span class="absolute left-space-md font-label-caps text-primary text-[12px] font-bold">MZN</span>
        <input
          v-model="bidInputMeticais"
          type="number"
          step="1000"
          :min="centavosToMeticais(minNextBid)"
          class="w-full bg-surface-container-low border border-white/[0.08] focus:border-primary rounded-lg pl-14 pr-space-md py-space-sm text-on-surface font-label-numeric text-body-md focus:outline-none"
          placeholder="Valor personalizado em Meticais"
        />
      </div>

      <!-- Bid Button -->
      <button
        v-if="authStore.isAuthenticated"
        type="button"
        class="w-full py-3 rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-caps text-label-caps uppercase transition-all shadow-xl flex items-center justify-center gap-space-xs disabled:opacity-50 disabled:cursor-not-allowed font-bold"
        :disabled="isSubmitting || !isValidBid"
        @click="submitBid"
      >
        <span class="material-symbols-outlined text-[18px]">gavel</span>
        <span v-if="isSubmitting">A Processar Licitação...</span>
        <span v-else>Submeter Licitação Fiduciária</span>
      </button>

      <router-link
        v-else
        :to="`/auth/login?redirect=/auctions/${auction.id}`"
        class="w-full py-3 rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-caps text-label-caps uppercase text-center transition-all shadow-xl font-bold flex items-center justify-center gap-space-xs"
      >
        <span class="material-symbols-outlined text-[18px]">login</span>
        <span>Iniciar Sessão Para Licitar</span>
      </router-link>

      <!-- Feedback / Anti-Sniping Alert -->
      <div v-if="feedbackMsg" class="p-2 rounded font-body-sm text-xs" :class="feedbackIsError ? 'bg-error/10 text-error' : 'bg-emerald-500/10 text-emerald-400'">
        {{ feedbackMsg }}
      </div>
    </div>

    <!-- Escrow Protection Trust Box -->
    <div class="p-space-sm rounded-lg bg-surface-container-lowest/60 border border-white/[0.04] flex items-center gap-space-sm">
      <span class="material-symbols-outlined text-primary text-[24px]">verified_user</span>
      <div class="flex flex-col">
        <span class="font-label-caps text-[10px] text-on-surface font-semibold">Garantia Bancária em Escrow</span>
        <span class="font-body-sm text-[11px] text-on-surface-variant/70">
          Depósitos custodiados no BCI / Millennium BIM. Libertação imediata para lances superados.
        </span>
      </div>
    </div>

    <!-- Live Bid Stream Table -->
    <div class="flex flex-col gap-space-xs pt-space-xs border-t border-white/[0.06]">
      <div class="flex items-center justify-between text-on-surface-variant pb-1">
        <span class="font-label-caps text-label-caps uppercase">Histórico Recente de Lances</span>
        <span class="font-label-numeric text-[11px]">{{ bidsList.length }} Registos</span>
      </div>

      <div class="flex flex-col max-h-56 overflow-y-auto divide-y divide-white/[0.04]">
        <div v-if="bidsList.length === 0" class="py-4 text-center font-body-sm text-xs text-on-surface-variant/60">
          Sem licitações anteriores. Seja o primeiro a licitar!
        </div>
        <div
          v-for="(bid, idx) in bidsList"
          :key="bid.id || idx"
          class="py-2 px-space-xs flex items-center justify-between transition-colors"
          :class="idx === 0 ? 'border-l-2 border-l-primary bg-primary/[0.03]' : 'hover:bg-white/[0.01]'"
        >
          <div class="flex flex-col">
            <span class="font-title-md text-[13px] text-on-surface font-medium flex items-center gap-1">
              <span>{{ bid.bidder_name || (bid.bidder_id ? `Licitador #MZ-${String(bid.bidder_id).padStart(4, '0')}` : 'Licitador Verificado') }}</span>
              <span v-if="idx === 0" class="px-1.5 py-0.2 rounded bg-primary/20 text-primary text-[9px] font-bold">LÍDER</span>
            </span>
            <span class="font-body-sm text-[10px] text-on-surface-variant/60">
              {{ formatTimeAgo(bid.created_at) }}
            </span>
          </div>

          <div class="font-currency-display text-[15px] text-on-surface text-right">
            {{ formatMoneyDigits(bid.amount) }} <span class="text-[10px] text-primary font-bold">MZN</span>
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

const timeInfo = computed(() => getTimeRemaining(props.auction.ends_at));
const isExpired = computed(() => timeInfo.value.isExpired);

const minNextBid = computed(() => {
  return props.auction.current_price + props.auction.bid_increment;
});

const bidInputMeticais = ref<number>(centavosToMeticais(minNextBid.value));

watch(() => props.auction.current_price, () => {
  bidInputMeticais.value = centavosToMeticais(minNextBid.value);
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

async function executeBidSubmission(centavos: number) {
  isSubmitting.value = true;
  feedbackMsg.value = '';
  feedbackIsError.value = false;

  try {
    await auctionStore.placeBid(props.auction.id, centavos);
    feedbackMsg.value = 'Licitação fiduciária submetida com sucesso!';
    feedbackIsError.value = false;

    $q.notify({
      type: 'positive',
      message: 'Licitação Registada com Sucesso!',
      caption: `Oferta de ${formatMoneyDigits(centavos)} MZN confirmada no Lote #${props.auction.id}`,
      position: 'top-right',
      icon: 'gavel',
      timeout: 5000
    });
  } catch (err: any) {
    const errorText = err?.response?.data?.error || 'Erro ao submeter licitação. Verifique os fundos de escrow disponíveis.';
    feedbackMsg.value = errorText;
    feedbackIsError.value = true;

    $q.notify({
      type: 'negative',
      message: 'Licitação Recusada',
      caption: errorText,
      position: 'top-right',
      icon: 'error',
      timeout: 6000
    });
  } finally {
    isSubmitting.value = false;
  }
}

function submitBid() {
  if (!isValidBid.value || isSubmitting.value) return;

  const centavos = meticaisToCentavos(bidInputMeticais.value);

  // Require institutional confirmation dialog for commitments
  $q.dialog({
    title: 'Confirmação de Licitação Fiduciária',
    message: `Confirma a submissão formal de uma oferta de ${formatMoneyDigits(centavos)} MZN para o Lote #${props.auction.id} (${props.auction.title})? Esta oferta possui valor legal executório nos termos das Condições Notariais do Leilão.`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-4'
    },
    ok: {
      label: 'Confirmar Oferta',
      color: 'amber-8',
      unelevated: true
    },
    dark: true,
    persistent: true
  }).onOk(() => {
    executeBidSubmission(centavos);
  });
}
</script>
