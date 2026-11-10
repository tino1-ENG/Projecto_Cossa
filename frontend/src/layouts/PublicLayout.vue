<template>
  <q-layout view="hHh lpR fFf" class="bg-[#F4F1EB] text-[#171717] min-h-screen">
    <AppNavbar />
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
    <AppFooter />
    <ToastContainer />

    <!-- Mobile Fixed Bottom Navigation Bar (Refined Editorial Style) -->
    <q-footer class="sm:hidden bg-white/95 backdrop-blur-md border-t border-[#E7E3DC] text-[#171717] z-50">
      <div class="grid grid-cols-4 h-14 items-center text-center px-1">
        <router-link
          to="/"
          class="flex flex-col items-center justify-center gap-0.5 no-underline transition-colors"
          :class="$route.path === '/' ? 'text-[#B69A68] font-semibold' : 'text-[#777777]'"
        >
          <q-icon name="home" size="20px" />
          <span class="text-[10px] leading-tight">Início</span>
        </router-link>

        <router-link
          to="/catalog"
          class="flex flex-col items-center justify-center gap-0.5 no-underline transition-colors"
          :class="$route.path === '/catalog' && !$route.query.status ? 'text-[#B69A68] font-semibold' : 'text-[#777777]'"
        >
          <q-icon name="search" size="20px" />
          <span class="text-[10px] leading-tight">Explorar</span>
        </router-link>

        <router-link
          to="/catalog?status=active"
          class="flex flex-col items-center justify-center gap-0.5 no-underline transition-colors relative"
          :class="$route.query.status === 'active' ? 'text-[#B69A68] font-semibold' : 'text-[#777777]'"
        >
          <div class="relative">
            <q-icon name="sensors" size="20px" />
            <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <span class="text-[10px] leading-tight">Ao Vivo</span>
        </router-link>

        <router-link
          :to="authStore.isAuthenticated ? '/buyer/dashboard' : '/auth/login'"
          class="flex flex-col items-center justify-center gap-0.5 no-underline transition-colors"
          :class="$route.path.startsWith('/buyer') || $route.path.startsWith('/auth') ? 'text-[#B69A68] font-semibold' : 'text-[#777777]'"
        >
          <q-icon :name="authStore.isAuthenticated ? 'dashboard' : 'person'" size="20px" />
          <span class="text-[10px] leading-tight">{{ authStore.isAuthenticated ? 'Conta' : 'Entrar' }}</span>
        </router-link>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import AppNavbar from '../components/common/AppNavbar.vue';
import AppFooter from '../components/common/AppFooter.vue';
import ToastContainer from '../components/common/ToastContainer.vue';

const authStore = useAuthStore();
</script>

<style scoped>
</style>
