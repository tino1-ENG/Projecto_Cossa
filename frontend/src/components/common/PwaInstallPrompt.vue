<template>
  <div>
    <!-- Floating Bottom Install Pill (Visible when app can be installed and user hasn't dismissed it) -->
    <transition name="fade-slide">
      <div
        v-if="!isInstalled && !dismissed && (canInstall || isIos)"
        class="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100%-2rem)] sm:w-auto bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E3DA] p-3.5 sm:p-4 shadow-xl flex items-center justify-between gap-3 text-[#171717]"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#171717] text-[#B69A68] flex items-center justify-center shrink-0 shadow-xs border border-[#B69A68]/30">
            <Download :size="20" />
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-[#171717] leading-tight">Instalar Aplicação MozBid</span>
            <span class="text-[11px] text-[#777777] leading-tight">Acesso rápido no PC ou Telemóvel</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            class="px-3 py-1.5 rounded-lg bg-[#B69A68] hover:bg-[#967B48] active:scale-95 text-[#171717] hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            @click="promptInstall"
          >
            Instalar
          </button>
          <button
            type="button"
            class="w-7 h-7 rounded-lg text-[#888888] hover:text-[#171717] flex items-center justify-center cursor-pointer transition-colors"
            @click="dismissed = true"
            aria-label="Dispensar aviso de instalação"
          >
            <X :size="16" />
          </button>
        </div>
      </div>
    </transition>

    <!-- Modal com Instruções para iOS / Navegadores Desktop -->
    <div
      v-if="showIosModal"
      class="fixed inset-0 z-50 bg-[#171717]/60 backdrop-blur-xs flex items-center justify-center p-4 text-left"
      @click.self="showIosModal = false"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E3DA] shadow-2xl flex flex-col gap-4 text-[#171717]">
        <div class="flex items-center justify-between pb-3 border-b border-[#E8E3DA]">
          <div class="flex items-center gap-2">
            <Smartphone :size="20" class="text-[#B69A68]" />
            <h3 class="font-editorial text-lg font-semibold text-[#171717]">
              Instalar o MozBid no Dispositivo
            </h3>
          </div>
          <button
            type="button"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-[#777777] hover:text-[#171717] cursor-pointer"
            @click="showIosModal = false"
          >
            ✕
          </button>
        </div>

        <div class="space-y-3 text-xs sm:text-sm text-[#555555] leading-relaxed">
          <p class="font-medium text-[#171717]">
            Para instalar a aplicação no seu telemóvel ou computador:
          </p>

          <!-- iOS / iPhone instructions -->
          <div v-if="isIos" class="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#E8E3DA] space-y-2">
            <span class="font-bold text-[#171717] flex items-center gap-1.5">
              <Share :size="16" class="text-[#B69A68]" /> No iPhone / iPad (Safari):
            </span>
            <ol class="list-decimal pl-4 space-y-1 text-xs">
              <li>Toque no botão de <strong>Partilha</strong> (quadrado com seta na barra inferior do Safari).</li>
              <li>Deslize para baixo e toque em <strong>"Adicionar ao Ecrã Principal"</strong>.</li>
              <li>Toque em <strong>"Adicionar"</strong> no canto superior direito.</li>
            </ol>
          </div>

          <!-- Android / Chrome / PC instructions -->
          <div v-else class="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#E8E3DA] space-y-2">
            <span class="font-bold text-[#171717] flex items-center gap-1.5">
              <Monitor :size="16" class="text-[#B69A68]" /> No Computador ou Android:
            </span>
            <ol class="list-decimal pl-4 space-y-1 text-xs">
              <li>No menu do seu navegador (três pontos no topo), clique em <strong>"Instalar MozBid"</strong>.</li>
              <li>Ou clique no ícone de computador/ecrã que surge na barra de endereço.</li>
              <li>A aplicação passará a funcionar como um programa independente no seu ambiente de trabalho ou telemóvel.</li>
            </ol>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            type="button"
            class="py-2.5 px-5 bg-[#171717] hover:bg-[#B69A68] text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            @click="showIosModal = false"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Download, X, Smartphone, Monitor, Share } from 'lucide-vue-next';
import { usePwaInstall } from '../../composables/usePwaInstall';

const dismissed = ref(false);
const { canInstall, isInstalled, isIos, showIosModal, promptInstall } = usePwaInstall();
</script>
