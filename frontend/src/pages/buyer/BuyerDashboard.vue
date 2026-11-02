<template>
  <div class="buyer-dashboard">
    <!-- Escrow Balance & Fiduciary Status Banner -->
    <div class="card-luxury p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gold/30 bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
          <ShieldCheck :size="28" />
        </div>
        <div>
          <div class="text-xs font-label-caps uppercase text-on-surface-variant flex items-center gap-2">
            <span>Conta de Custódia em Escrow (BCI / BIM)</span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">ACTIVA</span>
          </div>
          <div class="text-2xl sm:text-3xl font-bold font-currency-display text-on-surface mt-0.5">
            {{ formatMoney(currentEscrowBalance) }}
          </div>
          <p class="text-xs text-on-surface-variant/70 mt-0.5">
            Fundos salvaguardados para cobertura de cauções licitatórias fiduciárias.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto">
        <button
          type="button"
          class="btn btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
          @click="showDepositModal = true"
        >
          <PlusCircle :size="18" />
          <span>Depositar Caução Fiduciária</span>
        </button>
      </div>
    </div>

    <!-- KPI Metrics Row -->
    <div class="kpi-grid">
      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box">
          <Gavel :size="20" class="text-gold" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Total de Ofertas</span>
          <div class="kpi-value">{{ dashboardData?.metrics?.totalBids || 0 }}</div>
        </div>
      </div>

      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box leading-icon">
          <Trophy :size="20" class="text-green-400" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">A Liderar Actualmente</span>
          <div class="kpi-value text-green-400">{{ dashboardData?.metrics?.winningCount || 0 }}</div>
        </div>
      </div>

      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box outbid-icon">
          <AlertCircle :size="20" class="text-amber-400" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Lances Superados</span>
          <div class="kpi-value text-amber-400">{{ dashboardData?.metrics?.outbidCount || 0 }}</div>
        </div>
      </div>

      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box won-icon">
          <CheckCircle2 :size="20" class="text-gold" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Leilões Ganhos</span>
          <div class="kpi-value text-gold">{{ dashboardData?.metrics?.wonCount || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- Dashboard Tabs Header -->
    <div class="dashboard-tabs-bar">
      <button
        :class="['dash-tab', { active: activeTab === 'bids' }]"
        @click="activeTab = 'bids'"
      >
        <Gavel :size="16" /> Minhas Licitações
      </button>
      <button
        :class="['dash-tab', { active: activeTab === 'wins' }]"
        @click="activeTab = 'wins'"
      >
        <Trophy :size="16" /> Leilões Ganhos & Pagamentos
      </button>
      <button
        :class="['dash-tab', { active: activeTab === 'watchlist' }]"
        @click="activeTab = 'watchlist'"
      >
        <Heart :size="16" /> Favoritos ({{ watchlistItems.length }})
      </button>
      <button
        :class="['dash-tab', { active: activeTab === 'notifications' }]"
        @click="activeTab = 'notifications'"
      >
        <Bell :size="16" /> Alertas & Notificações
      </button>
    </div>

    <!-- TAB 1: Minhas Licitações -->
    <div v-if="activeTab === 'bids'" class="tab-content">
      <div v-if="myBids.length === 0" class="empty-tab glass-panel">
        <Gavel :size="40" class="text-muted" />
        <h4>Ainda não participou em nenhum leilão</h4>
        <p>Explore o catálogo para encontrar automóveis e activos tecnológicos disponíveis.</p>
        <router-link to="/catalog" class="btn btn-primary btn-sm mt-3">
          Ver Leilões Activos
        </router-link>
      </div>

      <div v-else class="glass-panel table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Produto / Leilão</th>
              <th>A Sua Maior Oferta</th>
              <th>Oferta Actual</th>
              <th>Estado do Seu Lance</th>
              <th>Tempo Restante</th>
              <th>Acção</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bid in myBids" :key="bid.bid_id">
              <td class="product-cell">
                <img :src="bid.primary_image || defaultImg" alt="" class="table-thumb" />
                <div class="table-prod-info">
                  <span class="prod-title">{{ bid.title }}</span>
                  <span class="prod-sub">{{ bid.brand }} {{ bid.model }}</span>
                </div>
              </td>
              <td class="money-cell">{{ formatMoney(bid.amount) }}</td>
              <td class="money-cell text-gold">{{ formatMoney(bid.current_price) }}</td>
              <td>
                <span v-if="bid.bid_state === 'leading'" class="badge badge-active">
                  <span class="pulse-dot"></span> A Liderar
                </span>
                <span v-else-if="bid.bid_state === 'outbid'" class="badge badge-urgent">
                  Superado
                </span>
                <span v-else-if="bid.bid_state === 'won'" class="badge badge-gold">
                  Vencedor
                </span>
                <span v-else class="badge badge-ended">
                  Encerrado
                </span>
              </td>
              <td>
                <AuctionTimer :ends-at="bid.ends_at" />
              </td>
              <td>
                <router-link :to="`/auctions/${bid.auction_id}`" class="btn btn-sm btn-secondary">
                  <span v-if="bid.bid_state === 'outbid'">Superar Oferta</span>
                  <span v-else>Ver Leilão</span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: Leilões Ganhos & Checkout -->
    <div v-if="activeTab === 'wins'" class="tab-content">
      <div v-if="wonAuctions.length === 0" class="empty-tab glass-panel">
        <Trophy :size="40" class="text-muted" />
        <h4>Nenhum leilão ganho de momento</h4>
        <p>Mantenha-se atento aos leilões onde licitou para garantir a liderança no encerramento.</p>
      </div>

      <div v-else class="wins-grid">
        <div v-for="win in wonAuctions" :key="win.auction_id" class="card-luxury win-card">
          <div class="win-card-media">
            <img :src="win.primary_image || defaultImg" alt="" class="win-img" />
            <div class="win-tag-badge">
              <Trophy :size="14" class="text-gold" /> GANHOU ESTE LEILÃO
            </div>
          </div>
          <div class="win-card-body">
            <h3 class="win-title">{{ win.title }}</h3>
            <div class="win-price-row">
              <span>Valor Final de Venda:</span>
              <strong class="text-gold">{{ formatMoney(win.current_price) }}</strong>
            </div>

            <!-- Order / Payment Status Callout -->
            <div class="order-status-box">
              <div v-if="win.payment_status === 'completed'" class="paid-alert">
                <CheckCircle2 :size="16" class="text-green-400" />
                <div>
                  <strong>Pagamento Confirmado (M-Pesa/Banco)</strong>
                  <div class="delivery-code">Código de Rastreio: {{ win.tracking_number || 'MZB-EXP-918231' }}</div>
                </div>
              </div>
              <div v-else class="unpaid-alert">
                <Clock :size="16" class="text-amber-400" />
                <div>
                  <strong>Aguardando Pagamento</strong>
                  <div>Por favor liquide o valor para que o vendedor proceda ao envio.</div>
                </div>
              </div>
            </div>

            <div class="win-actions">
              <button
                v-if="win.payment_status !== 'completed'"
                class="btn btn-primary btn-sm w-full"
                @click="openCheckoutModal(win)"
              >
                <CreditCard :size="16" /> Pagar com M-Pesa / e-Mola / Banco
              </button>
              <router-link :to="`/auctions/${win.auction_id}`" class="btn btn-secondary btn-sm w-full">
                Ver Detalhes do Produto
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: Favoritos / Watchlist -->
    <div v-if="activeTab === 'watchlist'" class="tab-content">
      <div v-if="watchlistItems.length === 0" class="empty-tab glass-panel">
        <Heart :size="40" class="text-muted" />
        <h4>A sua lista de favoritos está vazia</h4>
        <p>Clique no ícone de coração nos leilões do catálogo para acompanhar o seu progresso aqui.</p>
      </div>
      <div v-else class="grid-4">
        <AuctionCard
          v-for="item in watchlistItems"
          :key="item.id"
          :auction="item"
        />
      </div>
    </div>

    <!-- TAB 4: Notificações -->
    <div v-if="activeTab === 'notifications'" class="tab-content">
      <div class="glass-panel notifications-manager">
        <div class="notif-manager-header">
          <h3>Registo de Notificações</h3>
          <button class="btn btn-secondary btn-sm" @click="notifStore.markAllAsRead">
            Marcar Todas como Lidas
          </button>
        </div>
        <div class="notif-manager-list">
          <div
            v-for="notif in notifStore.notifications"
            :key="notif.id"
            :class="['notif-row', { unread: !notif.is_read }]"
          >
            <div class="notif-row-icon">
              <Bell :size="16" class="text-gold" />
            </div>
            <div class="notif-row-body">
              <div class="notif-row-title">{{ notif.title }}</div>
              <div class="notif-row-desc">{{ notif.message }}</div>
              <div class="notif-row-date">{{ formatTimeAgo(notif.created_at) }}</div>
            </div>
            <router-link v-if="notif.link" :to="notif.link" class="btn btn-secondary btn-sm">
              Ver
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- REAL-TIME PAYMENT CHECKOUT MODAL -->
    <div v-if="showPaymentModal" class="modal-backdrop" @click="closeCheckoutModal">
      <div class="modal-card glass-panel" @click.stop>
        <div class="modal-header">
          <h3>Liquidação de Leilão Ganho</h3>
          <button class="modal-close-btn" @click="closeCheckoutModal"><X :size="20" /></button>
        </div>

        <div class="modal-body">
          <div class="checkout-summary-box">
            <div class="checkout-prod-name">{{ selectedOrderToPay?.title }}</div>
            <div class="checkout-amount-row">
              <span>Montante a Pagar:</span>
              <strong class="text-gold">{{ formatMoney(selectedOrderToPay?.current_price) }}</strong>
            </div>
          </div>

          <!-- Payment Channels Selector -->
          <div class="form-group">
            <label class="form-label">Seleccione o Canal de Pagamento:</label>
            <div class="channel-options">
              <label :class="['channel-choice', { selected: paymentMethod === 'm-pesa' }]">
                <input v-model="paymentMethod" type="radio" value="m-pesa" />
                <div class="channel-info">
                  <strong>M-PESA (Vodacom)</strong>
                  <span>Pagamento instantâneo via telemóvel</span>
                </div>
              </label>

              <label :class="['channel-choice', { selected: paymentMethod === 'e-mola' }]">
                <input v-model="paymentMethod" type="radio" value="e-mola" />
                <div class="channel-info">
                  <strong>e-Mola (Movitel)</strong>
                  <span>Liquidação imediata via USSD</span>
                </div>
              </label>

              <label :class="['channel-choice', { selected: paymentMethod === 'bank_transfer' }]">
                <input v-model="paymentMethod" type="radio" value="bank_transfer" />
                <div class="channel-info">
                  <strong>Transferência Bancária (BIM / Standard / BCI)</strong>
                  <span>Comprovativo com validação automática</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Phone Number Input -->
          <div class="form-group">
            <label class="form-label">Número de Telemóvel para Confirmação</label>
            <input
              v-model="paymentPhone"
              type="tel"
              placeholder="+258 84 000 0000"
              class="form-input"
            />
          </div>

          <!-- Delivery Address Input -->
          <div class="form-group">
            <label class="form-label">Endereço de Entrega / Província</label>
            <input
              v-model="deliveryAddress"
              type="text"
              placeholder="Ex: Av. Julius Nyerere, Edifício Platinum, Maputo"
              class="form-input"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeCheckoutModal">Cancelar</button>
          <button class="btn btn-primary" :disabled="isPaying" @click="executePayment">
            <span v-if="isPaying">A comunicar com rede de pagamento...</span>
            <span v-else>Confirmar e Pagar {{ formatMoney(selectedOrderToPay?.current_price) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ESCROW DEPOSIT MODAL -->
    <div v-if="showDepositModal" class="modal-backdrop" @click="showDepositModal = false">
      <div class="modal-card glass-panel" @click.stop>
        <div class="modal-header">
          <div class="flex items-center gap-2">
            <ShieldCheck :size="22" class="text-gold" />
            <h3>Depósito de Caução em Escrow</h3>
          </div>
          <button class="modal-close-btn" @click="showDepositModal = false"><X :size="20" /></button>
        </div>

        <div class="modal-body">
          <p class="text-xs text-on-surface-variant/80 mb-3">
            O valor depositado fica retido em conta fiduciária do MOZBID no Millennium BIM / BCI. Em caso de lance superado, o montante é desbloqueado de forma automática e imediata.
          </p>

          <!-- Amount Preset Selector -->
          <div class="form-group">
            <label class="form-label">Selecione o Valor de Caução (Meticais):</label>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <button
                v-for="preset in [100000, 500000, 1000000]"
                :key="preset"
                type="button"
                class="btn btn-sm"
                :class="depositAmountMeticais === preset ? 'btn-primary' : 'btn-secondary'"
                @click="depositAmountMeticais = preset"
              >
                {{ (preset / 1000).toLocaleString('pt-MZ') }}k MZN
              </button>
            </div>
            <input
              v-model.number="depositAmountMeticais"
              type="number"
              min="1000"
              step="1000"
              placeholder="Outro montante em Meticais"
              class="form-input"
            />
          </div>

          <!-- Channel Options -->
          <div class="form-group">
            <label class="form-label">Canal Financeiro Autorizado:</label>
            <div class="channel-options">
              <label :class="['channel-choice', { selected: depositMethod === 'm-pesa' }]">
                <input v-model="depositMethod" type="radio" value="m-pesa" />
                <div class="channel-info">
                  <strong>M-Pesa (Vodacom Moçambique)</strong>
                  <span>Prompt USSD instantâneo no seu telemóvel</span>
                </div>
              </label>

              <label :class="['channel-choice', { selected: depositMethod === 'e-mola' }]">
                <input v-model="depositMethod" type="radio" value="e-mola" />
                <div class="channel-info">
                  <strong>e-Mola (Movitel Moçambique)</strong>
                  <span>Autorização rápida via *898#</span>
                </div>
              </label>

              <label :class="['channel-choice', { selected: depositMethod === 'bank_transfer' }]">
                <input v-model="depositMethod" type="radio" value="bank_transfer" />
                <div class="channel-info">
                  <strong>Transferência Imediata (BCI / Millennium BIM)</strong>
                  <span>Crédito direto no IBAN fiduciário institucional</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Phone or Account input -->
          <div class="form-group">
            <label class="form-label">
              {{ depositMethod === 'bank_transfer' ? 'IBAN / Conta Bancária de Origem' : 'Número de Telemóvel para Confirmação' }}
            </label>
            <input
              v-model="depositPhone"
              type="text"
              :placeholder="depositMethod === 'bank_transfer' ? '0001.0000.12345678901.23' : '+258 84 123 4567'"
              class="form-input"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDepositModal = false">Cancelar</button>
          <button class="btn btn-primary" :disabled="isDepositing || depositAmountMeticais <= 0" @click="executeDeposit">
            <span v-if="isDepositing">A contactar canal financeiro...</span>
            <span v-else>Confirmar Depósito de {{ (depositAmountMeticais || 0).toLocaleString('pt-MZ') }} MZN</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth';
import { useNotificationStore } from '../../stores/notification';
import { formatMoney } from '../../utils/money';
import { formatTimeAgo } from '../../utils/date';
import AuctionTimer from '../../components/auction/AuctionTimer.vue';
import AuctionCard from '../../components/auction/AuctionCard.vue';
import {
  Gavel, Trophy, AlertCircle, CheckCircle2, Heart,
  Bell, Clock, CreditCard, X, ShieldCheck, PlusCircle
} from 'lucide-vue-next';

const $q = useQuasar();
const authStore = useAuthStore();
const notifStore = useNotificationStore();

const activeTab = ref<'bids' | 'wins' | 'watchlist' | 'notifications'>('bids');
const dashboardData = ref<any>(null);
const myBids = ref<any[]>([]);
const wonAuctions = ref<any[]>([]);
const watchlistItems = ref<any[]>([]);

// Escrow Deposit State
const showDepositModal = ref(false);
const depositAmountMeticais = ref(500000);
const depositMethod = ref('m-pesa');
const depositPhone = ref('+258 84 555 6677');
const isDepositing = ref(false);

const currentEscrowBalance = computed(() => {
  return dashboardData.value?.metrics?.balance ?? authStore.user?.balance ?? 0;
});

// Checkout state
const showPaymentModal = ref(false);
const selectedOrderToPay = ref<any>(null);
const paymentMethod = ref('m-pesa');
const paymentPhone = ref('+258 84 555 6677');
const deliveryAddress = ref('Av. Friedrich Engels, Polana, Maputo');
const isPaying = ref(false);

const defaultImg = '/images/products/porsche-911-gt3rs.jpg';

async function fetchDashboard() {
  try {
    const [dashRes, bidsRes, winsRes, watchRes] = await Promise.all([
      api.get('/buyer/dashboard'),
      api.get('/buyer/bids'),
      api.get('/buyer/wins'),
      api.get('/buyer/watchlist')
    ]);

    dashboardData.value = dashRes.data;
    myBids.value = bidsRes.data;
    wonAuctions.value = winsRes.data;
    watchlistItems.value = watchRes.data;

    if (dashRes.data?.metrics?.balance !== undefined && authStore.user) {
      authStore.user.balance = dashRes.data.metrics.balance;
    }
  } catch (err) {
    console.error('Error loading buyer dashboard:', err);
  }
}

async function executeDeposit() {
  if (!depositAmountMeticais.value || depositAmountMeticais.value <= 0) return;
  isDepositing.value = true;

  try {
    const centavos = depositAmountMeticais.value * 100;
    const res = await api.post('/buyer/deposit', {
      amount: centavos,
      method: depositMethod.value,
      phone: depositPhone.value
    });

    if (authStore.user) {
      authStore.user.balance = res.data.newBalance;
    }
    if (dashboardData.value?.metrics) {
      dashboardData.value.metrics.balance = res.data.newBalance;
    }

    $q.notify({
      type: 'positive',
      message: 'Depósito de Caução Confirmado!',
      caption: `Valor de ${(depositAmountMeticais.value).toLocaleString('pt-MZ')} MZN creditado na conta de escrow fiduciário.`,
      position: 'top-right',
      icon: 'shield_check',
      timeout: 5000
    });

    showDepositModal.value = false;
    fetchDashboard();
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: 'Erro no Depósito',
      caption: err.response?.data?.error || 'Falha ao processar depósito com a rede bancária.',
      position: 'top-right',
      icon: 'error'
    });
  } finally {
    isDepositing.value = false;
  }
}

function openCheckoutModal(order: any) {
  selectedOrderToPay.value = order;
  showPaymentModal.value = true;
}

function closeCheckoutModal() {
  showPaymentModal.value = false;
  selectedOrderToPay.value = null;
}

async function executePayment() {
  if (!selectedOrderToPay.value) return;
  const orderId = selectedOrderToPay.value.order_id || 101;

  isPaying.value = true;
  try {
    const res = await api.post(`/orders/${orderId}/pay`, {
      method: paymentMethod.value,
      phoneNumber: paymentPhone.value,
      deliveryAddress: deliveryAddress.value
    });

    $q.notify({
      type: 'positive',
      message: 'Pagamento Concluído com Sucesso!',
      caption: `Referência: ${res.data.reference}. Envio agendado com código ${res.data.trackingNumber}`,
      position: 'top-right',
      icon: 'check_circle',
      timeout: 6000
    });

    notifStore.addToast('Pagamento Confirmado!', `Referência: ${res.data.reference}. Envio agendado com código ${res.data.trackingNumber}`, 'success');
    closeCheckoutModal();
    fetchDashboard();
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: 'Erro no Pagamento',
      caption: err.response?.data?.message || 'Falha ao processar pagamento',
      position: 'top-right',
      icon: 'error'
    });
    notifStore.addToast('Erro no Pagamento', err.response?.data?.message || 'Falha ao processar pagamento', 'error');
  } finally {
    isPaying.value = false;
  }
}

onMounted(() => {
  fetchDashboard();
});
</script>

<style scoped>
.buyer-dashboard {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 520px) {
  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.kpi-card {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

@media (min-width: 640px) {
  .kpi-card {
    padding: 20px;
    gap: 16px;
  }
}

.kpi-icon-box {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: rgba(245, 160, 0, 0.1);
  border: 1px solid var(--color-border-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.leading-icon {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.outbid-icon {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.kpi-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 2px;
}

.kpi-value {
  font-family: var(--font-family-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
}

.dashboard-tabs-bar {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
  overflow-x: auto;
}

.dash-tab {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.dash-tab:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.dash-tab.active {
  background: rgba(245, 160, 0, 0.12);
  color: var(--color-primary);
  border: 1px solid var(--color-border-gold);
}

.empty-tab {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
}

.data-table {
  width: 100%;
  min-width: 580px;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  padding: 14px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.88rem;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.table-prod-info {
  display: flex;
  flex-direction: column;
}

.prod-title {
  font-weight: 700;
  color: #ffffff;
}

.prod-sub {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.money-cell {
  font-family: var(--font-family-display);
  font-weight: 700;
}

/* Wins Grid */
.wins-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .wins-grid {
    grid-template-columns: 1fr;
  }
}

.win-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.win-card-media {
  position: relative;
  aspect-ratio: 16 / 9;
}

.win-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.win-tag-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border-gold);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.win-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.win-title {
  font-size: 1.15rem;
  font-weight: 700;
}

.win-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.paid-alert, .unpaid-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: var(--radius-md);
  font-size: 0.82rem;
}

.paid-alert {
  background: var(--color-success-soft);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: var(--color-success);
}

.unpaid-alert {
  background: var(--color-warning-soft);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: var(--color-warning);
}

.delivery-code {
  font-size: 0.75rem;
  color: #e5e5e5;
  margin-top: 2px;
}

.win-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 540px;
  background: #141414;
  border: 1px solid var(--color-border-gold);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.modal-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.checkout-summary-box {
  background: #0d0d0d;
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  margin-bottom: 20px;
}

.checkout-prod-name {
  font-weight: 700;
  margin-bottom: 6px;
}

.checkout-amount-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.channel-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.channel-choice {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #0d0d0d;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.channel-choice.selected {
  border-color: var(--color-primary);
  background: rgba(245, 160, 0, 0.08);
}

.channel-info {
  display: flex;
  flex-direction: column;
}

.channel-info strong {
  font-size: 0.85rem;
  color: #ffffff;
}

.channel-info span {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Notifications manager */
.notifications-manager {
  padding: 24px;
}

.notif-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.notif-manager-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notif-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: #0d0d0d;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.notif-row.unread {
  border-left: 3px solid var(--color-primary);
  background: rgba(245, 160, 0, 0.04);
}

.notif-row-body {
  flex: 1;
}

.notif-row-title {
  font-size: 0.88rem;
  font-weight: 700;
  margin-bottom: 2px;
}

.notif-row-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.notif-row-date {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.w-full { width: 100%; }
</style>
