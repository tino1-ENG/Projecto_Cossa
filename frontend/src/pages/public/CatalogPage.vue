<template>
  <div class="w-full bg-surface text-on-surface min-h-screen py-space-xl">
    <div class="max-w-[1440px] mx-auto px-margin">
      <!-- Breadcrumb & Header -->
      <div class="flex flex-col gap-space-xs mb-space-xl">
        <nav class="flex items-center gap-2 text-body-sm text-on-surface-variant/70">
          <router-link to="/" class="hover:text-primary transition-colors">Início</router-link>
          <span>/</span>
          <span class="text-on-surface font-medium">Catálogo de Leilões</span>
        </nav>
        <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary">Registo Oficial de Lotes</span>
        <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Catálogo Geral de Leilões em Moçambique
        </h1>
        <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Consulte o portfólio completo de supercarros, frotas institucionais, maquinaria industrial e equipamentos raros autenticados por escritura notarial.
        </p>
      </div>

      <!-- Filter Console Panel -->
      <div class="w-full bg-surface-container rounded-2xl p-space-md sm:p-space-lg border border-white/[0.08] shadow-2xl mb-space-2xl flex flex-col gap-space-md">
        <!-- Top Search Row -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
          <div class="md:col-span-8 relative">
            <span class="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Pesquisar por título, marca, modelo ou lote..."
              class="w-full bg-surface-container-low border border-white/[0.08] rounded-lg pl-12 pr-space-md py-space-sm text-on-surface placeholder:text-on-surface-variant/50 font-body-md text-body-md focus:outline-none focus:border-primary"
              @keyup.enter="applyFilters"
            />
          </div>

          <div class="md:col-span-4 flex items-center gap-space-sm">
            <button
              class="flex-1 py-space-sm rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-headline-sm text-title-md transition-all shadow-md flex items-center justify-center gap-space-xs"
              @click="applyFilters"
              type="button"
            >
              <span class="material-symbols-outlined text-[18px]">filter_alt</span>
              <span>Aplicar Filtros</span>
            </button>
            <button
              v-if="hasActiveFilters"
              class="px-space-md py-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-white/[0.08] text-on-surface-variant font-label-caps text-label-caps"
              @click="clearAllFilters"
              type="button"
            >
              Limpar
            </button>
          </div>
        </div>

        <!-- Filter Selectors Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-sm border-t border-white/[0.06]">
          <!-- Category -->
          <div class="flex flex-col gap-1">
            <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Categoria de Ativos</label>
            <select
              v-model="selectedCategory"
              class="bg-surface-container-low border border-white/[0.08] rounded-lg px-space-md py-2 text-on-surface font-body-md text-body-sm focus:outline-none focus:border-primary"
              @change="applyFilters"
            >
              <option value="all">Todas as Categorias</option>
              <option v-for="cat in auctionStore.categories" :key="cat.id" :value="cat.slug">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Province -->
          <div class="flex flex-col gap-1">
            <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Localização / Província</label>
            <select
              v-model="selectedProvince"
              class="bg-surface-container-low border border-white/[0.08] rounded-lg px-space-md py-2 text-on-surface font-body-md text-body-sm focus:outline-none focus:border-primary"
              @change="applyFilters"
            >
              <option value="all">Todo o Território Nacional</option>
              <option value="Maputo Cidade">Maputo Cidade</option>
              <option value="Maputo Província">Matola / Maputo Província</option>
              <option value="Sofala">Beira / Sofala</option>
              <option value="Nampula">Nampula</option>
              <option value="Tete">Tete / Moatize</option>
              <option value="Cabo Delgado">Pemba / Cabo Delgado</option>
              <option value="Zambézia">Quelimane / Zambézia</option>
              <option value="Inhambane">Inhambane</option>
              <option value="Gaza">Xai-Xai / Gaza</option>
            </select>
          </div>

          <!-- Status -->
          <div class="flex flex-col gap-1">
            <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Estado do Leilão</label>
            <select
              v-model="selectedStatus"
              class="bg-surface-container-low border border-white/[0.08] rounded-lg px-space-md py-2 text-on-surface font-body-md text-body-sm focus:outline-none focus:border-primary"
              @change="applyFilters"
            >
              <option value="all">Todos os Estados</option>
              <option value="active">Ao Vivo (Em Disputa)</option>
              <option value="upcoming">Próximas Sessões</option>
              <option value="ended">Sessões Encerradas</option>
            </select>
          </div>

          <!-- Sort -->
          <div class="flex flex-col gap-1">
            <label class="font-label-caps text-[10px] text-on-surface-variant uppercase">Ordenação do Livro de Ofertas</label>
            <select
              v-model="selectedSort"
              class="bg-surface-container-low border border-white/[0.08] rounded-lg px-space-md py-2 text-on-surface font-body-md text-body-sm focus:outline-none focus:border-primary"
              @change="applyFilters"
            >
              <option value="ending_soon">A Terminar Primeiro (Mais Urgentes)</option>
              <option value="price_desc">Maior Valor (MZN)</option>
              <option value="price_asc">Menor Valor (MZN)</option>
              <option value="bids_desc">Mais Disputados (Nº de Lances)</option>
              <option value="newest">Mais Recentes</option>
            </select>
          </div>
        </div>

        <!-- Active Badges Indicator -->
        <div class="flex items-center justify-between text-body-sm text-on-surface-variant pt-space-xs border-t border-white/[0.04]">
          <span class="font-label-numeric">
            A apresentar <strong>{{ filteredAuctions.length }}</strong> lotes certificados
          </span>
          <div class="flex items-center gap-space-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs">Sincronização em tempo real via Socket.IO</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="auctionStore.loading" class="py-20 flex flex-col items-center justify-center gap-space-md">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="font-body-md text-on-surface-variant">A sincronizar lotes em direto...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAuctions.length === 0" class="py-20 text-center rounded-2xl bg-surface-container border border-white/[0.08] p-space-2xl">
        <span class="material-symbols-outlined text-[48px] text-on-surface-variant/40 mb-2">search_off</span>
        <h3 class="font-headline-sm text-on-surface">Nenhum lote encontrado para os critérios selecionados</h3>
        <p class="font-body-md text-on-surface-variant mt-1 max-w-md mx-auto">
          Tente alargar os seus termos de pesquisa ou remover alguns filtros para encontrar lotes disponíveis.
        </p>
        <button
          class="mt-space-md px-space-lg py-2 rounded bg-primary text-on-primary font-label-caps text-label-caps uppercase shadow-md"
          @click="clearAllFilters"
          type="button"
        >
          Repor Filtros
        </button>
      </div>

      <!-- Grid of Lots -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div v-for="item in filteredAuctions" :key="item.id">
          <AuctionCard :auction="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuctionStore } from '../../stores/auction';
import AuctionCard from '../../components/auction/AuctionCard.vue';

const route = useRoute();
const router = useRouter();
const auctionStore = useAuctionStore();

const searchQuery = ref((route.query.q as string) || '');
const selectedCategory = ref((route.query.category as string) || 'all');
const selectedProvince = ref((route.query.province as string) || 'all');
const selectedStatus = ref((route.query.status as string) || 'all');
const selectedSort = ref((route.query.sort as string) || 'ending_soon');

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || selectedCategory.value !== 'all' || selectedProvince.value !== 'all' || selectedStatus.value !== 'all';
});

const filteredAuctions = computed(() => {
  return auctionStore.auctions;
});

function applyFilters() {
  const query: Record<string, string> = {};
  if (searchQuery.value) query.q = searchQuery.value;
  if (selectedCategory.value !== 'all') query.category = selectedCategory.value;
  if (selectedProvince.value !== 'all') query.province = selectedProvince.value;
  if (selectedStatus.value !== 'all') query.status = selectedStatus.value;
  if (selectedSort.value !== 'ending_soon') query.sort = selectedSort.value;

  router.push({ path: '/catalog', query });
  fetchData();
}

function clearAllFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  selectedProvince.value = 'all';
  selectedStatus.value = 'all';
  selectedSort.value = 'ending_soon';
  router.push('/catalog');
  fetchData();
}

async function fetchData() {
  const params: Record<string, any> = {};
  if (searchQuery.value) params.q = searchQuery.value;
  if (selectedCategory.value !== 'all') params.category = selectedCategory.value;
  if (selectedProvince.value !== 'all') params.province = selectedProvince.value;
  if (selectedStatus.value !== 'all') params.status = selectedStatus.value;
  if (selectedSort.value) params.sort = selectedSort.value;

  await auctionStore.fetchAuctions(params);
}

watch(() => route.query, () => {
  searchQuery.value = (route.query.q as string) || '';
  selectedCategory.value = (route.query.category as string) || 'all';
  selectedProvince.value = (route.query.province as string) || 'all';
  selectedStatus.value = (route.query.status as string) || 'all';
  selectedSort.value = (route.query.sort as string) || 'ending_soon';
  fetchData();
});

onMounted(async () => {
  await Promise.all([
    auctionStore.fetchCategories(),
    fetchData()
  ]);
});
</script>
