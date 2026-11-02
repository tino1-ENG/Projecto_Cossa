<template>
  <div class="dashboard-layout">
    <!-- Backdrop for mobile drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="sidebar-backdrop"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Admin Sidebar -->
    <aside class="dashboard-sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-brand" @click="isMobileMenuOpen = false">
          <div class="logo-box-xs">
            <Gavel :size="16" />
          </div>
          <span class="sidebar-brand-name">MOZ<span class="text-gold">BID</span></span>
        </router-link>
        <div class="flex items-center gap-2">
          <span class="sidebar-badge-admin">ADMIN</span>
          <button
            class="mobile-close-btn"
            @click="isMobileMenuOpen = false"
            aria-label="Fechar menu"
          >
            <X :size="18" />
          </button>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <router-link to="/admin/dashboard" class="sidebar-link" active-class="sidebar-link-active" @click="isMobileMenuOpen = false">
          <ShieldAlert :size="18" /> Painel de Controlo
        </router-link>
        <router-link to="/admin/dashboard?tab=users" class="sidebar-link" @click="isMobileMenuOpen = false">
          <Users :size="18" /> Utilizadores
        </router-link>
        <router-link to="/admin/dashboard?tab=sellers" class="sidebar-link" @click="isMobileMenuOpen = false">
          <ShieldCheck :size="18" /> Verificação Vendedores
        </router-link>
        <router-link to="/admin/dashboard?tab=auctions" class="sidebar-link" @click="isMobileMenuOpen = false">
          <Gavel :size="18" /> Moderação de Leilões
        </router-link>
        <router-link to="/admin/dashboard?tab=overview" class="sidebar-link" @click="isMobileMenuOpen = false">
          <FileText :size="18" /> Logs de Auditoria
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <router-link to="/" class="switch-role-btn" @click="isMobileMenuOpen = false">
          <Home :size="16" /> Ir ao Marketplace
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
            <h2>Administração MozBid</h2>
          </div>
        </div>
        <div class="topbar-actions">
          <div class="sqlite-status-tag">
            <span class="pulse-dot"></span>
            <span class="hidden sm:inline">MongoDB Activo</span>
            <span class="sm:hidden">Online</span>
          </div>
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
import ToastContainer from '../components/common/ToastContainer.vue';
import {
  Gavel, ShieldAlert, Users, ShieldCheck, FileText, Home, LogOut, Menu, X
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
  background-color: #0b0b0b;
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

.sidebar-badge-admin {
  font-size: 0.65rem;
  font-weight: 800;
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 2px 6px;
  border-radius: var(--radius-pill);
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
  font-size: 1.2rem;
  font-weight: 700;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sqlite-status-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: var(--color-success);
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
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
