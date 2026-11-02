<template>
  <div id="mozbid-app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useAuctionStore } from './stores/auction';
import { useNotificationStore } from './stores/notification';
import socketService from './services/socket';

const authStore = useAuthStore();
const auctionStore = useAuctionStore();
const notifStore = useNotificationStore();

onMounted(() => {
  // Initialize Socket.IO connection
  socketService.init();

  // Initialize store socket listeners
  auctionStore.initSocketListeners();
  notifStore.initSocketListeners();

  // Re-hydrate current user if token exists
  if (authStore.token) {
    authStore.fetchCurrentUser();
  }
});
</script>

<style>
#mozbid-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
