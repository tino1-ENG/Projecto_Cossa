<template>
  <div class="w-full bg-[#F4F1EB] text-[#171717] min-h-screen py-6 sm:py-10 pb-20 sm:pb-16">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-8">
      <!-- Breadcrumb & Header -->
      <div class="flex flex-col gap-2 mb-6 sm:mb-8">
        <div class="flex items-center gap-2 text-xs text-[#777777]">
          <router-link to="/" class="hover:text-[#171717] transition-colors no-underline text-[#777777]">Início</router-link>
          <span>/</span>
          <span class="text-[#171717] font-medium">Catálogo de Leilões</span>
        </div>

        <span class="text-[10px] tracking-[0.25em] text-[#B69A68] uppercase font-bold">
          REGISTO OFICIAL DE LOTES
        </span>

        <h1 class="font-editorial text-2xl sm:text-4xl lg:text-[40px] font-semibold text-[#171717] tracking-tight">
          Catálogo Geral de Leilões
        </h1>

        <p class="text-xs sm:text-sm text-[#666666] max-w-2xl leading-relaxed">
          Consulte o portfólio completo de supercarros, frotas institucionais, maquinaria industrial, alta relojoaria e equipamentos seleccionados em Moçambique.
        </p>
      </div>

      <!-- Filter Console Panel -->
      <div class="w-full bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#E7E3DC] shadow-sm mb-6 sm:mb-10 flex flex-col gap-4 text-[#171717]">
        <!-- Top Search Row -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div class="md:col-span-8 relative">
            <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Pesquisar por título, marca, modelo ou nº de lote..."
              class="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] text-xs sm:text-sm text-[#171717] placeholder:text-[#888888] focus:outline-none focus:border-[#B69A68] transition-colors"
              @keyup.enter="applyFilters"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#171717] bg-transparent border-0 cursor-pointer"
              @click="searchQuery = ''; applyFilters()"
            >
              <X :size="16" />
            </button>
          </div>

          <div class="md:col-span-4 flex items-center gap-2">
            <button
              type="button"
              class="flex-1 py-2.5 rounded-lg bg-[#171717] text-white hover:bg-[#B69A68] text-xs sm:text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border-0"
              @click="applyFilters"
            >
              <Filter :size="16" />
              <span>Aplicar Filtros</span>
            </button>
            <button
              v-if="hasActiveFilters"
              type="button"
              class="px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] hover:bg-[#EFECE5] text-[#171717] text-xs font-semibold tracking-wide transition-colors cursor-pointer"
              @click="clearAllFilters"
            >
              Limpar
            </button>
          </div>
        </div>

        <!-- Filter Selectors Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#E7E3DC]">
          <!-- Category -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Categoria</label>
            <div class="relative">
              <select
                v-model="selectedCategory"
                class="w-full pl-3 pr-8 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] hover:border-[#B69A68] text-xs text-[#171717] focus:outline-none focus:border-[#B69A68] transition-colors appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
              <ChevronDown :size="14" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none" />
            </div>
          </div>

          <!-- Province -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Província</label>
            <div class="relative">
              <select
                v-model="selectedProvince"
                class="w-full pl-3 pr-8 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] hover:border-[#B69A68] text-xs text-[#171717] focus:outline-none focus:border-[#B69A68] transition-colors appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option v-for="prov in provinceOptions" :key="prov.value" :value="prov.value">
                  {{ prov.label }}
                </option>
              </select>
              <ChevronDown :size="14" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none" />
            </div>
          </div>

          <!-- Status -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Estado do Leilão</label>
            <div class="relative">
              <select
                v-model="selectedStatus"
                class="w-full pl-3 pr-8 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] hover:border-[#B69A68] text-xs text-[#171717] focus:outline-none focus:border-[#B69A68] transition-colors appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option v-for="st in statusOptions" :key="st.value" :value="st.value">
                  {{ st.label }}
                </option>
              </select>
              <ChevronDown :size="14" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none" />
            </div>
          </div>

          <!-- Sorting -->
          <div class="flex flex-col gap-1">
            <label class="text-[10px] text-[#777777] uppercase font-bold tracking-wider">Ordenação</label>
            <div class="relative">
              <select
                v-model="selectedSort"
                class="w-full pl-3 pr-8 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E3DC] hover:border-[#B69A68] text-xs text-[#171717] focus:outline-none focus:border-[#B69A68] transition-colors appearance-none cursor-pointer"
                @change="applyFilters"
              >
                <option v-for="so in sortOptions" :key="so.value" :value="so.value">
                  {{ so.label }}
                </option>
              </select>
              <ChevronDown :size="14" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters Chips Bar -->
      <div v-if="hasActiveFilters" class="flex items-center gap-2 mb-4 flex-wrap">
        <span class="text-[11px] text-[#777777] uppercase tracking-wider font-semibold">Filtros Activos:</span>
        <span
          v-if="searchQuery"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E7E3DC] text-xs text-[#171717]"
        >
          Pesquisa: "{{ searchQuery }}"
          <button @click="searchQuery = ''; applyFilters()" class="text-[#888888] hover:text-[#171717]">✕</button>
        </span>
        <span
          v-if="selectedCategory !== 'all'"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E7E3DC] text-xs text-[#171717]"
        >
          Categoria: {{ categoryLabel(selectedCategory) }}
          <button @click="selectedCategory = 'all'; applyFilters()" class="text-[#888888] hover:text-[#171717]">✕</button>
        </span>
        <span
          v-if="selectedProvince !== 'all'"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E7E3DC] text-xs text-[#171717]"
        >
          Província: {{ selectedProvince }}
          <button @click="selectedProvince = 'all'; applyFilters()" class="text-[#888888] hover:text-[#171717]">✕</button>
        </span>
        <span
          v-if="selectedStatus"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E7E3DC] text-xs text-[#171717]"
        >
          Estado: {{ statusLabel(selectedStatus) }}
          <button @click="selectedStatus = ''; applyFilters()" class="text-[#888888] hover:text-[#171717]">✕</button>
        </span>
      </div>

      <!-- Results Stats Bar -->
      <div class="flex items-center justify-between pb-3 mb-6 border-b border-[#E7E3DC]">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-white border border-[#E7E3DC] text-xs font-semibold text-[#171717]">
            {{ auctionStore.total }} Lotes Encontrados
          </span>
          <span class="text-xs text-[#777777]">
            Página {{ auctionStore.filters.page }} de {{ auctionStore.totalPages || 1 }}
          </span>
        </div>
      </div>

      <!-- Auction Lots Grid -->
      <div v-if="auctionStore.loading" class="py-20 flex flex-col items-center justify-center gap-3">
        <q-spinner-dots color="primary" size="44px" />
        <p class="text-xs text-[#777777]">A sincronizar lotes em tempo real...</p>
      </div>

      <div v-else-if="auctionStore.auctions.length === 0" class="py-16 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-[#E7E3DC] p-8 shadow-xs">
        <SearchX :size="48" class="text-[#AAAAAA]" />
        <h3 class="font-editorial text-lg text-[#171717] font-semibold">Nenhum leilão corresponde aos critérios</h3>
        <p class="text-xs text-[#666666] max-w-md">
          Tente ajustar os filtros de pesquisa, remover palavras-chave ou escolher outra categoria de activos.
        </p>
        <button
          type="button"
          class="mt-2 px-5 py-2.5 rounded-lg bg-[#171717] text-white hover:bg-[#B69A68] text-xs font-semibold tracking-wide transition-colors cursor-pointer"
          @click="clearAllFilters"
        >
          Limpar Todos os Filtros
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <div v-for="auction in auctionStore.auctions" :key="auction.id">
          <AuctionCard :auction="auction" />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="auctionStore.totalPages > 1" class="flex justify-center mt-12 pt-6 border-t border-[#E7E3DC]">
        <q-pagination
          v-model="currentPage"
          :max="auctionStore.totalPages"
          :max-pages="6"
          boundary-numbers
          direction-links
          color="primary"
          active-color="primary"
          active-text-color="white"
          text-color="dark"
          class="font-mono text-sm"
          @update:model-value="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, X, Filter, SearchX, ChevronDown } from 'lucide-vue-next';
import { useAuctionStore } from '../../stores/auction';
import AuctionCard from '../../components/auction/AuctionCard.vue';

const route = useRoute();
const router = useRouter();
const auctionStore = useAuctionStore();

const searchQuery = ref('');
const selectedCategory = ref('all');
const selectedProvince = ref('all');
const selectedStatus = ref('');
const selectedSort = ref('ending_soon');
const currentPage = ref(1);

const categoryOptions = computed(() => [
  { label: 'Todas as Categorias', value: 'all' },
  ...auctionStore.categories.map(c => ({ label: c.name, value: c.slug }))
]);

const provinceOptions = [
  { label: 'Todas as Províncias', value: 'all' },
  { label: 'Maputo Cidade', value: 'Maputo Cidade' },
  { label: 'Maputo Província', value: 'Maputo Província' },
  { label: 'Gaza', value: 'Gaza' },
  { label: 'Inhambane', value: 'Inhambane' },
  { label: 'Sofala (Beira)', value: 'Sofala' },
  { label: 'Manica (Chimoio)', value: 'Manica' },
  { label: 'Tete (Moatize)', value: 'Tete' },
  { label: 'Zambézia', value: 'Zambézia' },
  { label: 'Nampula', value: 'Nampula' },
  { label: 'Cabo Delgado (Pemba)', value: 'Cabo Delgado' },
  { label: 'Niassa', value: 'Niassa' }
];

const statusOptions = [
  { label: 'Todos os Estados', value: '' },
  { label: 'Activos / Ao Vivo', value: 'active' },
  { label: 'Próximos Pregões', value: 'upcoming' },
  { label: 'Encerrados', value: 'ended' }
];

const sortOptions = [
  { label: 'A Terminar em Breve', value: 'ending_soon' },
  { label: 'Menor Preço Atual', value: 'price_asc' },
  { label: 'Maior Preço Atual', value: 'price_desc' },
  { label: 'Mais Recentes', value: 'newest' },
  { label: 'Mais Concorridos', value: 'most_bids' }
];

const hasActiveFilters = computed(() => {
  return Boolean(
    searchQuery.value ||
    selectedCategory.value !== 'all' ||
    selectedProvince.value !== 'all' ||
    selectedStatus.value
  );
});

onMounted(async () => {
  await auctionStore.fetchCategories();
  syncFiltersFromQuery();
  await auctionStore.fetchAuctions();
});

watch(() => route.query, () => {
  syncFiltersFromQuery();
  auctionStore.fetchAuctions();
});

function syncFiltersFromQuery() {
  searchQuery.value = (route.query.search as string) || '';
  selectedCategory.value = (route.query.category as string) || 'all';
  selectedProvince.value = (route.query.province as string) || 'all';
  selectedStatus.value = (route.query.status as string) || '';
  selectedSort.value = (route.query.sort as string) || 'ending_soon';
  currentPage.value = Number(route.query.page) || 1;

  auctionStore.filters = {
    ...auctionStore.filters,
    search: searchQuery.value,
    category: selectedCategory.value === 'all' ? '' : selectedCategory.value,
    province: selectedProvince.value === 'all' ? '' : selectedProvince.value,
    status: selectedStatus.value,
    sort: selectedSort.value,
    page: currentPage.value
  };
}

function applyFilters() {
  const query: Record<string, string | number> = {};
  if (searchQuery.value) query.search = searchQuery.value;
  if (selectedCategory.value !== 'all') query.category = selectedCategory.value;
  if (selectedProvince.value !== 'all') query.province = selectedProvince.value;
  if (selectedStatus.value) query.status = selectedStatus.value;
  if (selectedSort.value) query.sort = selectedSort.value;
  query.page = 1;

  router.push({ path: '/catalog', query });
}

function clearAllFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  selectedProvince.value = 'all';
  selectedStatus.value = '';
  selectedSort.value = 'ending_soon';
  currentPage.value = 1;

  router.push({ path: '/catalog' });
}

function onPageChange(page: number) {
  currentPage.value = page;
  const query = { ...route.query, page };
  router.push({ path: '/catalog', query });
}

function categoryLabel(slug: string) {
  const cat = auctionStore.categories.find(c => c.slug === slug);
  return cat ? cat.name : slug;
}

function statusLabel(st: string) {
  const opt = statusOptions.find(o => o.value === st);
  return opt ? opt.label : st;
}
</script>
