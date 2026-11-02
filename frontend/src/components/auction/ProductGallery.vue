<template>
  <div class="flex flex-col gap-space-sm w-full">
    <!-- Active Large Image Showcase -->
    <div class="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-surface-container-lowest border border-white/[0.08] shadow-xl group">
      <img
        :src="activeImage"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        @error="(e) => ((e.target as HTMLImageElement).src = defaultImg)"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

      <!-- Watermark / Inspection pill -->
      <div class="absolute bottom-space-md right-space-md px-space-sm py-1 rounded bg-black/70 backdrop-blur-md border border-white/[0.1] text-primary font-label-caps text-[10px] flex items-center gap-1 shadow-md">
        <span class="material-symbols-outlined text-[13px]">verified</span>
        <span>INSPEÇÃO CERTIFICADA MOZBID</span>
      </div>

      <!-- Photo Counter -->
      <div v-if="images && images.length > 0" class="absolute top-space-md left-space-md px-space-sm py-1 rounded bg-black/70 backdrop-blur-md border border-white/[0.1] text-on-surface font-label-numeric text-[11px] flex items-center gap-1 shadow-md">
        <span class="material-symbols-outlined text-[13px]">photo_library</span>
        <span>{{ currentIndex + 1 }} / {{ images.length }}</span>
      </div>
    </div>

    <!-- Thumbnails Strip -->
    <div v-if="images && images.length > 1" class="grid grid-cols-4 sm:grid-cols-6 gap-space-xs">
      <button
        v-for="(img, idx) in images"
        :key="img.id || idx"
        type="button"
        class="relative aspect-[16/10] rounded-lg overflow-hidden border transition-all duration-200"
        :class="activeImage === img.image_url ? 'border-primary ring-1 ring-primary' : 'border-white/[0.08] opacity-60 hover:opacity-100'"
        @click="selectImage(img.image_url, idx)"
      >
        <img
          :src="img.image_url"
          :alt="`${title} - foto ${idx + 1}`"
          class="w-full h-full object-cover"
          @error="(e) => ((e.target as HTMLImageElement).src = defaultImg)"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ProductImage } from '../../types';

const props = defineProps<{
  images?: ProductImage[];
  title: string;
}>();

const defaultImg = '/images/products/porsche-911-gt3rs.jpg';
const activeImage = ref<string>(props.images?.[0]?.image_url || defaultImg);
const currentIndex = ref<number>(0);

function selectImage(url: string, index: number) {
  activeImage.value = url;
  currentIndex.value = index;
}

watch(() => props.images, (newImgs) => {
  if (newImgs && newImgs.length > 0) {
    activeImage.value = newImgs[0].image_url;
    currentIndex.value = 0;
  }
});
</script>
