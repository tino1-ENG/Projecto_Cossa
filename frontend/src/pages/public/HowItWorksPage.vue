<template>
  <q-page class="w-full bg-surface text-on-surface py-6 sm:py-12">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col gap-2 mb-10 text-center max-w-3xl mx-auto">
        <q-badge outline color="primary" class="self-center px-3 py-1 font-mono uppercase tracking-widest text-xs mb-2">
          Regulamento Operacional & Jurídico
        </q-badge>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight font-display">
          Como Funciona a Bolsa de Leilões MozBid
        </h1>
        <p class="text-sm sm:text-base text-on-surface-variant mt-2 leading-relaxed">
          Conheça as regras de licitação em Meticais (MZN), o motor anti-sniping, as garantias fiduciárias de escrow bancário e a verificação oficial de NUIT em Moçambique.
        </p>
      </div>

      <!-- 3 Structured Pillars Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <q-card flat class="p-6 sm:p-8 rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-6 shadow-xl hover:bg-surface-container-high transition-all">
          <div class="flex items-center justify-between">
            <span class="font-headline-lg text-[44px] font-bold text-primary/30">01</span>
            <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
              <span class="material-symbols-outlined text-[24px]">gavel</span>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold text-on-surface mb-2">Licitação em Tempo Real</h3>
            <p class="text-sm text-on-surface-variant leading-relaxed">
              Cada leilão opera com incremento mínimo tabelado em Meticais. As licitações são processadas através de transações atómicas <code class="text-primary font-mono text-xs">BEGIN IMMEDIATE</code> em base de dados com registo WAL, garantindo que nenhum lance seja perdido ou duplicado.
            </p>
          </div>
          <span class="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1">
            Motor de Transações Atómicas <span class="material-symbols-outlined text-[16px]">check</span>
          </span>
        </q-card>

        <q-card flat class="p-6 sm:p-8 rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-6 shadow-xl hover:bg-surface-container-high transition-all">
          <div class="flex items-center justify-between">
            <span class="font-headline-lg text-[44px] font-bold text-primary/30">02</span>
            <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
              <span class="material-symbols-outlined text-[24px]">alarm_on</span>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold text-on-surface mb-2">Mecanismo Anti-Sniping</h3>
            <p class="text-sm text-on-surface-variant leading-relaxed">
              Para eliminar vantagens desleais de bots e assegurar disputa justa, qualquer licitação submetida nos últimos <strong>2 minutos</strong> de um lote estende automaticamente o prazo de encerramento em mais <strong>3 minutos</strong> adicionais.
            </p>
          </div>
          <span class="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1">
            Extensão Automática de Prazo <span class="material-symbols-outlined text-[16px]">check</span>
          </span>
        </q-card>

        <q-card flat class="p-6 sm:p-8 rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col justify-between gap-6 shadow-xl hover:bg-surface-container-high transition-all">
          <div class="flex items-center justify-between">
            <span class="font-headline-lg text-[44px] font-bold text-primary/30">03</span>
            <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary border border-white/[0.08]">
              <span class="material-symbols-outlined text-[24px]">lock</span>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-bold text-on-surface mb-2">Escrow Bancário em Meticais</h3>
            <p class="text-sm text-on-surface-variant leading-relaxed">
              Os pagamentos de arrematação e depósitos de garantia são custodiados em contas fiduciárias no <strong>BCI</strong>, <strong>Millennium BIM</strong>, <strong>Standard Bank</strong> ou vias digitais <strong>M-Pesa / e-Mola</strong>, com libertação apenas após inspeção física satisfatória.
            </p>
          </div>
          <span class="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1">
            Proteção Fiduciária Total <span class="material-symbols-outlined text-[16px]">check</span>
          </span>
        </q-card>
      </div>

      <!-- FAQ Section -->
      <q-card flat class="w-full bg-surface-container rounded-2xl p-6 sm:p-10 border border-white/[0.08] shadow-2xl mb-12">
        <div class="text-center max-w-xl mx-auto mb-8">
          <q-badge outline color="primary" class="px-3 py-1 font-mono uppercase tracking-widest text-xs mb-2">
            Esclarecimentos Legais
          </q-badge>
          <h2 class="text-2xl sm:text-3xl font-bold text-on-surface mt-1">Perguntas Frequentes (FAQ)</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-xl bg-surface-container-low border border-white/[0.04]">
            <h4 class="text-base text-on-surface font-bold mb-2">Como funciona a Licitação Automática (Proxy Bidding)?</h4>
            <p class="text-sm text-on-surface-variant leading-relaxed">
              Pode introduzir o seu teto máximo confidencial. O algoritmo da MozBid licitará pelo incremento mínimo estipulado apenas quando outro participante efetuar um lance, parando estritamente no seu limite estipulado.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-surface-container-low border border-white/[0.04]">
            <h4 class="text-base text-on-surface font-bold mb-2">O que acontece se o Preço de Reserva não for atingido?</h4>
            <p class="text-sm text-on-surface-variant leading-relaxed">
              O preço de reserva é o valor mínimo pelo qual o vendedor aceita transacionar o lote. Se no final do leilão a maior oferta não atingir a reserva, o lote encerra sem obrigação de venda, podendo o vendedor solicitar renegociação.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-surface-container-low border border-white/[0.04]">
            <h4 class="text-base text-on-surface font-bold mb-2">Quais os documentos exigidos para validação de NUIT?</h4>
            <p class="text-sm text-on-surface-variant leading-relaxed">
              Pessoas singulares devem submeter B.I. ou Passaporte válido e Número Único de Identificação Tributária (NUIT). Pessoas coletivas submetem Certidão Comercial da Conservatória e NUIT institucional.
            </p>
          </div>

          <div class="p-5 rounded-xl bg-surface-container-low border border-white/[0.04]">
            <h4 class="text-base text-on-surface font-bold mb-2">Como é feita a entrega física e a escritura do lote?</h4>
            <p class="text-sm text-on-surface-variant leading-relaxed">
              A escritura pública e a transferência de título automóvel ou predial são formalizadas no nosso escritório na Av. Julius Nyerere, Polana Cimento, Maputo, ou entregues via transportadora de segurança blindada para outras províncias.
            </p>
          </div>
        </div>
      </q-card>

      <!-- Quick Action Lead Banner -->
      <q-card flat class="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container border border-white/[0.08] text-center flex flex-col items-center gap-4">
        <h3 class="text-2xl sm:text-3xl font-bold text-on-surface max-w-2xl">
          Pronto para Participar nos Leilões mais Exclusivos de Moçambique?
        </h3>
        <p class="text-sm sm:text-base text-on-surface-variant max-w-xl">
          Credencie-se hoje mesmo e aceda aos cadernos de encargos de frotas corporativas, veículos de luxo e maquinaria pesada.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
          <q-btn
            unelevated
            no-caps
            color="primary"
            text-color="dark"
            to="/catalog"
            label="Explorar Catálogo Ao Vivo"
            class="font-bold text-sm px-6 py-3 rounded-lg shimmer-gold"
          />
          <q-btn
            unelevated
            outline
            no-caps
            color="white"
            to="/auth/register"
            label="Criar Conta Institucional"
            class="font-bold text-sm px-6 py-3 rounded-lg border-white/20"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
</script>
