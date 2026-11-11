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
        <AuctionTimer :ends-at="auction.ends_at" @expired="handleTimerExpired" />
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

    <!-- 1. Live Bidding Interactive Area (Only if active and not expired) -->
    <div v-if="!isEndedOrExpired" class="flex flex-col gap-3">
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

    <!-- 2. WINNER CELEBRATION & COLLECTION INSTRUCTIONS (Se o utilizador arrematou) -->
    <div
      v-else-if="isWinner"
      class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#171717] via-[#202020] to-[#121212] text-white border-2 border-[#E5A855] shadow-2xl flex flex-col gap-4 relative overflow-hidden"
    >
      <!-- Glow effect -->
      <div class="absolute -right-12 -top-12 w-36 h-36 bg-[#E5A855]/20 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Top Badge -->
      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="px-3 py-1 rounded-full bg-[#E5A855] text-[#171717] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <Trophy :size="15" />
          <span>Arrematação Homologada</span>
        </span>
        <span class="text-[10px] uppercase font-mono tracking-wider text-[#D6C4A3]">
          Ref: MZB-WIN-LOTE#{{ auction.id }}
        </span>
      </div>

      <!-- Winner Headline -->
      <div class="flex flex-col gap-1.5">
        <h3 class="font-editorial text-xl sm:text-2xl font-bold text-white leading-snug">
          🏆 Parabéns, {{ authStore.user?.name?.split(' ')[0] }}! Você Ganhou Este Leilão!
        </h3>
        <p class="text-xs text-[#D6C4A3] leading-relaxed">
          O pregão encerrou com sucesso. A sua licitação de <strong class="text-white font-mono text-sm">{{ formatMoneyDigits(auction.current_price) }} MZN</strong> foi a maior oferta registada e o lote foi-lhe formalmente adjudicado.
        </p>
      </div>

      <!-- INSTRUÇÕES OFICIAIS DE COMO IR LEVAR / RECOLHER O BEM -->
      <div class="p-4 rounded-xl bg-white/[0.05] border border-white/15 flex flex-col gap-3 text-xs">
        <div class="flex items-center gap-2 text-[#E5A855] font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-white/10">
          <PackageCheck :size="16" />
          <span>Instruções Oficiais para Levantamento do Bem</span>
        </div>

        <!-- 1. Local de Levantamento -->
        <div class="flex items-start gap-2.5">
          <MapPin :size="16" class="text-[#E5A855] shrink-0 mt-0.5" />
          <div>
            <strong class="text-white block font-semibold">1. Onde Ir Levantar (Local Presencial):</strong>
            <span class="text-zinc-300 leading-relaxed">
              Entreposto Aduaneiro / Armazém MozBid, {{ auction.location_city || 'Porto de Maputo' }}, {{ auction.location_province || 'Maputo Cidade' }}.
            </span>
          </div>
        </div>

        <!-- 2. Documentação Necessária -->
        <div class="flex items-start gap-2.5">
          <FileText :size="16" class="text-[#E5A855] shrink-0 mt-0.5" />
          <div>
            <strong class="text-white block font-semibold">2. Documentos a Apresentar no Armazém:</strong>
            <span class="text-zinc-300 leading-relaxed">
              Bilhete de Identidade (BI) ou DIRE original do titular, NUIT e Código de Arrematação (<strong class="text-white font-mono">MZB-WIN-LOTE#{{ auction.id }}</strong>).
            </span>
          </div>
        </div>

        <!-- 3. Vistoria & Outorga Notarial -->
        <div class="flex items-start gap-2.5">
          <ShieldCheck :size="16" class="text-[#E5A855] shrink-0 mt-0.5" />
          <div>
            <strong class="text-white block font-semibold">3. Vistoria Presencial & Adjudicação:</strong>
            <span class="text-zinc-300 leading-relaxed">
              Conferência física de 120 pontos, liquidação bancária/M-Pesa e assinatura da transmissão de propriedade no Cartório Notarial.
            </span>
          </div>
        </div>

        <!-- 4. Fiel Depositário & Agendamento -->
        <div class="flex items-start gap-2.5">
          <Phone :size="16" class="text-[#E5A855] shrink-0 mt-0.5" />
          <div>
            <strong class="text-white block font-semibold">4. Fiel Depositário & Agendamento:</strong>
            <span class="text-zinc-300 leading-relaxed">
              Contacte a linha institucional <strong class="text-white font-mono">+258 84 100 2000</strong> ou envie email para <strong class="text-white font-mono">suporte@mozbid.co.mz</strong> (Seg–Sex: 08:00–17:00).
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-2.5 pt-1">
        <router-link
          to="/buyer/dashboard?tab=wins"
          class="flex-1 py-3 px-4 rounded-xl bg-[#E5A855] hover:bg-[#D49845] text-[#171717] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 no-underline text-center"
        >
          <Trophy :size="16" />
          <span>Ver Arrematação & Liquidação</span>
        </router-link>

        <button
          type="button"
          class="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/20"
          @click="printPickupGuide"
        >
          <Printer :size="16" />
          <span>Imprimir Guia de Levantamento</span>
        </button>
      </div>
    </div>

    <!-- 3. AUCTION ENDED WITHOUT WINNER OR PARTICIPANT NOT THE WINNER -->
    <div
      v-else
      class="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E7E3DC] flex flex-col gap-3 text-center"
    >
      <div class="w-10 h-10 rounded-full bg-[#171717] text-[#E5A855] mx-auto flex items-center justify-center">
        <Gavel :size="20" />
      </div>
      <h4 class="font-editorial text-lg font-bold text-[#171717]">Leilão Encerrado</h4>
      <p class="text-xs text-[#666666] max-w-sm mx-auto leading-relaxed">
        Este pregão foi concluído e adjudicado pela licitação final de <strong class="text-[#171717] font-mono">{{ formatMoneyDigits(auction.current_price) }} MZN</strong>.
      </p>
      <div class="pt-2">
        <router-link
          to="/catalog"
          class="inline-flex py-2.5 px-5 rounded-lg bg-[#171717] hover:bg-[#B69A68] text-white font-semibold text-xs tracking-wide transition-colors no-underline"
        >
          Explorar Outros Lotes Disponíveis
        </router-link>
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
import {
  Trophy,
  PackageCheck,
  MapPin,
  FileText,
  ShieldCheck,
  Phone,
  Printer,
  Gavel
} from 'lucide-vue-next';
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

const isEndedOrExpired = computed(() => {
  return props.auction.status !== 'active' || isExpired.value;
});

const isWinner = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) return false;
  if (props.auction.winner_id === authStore.user.id) return true;
  if (props.auction.is_leading && isEndedOrExpired.value) return true;
  return false;
});

async function handleTimerExpired() {
  try {
    await auctionStore.fetchAuctionById(props.auction.id);
  } catch (e) {
    console.warn('Auto refresh on timer expiry:', e);
  }
}

function printPickupGuide() {
  const printWindow = window.open('', '_blank');
  const title = props.auction.title || `Lote #${props.auction.id}`;
  const price = formatMoneyDigits(props.auction.current_price);
  const city = props.auction.location_city || 'Maputo';
  const province = props.auction.location_province || 'Maputo Cidade';
  const buyerName = authStore.user?.name || 'Comprador Oficial';
  const buyerEmail = authStore.user?.email || '';
  const dateStr = new Date().toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' });

  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="utf-8">
      <title>Guia Oficial de Levantamento — Lote #${props.auction.id} — MozBid</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #171717; max-width: 800px; margin: 0 auto; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #B69A68; padding-bottom: 20px; margin-bottom: 25px; }
        .logo { font-size: 26px; font-weight: 800; letter-spacing: 2px; }
        .sublogo { font-size: 10px; color: #B69A68; letter-spacing: 3px; font-weight: bold; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #171717; }
        .box { background: #FAF9F6; border: 1px solid #E8E3DA; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .item strong { display: block; font-size: 11px; text-transform: uppercase; color: #777; margin-bottom: 4px; }
        .item span { font-size: 14px; font-weight: 600; }
        .instructions ol { padding-left: 20px; }
        .instructions li { margin-bottom: 10px; font-size: 13px; color: #333; }
        .stamp { margin-top: 50px; padding-top: 25px; border-top: 1px dashed #CCC; display: flex; justify-content: space-between; font-size: 12px; color: #555; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">MOZBID</div>
          <div class="sublogo">MOÇAMBIQUE • LEILÕES OFICIAIS</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: bold; color: #B69A68;">GUIA OFICIAL DE ADJUDICAÇÃO</div>
          <div style="font-size: 11px; color: #666;">CÓDIGO: MZB-WIN-LOTE#${props.auction.id}</div>
          <div style="font-size: 11px; color: #666;">Data de Emissão: ${dateStr}</div>
        </div>
      </div>

      <div class="title">Comprovativo de Arrematação e Ordem de Levantamento Presencial</div>

      <div class="box">
        <div class="grid">
          <div class="item">
            <strong>Lote Arrematado:</strong>
            <span>Lote #${props.auction.id} — ${title}</span>
          </div>
          <div class="item">
            <strong>Valor Final da Arrematação:</strong>
            <span style="color: #B69A68;">${price} MZN</span>
          </div>
          <div class="item">
            <strong>Titular Vencedor:</strong>
            <span>${buyerName} (${buyerEmail})</span>
          </div>
          <div class="item">
            <strong>Local de Levantamento:</strong>
            <span>Entreposto Aduaneiro / Armazém MozBid (${city}, ${province})</span>
          </div>
        </div>
      </div>

      <div class="instructions">
        <h4 style="margin-bottom: 10px; text-transform: uppercase; font-size: 12px; color: #171717; letter-spacing: 1px;">Procedimentos Obrigatórios para Entrega do Bem:</h4>
        <ol>
          <li><strong>Apresentação Documental Obrigatória:</strong> O titular deve apresentar o Bilhete de Identidade (BI) ou DIRE original e o cartão de NUIT no entreposto de levantamento.</li>
          <li><strong>Conferência Pericial Presencial:</strong> O arrematante tem direito a realizar a vistoria final física de conformidade no armazém conforme o Relatório Pericial de 120 pontos emitido pela MozBid.</li>
          <li><strong>Liquidação e Custódia Fiduciária:</strong> O valor residual (deduzida a caução) deve ser liquidado em Meticais (MZN) através dos canais autorizados da plataforma (M-Pesa, e-Mola ou Transferência Bancária).</li>
          <li><strong>Outorga e Declaração de Venda:</strong> Assinatura presencial do termo de entrega e emissão da declaração para registo de propriedade definitiva no Cartório Notarial.</li>
          <li><strong>Contacto e Agendamento do Fiel Depositário:</strong> Agendamento prévio através da linha institucional (+258 84 100 2000 / suporte@mozbid.co.mz). Horário: Segunda a Sexta, das 08:00 às 17:00.</li>
        </ol>
      </div>

      <div class="stamp">
        <div>
          <div>________________________________________________</div>
          <div style="margin-top: 4px;">Assinatura do Arrematante</div>
        </div>
        <div style="text-align: right;">
          <div>________________________________________________</div>
          <div style="margin-top: 4px;">Fiel Depositário Oficial MozBid</div>
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

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
