<template>
  <q-layout view="lHh LpR lFf" class="bg-surface text-on-surface min-h-screen">
    <!-- Quasar Drawer (Responsive Sidebar for Sellers) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      bordered
      :width="270"
      :breakpoint="860"
      class="bg-[#0d0d0d] border-r border-white/[0.08] flex flex-col p-4 justify-between"
    >
      <div>
        <!-- Brand Header -->
        <div class="flex items-center justify-between mb-6 pt-2">
          <router-link to="/" class="flex items-center gap-2 group">
            <div class="w-8 h-8 rounded bg-primary flex items-center justify-center text-black font-bold shadow-sm">
              <Gavel :size="16" />
            </div>
            <span class="font-display font-bold text-white text-lg tracking-wide">MOZ<span class="text-primary">BID</span></span>
          </router-link>
          <q-badge color="amber-8" text-color="dark" label="VENDEDOR" class="font-bold text-[10px] px-2 py-0.5" />
        </div>

        <!-- Seller Profile Micro Card -->
        <div class="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-6">
          <q-avatar size="36px" color="amber-8" text-color="dark" class="font-bold text-sm">
            {{ authStore.user?.name?.charAt(0) || 'V' }}
          </q-avatar>
          <div class="flex flex-col min-w-0">
            <div class="text-sm font-semibold text-white truncate">{{ authStore.user?.sellerProfile?.company_name || authStore.user?.name }}</div>
            <div class="text-xs text-on-surface-variant flex items-center gap-1">
              <Star :size="12" class="text-primary fill-primary" />
              <span>4.96/5.0</span>
              <span class="text-[10px] text-primary font-bold ml-1">✓</span>
            </div>
          </div>
        </div>

        <!-- Navigation Links via Quasar List -->
        <q-list class="flex flex-col gap-1">
          <router-link
            to="/seller/dashboard"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-white hover:bg-white/[0.05] transition-colors"
            active-class="bg-primary/10 text-primary font-semibold border border-primary/30"
          >
            <LayoutDashboard :size="18" /> Painel Geral
          </router-link>
          <router-link
            to="/seller/dashboard?tab=products"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <Package :size="18" /> Meus Produtos
          </router-link>
          <router-link
            to="/seller/dashboard?tab=auctions"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <Gavel :size="18" /> Meus Leilões
          </router-link>
          <router-link
            to="/seller/dashboard?tab=orders"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <ShoppingBag :size="18" /> Encomendas & Vendas
          </router-link>
        </q-list>
      </div>

      <!-- Sidebar Footer -->
      <div class="border-t border-white/[0.08] pt-4 flex flex-col gap-2">
        <button
          type="button"
          class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-error hover:bg-error/10 transition-colors"
          @click="handleLogout"
        >
          <LogOut :size="16" /> Terminar Sessão
        </button>
      </div>
    </q-drawer>

    <!-- Quasar Topbar Header -->
    <q-header elevated class="bg-[#0d0d0d]/90 text-on-surface backdrop-blur-md border-b border-white/[0.08]">
      <q-toolbar class="h-16 px-4 sm:px-6 flex justify-between">
        <div class="flex items-center gap-3">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            class="lt-md"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
          <q-toolbar-title class="text-base sm:text-lg font-bold font-display p-0">
            Painel do Vendedor
          </q-toolbar-title>
        </div>

        <div class="flex items-center gap-2">
          <q-btn
            outline
            color="white"
            to="/"
            class="text-xs px-3 py-1.5 rounded-lg"
            label="Página Inicial"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Quasar Page Container -->
    <q-page-container>
      <q-page class="p-4 sm:p-6 lg:p-8">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page>
    </q-page-container>

    <ToastContainer />
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ToastContainer from '../components/common/ToastContainer.vue';
import {
  Gavel, LayoutDashboard, Package, ShoppingBag, User, LogOut, Star
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);

function handleLogout() {
  authStore.logout();
  router.push('/auth/login');
}
</script>
