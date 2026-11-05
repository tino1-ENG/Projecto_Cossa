<template>
  <q-page class="w-full bg-surface text-on-surface min-h-screen py-space-md sm:py-space-xl">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-margin">
      <!-- Breadcrumb & Header via Quasar -->
      <div class="flex flex-col gap-space-xs mb-space-lg sm:mb-space-xl">
        <q-breadcrumbs class="text-xs sm:text-sm text-on-surface-variant/70 mb-1" active-color="primary">
          <q-breadcrumbs-el label="Início" to="/" icon="home" />
          <q-breadcrumbs-el label="Catálogo de Leilões" icon="gavel" />
        </q-breadcrumbs>
        <span class="font-label-caps text-label-caps uppercase tracking-wider text-primary text-xs font-bold">Registo Oficial de Lotes</span>
        <h1 class="text-2xl sm:text-3xl md:text-headline-lg font-bold text-on-surface tracking-tight font-display">
          Catálogo Geral de Leilões em Moçambique
        </h1>
        <p class="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl">
          Consulte o portfólio completo de supercarros, frotas institucionais, maquinaria industrial e equipamentos raros autenticados por escritura notarial.
        </p>
      </div>

      <!-- Filter Console Panel with Quasar Card -->
      <q-card class="w-full bg-surface-container rounded-2xl p-4 sm:p-space-lg border border-white/[0.08] shadow-2xl mb-space-xl sm:mb-space-2xl flex flex-col gap-space-md text-white" flat>
        <!-- Top Search Row -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-space-md items-center">
          <div class="md:col-span-8">
            <q-input
              v-model="searchQuery"
              dark
              filled
              dense
              color="primary"
              class="text-white"
              placeholder="Pesquisar por título, marca, modelo ou lote..."
              @keyup.enter="applyFilters"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              <template v-if="searchQuery" v-slot:append>
                <q-icon name="close" @click="searchQuery = ''; applyFilters()" class="cursor-pointer" />
              </template>
            </q-input>
          </div>

          <div class="md:col-span-4 flex items-center gap-2 sm:gap-space-sm">
            <q-btn
              unelevated
              no-caps
              color="primary"
              text-color="dark"
              icon="filter_alt"
              label="Aplicar Filtros"
              class="flex-1 py-2 font-bold text-xs uppercase shadow-md shimmer-gold active-press"
              @click="applyFilters"
            />
            <q-btn
              v-if="hasActiveFilters"
              outline
              no-caps
              color="grey-5"
              label="Limpar"
              class="px-3 py-2 text-xs"
              @click="clearAllFilters"
            />
          </div>
        </div>

        <!-- Filter Selectors Row via Quasar QSelect -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-space-md pt-space-sm border-t border-white/[0.06]">
          <!-- Category -->
          <div class="flex flex-col gap-1">
            <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Categoria de Ativos</label>
            <q-select
              v-model="selectedCategory"
              :options="categoryOptions"
              dark
              filled
              dense
              emit-value
              map-options
              color="primary"
              @update:model-value="applyFilters"
            />
          </div>

          <!-- Province -->
          <div class="flex flex-col gap-1">
            <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Localização / Província</label>
            <q-select
              v-model="selectedProvince"
              :options="provinceOptions"
              dark
              filled
              dense
              emit-value
              map-options
              color="primary"
              @update:model-value="applyFilters"
            />
          </div>

          <!-- Status -->
          <div class="flex flex-col gap-1">
            <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Estado do Leilão</label>
            <q-select
              v-model="selectedStatus"
              :options="statusOptions"
              dark
              filled
              dense
              emit-value
              map-options
              color="primary"
              @update:model-value="applyFilters"
            />
          </div>

          <!-- Sorting -->
          <div class="flex flex-col gap-1">
            <label class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Critério de Ordenação</label>
            <q-select
              v-model="selectedSort"
              :options="sortOptions"
              dark
              filled
              dense
              emit-value
              map-options
              color="primary"
              @update:model-value="applyFilters"
            />
          </div>
        </div>
      </q-card>

      <!-- Active Filters Chips Bar -->
      <div v-if="hasActiveFilters" class="flex items-center gap-2 mb-space-md flex-wrap">
        <span class="font-label-caps text-[11px] text-on-surface-variant/80 uppercase">Filtros Ativos:</span>
        <q-chip
          v-if="searchQuery"
          removable
          dark
          color="primary"
          text-color="dark"
          dense
          @remove="searchQuery = ''; applyFilters()"
        >
          Pesquisa: "{{ searchQuery }}"
        </q-chip>
        <q-chip
          v-if="selectedCategory !== 'all'"
          removable
          dark
          color="primary"
          text-color="dark"
          dense
          @remove="selectedCategory = 'all'; applyFilters()"
        >
          Categoria: {{ categoryLabel(selectedCategory) }}
        </q-chip>
        <q-chip
          v-if="selectedProvince !== 'all'"
          removable
          dark
          color="primary"
          text-color="dark"
          dense
          @remove="selectedProvince = 'all'; applyFilters()"
        >
          Província: {{ selectedProvince }}
        </q-chip>
        <q-chip
          v-if="selectedStatus"
          removable
          dark
          color="primary"
          text-color="dark"
          dense
          @remove="selectedStatus = ''; applyFilters()"
        >
          Estado: {{ statusLabel(selectedStatus) }}
        </q-chip>
      </div>

      <!-- Results Stats Bar -->
      <div class="flex items-center justify-between pb-space-sm mb-space-md border-b border-white/[0.04]">
        <div class="flex items-center gap-2">
          <q-badge color="primary" text-color="dark" class="font-bold text-xs" :label="`${auctionStore.total} Lotes Encontrados`" />
          <span class="font-body-sm text-xs text-on-surface-variant/70">
            A exibir página {{ auctionStore.filters.page }} de {{ auctionStore.totalPages || 1 }}
          </span>
        </div>
      </div>

      <!-- Auction Lots Grid -->
      <div v-if="auctionStore.loading" class="py-20 flex flex-col items-center justify-center gap-space-md">
        <q-spinner-dots color="primary" size="48px" />
        <p class="font-body-md text-on-surface-variant">A sincronizar lotes em direto...</p>
      </div>

      <div v-else-if="auctionStore.auctions.length === 0" class="py-20 text-center flex flex-col items-center justify-center gap-space-md bg-surface-container rounded-2xl border border-white/[0.08] p-8">
        <q-icon name="search_off" size="56px" class="text-on-surface-variant/50" />
        <h3 class="font-headline-sm text-on-surface font-bold">Nenhum leilão corresponde aos critérios</h3>
        <p class="font-body-md text-on-surface-variant max-w-md">
          Tente ajustar os filtros de pesquisa, remover palavras-chave ou escolher outra categoria de ativos.
        </p>
        <q-btn
          unelevated
          no-caps
          color="primary"
          text-color="dark"
          label="Limpar Todos os Filtros"
          class="font-bold text-xs"
          @click="clearAllFilters"
        />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-gutter">
        <div v-for="auction in auctionStore.auctions" :key="auction.id">
          <AuctionCard :auction="auction" />
        </div>
      </div>

      <!-- Pagination via Quasar QPagination -->
      <div v-if="auctionStore.totalPages > 1" class="flex justify-center mt-space-2xl pt-space-md border-t border-white/[0.06]">
        <q-pagination
          v-model="currentPage"
          :max="auctionStore.totalPages"
          :max-pages="6"
          boundary-numbers
          direction-links
          color="primary"
          active-color="primary"
          active-text-color="dark"
          text-color="grey-4"
          dark
          class="font-mono text-sm"
          @update:model-value="onPageChange"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuctionStore } from '../../stores/auction';
import AuctionCard from '../../components/auction/AuctionCard.vue';

const route = useRoute();
const router = useRouter();
const auctionStore = useAuctionStore();

const searchQuery = ref((route.query.search as string) || '');
const selectedCategory = ref((route.query.category as string) || 'all');
const selectedProvince = ref((route.query.province as string) || 'all');
const selectedStatus = ref((route.query.status as string) || '');
const selectedSort = ref((route.query.sort as string) || 'ending_soon');
const currentPage = ref(parseInt((route.query.page as string) || '1', 10));

const categoryOptions = computed(() => [
  { label: 'Todas as Categorias', value: 'all' },
  ...auctionStore.categories.map(c => ({ label: c.name, value: c.slug }))
]);

const provinceOptions = [
  { label: 'Todo o Território Nacional', value: 'all' },
  { label: 'Maputo Cidade', value: 'Maputo Cidade' },
  { label: 'Matola / Maputo Província', value: 'Maputo Província' },
  { label: 'Beira / Sofala', value: 'Sofala' },
  { label: 'Nampula', value: 'Nampula' },
  { label: 'Tete / Moatize', value: 'Tete' },
  { label: 'Pemba / Cabo Delgado', value: 'Cabo Delgado' },
  { label: 'Quelimane / Zambézia', value: 'Zambézia' },
  { label: 'Inhambane', value: 'Inhambane' },
  { label: 'Xai-Xai / Gaza', value: 'Gaza' }
];

const statusOptions = [
  { label: 'Todos os Lotes Disponíveis', value: '' },
  { label: 'Sessões Ao Vivo Ativas', value: 'active' },
  { label: 'Pregões Agendados / Brevemente', value: 'upcoming' },
  { label: 'Leilões Encerrados', value: 'ended' }
];

const sortOptions = [
  { label: 'A Terminar Mais Cedo (Crítico)', value: 'ending_soon' },
  { label: 'Valor Mais Elevado (Decrescente)', value: 'price_desc' },
  { label: 'Valor Mais Acessível (Crescente)', value: 'price_asc' },
  { label: 'Maior Número de Licitações', value: 'bids_desc' },
  { label: 'Mais Recentes no Registo', value: 'newest' }
];

const hasActiveFilters = computed(() => {
  return Boolean(
    searchQuery.value.trim() ||
    selectedCategory.value !== 'all' ||
    selectedProvince.value !== 'all' ||
    selectedStatus.value
  );
});

function categoryLabel(slug: string) {
  const found = auctionStore.categories.find(c => c.slug === slug);
  return found ? found.name : slug;
}

function statusLabel(status: string) {
  if (status === 'active') return 'Ao Vivo';
  if (status === 'upcoming') return 'Em Breve';
  if (status === 'ended') return 'Encerrado';
  return status;
}

async function fetchFiltered() {
  const params: any = {
    page: currentPage.value,
    limit: 12,
    sort: selectedSort.value
  };

  if (searchQuery.value.trim()) params.search = searchQuery.value.trim();
  if (selectedCategory.value !== 'all') params.category = selectedCategory.value;
  if (selectedProvince.value !== 'all') params.province = selectedProvince.value;
  if (selectedStatus.value) params.status = selectedStatus.value;

  await auctionStore.fetchAuctions(params);
}

function applyFilters() {
  currentPage.value = 1;
  syncUrlQuery();
  fetchFiltered();
}

function clearAllFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  selectedProvince.value = 'all';
  selectedStatus.value = '';
  selectedSort.value = 'ending_soon';
  currentPage.value = 1;
  syncUrlQuery();
  fetchFiltered();
}

function onPageChange(newPage: number) {
  currentPage.value = newPage;
  syncUrlQuery();
  fetchFiltered();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function syncUrlQuery() {
  const query: Record<string, string> = {};
  if (searchQuery.value.trim()) query.search = searchQuery.value.trim();
  if (selectedCategory.value !== 'all') query.category = selectedCategory.value;
  if (selectedProvince.value !== 'all') query.province = selectedProvince.value;
  if (selectedStatus.value) query.status = selectedStatus.value;
  if (selectedSort.value !== 'ending_soon') query.sort = selectedSort.value;
  if (currentPage.value > 1) query.page = String(currentPage.value);

  router.replace({ path: '/catalog', query });
}

onMounted(async () => {
  await auctionStore.fetchCategories();
  await fetchFiltered();
});

watch(() => route.query, () => {
  searchQuery.value = (route.query.search as string) || '';
  selectedCategory.value = (route.query.category as string) || 'all';
  selectedProvince.value = (route.query.province as string) || 'all';
  selectedStatus.value = (route.query.status as string) || '';
  selectedSort.value = (route.query.sort as string) || 'ending_soon';
  currentPage.value = parseInt((route.query.page as string) || '1', 10);
  fetchFiltered();
});
</script>
