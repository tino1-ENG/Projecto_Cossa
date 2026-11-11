<template>
  <span
    class="font-label-numeric tabular-nums inline-flex items-center gap-1"
    :class="{
      'text-error font-bold': time.isUrgent && !time.isExpired,
      'text-on-surface-variant/70': time.isExpired,
      'text-primary': !time.isUrgent && !time.isExpired
    }"
  >
    <template v-if="time.isExpired">
      <span>Concluído</span>
    </template>
    <template v-else>
      <span v-if="time.days > 0">{{ time.days }}d </span>
      <span>{{ pad(time.hours) }}h </span>
      <span>{{ pad(time.minutes) }}m </span>
      <span>{{ pad(time.seconds) }}s</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { getTimeRemaining, type TimeRemaining } from '../../utils/date';

const props = defineProps<{
  endsAt: string;
}>();

const emit = defineEmits<{
  (e: 'expired'): void;
}>();

const time = ref<TimeRemaining>(getTimeRemaining(props.endsAt));
let intervalId: any = null;

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function updateTime() {
  const prevExpired = time.value?.isExpired || false;
  time.value = getTimeRemaining(props.endsAt);
  if (!prevExpired && time.value.isExpired) {
    emit('expired');
  }
}

watch(() => props.endsAt, () => {
  updateTime();
});

onMounted(() => {
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
