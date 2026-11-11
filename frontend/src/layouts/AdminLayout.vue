<template>
  <q-layout view="lHh LpR lFf" class="bg-[#0a0a0a] text-white min-h-screen">
    <!-- Quasar Drawer (Responsive Sidebar for Admin) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      side="left"
      bordered
      :width="270"
      :breakpoint="860"
      class="bg-[#0b0b0b] border-r border-white/[0.08] flex flex-col p-4 justify-between text-white"
    >
      <div>
        <!-- Brand Header -->
        <div class="flex items-center justify-between mb-6 pt-2">
          <router-link to="/" class="flex items-center gap-2 group no-underline">
            <div class="w-8 h-8 rounded bg-primary flex items-center justify-center text-black font-bold shadow-sm">
              <Gavel :size="16" />
            </div>
            <span class="font-display font-bold text-white text-lg tracking-wide">MOZ<span class="text-primary">BID</span></span>
          </router-link>
          <q-badge color="negative" text-color="white" label="ADMIN" class="font-bold text-[10px] px-2 py-0.5" />
        </div>

        <!-- Navigation Links via Quasar List -->
        <q-list class="flex flex-col gap-1">
          <router-link
            to="/admin/dashboard"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors no-underline"
            active-class="bg-primary/15 text-primary font-semibold border border-primary/30"
          >
            <ShieldAlert :size="18" /> Painel de Controlo
          </router-link>
          <router-link
            to="/admin/dashboard?tab=users"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors no-underline"
          >
            <Users :size="18" /> Utilizadores
          </router-link>
          <router-link
            to="/admin/dashboard?tab=sellers"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors no-underline"
          >
            <ShieldCheck :size="18" /> Verificação Vendedores
          </router-link>
          <router-link
            to="/admin/dashboard?tab=auctions"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors no-underline"
          >
            <Gavel :size="18" /> Moderação de Leilões
          </router-link>
          <router-link
            to="/admin/dashboard?tab=overview"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors no-underline"
          >
            <FileText :size="18" /> Logs de Auditoria
          </router-link>
        </q-list>
      </div>

      <!-- Sidebar Footer -->
      <div class="border-t border-white/[0.08] pt-4 flex flex-col gap-2">
        <router-link
          to="/"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors no-underline"
        >
          <Home :size="16" /> Ir à Página Inicial
        </router-link>
        <button
          type="button"
          class="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors cursor-pointer border-0 bg-transparent"
          @click="handleLogout"
        >
          <LogOut :size="16" /> Terminar Sessão
        </button>
      </div>
    </q-drawer>

    <!-- Quasar Topbar Header -->
    <q-header elevated class="bg-[#0b0b0b]/95 text-white backdrop-blur-md border-b border-white/[0.08]">
      <q-toolbar class="h-16 px-4 sm:px-6 flex justify-between">
        <div class="flex items-center gap-3">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            class="lt-md text-white"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
          <q-toolbar-title class="text-base sm:text-lg font-bold font-display p-0 text-white">
            Administração MozBid
          </q-toolbar-title>
        </div>

        <div class="flex items-center gap-2">
          <q-badge color="positive" class="q-py-xs q-px-sm text-xs font-medium">
            <q-badge rounded color="white" class="q-mr-xs" />
            <span class="gt-xs">MongoDB Activo</span>
            <span class="lt-sm">Online</span>
          </q-badge>
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
  Gavel, ShieldAlert, Users, ShieldCheck, FileText, Home, LogOut
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);

function handleLogout() {
  authStore.logout();
  router.push('/auth/login');
}
</script>
