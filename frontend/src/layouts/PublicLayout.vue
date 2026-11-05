<template>
  <q-layout view="hHh lpR fFf" class="bg-surface text-on-surface min-h-screen">
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
  </q-layout>
</template>

<script setup lang="ts">
import AppNavbar from '../components/common/AppNavbar.vue';
import AppFooter from '../components/common/AppFooter.vue';
import ToastContainer from '../components/common/ToastContainer.vue';
</script>

<style scoped>
</style>
