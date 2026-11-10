<template>
  <footer class="w-full bg-[#141413] text-[#FAF8F5] border-t border-white/[0.08] pt-14 pb-20 sm:pb-12 mt-16 sm:mt-24">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8">
      <!-- Main Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/[0.08]">
        <!-- Brand & Description (Col 1-5) -->
        <div class="lg:col-span-5 flex flex-col gap-4">
          <div class="flex flex-col">
            <span class="font-editorial text-2xl font-bold tracking-wider text-white">MOZBID</span>
            <span class="text-[9px] tracking-[0.3em] text-[#B69A68] uppercase font-semibold">MOÇAMBIQUE</span>
          </div>

          <p class="text-xs text-[#999999] leading-relaxed max-w-sm">
            A plataforma de leilões seleccionados para activos extraordinários em Moçambique. Transparência financeira, procedimentos rigorosos e liquidação em Meticais (MZN).
          </p>

          <!-- Newsletter -->
          <div class="flex flex-col gap-2 pt-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-white">Subscrever Actualizações de Leilões</span>
            <form @submit.prevent="subscribeNewsletter" class="flex gap-2 max-w-sm">
              <input
                v-model="emailInput"
                type="email"
                required
                placeholder="O seu email institucional ou pessoal..."
                class="flex-1 bg-white/[0.06] border border-white/[0.12] rounded px-3 py-2 text-xs text-white placeholder:text-[#777777] focus:outline-none focus:border-[#B69A68] transition-colors"
              />
              <button
                type="submit"
                class="px-4 py-2 rounded bg-[#B69A68] text-white hover:bg-[#967B48] text-xs font-semibold tracking-wide transition-colors cursor-pointer"
              >
                {{ subscribed ? 'Subscrito!' : 'Subscrever' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Categorias (Col 6-8) -->
        <div class="lg:col-span-3 flex flex-col gap-3">
          <span class="text-xs font-bold uppercase tracking-wider text-[#B69A68]">Categorias</span>
          <ul class="flex flex-col gap-2 text-xs text-[#AAAAAA]">
            <li><router-link to="/catalog?category=automoveis-motos" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Automóveis & Coleccionáveis</router-link></li>
            <li><router-link to="/catalog?category=relogios-joias" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Relógios & Alta Joalharia</router-link></li>
            <li><router-link to="/catalog?category=maquinas-industriais" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Maquinaria Pesada</router-link></li>
            <li><router-link to="/catalog?category=tecnologia-computadores" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Tecnologia & Servidores</router-link></li>
            <li><router-link to="/catalog?category=imobiliario-terrenos" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Imobiliário Comercial</router-link></li>
            <li><router-link to="/catalog?category=arte-antiguidades" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Arte & Património</router-link></li>
          </ul>
        </div>

        <!-- Institucional & Legal (Col 9-10) -->
        <div class="lg:col-span-2 flex flex-col gap-3">
          <span class="text-xs font-bold uppercase tracking-wider text-[#B69A68]">Institucional</span>
          <ul class="flex flex-col gap-2 text-xs text-[#AAAAAA]">
            <li><router-link to="/how-it-works" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Como Funciona</router-link></li>
            <li><a href="/#seguranca" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Verificação & Segurança</a></li>
            <li><router-link to="/how-it-works" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Regulamento de Leilões</router-link></li>
            <li><router-link to="/how-it-works" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Política de Privacidade</router-link></li>
            <li><router-link to="/how-it-works" class="hover:text-white transition-colors no-underline text-[#AAAAAA]">Termos de Serviço</router-link></li>
          </ul>
        </div>

        <!-- Contacto (Col 11-12) -->
        <div class="lg:col-span-2 flex flex-col gap-3">
          <span class="text-xs font-bold uppercase tracking-wider text-[#B69A68]">Localização</span>
          <p class="text-xs text-[#AAAAAA] leading-relaxed">
            Maputo, Moçambique<br />
            Moeda Oficial: Metical (MZN)<br />
            Suporte: contacto@mozbid.co.mz
          </p>
          <div class="flex items-center gap-3 pt-2">
            <span class="text-xs text-[#777777]">Atendimento: Seg – Sex, 8h às 17h</span>
          </div>
        </div>
      </div>

      <!-- Bottom Copyright & Compliance -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
        <p>© 2026 MozBid. Todos os direitos reservados. República de Moçambique.</p>
        <div class="flex items-center gap-4">
          <span>Transparência Financeira</span>
          <span>•</span>
          <span>Activos Seleccionados</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emailInput = ref('');
const subscribed = ref(false);

function subscribeNewsletter() {
  if (emailInput.value) {
    subscribed.value = true;
    setTimeout(() => {
      emailInput.value = '';
      subscribed.value = false;
    }, 4000);
  }
}
</script>
