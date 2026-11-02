<template>
  <header class="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/[0.08]">
    <div class="max-w-[1440px] mx-auto px-margin h-20 flex items-center justify-between">
      <!-- Brand / Logo -->
      <router-link to="/" class="flex items-center gap-space-sm group">
        <div class="w-10 h-10 rounded bg-surface-container flex items-center justify-center border border-white/[0.08] group-hover:border-primary/50 transition-colors shadow-sm">
          <span class="material-symbols-outlined text-primary text-[24px]">gavel</span>
        </div>
        <div class="flex flex-col">
          <span class="font-headline-sm text-headline-sm uppercase tracking-wider text-on-surface">MozBid</span>
          <span class="font-label-caps text-[9px] tracking-[0.2em] text-primary -mt-1 font-bold">MOÇAMBIQUE</span>
        </div>
      </router-link>

      <!-- Navigation Center -->
      <nav class="hidden md:flex items-center gap-space-lg">
        <router-link
          to="/"
          class="font-title-md text-title-md transition-colors pb-1"
          :class="$route.path === '/' ? 'text-on-surface border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'"
        >
          Início
        </router-link>
        <router-link
          to="/catalog"
          class="font-title-md text-title-md transition-colors pb-1"
          :class="$route.path === '/catalog' && !$route.query.status ? 'text-on-surface border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'"
        >
          Explorar Leilões
        </router-link>
        <router-link
          to="/catalog?status=active"
          class="font-title-md text-title-md transition-colors pb-1"
          :class="$route.query.status === 'active' ? 'text-on-surface border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'"
        >
          Ao Vivo
        </router-link>
        <router-link
          to="/how-it-works"
          class="font-title-md text-title-md transition-colors pb-1"
          :class="$route.path === '/how-it-works' ? 'text-on-surface border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'"
        >
          Como Funciona
        </router-link>
      </nav>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-space-md">
        <!-- Currency Pill -->
        <div class="hidden sm:flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container border border-white/[0.08] text-on-surface font-label-numeric text-label-numeric">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>MZN</span>
          <span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
        </div>

        <!-- Search Icon Link -->
        <router-link
          to="/catalog"
          class="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="Pesquisar Leilões"
        >
          <span class="material-symbols-outlined text-[20px]">search</span>
        </router-link>

        <!-- Notifications Dropdown -->
        <div class="relative">
          <button
            class="relative w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            @click="toggleNotifs"
            title="Notificações"
            type="button"
          >
            <span class="material-symbols-outlined text-[20px]">notifications</span>
            <span v-if="unreadCount > 0" class="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </button>

          <!-- Notifications Tray -->
          <div
            v-if="showNotifs"
            class="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-surface-container border border-white/[0.08] shadow-2xl p-space-md z-50 backdrop-blur-xl"
          >
            <div class="flex items-center justify-between pb-space-sm border-b border-white/[0.08] mb-space-sm">
              <span class="font-title-md text-title-md text-on-surface">Notificações</span>
              <button
                class="font-label-caps text-[10px] text-primary hover:underline"
                @click="markAllRead"
              >
                Marcar lidas
              </button>
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
          </div>
        </div>

        <!-- Watchlist Button -->
        <router-link
          to="/buyer/dashboard?tab=watchlist"
          class="relative w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="Lotes Marcados"
        >
          <span class="material-symbols-outlined text-[20px]">bookmark</span>
          <span
            v-if="watchlistCount > 0"
            class="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-surface-container-highest text-primary font-label-numeric text-[10px]"
          >
            {{ watchlistCount }}
          </span>
        </router-link>

        <!-- Começar a Vender Button -->
        <router-link
          :to="sellerDestination"
          class="hidden lg:flex items-center justify-center px-space-md py-space-xs rounded border border-white/[0.12] hover:border-primary text-on-surface hover:text-primary font-label-caps text-label-caps tracking-wider transition-all"
        >
          Começar a Vender
        </router-link>

        <!-- User Authentication State -->
        <template v-if="authStore.isAuthenticated">
          <div class="relative">
            <button
              class="flex items-center gap-space-xs px-2.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-white/[0.08] transition-colors"
              @click="toggleUserMenu"
              type="button"
            >
              <div class="w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[12px]">
                {{ authStore.user?.name?.charAt(0) || 'U' }}
              </div>
              <span class="hidden sm:inline font-body-sm font-medium text-on-surface">
                {{ authStore.user?.name?.split(' ')[0] }}
              </span>
              <span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
            </button>

            <!-- User Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container border border-white/[0.08] shadow-2xl p-space-sm z-50 backdrop-blur-xl flex flex-col gap-1"
            >
              <div class="p-space-sm border-b border-white/[0.08] mb-1">
                <div class="font-title-md text-sm text-on-surface font-semibold">{{ authStore.user?.name }}</div>
                <div class="font-body-sm text-xs text-on-surface-variant/70 truncate">{{ authStore.user?.email }}</div>
                <span class="inline-block mt-1 font-label-caps text-[9px] px-2 py-0.5 rounded bg-primary/20 text-primary">
                  {{ roleLabel(authStore.user?.role) }}
                </span>
              </div>
              <router-link
                to="/buyer/dashboard"
                class="px-space-sm py-2 rounded text-body-sm text-on-surface hover:bg-surface-container-high hover:text-primary flex items-center gap-2 transition-colors"
                @click="closeMenus"
              >
                <span class="material-symbols-outlined text-[18px]">dashboard</span>
                <span>Painel do Comprador</span>
              </router-link>
              <router-link
                v-if="authStore.isSeller"
                to="/seller/dashboard"
                class="px-space-sm py-2 rounded text-body-sm text-on-surface hover:bg-surface-container-high hover:text-primary flex items-center gap-2 transition-colors"
                @click="closeMenus"
              >
                <span class="material-symbols-outlined text-[18px]">storefront</span>
                <span>Painel do Vendedor</span>
              </router-link>
              <router-link
                v-if="authStore.isAdmin"
                to="/admin/dashboard"
                class="px-space-sm py-2 rounded text-body-sm text-on-surface hover:bg-surface-container-high hover:text-primary flex items-center gap-2 transition-colors"
                @click="closeMenus"
              >
                <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                <span>Administração Geral</span>
              </router-link>
              <div class="border-t border-white/[0.08] my-1"></div>
              <button
                class="w-full text-left px-space-sm py-2 rounded text-body-sm text-error hover:bg-error/10 flex items-center gap-2 transition-colors"
                @click="handleLogout"
                type="button"
              >
                <span class="material-symbols-outlined text-[18px]">logout</span>
                <span>Terminar Sessão</span>
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link
            to="/auth/login"
            class="hidden sm:inline-flex px-space-md py-space-xs rounded text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Iniciar Sessão
          </router-link>
          <router-link
            to="/auth/register"
            class="px-space-md py-space-xs rounded bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-caps text-label-caps uppercase transition-colors shadow-md"
          >
            Registar
          </router-link>
        </template>

        <!-- Mobile Menu Toggle Button -->
        <button
          class="md:hidden w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          @click="toggleMobileMenu"
          type="button"
        >
          <span class="material-symbols-outlined text-[22px]">
            {{ showMobileMenu ? 'close' : 'menu' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div
      v-if="showMobileMenu"
      class="md:hidden border-t border-white/[0.08] bg-surface-container-low px-margin py-space-md flex flex-col gap-space-sm"
    >
      <router-link
        to="/"
        class="py-2 text-on-surface font-title-md hover:text-primary transition-colors flex items-center gap-2"
        @click="closeMenus"
      >
        <span class="material-symbols-outlined text-[18px]">home</span>
        <span>Início</span>
      </router-link>
      <router-link
        to="/catalog"
        class="py-2 text-on-surface font-title-md hover:text-primary transition-colors flex items-center gap-2"
        @click="closeMenus"
      >
        <span class="material-symbols-outlined text-[18px]">explore</span>
        <span>Explorar Leilões</span>
      </router-link>
      <router-link
        to="/catalog?status=active"
        class="py-2 text-on-surface font-title-md hover:text-primary transition-colors flex items-center gap-2"
        @click="closeMenus"
      >
        <span class="material-symbols-outlined text-[18px]">gavel</span>
        <span>Leilões Ao Vivo</span>
      </router-link>
      <router-link
        to="/how-it-works"
        class="py-2 text-on-surface font-title-md hover:text-primary transition-colors flex items-center gap-2"
        @click="closeMenus"
      >
        <span class="material-symbols-outlined text-[18px]">verified_user</span>
        <span>Como Funciona</span>
      </router-link>
      <router-link
        :to="sellerDestination"
        class="py-2 text-primary font-title-md hover:underline flex items-center gap-2"
        @click="closeMenus"
      >
        <span class="material-symbols-outlined text-[18px]">add_business</span>
        <span>Começar a Vender</span>
      </router-link>

      <div class="border-t border-white/[0.08] my-2"></div>

      <template v-if="authStore.isAuthenticated">
        <router-link
          to="/buyer/dashboard"
          class="py-2 text-on-surface-variant hover:text-on-surface font-body-md flex items-center gap-2"
          @click="closeMenus"
        >
          <span class="material-symbols-outlined text-[18px]">dashboard</span>
          <span>Painel do Comprador</span>
        </router-link>
        <router-link
          v-if="authStore.isSeller"
          to="/seller/dashboard"
          class="py-2 text-on-surface-variant hover:text-on-surface font-body-md flex items-center gap-2"
          @click="closeMenus"
        >
          <span class="material-symbols-outlined text-[18px]">storefront</span>
          <span>Painel do Vendedor</span>
        </router-link>
        <router-link
          v-if="authStore.isAdmin"
          to="/admin/dashboard"
          class="py-2 text-on-surface-variant hover:text-on-surface font-body-md flex items-center gap-2"
          @click="closeMenus"
        >
          <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          <span>Painel de Administração</span>
        </router-link>
        <button
          class="py-2 text-left text-error hover:underline font-body-md flex items-center gap-2"
          @click="handleLogout"
          type="button"
        >
          <span class="material-symbols-outlined text-[18px]">logout</span>
          <span>Terminar Sessão</span>
        </button>
      </template>
      <template v-else>
        <router-link
          to="/auth/login"
          class="py-2 text-on-surface font-title-md text-center rounded bg-surface-container border border-white/[0.08]"
          @click="closeMenus"
        >
          Iniciar Sessão
        </router-link>
        <router-link
          to="/auth/register"
          class="py-2 text-on-primary font-title-md text-center rounded bg-primary"
          @click="closeMenus"
        >
          Criar Conta Oficial
        </router-link>
      </template>
    </div>
  </header>
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
const notificationStore = useNotificationStore();

const showNotifs = ref(false);
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);
const watchlistCount = computed(() => auctionStore.watchlist.length);

const sellerDestination = computed(() => {
  if (!authStore.isAuthenticated) return '/auth/register?role=seller';
  if (authStore.isSeller) return '/seller/dashboard';
  return '/buyer/dashboard?action=become_seller';
});

function toggleNotifs() {
  showNotifs.value = !showNotifs.value;
  if (showNotifs.value) {
    showUserMenu.value = false;
  }
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
  if (showUserMenu.value) {
    showNotifs.value = false;
  }
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
}

function closeMenus() {
  showNotifs.value = false;
  showUserMenu.value = false;
  showMobileMenu.value = false;
}

async function markAllRead() {
  await notificationStore.markAllAsRead();
}

async function onNotifClick(item: any) {
  if (!item.is_read) {
    await notificationStore.markAsRead(item.id);
  }
  closeMenus();
  if (item.auction_id) {
    router.push(`/auction/${item.auction_id}`);
  }
}

function handleLogout() {
  closeMenus();
  authStore.logout();
  router.push('/auth/login');
}

function roleLabel(role?: string) {
  if (role === 'admin') return 'Administrador';
  if (role === 'seller') return 'Vendedor Verificado';
  return 'Licitador Credenciado';
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    notificationStore.fetchNotifications().catch(() => {});
  }
});
</script>
