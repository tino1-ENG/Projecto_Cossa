<template>
  <div class="public-layout">
    <AppNavbar />
    <main class="public-main">
      <router-view />
    </main>
    <AppFooter />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '../components/common/AppNavbar.vue';
import AppFooter from '../components/common/AppFooter.vue';
import ToastContainer from '../components/common/ToastContainer.vue';
</script>

<style scoped>
.public-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}

.public-main {
  flex: 1;
}
</style>
