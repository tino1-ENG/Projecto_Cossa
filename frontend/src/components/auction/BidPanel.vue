<template>
  <q-card class="flex flex-col bg-surface-container rounded-2xl border border-white/[0.08] shadow-2xl p-space-md sm:p-space-lg gap-space-md amber-glow text-white" flat>
    <!-- Header: Status Badge & Live Clock -->
    <div class="flex items-center justify-between pb-space-sm border-b border-white/[0.06]">
      <div class="flex items-center gap-space-xs flex-wrap">
        <q-badge
          v-if="auction.status === 'active' && !isExpired"
          outline
          color="primary"
          class="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5"
        >
          <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>SESSÃO AO VIVO</span>
        </q-badge>
        <q-badge
          v-else
          color="grey-9"
          class="px-2 py-1 text-[10px]"
          label="ENCERRADO"
        />

        <!-- Reserve Status Badge -->
        <q-badge
          v-if="auction.reserve_price && auction.current_price >= auction.reserve_price"
          color="primary"
          text-color="dark"
          class="px-2 py-1 font-bold text-[10px]"
          label="RESERVA ATINGIDA"
        />
        <q-badge
          v-else-if="!auction.reserve_price"
          outline
          color="white"
          class="px-2 py-1 text-[10px]"
          label="SEM RESERVA"
        />
        <q-badge
          v-else
          color="dark"
          text-color="grey-5"
          class="px-2 py-1 text-[10px]"
          label="RESERVA CONFIDENCIAL"
        />
      </div>

      <!-- Countdown -->
      <div class="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-low border border-white/[0.06] text-primary">
        <q-icon name="alarm" size="14px" />
        <AuctionTimer :ends-at="auction.ends_at" />
      </div>
    </div>

    <!-- Live Valuation Block -->
    <div 
      class="p-space-md rounded-xl bg-surface-container-low border border-white/[0.06] flex flex-col gap-1 transition-all duration-300"
      :class="{ 'bid-flash-active border-primary/60': isPriceFlash }"
    >
      <div class="flex items-center justify-between text-body-sm text-on-surface-variant">
        <span class="font-label-caps text-label-caps uppercase text-[10px]">Licitação Atual Mais Alta</span>
        <span class="font-label-numeric text-[12px] flex items-center gap-1">
          <q-icon name="groups" size="14px" class="text-primary" />
          <span>{{ auction.bid_count || 0 }} {{ auction.bid_count === 1 ? 'licitação' : 'licitações' }}</span>
        </span>
      </div>

      <div class="font-currency-display text-2xl sm:text-[32px] md:text-[36px] text-on-surface leading-tight mt-1 break-words font-extrabold font-display">
        {{ formatMoneyDigits(auction.current_price) }}
        <span class="text-sm sm:text-title-md font-label-caps text-primary">MZN</span>
      </div>

      <!-- User Leading / Outbid Alert -->
      <div v-if="authStore.isAuthenticated" class="mt-2">
        <div
          v-if="auction.is_leading"
          class="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-body-sm text-xs flex items-center gap-1.5"
        >
          <q-icon name="verified" size="16px" />
          <span>É atualmente o licitador líder com a oferta mais alta!</span>
        </div>
        <div
          v-else-if="userHasBid"
          class="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-body-sm text-xs flex items-center gap-1.5"
        >
          <q-icon name="priority_high" size="16px" />
          <span>A sua oferta foi superada. Aumente o lance para recuperar a liderança.</span>
        </div>
      </div>
    </div>

    <!-- Live Bidding Interactive Area (Only if active) -->
    <div v-if="auction.status === 'active' && !isExpired" class="flex flex-col gap-space-sm">
      <div class="flex items-center justify-between text-body-sm">
        <span class="text-on-surface-variant font-label-caps text-[11px]">Próximo Lance Mínimo:</span>
        <span class="font-label-numeric text-on-surface font-bold text-sm">
          {{ formatMoneyDigits(minNextBid) }} MZN
        </span>
      </div>

      <!-- Quick Preset Increments with Quasar Buttons -->
      <div class="grid grid-cols-3 gap-2">
        <q-btn
          v-for="mult in [1, 2, 5]"
          :key="mult"
          unelevated
          dense
          no-caps
          color="surface-container-high"
          text-color="primary"
          class="py-1.5 rounded-lg border border-white/[0.08] text-xs font-bold hover:border-primary/50 transition-all active-press"
          :label="'+' + formatMoneyCompact(auction.bid_increment * mult)"
          @click="selectPreset(auction.bid_increment * mult)"
        />
      </div>

      <!-- Custom Amount Input with Quasar QInput -->
      <q-input
        v-model.number="bidInputMeticais"
        dark
        filled
        dense
        color="primary"
        prefix="MZN"
        type="number"
        step="1000"
        :min="centavosToMeticais(minNextBid)"
        class="text-white font-mono"
        placeholder="Valor em Meticais"
      />

      <!-- Bid Button via Quasar -->
      <q-btn
        v-if="authStore.isAuthenticated"
        unelevated
        no-caps
        color="primary"
        text-color="dark"
        icon="gavel"
        :loading="isSubmitting"
        :disabled="isSubmitting || !isValidBid"
        label="Submeter Licitação Fiduciária"
        class="w-full py-3 rounded-lg font-bold uppercase tracking-wider text-xs shadow-xl shimmer-gold active-press"
        @click="submitBid"
      />

      <q-btn
        v-else
        unelevated
        no-caps
        color="primary"
        text-color="dark"
        icon="login"
        label="Iniciar Sessão Para Licitar"
        :to="`/auth/login?redirect=/auctions/${auction.id}`"
        class="w-full py-3 rounded-lg font-bold uppercase tracking-wider text-xs shadow-xl shimmer-gold active-press"
      />

      <!-- Feedback / Anti-Sniping Alert -->
      <div v-if="feedbackMsg" class="p-2 rounded font-body-sm text-xs" :class="feedbackIsError ? 'bg-error/10 text-error' : 'bg-emerald-500/10 text-emerald-400'">
        {{ feedbackMsg }}
      </div>
    </div>

    <!-- Escrow Protection Trust Box -->
    <div class="p-space-sm rounded-lg bg-surface-container-lowest/60 border border-white/[0.04] flex items-center gap-space-sm">
      <q-icon name="verified_user" size="24px" class="text-primary" />
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
        <span class="font-label-caps text-label-caps uppercase text-[10px]">Histórico Recente de Lances</span>
        <q-badge color="surface-container-high" text-color="grey-4" :label="`${bidsList.length} Registos`" />
      </div>

      <div v-if="bidsList.length === 0" class="py-4 text-center font-body-sm text-xs text-on-surface-variant/60">
        Sem licitações anteriores. Seja o primeiro a licitar!
      </div>
      <transition-group
        v-else
        name="list"
        tag="div"
        class="flex flex-col max-h-56 overflow-y-auto divide-y divide-white/[0.04]"
      >
        <div
          v-for="(bid, idx) in bidsList"
          :key="bid.id || idx"
          class="py-2 px-space-xs flex items-center justify-between transition-colors"
          :class="idx === 0 ? 'border-l-2 border-l-primary bg-primary/[0.03]' : 'hover:bg-white/[0.01]'"
        >
          <div class="flex flex-col">
            <span class="font-title-md text-[13px] text-on-surface font-medium flex items-center gap-1">
              <span>{{ bid.bidder_name || (bid.bidder_id ? `Licitador #MZ-${String(bid.bidder_id).padStart(4, '0')}` : 'Licitador Verificado') }}</span>
              <q-badge v-if="idx === 0" color="primary" text-color="dark" class="px-1.5 py-0.2 font-bold text-[9px]" label="LÍDER" />
            </span>
            <span class="font-body-sm text-[10px] text-on-surface-variant/60">
              {{ formatTimeAgo(bid.created_at) }}
            </span>
          </div>

          <div class="font-currency-display text-[15px] text-on-surface text-right font-bold">
            {{ formatMoneyDigits(bid.amount) }} <span class="text-[10px] text-primary font-bold">MZN</span>
          </div>
        </div>
      </transition-group>
    </div>
  </q-card>
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
