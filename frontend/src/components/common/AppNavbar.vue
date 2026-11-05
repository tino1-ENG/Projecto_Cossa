<template>
  <q-header elevated class="bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.08] text-white">
    <q-toolbar class="max-w-[1440px] mx-auto px-3 sm:px-margin h-16 sm:h-20 flex items-center justify-between">
      <!-- Brand / Logo -->
      <router-link to="/" class="flex items-center gap-2 sm:gap-space-sm group shrink-0 no-underline text-white">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded bg-surface-container flex items-center justify-center border border-white/[0.08] group-hover:border-primary/50 transition-colors shadow-sm">
          <span class="material-symbols-outlined text-primary text-[20px] sm:text-[24px]">gavel</span>
        </div>
        <div class="flex flex-col">
          <span class="font-headline-sm text-base sm:text-headline-sm uppercase tracking-wider text-on-surface font-bold">MozBid</span>
          <span class="font-label-caps text-[8px] sm:text-[9px] tracking-[0.2em] text-primary -mt-1 font-bold">MOÇAMBIQUE</span>
        </div>
      </router-link>

      <!-- Navigation Center (Desktop) -->
      <nav class="hidden md:flex items-center gap-space-lg">
        <router-link
          to="/"
          class="font-title-md text-title-md transition-colors pb-1 no-underline"
          :class="$route.path === '/' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
        >
          Início
        </router-link>
        <router-link
          to="/catalog"
          class="font-title-md text-title-md transition-colors pb-1 no-underline"
          :class="$route.path === '/catalog' && !$route.query.status ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
        >
          Explorar Leilões
        </router-link>
        <router-link
          to="/catalog?status=active"
          class="font-title-md text-title-md transition-colors pb-1 no-underline flex items-center gap-1.5"
          :class="$route.query.status === 'active' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
        >
          <span class="w-2 h-2 rounded-full bg-primary radar-ring"></span>
          <span>Ao Vivo</span>
        </router-link>
        <router-link
          to="/how-it-works"
          class="font-title-md text-title-md transition-colors pb-1 no-underline"
          :class="$route.path === '/how-it-works' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'"
        >
          Como Funciona
        </router-link>
      </nav>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-1.5 sm:gap-space-md">
        <!-- Currency Pill -->
        <q-badge
          outline
          color="primary"
          class="hidden sm:inline-flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container border border-white/[0.08] text-on-surface font-label-numeric text-label-numeric cursor-default"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>MZN</span>
        </q-badge>

        <!-- Search Icon Link -->
        <q-btn
          flat
          round
          dense
          icon="search"
          to="/catalog"
          class="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="Pesquisar Leilões"
        />

        <!-- Notifications Dropdown (Quasar Menu) -->
        <q-btn
          flat
          round
          dense
          icon="notifications"
          class="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="Notificações"
        >
          <q-badge
            v-if="unreadCount > 0"
            color="primary"
            floating
            rounded
            class="animate-pulse"
          />
          <q-menu dark class="bg-surface-container border border-white/[0.08] shadow-2xl p-space-md w-80 sm:w-96 rounded-xl">
            <div class="flex items-center justify-between pb-space-sm border-b border-white/[0.08] mb-space-sm">
              <span class="font-title-md text-title-md text-on-surface font-bold">Notificações</span>
              <q-btn
                flat
                dense
                no-caps
                size="sm"
                color="primary"
                label="Marcar lidas"
                @click="markAllRead"
              />
            </div>
            <div class="flex flex-col gap-space-xs max-h-72 overflow-y-auto">
              <div v-if="notifications.length === 0" class="py-6 text-center text-body-sm text-on-surface-variant/60">
                Nenhuma notificação recente
              </div>
              <div
                v-for="item in notifications.slice(0, 5)"
                :key="item.id"
                class="p-space-sm rounded bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer flex flex-col gap-1 border border-white/[0.04]"
                :class="{ 'border-l-2 border-l-primary': !item.is_read }"
                @click="onNotifClick(item)"
              >
                <div class="flex justify-between items-center">
                  <span class="font-title-md text-[13px] text-on-surface font-semibold">{{ item.title }}</span>
                  <span class="font-body-sm text-[10px] text-on-surface-variant/60">{{ formatTimeAgo(item.created_at) }}</span>
                </div>
                <p class="font-body-sm text-[12px] text-on-surface-variant leading-snug">{{ item.message }}</p>
              </div>
            </div>
          </q-menu>
        </q-btn>

        <!-- Watchlist Button (Desktop/Tablet) -->
        <q-btn
          flat
          round
          dense
          icon="bookmark"
          to="/buyer/dashboard?tab=watchlist"
          class="hidden xs:inline-flex text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="Lotes Marcados"
        >
          <q-badge
            v-if="watchlistCount > 0"
            color="primary"
            text-color="dark"
            floating
            rounded
            :label="watchlistCount"
          />
        </q-btn>

        <!-- Começar a Vender Button -->
        <q-btn
          outline
          no-caps
          color="primary"
          :to="sellerDestination"
          label="Começar a Vender"
          class="hidden lg:inline-flex px-space-md py-space-xs rounded text-label-caps font-label-caps tracking-wider transition-all"
        />

        <!-- User Authentication State -->
        <template v-if="authStore.isAuthenticated">
          <q-btn flat dense no-caps class="rounded-full bg-surface-container border border-white/[0.08] px-2 py-1">
            <q-avatar size="28px" color="primary" text-color="dark" class="font-bold text-[12px]">
              {{ authStore.user?.name?.charAt(0) || 'U' }}
            </q-avatar>
            <span class="hidden sm:inline-block ml-2 text-xs font-semibold text-white">
              {{ authStore.user?.name?.split(' ')[0] }}
            </span>
            <q-icon name="expand_more" size="16px" class="text-on-surface-variant ml-1" />

            <!-- User Dropdown Menu -->
            <q-menu dark class="bg-surface-container border border-white/[0.08] shadow-2xl p-space-sm w-64 rounded-xl">
              <div class="p-space-sm border-b border-white/[0.08] mb-1">
                <div class="font-title-md text-sm text-on-surface font-semibold">{{ authStore.user?.name }}</div>
                <div class="font-body-sm text-xs text-on-surface-variant/70 truncate">{{ authStore.user?.email }}</div>
                <q-badge color="primary" text-color="dark" class="mt-1 font-bold text-[10px]">
                  {{ roleLabel(authStore.user?.role) }}
                </q-badge>
              </div>

              <q-list dense>
                <q-item clickable v-close-popup to="/buyer/dashboard" class="rounded hover:bg-white/[0.06]">
                  <q-item-section avatar><q-icon name="dashboard" size="18px" class="text-primary" /></q-item-section>
                  <q-item-section class="text-sm">Painel do Comprador</q-item-section>
                </q-item>

                <q-item v-if="authStore.isSeller" clickable v-close-popup to="/seller/dashboard" class="rounded hover:bg-white/[0.06]">
                  <q-item-section avatar><q-icon name="storefront" size="18px" class="text-primary" /></q-item-section>
                  <q-item-section class="text-sm">Painel do Vendedor</q-item-section>
                </q-item>

                <q-item v-if="authStore.isAdmin" clickable v-close-popup to="/admin/dashboard" class="rounded hover:bg-white/[0.06]">
                  <q-item-section avatar><q-icon name="admin_panel_settings" size="18px" class="text-primary" /></q-item-section>
                  <q-item-section class="text-sm">Administração Central</q-item-section>
                </q-item>

                <q-separator dark class="my-1" />

                <q-item clickable v-close-popup @click="handleLogout" class="rounded text-error hover:bg-error/10">
                  <q-item-section avatar><q-icon name="logout" size="18px" /></q-item-section>
                  <q-item-section class="text-sm font-semibold">Terminar Sessão</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template v-else>
          <q-btn
            flat
            no-caps
            label="Iniciar Sessão"
            to="/auth/login"
            class="hidden sm:inline-flex text-on-surface-variant hover:text-on-surface"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            text-color="dark"
            label="Registar"
            to="/auth/register"
            class="font-bold text-xs shadow-md"
          />
        </template>

        <!-- Mobile Menu Toggle Button -->
        <q-btn
          flat
          round
          dense
          class="md:hidden ml-1 text-on-surface-variant hover:text-on-surface"
          :icon="showMobileMenu ? 'close' : 'menu'"
          @click="showMobileMenu = !showMobileMenu"
          aria-label="Abrir menu de navegação"
        />
      </div>
    </q-toolbar>

    <!-- Mobile Navigation Drawer via Quasar -->
    <q-drawer
      v-model="showMobileMenu"
      side="right"
      overlay
      bordered
      dark
      :width="280"
      class="bg-[#0e0e0e] text-white p-4 flex flex-col justify-between"
    >
      <div>
        <div class="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[22px]">gavel</span>
            <span class="font-bold text-lg">MOZ<span class="text-primary">BID</span></span>
          </div>
          <q-btn flat round dense icon="close" @click="showMobileMenu = false" />
        </div>

        <q-list class="flex flex-col gap-1">
          <q-item clickable v-close-popup to="/" class="rounded-lg hover:bg-white/[0.05]">
            <q-item-section avatar><q-icon name="home" size="20px" class="text-primary" /></q-item-section>
            <q-item-section class="text-sm font-semibold">Início</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/catalog" class="rounded-lg hover:bg-white/[0.05]">
            <q-item-section avatar><q-icon name="search" size="20px" class="text-primary" /></q-item-section>
            <q-item-section class="text-sm font-semibold">Explorar Catálogo</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/catalog?status=active" class="rounded-lg hover:bg-white/[0.05]">
            <q-item-section avatar><q-icon name="sensors" size="20px" class="text-emerald-400" /></q-item-section>
            <q-item-section class="text-sm font-semibold">Pregões Ao Vivo</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/how-it-works" class="rounded-lg hover:bg-white/[0.05]">
            <q-item-section avatar><q-icon name="help_outline" size="20px" class="text-primary" /></q-item-section>
            <q-item-section class="text-sm font-semibold">Como Funciona</q-item-section>
          </q-item>

          <q-separator dark class="my-3" />

          <template v-if="authStore.isAuthenticated">
            <q-item clickable v-close-popup to="/buyer/dashboard" class="rounded-lg hover:bg-white/[0.05]">
              <q-item-section avatar><q-icon name="dashboard" size="20px" class="text-primary" /></q-item-section>
              <q-item-section class="text-sm font-semibold">Painel Comprador</q-item-section>
            </q-item>
            <q-item v-if="authStore.isSeller" clickable v-close-popup to="/seller/dashboard" class="rounded-lg hover:bg-white/[0.05]">
              <q-item-section avatar><q-icon name="storefront" size="20px" class="text-primary" /></q-item-section>
              <q-item-section class="text-sm font-semibold">Painel Vendedor</q-item-section>
            </q-item>
            <q-item v-if="authStore.isAdmin" clickable v-close-popup to="/admin/dashboard" class="rounded-lg hover:bg-white/[0.05]">
              <q-item-section avatar><q-icon name="admin_panel_settings" size="20px" class="text-primary" /></q-item-section>
              <q-item-section class="text-sm font-semibold">Administração Central</q-item-section>
            </q-item>
          </template>
          <template v-else>
            <q-item clickable v-close-popup to="/auth/login" class="rounded-lg hover:bg-white/[0.05]">
              <q-item-section avatar><q-icon name="login" size="20px" class="text-primary" /></q-item-section>
              <q-item-section class="text-sm font-semibold">Iniciar Sessão</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/auth/register" class="rounded-lg bg-primary/10 text-primary border border-primary/30">
              <q-item-section avatar><q-icon name="person_add" size="20px" class="text-primary" /></q-item-section>
              <q-item-section class="text-sm font-semibold">Criar Conta</q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>

      <div class="pt-4 border-t border-white/[0.08]">
        <q-btn
          v-if="authStore.isAuthenticated"
          flat
          color="negative"
          icon="logout"
          label="Terminar Sessão"
          no-caps
          class="w-full justify-start"
          @click="handleLogout"
        />
      </div>
    </q-drawer>
  </q-header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useAuctionStore } from '../../stores/auction';
import { useNotificationStore } from '../../stores/notification';
import { formatTimeAgo } from '../../utils/date';

const router = useRouter();
const authStore = useAuthStore();
const auctionStore = useAuctionStore();
const notifStore = useNotificationStore();

const showMobileMenu = ref(false);

const notifications = computed(() => notifStore.notifications);
const unreadCount = computed(() => notifStore.unreadCount);
const watchlistCount = computed(() => auctionStore.watchlistIds.size);

const sellerDestination = computed(() => {
  if (!authStore.isAuthenticated) return '/auth/login?redirect=/seller/dashboard';
  if (authStore.isSeller) return '/seller/dashboard';
  return '/seller/dashboard';
});

onMounted(() => {
  if (authStore.isAuthenticated) {
    notifStore.fetchNotifications();
    auctionStore.fetchWatchlist();
  }
});

function markAllRead() {
  notifStore.markAllAsRead();
}

function onNotifClick(item: any) {
  notifStore.markAsRead(item.id);
  if (item.link) {
    router.push(item.link);
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/auth/login');
}

function roleLabel(role?: string) {
  if (role === 'admin') return 'Administrador';
  if (role === 'seller') return 'Vendedor Homologado';
  return 'Licitador VIP';
}
</script>
