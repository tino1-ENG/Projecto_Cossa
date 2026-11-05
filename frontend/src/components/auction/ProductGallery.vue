<template>
  <div class="flex flex-col gap-3 w-full">
    <!-- Active Large Image Showcase with Quasar q-img -->
    <div class="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-surface-container-lowest border border-white/[0.08] shadow-2xl group">
      <q-img
        :src="activeImage"
        :alt="title"
        :ratio="16/10"
        fit="cover"
        class="w-full h-full group-hover:scale-105 transition-transform duration-700"
      >
        <template #error>
          <div class="absolute-full flex flex-center bg-dark text-muted">
            <q-img :src="defaultImg" :ratio="16/10" fit="cover" />
          </div>
        </template>
        <template #loading>
          <q-spinner-dots color="primary" size="30px" />
        </template>
      </q-img>

      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

      <!-- Watermark / Inspection pill -->
      <div class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/[0.1] text-primary text-[10px] font-bold flex items-center gap-1.5 shadow-md">
        <span class="material-symbols-outlined text-[13px]">verified</span>
        <span>INSPECÇÃO CERTIFICADA MOZBID</span>
      </div>

      <!-- Photo Counter -->
      <div v-if="images && images.length > 0" class="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/[0.1] text-white text-[11px] font-mono flex items-center gap-1.5 shadow-md">
        <span class="material-symbols-outlined text-[13px]">photo_library</span>
        <span>{{ currentIndex + 1 }} / {{ images.length }}</span>
      </div>
    </div>

    <!-- Thumbnails Strip -->
    <div v-if="images && images.length > 1" class="grid grid-cols-4 sm:grid-cols-6 gap-2">
      <button
        v-for="(img, idx) in images"
        :key="img.id || idx"
        type="button"
        class="relative aspect-[16/10] rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer"
        :class="activeImage === img.image_url ? 'border-primary ring-2 ring-primary/50 scale-[1.02]' : 'border-white/[0.08] opacity-60 hover:opacity-100'"
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
