<template>
  <q-header class="bg-white/95 backdrop-blur-md border-b border-[#E7E3DC] text-[#171717] transition-colors sticky top-0 z-50">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
      <!-- Brand / Logo (Editorial Luxury Typography) -->
      <router-link to="/" class="flex items-center gap-3 no-underline text-[#171717] group shrink-0">
        <div class="flex flex-col">
          <span class="font-editorial text-2xl sm:text-[26px] tracking-wide font-bold text-[#171717] group-hover:text-[#B69A68] transition-colors leading-none">
            MOZBID
          </span>
          <span class="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#B69A68] uppercase font-semibold mt-0.5">
            MOÇAMBIQUE
          </span>
        </div>
      </router-link>

      <!-- Navigation Center (Desktop / Tablet Wide) -->
      <nav class="navbar-center-nav">
        <router-link
          to="/catalog"
          class="font-sans text-xs lg:text-sm tracking-wide transition-colors py-1 no-underline whitespace-nowrap"
          :class="$route.path === '/catalog' && !$route.query.status ? 'text-[#171717] font-semibold border-b-2 border-[#171717]' : 'text-[#666666] hover:text-[#171717]'"
        >
          Explorar Leilões
        </router-link>

        <a
          href="/#categorias"
          class="font-sans text-xs lg:text-sm tracking-wide transition-colors py-1 no-underline text-[#666666] hover:text-[#171717] whitespace-nowrap"
        >
          Categorias
        </a>

        <router-link
          to="/how-it-works"
          class="font-sans text-xs lg:text-sm tracking-wide transition-colors py-1 no-underline whitespace-nowrap"
          :class="$route.path === '/how-it-works' ? 'text-[#171717] font-semibold border-b-2 border-[#171717]' : 'text-[#666666] hover:text-[#171717]'"
        >
          Como Funciona
        </router-link>

        <a
          href="/#sobre-nos"
          class="font-sans text-xs lg:text-sm tracking-wide transition-colors py-1 no-underline text-[#666666] hover:text-[#171717] whitespace-nowrap"
        >
          Sobre Nós
        </a>

        <!-- Contactos (Abre modal de apoio oficial) -->
        <button
          type="button"
          class="font-sans text-xs lg:text-sm tracking-wide transition-colors py-1 text-[#666666] hover:text-[#B69A68] cursor-pointer bg-transparent border-0 flex items-center gap-1 whitespace-nowrap"
          @click="showContactModal = true"
        >
          <span>Contactos</span>
        </button>
      </nav>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <!-- Currency Pill (Desktop) -->
        <div class="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E7E3DC] text-[11px] font-medium text-[#777777]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>MZN</span>
        </div>

        <!-- Search Icon Link -->
        <router-link
          to="/catalog"
          class="w-9 h-9 rounded-lg flex items-center justify-center text-[#444444] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#E7E3DC]"
          title="Pesquisar Leilões"
        >
          <Search :size="18" />
        </router-link>

        <!-- Notifications Dropdown (Quasar Menu) - Only for Authenticated Users -->
        <div v-if="authStore.isAuthenticated" class="relative">
          <button
            type="button"
            class="w-9 h-9 rounded-lg flex items-center justify-center text-[#444444] hover:text-[#171717] hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#E7E3DC] cursor-pointer relative"
            title="Notificações"
          >
            <Bell :size="18" />
            <span
              v-if="unreadCount > 0"
              class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B69A68]"
            ></span>
            <q-menu class="bg-white border border-[#E7E3DC] shadow-xl p-4 w-80 sm:w-96 rounded-xl text-[#171717]">
              <div class="flex items-center justify-between pb-3 border-b border-[#E7E3DC] mb-3">
                <span class="font-display text-sm font-semibold text-[#171717]">Notificações</span>
                <button
                  type="button"
                  class="text-xs text-[#B69A68] hover:underline font-semibold bg-transparent border-0 cursor-pointer"
                  @click="markAllRead"
                >
                  Marcar lidas
                </button>
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
          </button>
        </div>

        <!-- User Authentication State -->
        <template v-if="authStore.isAuthenticated">
          <q-btn flat dense no-caps class="rounded-full bg-[#FAF8F5] border border-[#E7E3DC] px-2.5 py-1">
            <q-avatar size="26px" color="primary" text-color="white" class="font-semibold text-xs">
              {{ authStore.user?.name?.charAt(0) || 'U' }}
            </q-avatar>
            <span class="hidden sm:inline-block ml-2 text-xs font-medium text-[#171717]">
              {{ authStore.user?.name?.split(' ')[0] }}
            </span>
            <ChevronDown :size="14" class="text-[#777777] ml-1" />

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
                <!-- Acesso estritamente determinado pelas credenciais da conta autenticada -->
                <q-item v-if="authStore.user?.role === 'admin'" clickable v-close-popup to="/admin/dashboard" class="rounded hover:bg-[#FAF8F5]">
                  <q-item-section class="text-xs font-semibold text-[#171717]">Administração Central</q-item-section>
                </q-item>

                <q-item v-else-if="authStore.user?.role === 'seller'" clickable v-close-popup to="/seller/dashboard" class="rounded hover:bg-[#FAF8F5]">
                  <q-item-section class="text-xs font-semibold text-[#171717]">Painel do Vendedor</q-item-section>
                </q-item>

                <q-item v-else-if="authStore.user?.role === 'buyer'" clickable v-close-popup to="/buyer/dashboard" class="rounded hover:bg-[#FAF8F5]">
                  <q-item-section class="text-xs font-semibold text-[#171717]">Painel do Comprador</q-item-section>
                </q-item>

                <q-separator class="my-1 border-[#E7E3DC]" />

                <q-item clickable v-close-popup @click="handleLogout" class="rounded text-red-600 hover:bg-red-50">
                  <q-item-section class="text-xs font-semibold">Terminar Sessão</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>

        <!-- Unauthenticated Guest State: ENTRAR + REGISTAR / CRIAR CONTA (Sempre visível em mobile e desktop) -->
        <template v-else>
          <!-- Entrar (Login) Button - Visível em todas as resoluções -->
          <router-link
            to="/auth/login"
            class="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#171717] hover:text-[#B69A68] hover:bg-[#FAF8F5] border border-[#E7E3DC] hover:border-[#B69A68] transition-all no-underline shrink-0"
          >
            <LogIn :size="14" />
            <span>Entrar</span>
          </router-link>

          <!-- Registar / Criar Conta Button - Visível em todas as resoluções -->
          <router-link
            to="/auth/register"
            class="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#171717] hover:bg-[#B69A68] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all no-underline shadow-xs shrink-0"
          >
            <UserPlus :size="14" />
            <span class="sm:hidden">Registar</span>
            <span class="hidden sm:inline">Criar Conta</span>
          </router-link>
        </template>

        <!-- Mobile Menu Toggle Button (Visible on screens < 860px) -->
        <button
          type="button"
          class="navbar-mobile-toggle w-9 h-9 rounded-lg text-[#171717] hover:bg-[#FAF8F5] border border-[#E7E3DC] flex items-center justify-center cursor-pointer transition-colors"
          @click="showMobileMenu = !showMobileMenu"
          aria-label="Abrir menu de navegação"
        >
          <Menu v-if="!showMobileMenu" :size="20" />
          <X v-else :size="20" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer via Quasar -->
    <q-drawer
      v-model="showMobileMenu"
      side="right"
      overlay
      bordered
      :width="300"
      class="bg-[#FAF8F5] text-[#171717] p-5 flex flex-col justify-between border-l border-[#E7E3DC]"
    >
      <div>
        <div class="flex items-center justify-between pb-4 border-b border-[#E7E3DC] mb-5">
          <div class="flex flex-col">
            <span class="font-editorial text-xl font-bold tracking-wide text-[#171717]">MOZBID</span>
            <span class="text-[8px] tracking-[0.25em] text-[#B69A68] uppercase font-semibold">MOÇAMBIQUE</span>
          </div>
          <button
            type="button"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] hover:text-[#171717] cursor-pointer"
            @click="showMobileMenu = false"
          >
            <X :size="18" />
          </button>
        </div>

        <q-list class="flex flex-col gap-1.5">
          <q-item clickable v-close-popup to="/" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section class="text-sm font-medium">Início</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/catalog" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section class="text-sm font-medium">Explorar Leilões</q-item-section>
          </q-item>
          <q-item clickable v-close-popup href="/#categorias" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section class="text-sm font-medium">Categorias</q-item-section>
          </q-item>
          <q-item clickable v-close-popup to="/how-it-works" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section class="text-sm font-medium">Como Funciona</q-item-section>
          </q-item>
          <q-item clickable v-close-popup href="/#sobre-nos" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section class="text-sm font-medium">Sobre Nós</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="showContactModal = true" class="rounded-lg hover:bg-white text-[#171717]">
            <q-item-section class="text-sm font-medium">Contactos Oficiais</q-item-section>
          </q-item>

          <q-separator class="my-3 border-[#E7E3DC]" />

          <template v-if="authStore.isAuthenticated">
            <q-item v-if="authStore.user?.role === 'admin'" clickable v-close-popup to="/admin/dashboard" class="rounded-lg hover:bg-white">
              <q-item-section class="text-sm font-semibold">Administração Central</q-item-section>
            </q-item>
            <q-item v-else-if="authStore.user?.role === 'seller'" clickable v-close-popup to="/seller/dashboard" class="rounded-lg hover:bg-white">
              <q-item-section class="text-sm font-semibold">Painel do Vendedor</q-item-section>
            </q-item>
            <q-item v-else-if="authStore.user?.role === 'buyer'" clickable v-close-popup to="/buyer/dashboard" class="rounded-lg hover:bg-white">
              <q-item-section class="text-sm font-semibold">Painel do Comprador</q-item-section>
            </q-item>
          </template>
          <template v-else>
            <q-item clickable v-close-popup to="/auth/login" class="rounded-lg hover:bg-white border border-[#E7E3DC]">
              <q-item-section class="text-sm font-semibold flex items-center gap-2">
                <LogIn :size="16" /> Iniciar Sessão (Entrar)
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/auth/register" class="rounded-lg bg-[#171717] text-white">
              <q-item-section class="text-sm font-semibold flex items-center gap-2">
                <UserPlus :size="16" /> Criar Conta Oficial
              </q-item-section>
            </q-item>
          </template>

          <q-item clickable v-close-popup @click="promptInstall" class="rounded-lg bg-[#FAF8F5] border border-[#B69A68]/30 mt-2">
            <q-item-section class="text-xs font-semibold text-[#B69A68] flex items-center gap-2">
              <Download :size="16" /> Instalar Aplicação no Telemóvel
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="pt-4 border-t border-[#E7E3DC]">
        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="w-full py-2 px-3 text-left text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
          @click="handleLogout"
        >
          Terminar Sessão
        </button>
        <div v-else class="text-[11px] text-[#888888] text-center">
          &copy; {{ new Date().getFullYear() }} MozBid Moçambique
        </div>
      </div>
    </q-drawer>

    <!-- Modal de Contactos Oficiais MozBid -->
    <div
      v-if="showContactModal"
      class="fixed inset-0 z-50 bg-[#171717]/60 backdrop-blur-xs flex items-center justify-center p-4 text-left"
      @click.self="showContactModal = false"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#E8E3DA] shadow-2xl flex flex-col gap-5 text-[#171717]">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
          <div class="flex items-center gap-2">
            <Phone :size="20" class="text-[#B69A68]" />
            <div>
              <h3 class="font-editorial text-xl font-semibold text-[#171717]">
                Contactos Oficiais MozBid
              </h3>
              <span class="text-[10px] text-[#B69A68] font-bold uppercase tracking-wider">
                Atendimento ao Licitador e Consignador
              </span>
            </div>
          </div>
          <button
            type="button"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] hover:text-[#171717] cursor-pointer"
            @click="showContactModal = false"
          >
            ✕
          </button>
        </div>

        <!-- Body Items -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
          <!-- Sede -->
          <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E3DA] flex flex-col gap-1 sm:col-span-2">
            <div class="flex items-center gap-2 text-[#B69A68] font-semibold text-xs uppercase tracking-wider">
              <MapPin :size="16" />
              <span>Sede Institucional & Peritagem</span>
            </div>
            <p class="text-[#171717] font-medium leading-relaxed">
              Edifício Maryah, 7º Andar, Av. Julius Nyerere, Polana Cimento, Maputo, República de Moçambique.
            </p>
          </div>

          <!-- Telefones -->
          <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E3DA] flex flex-col gap-1">
            <div class="flex items-center gap-2 text-[#B69A68] font-semibold text-xs uppercase tracking-wider">
              <Phone :size="16" />
              <span>Linhas Telefónicas (+258)</span>
            </div>
            <p class="text-[#171717] font-mono font-medium">
              +258 84 100 2000<br />
              +258 82 100 2000
            </p>
          </div>

          <!-- Email -->
          <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E3DA] flex flex-col gap-1">
            <div class="flex items-center gap-2 text-[#B69A68] font-semibold text-xs uppercase tracking-wider">
              <Mail :size="16" />
              <span>Correio Electrónico</span>
            </div>
            <p class="text-[#171717] font-mono font-medium">
              contacto@mozbid.co.mz<br />
              suporte@mozbid.co.mz
            </p>
          </div>

          <!-- Horário -->
          <div class="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E3DA] flex flex-col gap-1 sm:col-span-2">
            <div class="flex items-center gap-2 text-[#B69A68] font-semibold text-xs uppercase tracking-wider">
              <Clock :size="16" />
              <span>Horário de Atendimento e Sala de Vistorias</span>
            </div>
            <p class="text-[#555555]">
              Segunda a Sexta-feira: <strong>08:00 – 17:00</strong> | Sábados: <strong>09:00 – 13:00 (Apenas com agendamento prévio)</strong>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-2 flex items-center justify-between border-t border-[#E8E3DA]">
          <span class="text-xs text-[#777777]">Liquidação auditada em Meticais (MZN)</span>
          <button
            type="button"
            class="py-2 px-5 bg-[#171717] hover:bg-[#B69A68] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            @click="showContactModal = false"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </q-header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search,
  Bell,
  LogIn,
  UserPlus,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Download,
  ChevronDown
} from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth';
import { useAuctionStore } from '../../stores/auction';
import { useNotificationStore } from '../../stores/notification';
import { formatTimeAgo } from '../../utils/date';
import { usePwaInstall } from '../../composables/usePwaInstall';

const router = useRouter();
const authStore = useAuthStore();
const auctionStore = useAuctionStore();
const notifStore = useNotificationStore();
const { promptInstall } = usePwaInstall();

const showMobileMenu = ref(false);
const showContactModal = ref(false);

const notifications = computed(() => notifStore.notifications);
const unreadCount = computed(() => notifStore.unreadCount);

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

<style scoped>
/* Responsive Navigation Visibility */
.navbar-center-nav {
  display: none;
}

@media (min-width: 860px) {
  .navbar-center-nav {
    display: flex !important;
    align-items: center;
    gap: 24px;
  }
}

@media (min-width: 1100px) {
  .navbar-center-nav {
    gap: 32px;
  }
}

.navbar-mobile-toggle {
  display: flex !important;
}

@media (min-width: 860px) {
  .navbar-mobile-toggle {
    display: none !important;
  }
}
</style>
