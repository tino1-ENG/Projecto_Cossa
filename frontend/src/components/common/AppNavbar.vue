<template>
  <q-header class="bg-white/95 backdrop-blur-md border-b border-[#E7E3DC] text-[#171717] transition-colors">
    <q-toolbar class="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
      <!-- Brand / Logo (Editorial Luxury Typography) -->
      <router-link to="/" class="flex items-center gap-3 no-underline text-[#171717] group">
        <div class="flex flex-col">
          <span class="font-editorial text-2xl sm:text-[26px] tracking-wide font-bold text-[#171717] group-hover:text-[#B69A68] transition-colors">MOZBID</span>
          <span class="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#B69A68] uppercase font-semibold -mt-1">MOÇAMBIQUE</span>
        </div>
      </router-link>

      <!-- Navigation Center (Desktop) -->
      <nav class="hidden md:flex items-center gap-8">
        <router-link
          to="/catalog"
          class="font-sans text-sm tracking-wide transition-colors py-1 no-underline"
          :class="$route.path === '/catalog' && !$route.query.status ? 'text-[#171717] font-semibold border-b-2 border-[#171717]' : 'text-[#666666] hover:text-[#171717]'"
        >
          Explorar Leilões
        </router-link>
        <a
          href="/#categorias"
          class="font-sans text-sm tracking-wide transition-colors py-1 no-underline text-[#666666] hover:text-[#171717]"
        >
          Categorias
        </a>
        <router-link
          to="/how-it-works"
          class="font-sans text-sm tracking-wide transition-colors py-1 no-underline"
          :class="$route.path === '/how-it-works' ? 'text-[#171717] font-semibold border-b-2 border-[#171717]' : 'text-[#666666] hover:text-[#171717]'"
        >
          Como Funciona
        </router-link>
        <a
          href="/#sobre-nos"
          class="font-sans text-sm tracking-wide transition-colors py-1 no-underline text-[#666666] hover:text-[#171717]"
        >
          Sobre Nós
        </a>
      </nav>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Currency Pill -->
        <div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E3DC] text-[11px] font-medium text-[#777777]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>MZN</span>
        </div>

        <!-- Search Icon Link -->
        <q-btn
          flat
          round
          dense
          icon="search"
          to="/catalog"
          class="text-[#444444] hover:text-[#171717] hover:bg-[#F4F1EB] transition-colors"
          title="Pesquisar Leilões"
        />

        <!-- Notifications Dropdown (Quasar Menu) -->
        <q-btn
          flat
          round
          dense
          icon="notifications"
          class="text-[#444444] hover:text-[#171717] hover:bg-[#F4F1EB] transition-colors"
          title="Notificações"
        >
          <q-badge
            v-if="unreadCount > 0"
            color="primary"
            floating
            rounded
            class="scale-75"
          />
          <q-menu class="bg-white border border-[#E7E3DC] shadow-xl p-4 w-80 sm:w-96 rounded-xl text-[#171717]">
            <div class="flex items-center justify-between pb-3 border-b border-[#E7E3DC] mb-3">
              <span class="font-display text-sm font-semibold text-[#171717]">Notificações</span>
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
            <div class="flex flex-col gap-2 max-h-72 overflow-y-auto">
              <div v-if="notifications.length === 0" class="py-6 text-center text-xs text-[#888888]">
                Nenhuma notificação recente
              </div>
              <div
                v-for="item in notifications.slice(0, 5)"
                :key="item.id"
                class="p-2.5 rounded bg-[#FAF8F5] hover:bg-[#F4F1EB] transition-colors cursor-pointer flex flex-col gap-1 border border-[#E7E3DC]"
                :class="{ 'border-l-2 border-l-[#B69A68]': !item.is_read }"
                @click="onNotifClick(item)"
              >
                <div class="flex justify-between items-center">
                  <span class="font-display text-xs text-[#171717] font-semibold">{{ item.title }}</span>
                  <span class="text-[10px] text-[#888888]">{{ formatTimeAgo(item.created_at) }}</span>
                </div>
                <p class="text-[11px] text-[#555555] leading-snug">{{ item.message }}</p>
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
          class="hidden xs:inline-flex text-[#444444] hover:text-[#171717] hover:bg-[#F4F1EB] transition-colors"
          title="Lotes Marcados"
        >
          <q-badge
            v-if="watchlistCount > 0"
            color="primary"
            text-color="white"
            floating
            rounded
            :label="watchlistCount"
          />
        </q-btn>

        <!-- User Authentication State -->
        <template v-if="authStore.isAuthenticated">
          <q-btn flat dense no-caps class="rounded-full bg-[#FAF8F5] border border-[#E7E3DC] px-2.5 py-1">
            <q-avatar size="26px" color="primary" text-color="white" class="font-semibold text-xs">
              {{ authStore.user?.name?.charAt(0) || 'U' }}
            </q-avatar>
            <span class="hidden sm:inline-block ml-2 text-xs font-medium text-[#171717]">
              {{ authStore.user?.name?.split(' ')[0] }}
            </span>
            <q-icon name="expand_more" size="16px" class="text-[#777777] ml-1" />

            <!-- User Dropdown Menu -->
            <q-menu class="bg-white border border-[#E7E3DC] shadow-xl p-3 w-64 rounded-xl text-[#171717]">
              <div class="p-2 border-b border-[#E7E3DC] mb-2">
                <div class="font-display text-sm text-[#171717] font-semibold">{{ authStore.user?.name }}</div>
                <div class="text-xs text-[#777777] truncate">{{ authStore.user?.email }}</div>
                <span class="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#B69A68] bg-[#F4F1EB] px-2 py-0.5 rounded">
                  {{ roleLabel(authStore.user?.role) }}
                </span>
              </div>

              <q-list dense>
                <q-item clickable v-close-popup to="/buyer/dashboard" class="rounded hover:bg-[#FAF8F5]">
                  <q-item-section avatar><q-icon name="dashboard" size="18px" class="text-[#B69A68]" /></q-item-section>
                  <q-item-section class="text-xs font-medium">Painel do Comprador</q-item-section>
                </q-item>

                <q-item v-if="authStore.isSeller" clickable v-close-popup to="/seller/dashboard" class="rounded hover:bg-[#FAF8F5]">
                  <q-item-section avatar><q-icon name="storefront" size="18px" class="text-[#B69A68]" /></q-item-section>
                  <q-item-section class="text-xs font-medium">Painel do Vendedor</q-item-section>
                </q-item>

                <q-item v-if="authStore.isAdmin" clickable v-close-popup to="/admin/dashboard" class="rounded hover:bg-[#FAF8F5]">
                  <q-item-section avatar><q-icon name="admin_panel_settings" size="18px" class="text-[#B69A68]" /></q-item-section>
                  <q-item-section class="text-xs font-medium">Administração Central</q-item-section>
                </q-item>

                <q-separator class="my-1 border-[#E7E3DC]" />

                <q-item clickable v-close-popup @click="handleLogout" class="rounded text-red-600 hover:bg-red-50">
                  <q-item-section avatar><q-icon name="logout" size="18px" /></q-item-section>
                  <q-item-section class="text-xs font-semibold">Terminar Sessão</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <template v-else>
          <router-link
            to="/auth/login"
            class="hidden sm:inline-flex text-xs sm:text-sm font-medium text-[#171717] hover:text-[#B69A68] px-2 py-1.5 transition-colors no-underline"
          >
            Entrar
          </router-link>
          <router-link
            to="/auth/register"
            class="inline-flex items-center justify-center px-4 py-2 rounded bg-[#171717] text-white text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#B69A68] transition-colors no-underline shadow-sm"
          >
            Criar Conta
          </router-link>
        </template>

        <!-- Mobile Menu Toggle Button -->
        <q-btn
          flat
          round
          dense
          class="md:hidden ml-1 text-[#171717]"
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
      :width="290"
      class="bg-[#FAF8F5] text-[#171717] p-5 flex flex-col justify-between border-l border-[#E7E3DC]"
    >
      <div>
        <div class="flex items-center justify-between pb-4 border-b border-[#E7E3DC] mb-5">
          <div class="flex flex-col">
            <span class="font-editorial text-xl font-bold tracking-wide text-[#171717]">MOZBID</span>
            <span class="text-[8px] tracking-[0.25em] text-[#B69A68] uppercase font-semibold">MOÇAMBIQUE</span>
          </div>
          <q-btn flat round dense icon="close" text-color="dark" @click="showMobileMenu = false" />
        </div>

        <q-list class="flex flex-col gap-1.5">
          <q-item clickable v-close-popup to="/" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section avatar><q-icon name="home" size="18px" class="text-[#B69A68]" /></q-item-section>
            <q-item-section class="text-sm font-medium">Início</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/catalog" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section avatar><q-icon name="search" size="18px" class="text-[#B69A68]" /></q-item-section>
            <q-item-section class="text-sm font-medium">Explorar Leilões</q-item-section>
          </q-item>
          <q-item clickable v-close-popup href="/#categorias" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section avatar><q-icon name="category" size="18px" class="text-[#B69A68]" /></q-item-section>
            <q-item-section class="text-sm font-medium">Categorias</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/how-it-works" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section avatar><q-icon name="help_outline" size="18px" class="text-[#B69A68]" /></q-item-section>
            <q-item-section class="text-sm font-medium">Como Funciona</q-item-section>
          </q-item>
          <q-item clickable v-close-popup href="/#sobre-nos" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section avatar><q-icon name="info" size="18px" class="text-[#B69A68]" /></q-item-section>
            <q-item-section class="text-sm font-medium">Sobre Nós</q-item-section>
          </q-item>

          <q-separator class="my-3 border-[#E7E3DC]" />

          <template v-if="authStore.isAuthenticated">
            <q-item clickable v-close-popup to="/buyer/dashboard" class="rounded-lg hover:bg-white">
              <q-item-section avatar><q-icon name="dashboard" size="18px" class="text-[#B69A68]" /></q-item-section>
              <q-item-section class="text-sm font-medium">Painel Comprador</q-item-section>
            </q-item>
            <q-item v-if="authStore.isSeller" clickable v-close-popup to="/seller/dashboard" class="rounded-lg hover:bg-white">
              <q-item-section avatar><q-icon name="storefront" size="18px" class="text-[#B69A68]" /></q-item-section>
              <q-item-section class="text-sm font-medium">Painel Vendedor</q-item-section>
            </q-item>
            <q-item v-if="authStore.isAdmin" clickable v-close-popup to="/admin/dashboard" class="rounded-lg hover:bg-white">
              <q-item-section avatar><q-icon name="admin_panel_settings" size="18px" class="text-[#B69A68]" /></q-item-section>
              <q-item-section class="text-sm font-medium">Administração</q-item-section>
            </q-item>
          </template>
          <template v-else>
            <q-item clickable v-close-popup to="/auth/login" class="rounded-lg hover:bg-white">
              <q-item-section avatar><q-icon name="login" size="18px" class="text-[#B69A68]" /></q-item-section>
              <q-item-section class="text-sm font-medium">Entrar</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/auth/register" class="rounded-lg bg-[#171717] text-white">
              <q-item-section avatar><q-icon name="person_add" size="18px" class="text-white" /></q-item-section>
              <q-item-section class="text-sm font-semibold">Criar Conta</q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>

      <div class="pt-4 border-t border-[#E7E3DC]">
        <q-btn
          v-if="authStore.isAuthenticated"
          flat
          color="negative"
          icon="logout"
          label="Terminar Sessão"
          no-caps
          class="w-full justify-start text-xs font-semibold"
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
  return 'Licitador';
}
</script>
