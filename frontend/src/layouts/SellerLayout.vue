<template>
  <div class="dashboard-layout">
    <!-- Dark Luxury Sidebar for Sellers -->
    <aside class="dashboard-sidebar">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-brand">
          <div class="logo-box-xs">
            <Gavel :size="16" />
          </div>
          <span class="sidebar-brand-name">MOZ<span class="text-gold">BID</span></span>
        </router-link>
        <span class="sidebar-badge-seller">VENDEDOR</span>
      </div>

      <!-- Seller Profile Micro Card -->
      <div class="user-micro-card">
        <div class="avatar-circle">
          {{ authStore.user?.name?.charAt(0) || 'V' }}
        </div>
        <div class="micro-info">
          <div class="micro-name">{{ authStore.user?.sellerProfile?.company_name || authStore.user?.name }}</div>
          <div class="micro-rating">
            <Star :size="12" class="text-gold" fill="#F5A000" />
            <span>4.96/5.0</span>
            <span class="verified-dot" title="Verificado MozBid">✓</span>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <router-link to="/seller/dashboard" class="sidebar-link" active-class="sidebar-link-active">
          <LayoutDashboard :size="18" /> Painel Geral
        </router-link>
        <router-link to="/seller/dashboard" class="sidebar-link">
          <Package :size="18" /> Meus Produtos
        </router-link>
        <router-link to="/seller/dashboard" class="sidebar-link">
          <Gavel :size="18" /> Meus Leilões
        </router-link>
        <router-link to="/seller/dashboard" class="sidebar-link">
          <ShoppingBag :size="18" /> Encomendas & Vendas
        </router-link>
        <router-link to="/seller/dashboard" class="sidebar-link">
          <BarChart3 :size="18" /> Análise & Estatísticas
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <router-link to="/buyer/dashboard" class="switch-role-btn">
          <User :size="16" /> Modo Comprador
        </router-link>
        <button class="logout-btn" @click="handleLogout">
          <LogOut :size="16" /> Terminar Sessão
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="dashboard-content-area">
      <header class="dashboard-topbar">
        <div class="topbar-title">
          <h2>Painel do Vendedor</h2>
        </div>
        <div class="topbar-actions">
          <router-link to="/" class="btn btn-sm btn-secondary">
            Marketplace
          </router-link>
        </div>
      </header>

      <main class="dashboard-main-view">
        <router-view />
      </main>
    </div>

    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ToastContainer from '../components/common/ToastContainer.vue';
import {
  Gavel, LayoutDashboard, Package, ShoppingBag, BarChart3, User, LogOut, Star
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push('/auth/login');
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
}

.dashboard-sidebar {
  width: 260px;
  background-color: #0d0d0d;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  flex-shrink: 0;
}

@media (max-width: 860px) {
  .dashboard-sidebar {
    display: none;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-box-xs {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #080808;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-brand-name {
  font-family: var(--font-family-display);
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffffff;
}

.sidebar-badge-seller {
  font-size: 0.65rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #FFB52E, #F5A000);
  color: #080808;
  padding: 2px 6px;
  border-radius: var(--radius-pill);
}

.user-micro-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: 24px;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFB52E, #F5A000);
  color: #080808;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.micro-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.micro-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.verified-dot {
  color: var(--color-primary);
  font-weight: 800;
}

.text-gold {
  color: var(--color-primary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.15s ease;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.sidebar-link-active {
  background: rgba(245, 160, 0, 0.12);
  color: var(--color-primary);
  font-weight: 600;
  border: 1px solid var(--color-border-gold);
}

.sidebar-footer {
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.switch-role-btn, .logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  text-decoration: none;
}

.switch-role-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.logout-btn:hover {
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

.dashboard-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dashboard-topbar {
  height: 72px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(13, 13, 13, 0.8);
  backdrop-filter: blur(12px);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-title h2 {
  font-size: 1.25rem;
  font-weight: 700;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-main-view {
  padding: 32px;
  flex: 1;
}

@media (max-width: 640px) {
  .dashboard-topbar {
    padding: 0 16px;
  }
  .dashboard-main-view {
    padding: 20px 16px;
  }
}
</style>
