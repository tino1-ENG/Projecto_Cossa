<template>
  <div class="w-full bg-[#F4F1EB] text-[#171717] min-h-screen py-8 sm:py-16">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8">
      <!-- Header -->
      <div class="flex flex-col gap-2 mb-12 text-center max-w-3xl mx-auto">
        <span class="inline-flex self-center px-3 py-1 rounded-full bg-white border border-[#E7E3DC] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A68]">
          REGULAMENTO OPERACIONAL & JURÍDICO
        </span>
        <h1 class="font-editorial text-2xl sm:text-4xl lg:text-[44px] font-semibold text-[#171717] tracking-tight mt-1">
          Como Funciona a Bolsa de Leilões MozBid
        </h1>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-xl mx-auto">
          Conheça os procedimentos de licitação em Meticais (MZN), as regras de adjudicação e os critérios de validação de identidade e conformidade fiscal em Moçambique.
        </p>
      </div>

      <!-- 3 Structured Pillars Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        <div class="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E3DC] flex flex-col justify-between gap-6 shadow-xs hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="font-editorial text-4xl font-bold text-[#B69A68]">01</span>
            <div class="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
              <span class="material-symbols-outlined text-[24px]">gavel</span>
            </div>
          </div>
          <div>
            <h3 class="font-display text-lg font-semibold text-[#171717] mb-2">Licitação em Tempo Real</h3>
            <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
              Cada leilão opera com incremento mínimo pré-fixado em Meticais. As licitações são processadas em tempo real através de WebSockets e transações atómicas, assegurando integridade absoluta em cada lance.
            </p>
          </div>
          <span class="text-xs uppercase tracking-wider text-[#B69A68] font-bold flex items-center gap-1">
            Motor de Transacções Atómicas <span class="material-symbols-outlined text-[16px]">check</span>
          </span>
        </div>

        <div class="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E3DC] flex flex-col justify-between gap-6 shadow-xs hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="font-editorial text-4xl font-bold text-[#B69A68]">02</span>
            <div class="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
              <span class="material-symbols-outlined text-[24px]">alarm_on</span>
            </div>
          </div>
          <div>
            <h3 class="font-display text-lg font-semibold text-[#171717] mb-2">Mecanismo Anti-Sniping</h3>
            <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
              Para assegurar disputa justa e transparente, qualquer licitação submetida nos últimos minutos de um lote estende automaticamente o prazo de encerramento em mais 3 minutos adicionais.
            </p>
          </div>
          <span class="text-xs uppercase tracking-wider text-[#B69A68] font-bold flex items-center gap-1">
            Extensão Automática de Prazo <span class="material-symbols-outlined text-[16px]">check</span>
          </span>
        </div>

        <div class="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E3DC] flex flex-col justify-between gap-6 shadow-xs hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <span class="font-editorial text-4xl font-bold text-[#B69A68]">03</span>
            <div class="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#B69A68] border border-[#E7E3DC]">
              <span class="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
          </div>
          <div>
            <h3 class="font-display text-lg font-semibold text-[#171717] mb-2">Liquidação Bancária Transparente</h3>
            <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
              Os pagamentos de arrematação são liquidados em Meticais (MZN) através de canais bancários auditáveis, com entrega formal da documentação e escritura de transferência de titularidade.
            </p>
          </div>
          <span class="text-xs uppercase tracking-wider text-[#B69A68] font-bold flex items-center gap-1">
            Liquidação Auditável em MZN <span class="material-symbols-outlined text-[16px]">check</span>
          </span>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="w-full bg-white rounded-2xl p-6 sm:p-12 border border-[#E7E3DC] shadow-xs mb-16 text-[#171717]">
        <div class="text-center max-w-xl mx-auto mb-10">
          <span class="text-[10px] tracking-[0.25em] text-[#B69A68] uppercase font-bold block mb-1">
            ESCLARECIMENTOS
          </span>
          <h2 class="font-editorial text-2xl sm:text-3xl font-semibold text-[#171717]">Perguntas Frequentes</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
            <h4 class="font-display text-sm font-semibold text-[#171717] mb-1.5">Como funciona a Licitação em Tempo Real?</h4>
            <p class="text-xs text-[#666666] leading-relaxed">
              Pode licitar diretamente na sala do lote. O sistema atualiza instantaneamente para todos os utilizadores conectados via WebSocket, indicando quem detém a maior oferta líder.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
            <h4 class="font-display text-sm font-semibold text-[#171717] mb-1.5">O que acontece se o Preço de Reserva não for atingido?</h4>
            <p class="text-xs text-[#666666] leading-relaxed">
              O preço de reserva é o valor mínimo confidencial estipulado pelo consignador. Se o pregão terminar sem atingir a reserva, o lote encerra sem obrigação de alienação.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
            <h4 class="font-display text-sm font-semibold text-[#171717] mb-1.5">Quais os documentos exigidos para validação?</h4>
            <p class="text-xs text-[#666666] leading-relaxed">
              Para licitar e arrematar, é necessário registo com Bilhete de Identidade ou Passaporte válido e Número Único de Identificação Tributária (NUIT).
            </p>
          </div>

          <div class="p-5 rounded-xl bg-[#FAF8F5] border border-[#E7E3DC]">
            <h4 class="font-display text-sm font-semibold text-[#171717] mb-1.5">Como é feita a entrega física do lote arrematado?</h4>
            <p class="text-xs text-[#666666] leading-relaxed">
              Após confirmação da liquidação bancária, é agendada a recolha do bem ou transporte seguro para as principais cidades de Moçambique com os respectivos títulos de propriedade.
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Action Lead Banner -->
      <div class="p-8 sm:p-14 rounded-2xl bg-[#171717] text-white text-center flex flex-col items-center gap-6 shadow-xl">
        <h3 class="font-editorial text-2xl sm:text-4xl font-semibold text-white max-w-2xl">
          Pronto para participar nos leilões da MozBid?
        </h3>
        <p class="text-xs sm:text-sm text-[#AAAAAA] max-w-lg leading-relaxed">
          Crie a sua conta de licitador hoje mesmo e explore oportunidades exclusivas em Moçambique.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <router-link
            to="/catalog"
            class="px-6 py-3 rounded-lg bg-[#B69A68] text-white hover:bg-[#967B48] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md no-underline"
          >
            Explorar Catálogo
          </router-link>
          <router-link
            to="/auth/register"
            class="px-6 py-3 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 text-xs sm:text-sm font-semibold tracking-wide transition-all no-underline"
          >
            Criar Conta
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
