<template>
  <q-page class="p-4 sm:p-6 lg:p-8 text-white">
    <div class="buyer-dashboard flex flex-col gap-6">
      <!-- Escrow Balance & Fiduciary Status Banner -->
      <q-card flat class="card-luxury p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gold/30 bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
            <ShieldCheck :size="28" />
          </div>
          <div>
            <div class="text-xs font-label-caps uppercase text-on-surface-variant flex items-center gap-2">
              <span>Conta de Custódia em Escrow (BCI / BIM)</span>
              <q-badge color="positive" text-color="dark" class="font-bold text-[10px] px-2 py-0.5">ACTIVA</q-badge>
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
          <q-btn
            unelevated
            no-caps
            color="primary"
            text-color="dark"
            icon="add_circle"
            label="Depositar Caução Fiduciária"
            class="font-bold text-sm px-5 py-2.5 rounded-lg w-full md:w-auto shimmer-gold active-press"
            @click="showDepositModal = true"
          />
        </div>
      </q-card>

      <!-- KPI Metrics Row -->
      <div class="kpi-grid">
        <q-card flat class="card-luxury kpi-card">
          <div class="kpi-icon-box">
            <Gavel :size="20" class="text-gold" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Total de Ofertas</span>
            <div class="kpi-value">{{ dashboardData?.metrics?.totalBids || 0 }}</div>
          </div>
        </q-card>

        <q-card flat class="card-luxury kpi-card">
          <div class="kpi-icon-box leading-icon">
            <Trophy :size="20" class="text-green-400" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">A Liderar Actualmente</span>
            <div class="kpi-value text-green-400">{{ dashboardData?.metrics?.winningCount || 0 }}</div>
          </div>
        </q-card>

        <q-card flat class="card-luxury kpi-card">
          <div class="kpi-icon-box outbid-icon">
            <AlertCircle :size="20" class="text-amber-400" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Lances Superados</span>
            <div class="kpi-value text-amber-400">{{ dashboardData?.metrics?.outbidCount || 0 }}</div>
          </div>
        </q-card>

        <q-card flat class="card-luxury kpi-card">
          <div class="kpi-icon-box won-icon">
            <CheckCircle2 :size="20" class="text-gold" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Leilões Ganhos</span>
            <div class="kpi-value text-gold">{{ dashboardData?.metrics?.wonCount || 0 }}</div>
          </div>
        </q-card>
      </div>

      <!-- Dashboard Tabs Header via Quasar Tabs -->
      <q-tabs
        v-model="activeTab"
        dark
        dense
        active-color="primary"
        indicator-color="primary"
        align="left"
        class="border-b border-white/[0.08] bg-surface-container-low rounded-lg p-1"
      >
        <q-tab name="bids" icon="gavel" label="Minhas Licitações" no-caps class="text-xs font-bold" />
        <q-tab name="wins" icon="emoji_events" :label="`Leilões Ganhos & Pagamentos (${wonAuctions.length})`" no-caps class="text-xs font-bold" />
        <q-tab name="watchlist" icon="favorite" :label="`Favoritos (${watchlistItems.length})`" no-caps class="text-xs font-bold" />
        <q-tab name="notifications" icon="notifications" :label="`Alertas & Notificações (${notifStore.unreadCount})`" no-caps class="text-xs font-bold" />
      </q-tabs>

      <!-- TAB PANELS -->
      <q-tab-panels v-model="activeTab" animated class="bg-transparent text-white p-0">
        <!-- TAB 1: Minhas Licitações -->
        <q-tab-panel name="bids" class="p-0">
          <div v-if="myBids.length === 0" class="empty-tab glass-panel p-12 text-center flex flex-col items-center gap-3 rounded-2xl">
            <Gavel :size="40" class="text-muted" />
            <h4 class="font-bold text-lg">Ainda não participou em nenhum leilão</h4>
            <p class="text-sm text-on-surface-variant">Explore o catálogo para encontrar automóveis e activos tecnológicos disponíveis.</p>
            <q-btn unelevated no-caps color="primary" text-color="dark" to="/catalog" label="Ver Leilões Activos" class="font-bold mt-2" />
          </div>

          <div v-else class="glass-panel table-wrapper overflow-x-auto rounded-2xl">
            <table class="data-table w-full">
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
                  <td class="money-cell text-gold font-bold">{{ formatMoney(bid.current_price) }}</td>
                  <td>
                    <q-badge v-if="bid.bid_state === 'leading'" color="positive" class="p-1 px-2 font-bold flex items-center gap-1">
                      <span class="pulse-dot"></span> A Liderar
                    </q-badge>
                    <q-badge v-else-if="bid.bid_state === 'outbid'" color="negative" class="p-1 px-2 font-bold">
                      Superado
                    </q-badge>
                    <q-badge v-else-if="bid.bid_state === 'won'" color="primary" text-color="dark" class="p-1 px-2 font-bold">
                      Vencedor
                    </q-badge>
                    <q-badge v-else color="grey-8" class="p-1 px-2 font-bold">
                      Encerrado
                    </q-badge>
                  </td>
                  <td>
                    <AuctionTimer :ends-at="bid.ends_at" />
                  </td>
                  <td>
                    <q-btn
                      unelevated
                      outline
                      size="sm"
                      no-caps
                      color="primary"
                      :to="`/auctions/${bid.auction_id}`"
                      :label="bid.bid_state === 'outbid' ? 'Superar Oferta' : 'Ver Leilão'"
                      class="font-bold px-3 py-1.5 rounded-lg"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </q-tab-panel>

        <!-- TAB 2: Leilões Ganhos & Checkout -->
        <q-tab-panel name="wins" class="p-0">
          <div v-if="wonAuctions.length === 0" class="empty-tab glass-panel p-12 text-center flex flex-col items-center gap-3 rounded-2xl">
            <Trophy :size="40" class="text-muted" />
            <h4 class="font-bold text-lg">Nenhum leilão ganho de momento</h4>
            <p class="text-sm text-on-surface-variant">Mantenha-se atento aos leilões onde licitou para garantir a liderança no encerramento.</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <q-card v-for="win in wonAuctions" :key="win.auction_id" flat class="card-luxury win-card rounded-2xl overflow-hidden border border-white/[0.08]">
              <div class="relative h-48 w-full overflow-hidden">
                <img :src="win.primary_image || defaultImg" alt="" class="w-full h-full object-cover" />
                <div class="absolute top-3 left-3 bg-[#131313]/90 border border-primary/50 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <Trophy :size="14" class="text-gold" /> GANHOU ESTE LEILÃO
                </div>
              </div>
              <div class="p-5 flex flex-col gap-4">
                <h3 class="font-bold text-base line-clamp-2">{{ win.title }}</h3>
                <div class="flex justify-between items-center text-sm py-2 border-y border-white/[0.08]">
                  <span class="text-on-surface-variant">Valor Final de Venda:</span>
                  <strong class="text-gold font-currency-display text-lg">{{ formatMoney(win.current_price) }}</strong>
                </div>

                <!-- Order / Payment Status Callout -->
                <div class="rounded-xl p-3.5 border" :class="win.payment_status === 'completed' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/30 border-amber-500/30 text-amber-200'">
                  <div v-if="win.payment_status === 'completed'" class="flex items-start gap-2.5">
                    <CheckCircle2 :size="18" class="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong class="text-xs block font-bold">Pagamento Confirmado (M-Pesa/Banco)</strong>
                      <div class="text-[11px] opacity-80 mt-0.5">Código de Rastreio: {{ win.tracking_number || 'MZB-EXP-918231' }}</div>
                    </div>
                  </div>
                  <div v-else class="flex items-start gap-2.5">
                    <Clock :size="18" class="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong class="text-xs block font-bold">Aguardando Pagamento</strong>
                      <div class="text-[11px] opacity-80 mt-0.5">Por favor liquide o valor para que o vendedor proceda ao envio seguro.</div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col gap-2 pt-2">
                  <q-btn
                    v-if="win.payment_status !== 'completed'"
                    unelevated
                    no-caps
                    color="primary"
                    text-color="dark"
                    icon="payments"
                    label="Pagar com M-Pesa / e-Mola / Banco"
                    class="font-bold text-xs py-2.5 rounded-lg shimmer-gold"
                    @click="openCheckoutModal(win)"
                  />
                  <q-btn
                    unelevated
                    outline
                    no-caps
                    color="white"
                    :to="`/auctions/${win.auction_id}`"
                    label="Ver Detalhes do Produto"
                    class="font-medium text-xs py-2 rounded-lg border-white/20"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </q-tab-panel>

        <!-- TAB 3: Favoritos / Watchlist -->
        <q-tab-panel name="watchlist" class="p-0">
          <div v-if="watchlistItems.length === 0" class="empty-tab glass-panel p-12 text-center flex flex-col items-center gap-3 rounded-2xl">
            <Heart :size="40" class="text-muted" />
            <h4 class="font-bold text-lg">A sua lista de favoritos está vazia</h4>
            <p class="text-sm text-on-surface-variant">Clique no ícone de coração nos leilões do catálogo para acompanhar o seu progresso aqui.</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AuctionCard
              v-for="item in watchlistItems"
              :key="item.id"
              :auction="item"
            />
          </div>
        </q-tab-panel>

        <!-- TAB 4: Notificações -->
        <q-tab-panel name="notifications" class="p-0">
          <q-card flat class="glass-panel p-5 rounded-2xl border border-white/[0.08]">
            <div class="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 class="font-bold text-base">Registo de Notificações</h3>
              <q-btn
                unelevated
                outline
                size="sm"
                no-caps
                color="primary"
                label="Marcar Todas como Lidas"
                class="font-bold px-3 py-1 rounded-lg"
                @click="notifStore.markAllAsRead"
              />
            </div>
            <div class="flex flex-col gap-3">
              <div
                v-for="notif in notifStore.notifications"
                :key="notif.id"
                :class="['p-4 rounded-xl flex items-start gap-4 transition-all', notif.is_read ? 'bg-surface-container-lowest/50' : 'bg-surface-container border border-primary/20']"
              >
                <div class="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0 mt-0.5">
                  <Bell :size="16" class="text-gold" />
                </div>
                <div class="flex-1">
                  <div class="font-bold text-sm text-white">{{ notif.title }}</div>
                  <div class="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{{ notif.message }}</div>
                  <div class="text-[10px] text-muted mt-1">{{ formatTimeAgo(notif.created_at) }}</div>
                </div>
                <q-btn
                  v-if="notif.link"
                  unelevated
                  outline
                  size="sm"
                  no-caps
                  color="primary"
                  :to="notif.link"
                  label="Ver"
                  class="font-bold px-3"
                />
              </div>
            </div>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>

      <!-- REAL-TIME PAYMENT CHECKOUT MODAL (QUASAR DIALOG) -->
      <q-dialog v-model="showPaymentModal" persistent>
        <q-card class="bg-[#141414] border border-primary/30 rounded-2xl overflow-hidden shadow-2xl text-white w-full max-w-lg" flat>
          <div class="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#0f0f0f]">
            <div class="flex items-center gap-2">
              <CreditCard :size="20" class="text-gold" />
              <h3 class="font-bold text-base text-white">Liquidação de Leilão Ganho</h3>
            </div>
            <q-btn flat round dense icon="close" @click="closeCheckoutModal" />
          </div>

          <div class="p-5 flex flex-col gap-4">
            <div class="bg-surface-container-high/60 p-4 rounded-xl border border-white/[0.08]">
              <div class="text-sm font-bold text-white mb-1">{{ selectedOrderToPay?.title }}</div>
              <div class="flex justify-between items-center text-sm pt-2 border-t border-white/[0.08]">
                <span class="text-on-surface-variant">Montante a Pagar:</span>
                <strong class="text-gold font-currency-display text-lg">{{ formatMoney(selectedOrderToPay?.current_price) }}</strong>
              </div>
            </div>

            <!-- Payment Channels Selector -->
            <div>
              <label class="text-xs uppercase font-bold text-on-surface-variant mb-2 block">Seleccione o Canal de Pagamento:</label>
              <div class="flex flex-col gap-2">
                <div
                  :class="['p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3', paymentMethod === 'm-pesa' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-surface-container-low border-white/[0.08] hover:border-white/20']"
                  @click="paymentMethod = 'm-pesa'"
                >
                  <q-radio v-model="paymentMethod" val="m-pesa" dark color="primary" dense />
                  <div>
                    <div class="text-xs font-bold text-white">M-PESA (Vodacom)</div>
                    <div class="text-[11px] text-on-surface-variant">Prompt USSD de confirmação PIN em Moçambique</div>
                  </div>
                </div>

                <div
                  :class="['p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3', paymentMethod === 'e-mola' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-surface-container-low border-white/[0.08] hover:border-white/20']"
                  @click="paymentMethod = 'e-mola'"
                >
                  <q-radio v-model="paymentMethod" val="e-mola" dark color="primary" dense />
                  <div>
                    <div class="text-xs font-bold text-white">e-Mola (Movitel)</div>
                    <div class="text-[11px] text-on-surface-variant">Liquidação imediata via carteira móvel</div>
                  </div>
                </div>

                <div
                  :class="['p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3', paymentMethod === 'bank_transfer' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-surface-container-low border-white/[0.08] hover:border-white/20']"
                  @click="paymentMethod = 'bank_transfer'"
                >
                  <q-radio v-model="paymentMethod" val="bank_transfer" dark color="primary" dense />
                  <div>
                    <div class="text-xs font-bold text-white">Transferência Bancária (BIM / Standard / BCI)</div>
                    <div class="text-[11px] text-on-surface-variant">Comprovativo com validação automática fiduciária</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phone Number Input -->
            <div>
              <label class="text-xs uppercase font-bold text-on-surface-variant mb-1 block">Número de Telemóvel para Confirmação</label>
              <q-input
                v-model="paymentPhone"
                dark
                filled
                dense
                color="primary"
                placeholder="+258 84 000 0000"
              />
            </div>

            <!-- Delivery Address Input -->
            <div>
              <label class="text-xs uppercase font-bold text-on-surface-variant mb-1 block">Endereço de Entrega / Província</label>
              <q-input
                v-model="deliveryAddress"
                dark
                filled
                dense
                color="primary"
                placeholder="Ex: Av. Julius Nyerere, Edifício Platinum, Maputo"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 p-4 border-t border-white/[0.08] bg-[#0f0f0f]">
            <q-btn flat no-caps color="grey-5" label="Cancelar" @click="closeCheckoutModal" />
            <q-btn
              unelevated
              no-caps
              color="primary"
              text-color="dark"
              :loading="isPaying"
              :label="`Confirmar e Pagar ${formatMoney(selectedOrderToPay?.current_price)}`"
              class="font-bold px-5 py-2.5 rounded-lg shimmer-gold"
              @click="executePayment"
            />
          </div>
        </q-card>
      </q-dialog>

      <!-- ESCROW DEPOSIT MODAL (QUASAR DIALOG) -->
      <q-dialog v-model="showDepositModal" persistent>
        <q-card class="bg-[#141414] border border-primary/30 rounded-2xl overflow-hidden shadow-2xl text-white w-full max-w-lg" flat>
          <div class="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#0f0f0f]">
            <div class="flex items-center gap-2">
              <ShieldCheck :size="22" class="text-gold" />
              <h3 class="font-bold text-base text-white">Depósito de Caução em Escrow</h3>
            </div>
            <q-btn flat round dense icon="close" @click="showDepositModal = false" />
          </div>

          <div class="p-5 flex flex-col gap-4">
            <p class="text-xs text-on-surface-variant/80 leading-relaxed bg-surface-container-low p-3 rounded-xl border border-white/[0.06]">
              O valor depositado fica retido em conta fiduciária do MOZBID no Millennium BIM / BCI. Em caso de lance superado, o montante é desbloqueado de forma automática e imediata.
            </p>

            <!-- Amount Preset Selector -->
            <div>
              <label class="text-xs uppercase font-bold text-on-surface-variant mb-2 block">Selecione o Valor de Caução (Meticais):</label>
              <div class="grid grid-cols-3 gap-2 mb-2">
                <q-btn
                  v-for="preset in [100000, 500000, 1000000]"
                  :key="preset"
                  unelevated
                  no-caps
                  :color="depositAmountMeticais === preset ? 'primary' : 'dark'"
                  :text-color="depositAmountMeticais === preset ? 'dark' : 'white'"
                  class="font-bold text-xs py-2 rounded-lg border border-white/10"
                  :label="`${(preset / 1000).toLocaleString('pt-MZ')}k MZN`"
                  @click="depositAmountMeticais = preset"
                />
              </div>
              <q-input
                v-model.number="depositAmountMeticais"
                type="number"
                min="1000"
                step="1000"
                dark
                filled
                dense
                color="primary"
                prefix="MZN"
                placeholder="Outro montante em Meticais"
              />
            </div>

            <!-- Channel Options -->
            <div>
              <label class="text-xs uppercase font-bold text-on-surface-variant mb-2 block">Canal Financeiro Autorizado:</label>
              <div class="flex flex-col gap-2">
                <div
                  :class="['p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3', depositMethod === 'm-pesa' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-surface-container-low border-white/[0.08] hover:border-white/20']"
                  @click="depositMethod = 'm-pesa'"
                >
                  <q-radio v-model="depositMethod" val="m-pesa" dark color="primary" dense />
                  <div>
                    <div class="text-xs font-bold text-white">M-Pesa (Vodacom Moçambique)</div>
                    <div class="text-[11px] text-on-surface-variant">Prompt USSD instantâneo no seu telemóvel</div>
                  </div>
                </div>

                <div
                  :class="['p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3', depositMethod === 'e-mola' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-surface-container-low border-white/[0.08] hover:border-white/20']"
                  @click="depositMethod = 'e-mola'"
                >
                  <q-radio v-model="depositMethod" val="e-mola" dark color="primary" dense />
                  <div>
                    <div class="text-xs font-bold text-white">e-Mola (Movitel Moçambique)</div>
                    <div class="text-[11px] text-on-surface-variant">Autorização rápida via *898#</div>
                  </div>
                </div>

                <div
                  :class="['p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3', depositMethod === 'bank_transfer' ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-surface-container-low border-white/[0.08] hover:border-white/20']"
                  @click="depositMethod = 'bank_transfer'"
                >
                  <q-radio v-model="depositMethod" val="bank_transfer" dark color="primary" dense />
                  <div>
                    <div class="text-xs font-bold text-white">Transferência Imediata (BCI / Millennium BIM)</div>
                    <div class="text-[11px] text-on-surface-variant">Crédito direto no IBAN fiduciário institucional</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Phone or Account input -->
            <div>
              <label class="text-xs uppercase font-bold text-on-surface-variant mb-1 block">
                {{ depositMethod === 'bank_transfer' ? 'IBAN / Conta Bancária de Origem' : 'Número de Telemóvel para Confirmação' }}
              </label>
              <q-input
                v-model="depositPhone"
                dark
                filled
                dense
                color="primary"
                :placeholder="depositMethod === 'bank_transfer' ? '0001.0000.12345678901.23' : '+258 84 123 4567'"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 p-4 border-t border-white/[0.08] bg-[#0f0f0f]">
            <q-btn flat no-caps color="grey-5" label="Cancelar" @click="showDepositModal = false" />
            <q-btn
              unelevated
              no-caps
              color="primary"
              text-color="dark"
              :loading="isDepositing"
              :disabled="depositAmountMeticais <= 0"
              :label="`Confirmar Depósito de ${(depositAmountMeticais || 0).toLocaleString('pt-MZ')} MZN`"
              class="font-bold px-5 py-2.5 rounded-lg shimmer-gold"
              @click="executeDeposit"
            />
          </div>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
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
  Bell, Clock, CreditCard, ShieldCheck
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
  } finally {
    isPaying.value = false;
  }
}

onMounted(() => {
  fetchDashboard();
});
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.kpi-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 195, 116, 0.12);
  border: 1px solid rgba(255, 195, 116, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.leading-icon {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.25);
}

.outbid-icon {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.25);
}

.won-icon {
  background: rgba(255, 195, 116, 0.15);
  border-color: rgba(255, 195, 116, 0.35);
}

.kpi-label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #a8a8a8;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.kpi-value {
  font-size: 1.6rem;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  margin-top: 2px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a8a8a8;
}

.data-table td {
  padding: 16px;
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
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table-prod-info {
  display: flex;
  flex-direction: column;
}

.prod-title {
  font-weight: 600;
  color: #ffffff;
}

.prod-sub {
  font-size: 0.78rem;
  color: #a8a8a8;
}

.money-cell {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #22c55e;
  animation: pulse-ring 2s infinite;
  display: inline-block;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.text-gold {
  color: #ffc374;
}
</style>
