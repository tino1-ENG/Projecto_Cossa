<template>
  <div class="w-full bg-surface text-on-surface min-h-screen py-space-xl">
    <div class="max-w-[1440px] mx-auto px-margin">
      <!-- Header -->
      <div class="flex flex-col gap-space-xs mb-space-2xl text-center max-w-3xl mx-auto">
        <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary">Regulamento Operacional & Jurídico</span>
        <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Como Funciona a Bolsa de Leilões MozBid
        </h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant mt-2">
          Conheça as regras de licitação em Meticais (MZN), o motor anti-sniping, as garantias fiduciárias de escrow bancário e a verificação oficial de NUIT em Moçambique.
        </p>
      </div>

      <!-- 3 Structured Pillars Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-space-3xl">
        <div class="p-space-xl rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-space-lg shadow-xl hover:bg-surface-container-high transition-colors">
          <div class="flex items-center justify-between">
            <span class="font-headline-lg text-[44px] font-bold text-primary/30">01</span>
            <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
              <span class="material-symbols-outlined text-[24px]">gavel</span>
            </div>
          </div>
          <div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Licitação em Tempo Real</h3>
            <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Cada leilão opera com incremento mínimo tabelado em Meticais. As licitações são processadas através de transações atómicas <code class="text-primary font-mono text-xs">BEGIN IMMEDIATE</code> em base de dados com registo WAL, garantindo que nenhum lance seja perdido ou duplicado.
            </p>
          </div>
          <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1">
            Motor de Transações Atómicas <span class="material-symbols-outlined text-[16px]">check</span>
          </span>
        </div>

        <div class="p-space-xl rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-space-lg shadow-xl hover:bg-surface-container-high transition-colors">
          <div class="flex items-center justify-between">
            <span class="font-headline-lg text-[44px] font-bold text-primary/30">02</span>
            <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
              <span class="material-symbols-outlined text-[24px]">alarm_on</span>
            </div>
          </div>
          <div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Mecanismo Anti-Sniping</h3>
            <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Para eliminar vantagens desleais de bots e assegurar disputa justa, qualquer licitação submetida nos últimos <strong>2 minutos</strong> de um lote estende automaticamente o prazo de encerramento em mais <strong>3 minutos</strong> adicionais.
            </p>
          </div>
          <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1">
            Extensão Automática de Prazo <span class="material-symbols-outlined text-[16px]">check</span>
          </span>
        </div>

        <div class="p-space-xl rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-space-lg shadow-xl hover:bg-surface-container-high transition-colors">
          <div class="flex items-center justify-between">
            <span class="font-headline-lg text-[44px] font-bold text-primary/30">03</span>
            <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
              <span class="material-symbols-outlined text-[24px]">lock</span>
            </div>
          </div>
          <div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">Escrow Bancário em Meticais</h3>
            <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Os pagamentos de arrematação e depósitos de garantia são custodiados em contas fiduciárias no <strong>BCI</strong>, <strong>Millennium BIM</strong>, <strong>Standard Bank</strong> ou vias digitais <strong>M-Pesa / e-Mola</strong>, com libertação apenas após inspeção física satisfatória.
            </p>
          </div>
          <span class="font-label-caps text-label-caps text-primary uppercase flex items-center gap-1">
            Proteção Fiduciária Total <span class="material-symbols-outlined text-[16px]">check</span>
          </span>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="w-full bg-surface-container rounded-2xl p-space-xl border border-white/[0.08] shadow-2xl mb-space-3xl">
        <div class="text-center max-w-xl mx-auto mb-space-xl">
          <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary">Esclarecimentos Legais</span>
          <h2 class="font-headline-lg text-headline-lg text-on-surface mt-1">Perguntas Frequentes (FAQ)</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          <div class="p-space-md rounded-xl bg-surface-container-low border border-white/[0.04]">
            <h4 class="font-title-md text-on-surface font-semibold mb-2">Como funciona a Licitação Automática (Proxy Bidding)?</h4>
            <p class="font-body-md text-body-sm text-on-surface-variant leading-relaxed">
              Pode introduzir o seu teto máximo confidencial. O algoritmo da MozBid licitará pelo incremento mínimo estipulado apenas quando outro participante efetuar um lance, parando estritamente no seu limite estipulado.
            </p>
          </div>

          <div class="p-space-md rounded-xl bg-surface-container-low border border-white/[0.04]">
            <h4 class="font-title-md text-on-surface font-semibold mb-2">O que acontece se o Preço de Reserva não for atingido?</h4>
            <p class="font-body-md text-body-sm text-on-surface-variant leading-relaxed">
              O preço de reserva é o valor mínimo pelo qual o vendedor aceita transacionar o lote. Se no final do leilão a maior oferta não atingir a reserva, o lote encerra sem obrigação de venda, podendo o vendedor solicitar renegociação.
            </p>
          </div>

          <div class="p-space-md rounded-xl bg-surface-container-low border border-white/[0.04]">
            <h4 class="font-title-md text-on-surface font-semibold mb-2">Quais os documentos exigidos para validação de NUIT?</h4>
            <p class="font-body-md text-body-sm text-on-surface-variant leading-relaxed">
              Pessoas singulares devem submeter B.I. ou Passaporte válido e Número Único de Identificação Tributária (NUIT). Pessoas coletivas submetem Certidão Comercial da Conservatória e NUIT institucional.
            </p>
          </div>

          <div class="p-space-md rounded-xl bg-surface-container-low border border-white/[0.04]">
            <h4 class="font-title-md text-on-surface font-semibold mb-2">Como é feita a entrega física e a escritura do lote?</h4>
            <p class="font-body-md text-body-sm text-on-surface-variant leading-relaxed">
              A escritura pública e a transferência de título automóvel ou predial são formalizadas no nosso escritório na Av. Julius Nyerere, Polana Cimento, Maputo, ou entregues via transportadora de segurança blindada para outras províncias.
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Action Lead Banner -->
      <div class="p-space-2xl rounded-2xl bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container border border-white/[0.08] text-center flex flex-col items-center gap-space-md">
        <h3 class="font-headline-lg text-headline-lg text-on-surface max-w-2xl">
          Pronto para Participar nos Leilões mais Exclusivos de Moçambique?
        </h3>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-xl">
          Credencie-se hoje mesmo e aceda aos cadernos de encargos de frotas corporativas, veículos de luxo e maquinaria pesada.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
          <router-link
            to="/catalog"
            class="px-space-xl py-space-md rounded bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-fixed-dim transition-all shadow-xl"
          >
            Explorar Catálogo Ao Vivo
          </router-link>
          <router-link
            to="/auth/register"
            class="px-space-lg py-space-md rounded bg-surface-container-low border border-white/[0.08] text-on-surface font-title-md text-title-md hover:bg-surface-container-lowest transition-all"
          >
            Criar Conta Institucional
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
