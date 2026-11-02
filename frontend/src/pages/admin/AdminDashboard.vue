<template>
  <div class="admin-dashboard">
    <!-- Admin KPI Row -->
    <div class="kpi-grid">
      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box">
          <Users :size="20" class="text-gold" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Utilizadores Registados</span>
          <div class="kpi-value">{{ dashboardData?.kpis?.totalUsers || 0 }}</div>
        </div>
      </div>

      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box">
          <Gavel :size="20" class="text-gold" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Leilões Activos</span>
          <div class="kpi-value text-gold">{{ dashboardData?.kpis?.activeAuctions || 0 }}</div>
        </div>
      </div>

      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box vol-icon">
          <DollarSign :size="20" class="text-green-400" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Volume Total Movimentado</span>
          <div class="kpi-value text-green-400">{{ formatMoney(dashboardData?.kpis?.totalVolume) }}</div>
        </div>
      </div>

      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box pending-icon">
          <ShieldAlert :size="20" class="text-amber-400" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Vendedores Pendentes</span>
          <div class="kpi-value text-amber-400">{{ dashboardData?.kpis?.pendingSellers || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- Admin Tabs -->
    <div class="dashboard-tabs-bar">
      <button
        :class="['dash-tab', { active: activeTab === 'overview' }]"
        @click="activeTab = 'overview'"
      >
        <LayoutDashboard :size="16" /> Visão Geral & Auditoria
      </button>
      <button
        :class="['dash-tab', { active: activeTab === 'users' }]"
        @click="activeTab = 'users'"
      >
        <Users :size="16" /> Gestão de Utilizadores ({{ usersList.length }})
      </button>
      <button
        :class="['dash-tab', { active: activeTab === 'sellers' }]"
        @click="activeTab = 'sellers'"
      >
        <ShieldCheck :size="16" /> Verificação de Vendedores ({{ sellersList.length }})
      </button>
      <button
        :class="['dash-tab', { active: activeTab === 'auctions' }]"
        @click="activeTab = 'auctions'"
      >
        <Gavel :size="16" /> Moderação de Leilões ({{ auctionsList.length }})
      </button>
    </div>

    <!-- TAB 1: Overview & Audit Logs -->
    <div v-if="activeTab === 'overview'" class="tab-content">
      <div class="overview-grid">
        <!-- Recent Bids Feed -->
        <div class="glass-panel feed-card">
          <h3 class="feed-title">
            <Radio :size="18" class="text-gold" /> Monitor de Licitações em Tempo Real
          </h3>
          <div class="feed-list">
            <div v-for="bid in dashboardData?.recentBids || []" :key="bid.id" class="feed-item">
              <div class="feed-item-left">
                <span class="feed-bidder">{{ bid.bidder_name }}</span>
                <span class="feed-product">{{ bid.product_title }}</span>
              </div>
              <div class="feed-item-right">
                <span class="feed-amount text-gold">{{ formatMoney(bid.amount) }}</span>
                <span class="feed-time">{{ formatTimeAgo(bid.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Audit Logs -->
        <div class="glass-panel feed-card">
          <h3 class="feed-title">
            <FileText :size="18" class="text-gold" /> Registo de Auditoria SQLite
          </h3>
          <div class="feed-list">
            <div v-for="log in dashboardData?.recentAuditLogs || []" :key="log.id" class="feed-item">
              <div class="feed-item-left">
                <span class="badge badge-sm badge-gold">{{ log.action }}</span>
                <span class="feed-log-details">{{ log.details }}</span>
              </div>
              <div class="feed-item-right">
                <span class="feed-user">{{ log.user_name || 'Sistema' }}</span>
                <span class="feed-time">{{ formatTimeAgo(log.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Users Management -->
    <div v-if="activeTab === 'users'" class="tab-content">
      <div class="glass-panel table-wrapper">
        <table class="data-table">
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
              <td>#{{ u.id }}</td>
              <td class="font-bold">{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.phone }}</td>
              <td>
                <span :class="['badge', u.role === 'admin' ? 'badge-urgent' : u.role === 'seller' ? 'badge-gold' : 'badge-ended']">
                  {{ u.role.toUpperCase() }}
                </span>
              </td>
              <td>
                <span v-if="u.is_verified" class="text-green-400">✓ Sim</span>
                <span v-else class="text-muted">Não</span>
              </td>
              <td>
                <div class="table-actions">
                  <button
                    v-if="u.role !== 'seller'"
                    class="btn btn-sm btn-secondary"
                    @click="changeRole(u.id, 'seller')"
                  >
                    Promover a Vendedor
                  </button>
                  <button
                    v-if="u.role === 'seller'"
                    class="btn btn-sm btn-outline"
                    @click="changeRole(u.id, 'buyer')"
                  >
                    Tornar Comprador
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: Seller Approvals -->
    <div v-if="activeTab === 'sellers'" class="tab-content">
      <div class="glass-panel table-wrapper">
        <table class="data-table">
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
                <div class="font-bold">{{ seller.company_name || seller.name }}</div>
                <div class="text-muted text-xs">{{ seller.email }}</div>
              </td>
              <td>{{ seller.business_type === 'company' ? 'Empresa' : 'Particular' }}</td>
              <td>
                <span class="tracking-pill">{{ seller.nuit || 'Não aplicável' }}</span>
              </td>
              <td>
                <span v-if="seller.verified_status === 'verified'" class="badge badge-active">Verificado</span>
                <span v-else-if="seller.verified_status === 'pending'" class="badge badge-urgent">Pendente</span>
                <span v-else class="badge badge-ended">{{ seller.verified_status }}</span>
              </td>
              <td>{{ seller.auction_count || 0 }}</td>
              <td>⭐ {{ seller.rating || 5.0 }}</td>
              <td>
                <div class="table-actions">
                  <button
                    v-if="seller.verified_status !== 'verified'"
                    class="btn btn-sm btn-primary"
                    @click="verifySeller(seller.id, 'verified')"
                  >
                    Aprovar Vendedor
                  </button>
                  <button
                    v-if="seller.verified_status === 'verified'"
                    class="btn btn-sm btn-danger"
                    @click="verifySeller(seller.id, 'rejected')"
                  >
                    Revogar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: Auction Moderation -->
    <div v-if="activeTab === 'auctions'" class="tab-content">
      <div class="glass-panel table-wrapper">
        <table class="data-table">
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
              <td>#{{ auc.id }}</td>
              <td class="font-bold">{{ auc.title }}</td>
              <td>{{ auc.seller_name }}</td>
              <td class="money-cell text-gold">{{ formatMoney(auc.current_price) }}</td>
              <td>{{ auc.bid_count }} ofertas</td>
              <td>
                <span v-if="auc.status === 'active'" class="badge badge-active">Activo</span>
                <span v-else class="badge badge-ended">{{ auc.status }}</span>
              </td>
              <td>
                <div class="table-actions">
                  <router-link :to="`/auctions/${auc.id}`" class="btn btn-sm btn-secondary">
                    Ver
                  </router-link>
                  <button
                    v-if="auc.status === 'active'"
                    class="btn btn-sm btn-danger"
                    @click="toggleAuctionStatus(auc.id, 'ended')"
                  >
                    Suspender
                  </button>
                  <button
                    v-else-if="auc.status === 'ended'"
                    class="btn btn-sm btn-outline"
                    @click="toggleAuctionStatus(auc.id, 'active')"
                  >
                    Reactivar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import { useNotificationStore } from '../../stores/notification';
import { formatMoney } from '../../utils/money';
import { formatTimeAgo } from '../../utils/date';
import {
  Users, Gavel, DollarSign, ShieldAlert, LayoutDashboard,
  ShieldCheck, FileText, Radio
} from 'lucide-vue-next';

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
    notifStore.addToast('Utilizador Actualizado', `Função alterada para ${role}.`, 'success');
    fetchAdminData();
  } catch (err: any) {
    notifStore.addToast('Erro', err.response?.data?.message || 'Erro ao alterar função', 'error');
  }
}

async function verifySeller(sellerId: number, status: string) {
  try {
    await api.patch(`/admin/sellers/${sellerId}/verify`, { status });
    notifStore.addToast('Vendedor Actualizado', `Estado de verificação: ${status}.`, 'success');
    fetchAdminData();
  } catch (err: any) {
    notifStore.addToast('Erro', err.response?.data?.message || 'Erro ao verificar', 'error');
  }
}

async function toggleAuctionStatus(auctionId: number, status: string) {
  try {
    await api.patch(`/admin/auctions/${auctionId}/status`, { status });
    notifStore.addToast('Leilão Actualizado', `Estado alterado para ${status}.`, 'info');
    fetchAdminData();
  } catch (err: any) {
    notifStore.addToast('Erro', err.response?.data?.message || 'Erro ao moderar', 'error');
  }
}

onMounted(() => {
  fetchAdminData();
});
</script>

<style scoped>
.admin-dashboard {
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

.vol-icon {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.pending-icon {
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
  font-size: 1.5rem;
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

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

.feed-card {
  padding: 24px;
}

.feed-title {
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #0d0d0d;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.feed-item-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feed-bidder {
  font-weight: 700;
  font-size: 0.88rem;
}

.feed-product {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.feed-log-details {
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.feed-item-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feed-amount {
  font-family: var(--font-family-display);
  font-weight: 700;
  font-size: 0.95rem;
}

.feed-user {
  font-size: 0.8rem;
  font-weight: 600;
}

.feed-time {
  font-size: 0.7rem;
  color: var(--color-text-muted);
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

.font-bold {
  font-weight: 700;
}

.money-cell {
  font-family: var(--font-family-display);
  font-weight: 700;
}

.tracking-pill {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  font-family: monospace;
}

.table-actions {
  display: flex;
  gap: 6px;
}

.text-xs { font-size: 0.72rem; }
.text-muted { color: var(--color-text-muted); }
</style>
