<template>
  <div class="dashboard-layout">
    <!-- Backdrop for mobile drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="sidebar-backdrop"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Dark Luxury Sidebar -->
    <aside class="dashboard-sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-brand" @click="isMobileMenuOpen = false">
          <div class="logo-box-xs">
            <Gavel :size="16" />
          </div>
          <span class="sidebar-brand-name">MOZ<span class="text-gold">BID</span></span>
        </router-link>
        <div class="flex items-center gap-2">
          <span class="sidebar-badge">COMPRADOR</span>
          <button
            class="mobile-close-btn"
            @click="isMobileMenuOpen = false"
            aria-label="Fechar menu"
          >
            <X :size="18" />
          </button>
        </div>
      </div>

      <!-- User Profile Micro Card -->
      <div class="user-micro-card">
        <div class="avatar-circle">
          {{ authStore.user?.name?.charAt(0) || 'U' }}
        </div>
        <div class="micro-info">
          <div class="micro-name">{{ authStore.user?.name }}</div>
          <div class="micro-balance">Saldo: <span class="text-gold">{{ formatMoney(authStore.userBalance) }}</span></div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <router-link to="/buyer/dashboard" class="sidebar-link" active-class="sidebar-link-active" @click="isMobileMenuOpen = false">
          <LayoutDashboard :size="18" /> Visão Geral
        </router-link>
        <router-link to="/catalog" class="sidebar-link" @click="isMobileMenuOpen = false">
          <Search :size="18" /> Explorar Leilões
        </router-link>
        <router-link to="/buyer/dashboard?tab=bids" class="sidebar-link" @click="isMobileMenuOpen = false">
          <Gavel :size="18" /> Minhas Licitações
        </router-link>
        <router-link to="/buyer/dashboard?tab=watchlist" class="sidebar-link" @click="isMobileMenuOpen = false">
          <Heart :size="18" /> Favoritos & Watchlist
        </router-link>
        <router-link to="/buyer/dashboard?tab=wins" class="sidebar-link" @click="isMobileMenuOpen = false">
          <Trophy :size="18" /> Leilões Ganhos
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <router-link v-if="authStore.isSeller" to="/seller/dashboard" class="switch-role-btn" @click="isMobileMenuOpen = false">
          <Store :size="16" /> Mudar p/ Vendedor
        </router-link>
        <button class="logout-btn" @click="handleLogout">
          <LogOut :size="16" /> Terminar Sessão
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="dashboard-content-area">
      <header class="dashboard-topbar">
        <div class="topbar-left">
          <button
            class="mobile-toggle-btn"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Abrir menu"
          >
            <Menu :size="20" />
          </button>
          <div class="topbar-title">
            <h2>Painel do Comprador</h2>
          </div>
        </div>
        <div class="topbar-actions">
          <router-link to="/catalog" class="btn btn-sm btn-primary">
            <Plus :size="16" /> <span class="hidden sm:inline">Explorar Leilões</span><span class="sm:hidden">Explorar</span>
          </router-link>
          <router-link to="/" class="btn btn-sm btn-secondary hidden sm:inline-flex">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { formatMoney } from '../utils/money';
import ToastContainer from '../components/common/ToastContainer.vue';
import {
  Gavel, LayoutDashboard, Search, Heart, Trophy, Store, LogOut, Plus, Menu, X
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const isMobileMenuOpen = ref(false);

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
  position: relative;
}

.dashboard-sidebar {
  width: 260px;
  background-color: #0d0d0d;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100;
}

.sidebar-backdrop {
  display: none;
}

.mobile-toggle-btn {
  display: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  padding: 8px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.mobile-close-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 860px) {
  .dashboard-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 280px;
    transform: translateX(-100%);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.9);
  }

  .dashboard-sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 99;
  }

  .mobile-toggle-btn {
    display: flex;
  }

  .mobile-close-btn {
    display: flex;
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

.sidebar-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--color-primary);
  background: rgba(245, 160, 0, 0.12);
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
}

.micro-balance {
  font-size: 0.75rem;
  color: var(--color-text-muted);
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
