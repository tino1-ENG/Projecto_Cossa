<template>
  <q-page class="p-4 sm:p-6 lg:p-8 text-white">
    <div class="admin-dashboard flex flex-col gap-6">
      <!-- Admin KPI Row -->
      <div class="kpi-grid">
        <q-card flat class="card-luxury kpi-card">
          <div class="kpi-icon-box">
            <Users :size="20" class="text-gold" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Utilizadores Registados</span>
            <div class="kpi-value">{{ dashboardData?.kpis?.totalUsers || 0 }}</div>
          </div>
        </q-card>

        <q-card flat class="card-luxury kpi-card">
          <div class="kpi-icon-box">
            <Gavel :size="20" class="text-gold" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Leilões Activos</span>
            <div class="kpi-value text-gold">{{ dashboardData?.kpis?.activeAuctions || 0 }}</div>
          </div>
        </q-card>

        <q-card flat class="card-luxury kpi-card">
          <div class="kpi-icon-box vol-icon">
            <DollarSign :size="20" class="text-green-400" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Volume Total Movimentado</span>
            <div class="kpi-value text-green-400">{{ formatMoney(dashboardData?.kpis?.totalVolume) }}</div>
          </div>
        </q-card>

        <q-card flat class="card-luxury kpi-card">
          <div class="kpi-icon-box pending-icon">
            <ShieldAlert :size="20" class="text-amber-400" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Vendedores Pendentes</span>
            <div class="kpi-value text-amber-400">{{ dashboardData?.kpis?.pendingSellers || 0 }}</div>
          </div>
        </q-card>
      </div>

      <!-- Admin Tabs Header via Quasar Tabs -->
      <q-tabs
        v-model="activeTab"
        dark
        dense
        active-color="primary"
        indicator-color="primary"
        align="left"
        class="border-b border-white/[0.08] bg-surface-container-low rounded-lg p-1"
      >
        <q-tab name="overview" icon="dashboard" label="Visão Geral & Auditoria" no-caps class="text-xs font-bold" />
        <q-tab name="users" icon="group" :label="`Gestão de Utilizadores (${usersList.length})`" no-caps class="text-xs font-bold" />
        <q-tab name="sellers" icon="verified_user" :label="`Verificação de Vendedores (${sellersList.length})`" no-caps class="text-xs font-bold" />
        <q-tab name="auctions" icon="gavel" :label="`Moderação de Leilões (${auctionsList.length})`" no-caps class="text-xs font-bold" />
      </q-tabs>

      <!-- TAB PANELS -->
      <q-tab-panels v-model="activeTab" animated class="bg-transparent text-white p-0">
        <!-- TAB 1: Overview & Audit Logs -->
        <q-tab-panel name="overview" class="p-0">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Bids Feed -->
            <q-card flat class="glass-panel p-5 rounded-2xl border border-white/[0.08]">
              <div class="flex items-center gap-2 pb-4 border-b border-white/[0.08] mb-4">
                <Radio :size="18" class="text-gold animate-pulse" />
                <h3 class="font-bold text-base text-white">Monitor de Licitações em Tempo Real</h3>
              </div>
              <div class="flex flex-col gap-3">
                <div
                  v-for="bid in dashboardData?.recentBids || []"
                  :key="bid.id"
                  class="p-3.5 rounded-xl bg-surface-container-low/70 border border-white/[0.06] flex items-center justify-between"
                >
                  <div class="flex flex-col">
                    <span class="font-bold text-sm text-white">{{ bid.bidder_name }}</span>
                    <span class="text-xs text-on-surface-variant">{{ bid.product_title }}</span>
                  </div>
                  <div class="flex flex-col items-end">
                    <span class="font-currency-display font-bold text-gold text-sm">{{ formatMoney(bid.amount) }}</span>
                    <span class="text-[10px] text-muted">{{ formatTimeAgo(bid.created_at) }}</span>
                  </div>
                </div>
              </div>
            </q-card>

            <!-- Recent Audit Logs -->
            <q-card flat class="glass-panel p-5 rounded-2xl border border-white/[0.08]">
              <div class="flex items-center gap-2 pb-4 border-b border-white/[0.08] mb-4">
                <FileText :size="18" class="text-gold" />
                <h3 class="font-bold text-base text-white">Registo de Auditoria MongoDB / SQLite</h3>
              </div>
              <div class="flex flex-col gap-3">
                <div
                  v-for="log in dashboardData?.recentAuditLogs || []"
                  :key="log.id"
                  class="p-3.5 rounded-xl bg-surface-container-low/70 border border-white/[0.06] flex items-center justify-between"
                >
                  <div class="flex items-start gap-2.5">
                    <q-badge color="primary" text-color="dark" class="font-bold text-[10px] uppercase px-1.5 py-0.5 mt-0.5">
                      {{ log.action }}
                    </q-badge>
                    <span class="text-xs text-on-surface-variant leading-relaxed">{{ log.details }}</span>
                  </div>
                  <div class="flex flex-col items-end shrink-0 pl-3">
                    <span class="text-xs font-semibold text-white">{{ log.user_name || 'Sistema' }}</span>
                    <span class="text-[10px] text-muted">{{ formatTimeAgo(log.created_at) }}</span>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </q-tab-panel>

        <!-- TAB 2: Users Management -->
        <q-tab-panel name="users" class="p-0">
          <q-card flat class="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
            <div class="overflow-x-auto">
              <table class="data-table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome Completo</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Função / Role</th>
                    <th>Verificado</th>
                    <th>Acções Administrativas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in usersList" :key="u.id">
                    <td class="font-mono text-muted text-xs">#{{ u.id }}</td>
                    <td class="font-bold text-white">{{ u.name }}</td>
                    <td class="text-on-surface-variant text-sm">{{ u.email }}</td>
                    <td class="text-on-surface-variant text-sm">{{ u.phone }}</td>
                    <td>
                      <q-badge
                        :color="u.role === 'admin' ? 'negative' : u.role === 'seller' ? 'primary' : 'grey-8'"
                        :text-color="u.role === 'seller' ? 'dark' : 'white'"
                        class="font-bold text-xs uppercase px-2 py-0.5"
                      >
                        {{ u.role.toUpperCase() }}
                      </q-badge>
                    </td>
                    <td>
                      <span v-if="u.is_verified" class="text-emerald-400 font-bold text-xs">✓ Verificado</span>
                      <span v-else class="text-muted text-xs">Não verificado</span>
                    </td>
                    <td>
                      <div class="flex items-center gap-2">
                        <q-btn
                          v-if="u.role !== 'seller'"
                          unelevated
                          outline
                          size="sm"
                          no-caps
                          color="primary"
                          label="Promover a Vendedor"
                          class="font-bold px-2 py-1 rounded"
                          @click="changeRole(u.id, 'seller')"
                        />
                        <q-btn
                          v-if="u.role === 'seller'"
                          unelevated
                          outline
                          size="sm"
                          no-caps
                          color="grey-5"
                          label="Tornar Comprador"
                          class="font-bold px-2 py-1 rounded"
                          @click="changeRole(u.id, 'buyer')"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card>
        </q-tab-panel>

        <!-- TAB 3: Seller Approvals -->
        <q-tab-panel name="sellers" class="p-0">
          <q-card flat class="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
            <div class="overflow-x-auto">
              <table class="data-table w-full">
                <thead>
                  <tr>
                    <th>Empresa / Vendedor</th>
                    <th>Tipo</th>
                    <th>NUIT</th>
                    <th>Estado Verificação</th>
                    <th>Leilões</th>
                    <th>Avaliação</th>
                    <th>Decisão</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="seller in sellersList" :key="seller.id">
                    <td>
                      <div class="font-bold text-white">{{ seller.company_name || seller.name }}</div>
                      <div class="text-muted text-xs">{{ seller.email }}</div>
                    </td>
                    <td class="text-sm text-on-surface-variant">{{ seller.business_type === 'company' ? 'Empresa' : 'Particular' }}</td>
                    <td>
                      <span class="px-2 py-0.5 rounded bg-surface-container-high text-xs font-mono border border-white/10 text-on-surface">
                        {{ seller.nuit || 'Não aplicável' }}
                      </span>
                    </td>
                    <td>
                      <q-badge
                        v-if="seller.verified_status === 'verified'"
                        color="positive"
                        text-color="dark"
                        class="font-bold text-xs px-2 py-0.5"
                      >
                        Verificado
                      </q-badge>
                      <q-badge
                        v-else-if="seller.verified_status === 'pending'"
                        color="warning"
                        text-color="dark"
                        class="font-bold text-xs px-2 py-0.5"
                      >
                        Pendente
                      </q-badge>
                      <q-badge v-else color="grey-8" class="font-bold text-xs px-2 py-0.5">
                        {{ seller.verified_status }}
                      </q-badge>
                    </td>
                    <td class="font-bold text-sm">{{ seller.auction_count || 0 }}</td>
                    <td class="text-gold font-bold text-sm">⭐ {{ seller.rating || 5.0 }}</td>
                    <td>
                      <div class="flex items-center gap-2">
                        <q-btn
                          v-if="seller.verified_status !== 'verified'"
                          unelevated
                          no-caps
                          size="sm"
                          color="primary"
                          text-color="dark"
                          label="Aprovar Vendedor"
                          class="font-bold px-3 py-1 rounded-lg shimmer-gold"
                          @click="verifySeller(seller.id, 'verified')"
                        />
                        <q-btn
                          v-if="seller.verified_status === 'verified'"
                          unelevated
                          no-caps
                          size="sm"
                          color="negative"
                          label="Revogar"
                          class="font-bold px-3 py-1 rounded-lg"
                          @click="verifySeller(seller.id, 'rejected')"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card>
        </q-tab-panel>

        <!-- TAB 4: Auction Moderation -->
        <q-tab-panel name="auctions" class="p-0">
          <q-card flat class="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
            <div class="overflow-x-auto">
              <table class="data-table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Lote</th>
                    <th>Vendedor</th>
                    <th>Preço Actual</th>
                    <th>Lances</th>
                    <th>Estado</th>
                    <th>Moderação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="auc in auctionsList" :key="auc.id">
                    <td class="font-mono text-muted text-xs">#{{ auc.id }}</td>
                    <td class="font-bold text-white">{{ auc.title }}</td>
                    <td class="text-sm text-on-surface-variant">{{ auc.seller_name }}</td>
                    <td class="font-currency-display font-bold text-gold">{{ formatMoney(auc.current_price) }}</td>
                    <td class="text-sm">{{ auc.bid_count }} ofertas</td>
                    <td>
                      <q-badge
                        :color="auc.status === 'active' ? 'positive' : 'grey-8'"
                        :text-color="auc.status === 'active' ? 'dark' : 'white'"
                        class="font-bold text-xs px-2 py-0.5"
                      >
                        {{ auc.status === 'active' ? 'Activo' : auc.status }}
                      </q-badge>
                    </td>
                    <td>
                      <div class="flex items-center gap-2">
                        <q-btn
                          unelevated
                          outline
                          size="sm"
                          no-caps
                          color="primary"
                          :to="`/auctions/${auc.id}`"
                          label="Ver"
                          class="font-bold px-2 py-1 rounded"
                        />
                        <q-btn
                          v-if="auc.status === 'active'"
                          unelevated
                          size="sm"
                          no-caps
                          color="negative"
                          label="Suspender"
                          class="font-bold px-2 py-1 rounded"
                          @click="toggleAuctionStatus(auc.id, 'ended')"
                        />
                        <q-btn
                          v-else-if="auc.status === 'ended'"
                          unelevated
                          outline
                          size="sm"
                          no-caps
                          color="positive"
                          label="Reactivar"
                          class="font-bold px-2 py-1 rounded"
                          @click="toggleAuctionStatus(auc.id, 'active')"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import api from '../../services/api';
import { useNotificationStore } from '../../stores/notification';
import { formatMoney } from '../../utils/money';
import { formatTimeAgo } from '../../utils/date';
import {
  Users, Gavel, DollarSign, ShieldAlert,
  FileText, Radio
} from 'lucide-vue-next';

const $q = useQuasar();
const notifStore = useNotificationStore();

const activeTab = ref<'overview' | 'users' | 'sellers' | 'auctions'>('overview');
const dashboardData = ref<any>(null);
const usersList = ref<any[]>([]);
const sellersList = ref<any[]>([]);
const auctionsList = ref<any[]>([]);

async function fetchAdminData() {
  try {
    const [dashRes, usersRes, sellersRes, aucRes] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/users'),
      api.get('/admin/sellers'),
      api.get('/admin/auctions')
    ]);

    dashboardData.value = dashRes.data;
    usersList.value = usersRes.data;
    sellersList.value = sellersRes.data;
    auctionsList.value = aucRes.data;
  } catch (err) {
    console.error('Error loading admin dashboard:', err);
  }
}

async function changeRole(userId: number, role: string) {
  try {
    await api.patch(`/admin/users/${userId}`, { role });
    $q.notify({
      type: 'positive',
      message: 'Utilizador Actualizado',
      caption: `Função alterada com sucesso para ${role}.`,
      position: 'top-right'
    });
    fetchAdminData();
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: 'Erro',
      caption: err.response?.data?.message || 'Erro ao alterar função',
      position: 'top-right'
    });
  }
}

async function verifySeller(sellerId: number, status: string) {
  try {
    await api.patch(`/admin/sellers/${sellerId}/verify`, { status });
    $q.notify({
      type: 'positive',
      message: 'Vendedor Actualizado',
      caption: `Estado de verificação alterado para ${status}.`,
      position: 'top-right'
    });
    fetchAdminData();
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: 'Erro',
      caption: err.response?.data?.message || 'Erro ao verificar',
      position: 'top-right'
    });
  }
}

async function toggleAuctionStatus(auctionId: number, status: string) {
  try {
    await api.patch(`/admin/auctions/${auctionId}/status`, { status });
    $q.notify({
      type: 'info',
      message: 'Leilão Actualizado',
      caption: `Estado alterado para ${status}.`,
      position: 'top-right'
    });
    fetchAdminData();
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: 'Erro',
      caption: err.response?.data?.message || 'Erro ao moderar leilão',
      position: 'top-right'
    });
  }
}

onMounted(() => {
  fetchAdminData();
});
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 900px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

.kpi-card {
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 16px;
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
  flex-shrink: 0;
}

.vol-icon {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.25);
}

.pending-icon {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.25);
}

.kpi-label {
  display: block;
  font-size: 0.72rem;
  color: #a8a8a8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.kpi-value {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
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
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.88rem;
}

.text-gold {
  color: #ffc374;
}
</style>
