<template>
  <div class="toast-stack">
    <div
      v-for="toast in notificationStore.toasts"
      :key="toast.id"
      :class="['toast-item', toast.type]"
      @click="notificationStore.removeToast(toast.id)"
    >
      <div class="toast-icon">
        <CheckCircle2 v-if="toast.type === 'success'" :size="20" class="text-green-500" />
        <AlertCircle v-else-if="toast.type === 'error'" :size="20" class="text-red-500" />
        <AlertTriangle v-else-if="toast.type === 'warning'" :size="20" class="text-amber-500" />
        <Info v-else :size="20" class="text-amber-400" />
      </div>
      <div class="toast-content" style="flex: 1;">
        <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 2px;">{{ toast.title }}</div>
        <div style="font-size: 0.8rem; color: var(--color-text-secondary);">{{ toast.message }}</div>
      </div>
      <button
        style="background: transparent; border: none; color: var(--color-text-muted); cursor: pointer;"
        @click.stop="notificationStore.removeToast(toast.id)"
      >
        <X :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../../stores/notification';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next';

const notificationStore = useNotificationStore();
</script>
