<template>
  <q-page class="p-3 sm:p-6 lg:p-8 pb-20 sm:pb-8 text-white">
    <div class="seller-dashboard">
      <!-- Seller KPIs Row with Quasar Cards -->
      <div class="kpi-grid">
        <q-card class="card-luxury kpi-card" flat>
          <div class="kpi-icon-box">
            <Gavel :size="20" class="text-gold" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Leilões Activos</span>
            <div class="kpi-value text-gold">{{ dashboardData?.metrics?.activeAuctions || 0 }}</div>
          </div>
        </q-card>

        <q-card class="card-luxury kpi-card" flat>
          <div class="kpi-icon-box sales-icon">
            <DollarSign :size="20" class="text-green-400" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Volume Total de Vendas</span>
            <div class="kpi-value text-green-400">{{ formatMoney(dashboardData?.metrics?.totalSalesRevenue) }}</div>
          </div>
        </q-card>

        <q-card class="card-luxury kpi-card" flat>
          <div class="kpi-icon-box">
            <Users :size="20" class="text-gold" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Licitações Recebidas</span>
            <div class="kpi-value">{{ dashboardData?.metrics?.totalBidsReceived || 0 }}</div>
          </div>
        </q-card>

        <q-card class="card-luxury kpi-card" flat>
          <div class="kpi-icon-box rating-icon">
            <Star :size="20" class="text-gold" fill="#F5A000" />
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Avaliação do Vendedor</span>
            <div class="kpi-value">{{ dashboardData?.metrics?.rating || 4.96 }} / 5.0</div>
          </div>
        </q-card>
      </div>

      <!-- Quick Action Banner with Quasar Card -->
      <q-card class="glass-panel publish-banner text-white" flat>
        <div class="publish-banner-text">
          <h3 class="font-bold text-lg text-white">Pretende Publicar um Novo Lote de Leilão?</h3>
          <p class="text-sm text-on-surface-variant">Utilize o nosso assistente passo-a-passo para publicar automóveis, equipamento industrial ou tecnologia.</p>
        </div>
        <q-btn
          unelevated
          no-caps
          color="primary"
          text-color="dark"
          icon="add"
          label="Publicar Novo Leilão"
          class="font-bold text-sm px-6 py-3 rounded-lg shadow-xl shimmer-gold active-press"
          @click="openWizard"
        />
      </q-card>

      <!-- Dashboard Tabs via Quasar Tabs -->
      <q-tabs
        v-model="activeTab"
        dark
        dense
        active-color="primary"
        indicator-color="primary"
        align="left"
        class="border-b border-white/[0.08] mb-4 bg-surface-container-low rounded-lg p-1"
      >
        <q-tab name="auctions" icon="gavel" :label="`Meus Leilões (${myAuctions.length})`" no-caps class="text-xs font-bold" />
        <q-tab name="products" icon="inventory_2" :label="`Meus Produtos (${myProducts.length})`" no-caps class="text-xs font-bold" />
        <q-tab name="orders" icon="local_shipping" :label="`Gestão de Vendas & Envios (${myOrders.length})`" no-caps class="text-xs font-bold" />
      </q-tabs>

      <!-- TAB 1: My Auctions -->
      <div v-if="activeTab === 'auctions'" class="tab-content">
        <div v-if="myAuctions.length === 0" class="empty-tab glass-panel">
          <Gavel :size="40" class="text-muted" />
          <h4 class="font-bold text-lg">Ainda não tem leilões criados</h4>
          <p class="text-sm text-on-surface-variant">Clique em "Publicar Novo Leilão" para começar a receber lances em tempo real.</p>
        </div>
        <div v-else class="glass-panel table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Artigo / Lote</th>
                <th>Oferta Actual</th>
                <th>Total Lances</th>
                <th>Licitador Líder</th>
                <th>Estado</th>
                <th>Data de Encerramento</th>
                <th>Acção</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="auc in myAuctions" :key="auc.id">
                <td class="product-cell">
                  <img :src="auc.primary_image || defaultImg" alt="" class="table-thumb" />
                  <div class="table-prod-info">
                    <span class="prod-title">{{ auc.title }}</span>
                    <span class="prod-sub">{{ auc.location_city }}</span>
                  </div>
                </td>
                <td class="money-cell text-gold">{{ formatMoney(auc.current_price) }}</td>
                <td>{{ auc.bid_count }} ofertas</td>
                <td>{{ auc.highest_bidder_name || 'Nenhum lance' }}</td>
                <td>
                  <q-badge v-if="auc.status === 'active'" color="emerald-9" text-color="emerald-3" class="px-2 py-0.5 font-bold" label="Activo" />
                  <q-badge v-else color="grey-9" text-color="grey-4" class="px-2 py-0.5" :label="auc.status" />
                </td>
                <td>{{ formatDateTime(auc.ends_at) }}</td>
                <td>
                  <q-btn
                    :to="`/auctions/${auc.id}`"
                    outline
                    dense
                    no-caps
                    size="sm"
                    color="primary"
                    label="Acompanhar"
                    class="px-2.5 py-1"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: My Products -->
      <div v-if="activeTab === 'products'" class="tab-content">
        <div class="glass-panel table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Ano / Condição</th>
                <th>Localização</th>
                <th>Estado do Anúncio</th>
                <th>Leilão Vinculado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in myProducts" :key="prod.id">
                <td class="product-cell">
                  <img :src="prod.primary_image || defaultImg" alt="" class="table-thumb" />
                  <div class="table-prod-info">
                    <span class="prod-title">{{ prod.title }}</span>
                    <span class="prod-sub">{{ prod.brand }} {{ prod.model }}</span>
                  </div>
                </td>
                <td>{{ prod.category_name }}</td>
                <td>{{ prod.year || 'N/A' }} ({{ prod.condition }})</td>
                <td>{{ prod.location_city }}, {{ prod.location_province }}</td>
                <td>
                  <q-badge color="emerald-9" text-color="emerald-3" class="px-2 py-0.5 font-bold" label="Aprovado" />
                </td>
                <td>
                  <router-link v-if="prod.auction_id" :to="`/auctions/${prod.auction_id}`" class="link-gold">
                    Leilão #{{ prod.auction_id }}
                  </router-link>
                  <span v-else class="text-muted">Sem leilão activo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: Sales Orders & Logistics -->
      <div v-if="activeTab === 'orders'" class="tab-content">
        <div v-if="myOrders.length === 0" class="empty-tab glass-panel">
          <ShoppingBag :size="40" class="text-muted" />
          <h4 class="font-bold text-lg">Nenhuma venda registada de momento</h4>
        </div>
        <div v-else class="glass-panel table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Lote / Produto</th>
                <th>Comprador</th>
                <th>Valor Total</th>
                <th>Estado Pagamento</th>
                <th>Rastreio de Envio</th>
                <th>Acção</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ord in myOrders" :key="ord.id">
                <td>#{{ ord.id }}</td>
                <td class="prod-title">{{ ord.title }}</td>
                <td>
                  <div>{{ ord.buyer_name }}</div>
                  <div class="text-muted" style="font-size: 0.72rem;">{{ ord.buyer_phone }}</div>
                </td>
                <td class="money-cell text-gold">{{ formatMoney(ord.total_amount) }}</td>
                <td>
                  <q-badge v-if="ord.status === 'paid'" color="emerald-9" text-color="emerald-3" class="px-2 py-0.5 font-bold" label="Pago" />
                  <q-badge v-else color="amber-9" text-color="amber-2" class="px-2 py-0.5 font-bold" label="Pendente" />
                </td>
                <td>
                  <span class="tracking-pill">{{ ord.tracking_number || 'A aguardar código' }}</span>
                </td>
                <td>
                  <q-btn
                    v-if="ord.delivery_status !== 'delivered'"
                    outline
                    dense
                    no-caps
                    size="sm"
                    color="primary"
                    icon="local_shipping"
                    label="Despachar"
                    class="px-2.5 py-1"
                    @click="openShipModal(ord)"
                  />
                  <q-badge v-else color="emerald-9" text-color="emerald-3" label="Entregue" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5-STEP GUIDED AUCTION WIZARD MODAL (NATIVE QUASAR DIALOG) -->
      <q-dialog v-model="showWizardModal" persistent :maximized="$q.screen.xs">
        <q-card class="wizard-modal glass-panel bg-[#141414] border border-primary/30 rounded-2xl overflow-hidden shadow-2xl text-white w-full max-w-2xl" flat>
          <!-- Wizard Header -->
          <div class="wizard-header flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#0f0f0f]">
            <div>
              <h3 class="font-bold text-lg text-white">Criar e Publicar Novo Leilão</h3>
              <span class="step-counter-text text-xs text-primary font-bold">Passo {{ currentStep }} de 5: {{ stepTitles[currentStep - 1] }}</span>
            </div>
            <q-btn flat round dense icon="close" @click="closeWizard" />
          </div>

          <!-- Stepper Progress Bar -->
          <div class="wizard-progress-bar flex justify-between p-3 bg-[#0a0a0a] border-b border-white/[0.08]">
            <div
              v-for="step in 5"
              :key="step"
              :class="['step-pip', { active: step <= currentStep, current: step === currentStep }]"
            >
              <span>{{ step }}</span>
            </div>
          </div>

          <div class="wizard-body p-4 sm:p-6 max-h-[65vh] overflow-y-auto">
            <!-- STEP 1: Product Information -->
            <div v-if="currentStep === 1" class="step-view flex flex-col gap-3">
              <div>
                <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Título do Produto / Lote *</label>
                <q-input
                  v-model="wizard.title"
                  dark
                  filled
                  dense
                  color="primary"
                  placeholder="Ex: Toyota Land Cruiser 300 ZX V8 Twin-Turbo 2023"
                  class="text-white"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Categoria *</label>
                  <q-select
                    v-model="wizard.categoryId"
                    :options="categoryOptions"
                    dark
                    filled
                    dense
                    emit-value
                    map-options
                    color="primary"
                  />
                </div>
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Condição *</label>
                  <q-select
                    v-model="wizard.condition"
                    :options="conditionOptions"
                    dark
                    filled
                    dense
                    emit-value
                    map-options
                    color="primary"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Marca</label>
                  <q-input v-model="wizard.brand" dark filled dense color="primary" placeholder="Ex: Toyota, BMW" />
                </div>
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Modelo</label>
                  <q-input v-model="wizard.model" dark filled dense color="primary" placeholder="Ex: Land Cruiser" />
                </div>
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Ano</label>
                  <q-input v-model.number="wizard.year" dark filled dense color="primary" type="number" placeholder="2023" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Província *</label>
                  <q-select
                    v-model="wizard.locationProvince"
                    :options="provinceOptions"
                    dark
                    filled
                    dense
                    emit-value
                    map-options
                    color="primary"
                  />
                </div>
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Cidade / Bairro</label>
                  <q-input v-model="wizard.locationCity" dark filled dense color="primary" placeholder="Ex: Sommerschield, Maputo" />
                </div>
              </div>

              <div>
                <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Descrição Editorial Completa *</label>
                <q-input
                  v-model="wizard.description"
                  dark
                  filled
                  color="primary"
                  type="textarea"
                  rows="3"
                  placeholder="Descreva o histórico, documentação, opcionais e estado geral..."
                />
              </div>
            </div>

            <!-- STEP 2: Product Photographs -->
            <div v-if="currentStep === 2" class="step-view flex flex-col gap-3">
              <p class="text-xs text-on-surface-variant">
                Insira o URL de imagens em alta resolução do produto ou seleccione das sugestões automotivas.
              </p>

              <div>
                <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">URL da Fotografia Principal *</label>
                <q-input
                  v-model="wizard.imageUrl1"
                  dark
                  filled
                  dense
                  color="primary"
                  placeholder="/images/products/land-cruiser-300.jpg ou URL"
                />
              </div>

              <div>
                <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">URL da Fotografia Secundária (Opcional)</label>
                <q-input
                  v-model="wizard.imageUrl2"
                  dark
                  filled
                  dense
                  color="primary"
                  placeholder="/images/products/porsche-911-gt3rs.jpg ou URL"
                />
              </div>

              <!-- Preset Image Pickers -->
              <div class="mt-2">
                <span class="text-xs text-on-surface-variant block mb-2 font-bold">Sugestões de Alta Qualidade:</span>
                <div class="flex gap-2 flex-wrap">
                  <img
                    v-for="(img, idx) in presetImages"
                    :key="idx"
                    :src="img"
                    alt=""
                    class="w-20 h-14 rounded-lg object-cover cursor-pointer border-2 transition-all hover:scale-105"
                    :class="wizard.imageUrl1 === img ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'"
                    @click="wizard.imageUrl1 = img"
                  />
                </div>
              </div>
            </div>

            <!-- STEP 3: Auction Parameters -->
            <div v-if="currentStep === 3" class="step-view flex flex-col gap-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Preço Inicial (MZN) *</label>
                  <q-input
                    v-model.number="wizard.startingPriceMt"
                    dark
                    filled
                    dense
                    color="primary"
                    type="number"
                    prefix="MZN"
                  />
                </div>
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Preço de Reserva (Opcional)</label>
                  <q-input
                    v-model.number="wizard.reservePriceMt"
                    dark
                    filled
                    dense
                    color="primary"
                    type="number"
                    prefix="MZN"
                    placeholder="Confidencial"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Incremento Mínimo (MZN) *</label>
                  <q-input
                    v-model.number="wizard.bidIncrementMt"
                    dark
                    filled
                    dense
                    color="primary"
                    type="number"
                    prefix="MZN"
                  />
                </div>
                <div>
                  <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Duração do Leilão *</label>
                  <q-select
                    v-model="wizard.durationDays"
                    :options="durationOptions"
                    dark
                    filled
                    dense
                    emit-value
                    map-options
                    color="primary"
                  />
                </div>
              </div>
            </div>

            <!-- STEP 4: Conditions & Delivery -->
            <div v-if="currentStep === 4" class="step-view flex flex-col gap-3">
              <div class="guar-info-box p-3 rounded-lg bg-primary/10 border border-primary/30 flex items-start gap-3">
                <ShieldCheck :size="24" class="text-gold shrink-0 mt-0.5" />
                <div class="text-xs">
                  <strong class="text-primary block font-bold mb-0.5">Compromisso de Veracidade MozBid</strong>
                  <p class="text-on-surface-variant m-0">Ao submeter este anúncio, declara que o bem é de proveniência lícita e que possui toda a documentação legal moçambicana correspondente.</p>
                </div>
              </div>

              <div>
                <label class="form-label text-xs uppercase font-bold text-on-surface-variant mb-1 block">Condições de Entrega ou Levantamento</label>
                <q-input
                  v-model="wizard.deliveryTerms"
                  dark
                  filled
                  color="primary"
                  type="textarea"
                  rows="3"
                  placeholder="Ex: Levantamento em armazém em Maputo ou envio via transportadora nacional..."
                />
              </div>
            </div>

            <!-- STEP 5: Review & Confirm -->
            <div v-if="currentStep === 5" class="step-view flex flex-col gap-3">
              <q-card class="bg-[#0d0d0d] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-2 text-sm" flat>
                <div class="flex justify-between"><span class="text-on-surface-variant">Título:</span><strong class="text-right">{{ wizard.title }}</strong></div>
                <div class="flex justify-between"><span class="text-on-surface-variant">Preço Inicial:</span><strong class="text-primary">{{ Number(wizard.startingPriceMt).toLocaleString('pt-MZ') }} MT</strong></div>
                <div class="flex justify-between"><span class="text-on-surface-variant">Incremento Mínimo:</span><strong>{{ Number(wizard.bidIncrementMt).toLocaleString('pt-MZ') }} MT</strong></div>
                <div class="flex justify-between"><span class="text-on-surface-variant">Duração:</span><strong>{{ wizard.durationDays }} Dias</strong></div>
                <div class="flex justify-between"><span class="text-on-surface-variant">Localização:</span><strong>{{ wizard.locationCity }}, {{ wizard.locationProvince }}</strong></div>
              </q-card>

              <p class="text-xs text-center text-on-surface-variant/80 mt-1">
                O leilão será publicado imediatamente na plataforma e estará aberto a licitações em tempo real.
              </p>
            </div>
          </div>

          <!-- Wizard Footer -->
          <div class="wizard-footer p-4 border-t border-white/[0.08] bg-[#0f0f0f] flex items-center justify-between">
            <q-btn v-if="currentStep > 1" outline color="white" label="Anterior" @click="currentStep--" />
            <q-space />
            <q-btn
              v-if="currentStep < 5"
              unelevated
              no-caps
              color="primary"
              text-color="dark"
              icon-right="chevron_right"
              label="Seguinte"
              class="font-bold text-xs px-5 py-2"
              @click="nextStep"
            />
            <q-btn
              v-else
              unelevated
              no-caps
              color="primary"
              text-color="dark"
              :loading="isPublishing"
              label="Publicar Leilão Agora"
              class="font-bold text-xs px-6 py-2 shimmer-gold active-press"
              @click="submitAuction"
            />
          </div>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import api from '../../services/api';
import { useAuctionStore } from '../../stores/auction';
import { useNotificationStore } from '../../stores/notification';
import { formatMoney } from '../../utils/money';
import { formatDateTime } from '../../utils/date';
import {
  Gavel, DollarSign, Users, Star, Plus, Package,
  ShoppingBag, Truck, X, ChevronRight, ShieldCheck
} from 'lucide-vue-next';

const $q = useQuasar();
const auctionStore = useAuctionStore();
const notifStore = useNotificationStore();

const activeTab = ref<'auctions' | 'products' | 'orders'>('auctions');
const dashboardData = ref<any>(null);
const myAuctions = ref<any[]>([]);
const myProducts = ref<any[]>([]);
const myOrders = ref<any[]>([]);

const showWizardModal = ref(false);
const currentStep = ref(1);
const isPublishing = ref(false);

const stepTitles = [
  'Informações do Produto',
  'Fotografias do Lote',
  'Configuração do Leilão',
  'Condições de Entrega',
  'Revisão e Confirmação'
];

const presetImages = [
  '/images/products/porsche-911-gt3rs.jpg',
  '/images/products/bmw-m4-competition.jpg',
  '/images/products/land-cruiser-300.jpg',
  '/images/products/cat-320-excavator.jpg',
  '/images/products/cummins-generator.jpg',
  '/images/products/rolex-submariner.jpg'
];

const categoryOptions = computed(() => [
  ...auctionStore.categories.map(c => ({ label: c.name, value: c.id }))
]);

const conditionOptions = [
  { label: 'Novo em Caixa (0 km/h)', value: 'new' },
  { label: 'Usado — Como Novo', value: 'used_like_new' },
  { label: 'Usado — Bom Estado', value: 'used_good' },
  { label: 'Recondicionado Certificado', value: 'refurbished' }
];

const provinceOptions = [
  { label: 'Maputo Cidade', value: 'Maputo Cidade' },
  { label: 'Matola / Maputo Província', value: 'Maputo Província' },
  { label: 'Beira / Sofala', value: 'Sofala' },
  { label: 'Nampula', value: 'Nampula' },
  { label: 'Tete / Moatize', value: 'Tete' },
  { label: 'Cabo Delgado', value: 'Cabo Delgado' }
];

const durationOptions = [
  { label: '3 Dias (Leilão Rápido)', value: 3 },
  { label: '5 Dias', value: 5 },
  { label: '7 Dias (Recomendado)', value: 7 },
  { label: '14 Dias (Maquinaria Pesada)', value: 14 }
];

const wizard = ref({
  title: '',
  categoryId: 1,
  condition: 'used_like_new',
  brand: '',
  model: '',
  year: 2023,
  locationProvince: 'Maputo Cidade',
  locationCity: 'Maputo',
  description: '',
  imageUrl1: presetImages[0],
  imageUrl2: '',
  startingPriceMt: 2500000,
  reservePriceMt: '',
  bidIncrementMt: 25000,
  durationDays: 7,
  deliveryTerms: 'Levantamento no estaleiro em Maputo ou despacho via transportadora com escolta.'
});

const defaultImg = '/images/products/porsche-911-gt3rs.jpg';

async function fetchSellerDashboard() {
  try {
    const [dashRes, aucRes, prodRes, ordRes] = await Promise.all([
      api.get('/seller/dashboard'),
      api.get('/seller/auctions'),
      api.get('/seller/products'),
      api.get('/seller/orders')
    ]);

    dashboardData.value = dashRes.data;
    myAuctions.value = aucRes.data;
    myProducts.value = prodRes.data;
    myOrders.value = ordRes.data;
  } catch (err) {
    console.error('Error loading seller dashboard:', err);
  }
}

function openWizard() {
  currentStep.value = 1;
  showWizardModal.value = true;
}

function closeWizard() {
  showWizardModal.value = false;
}

function nextStep() {
  if (currentStep.value === 1 && !wizard.value.title.trim()) {
    alert('Por favor, indique o título do produto.');
    return;
  }
  if (currentStep.value === 3 && (!wizard.value.startingPriceMt || wizard.value.startingPriceMt <= 0)) {
    alert('Por favor, indique um preço inicial válido.');
    return;
  }
  if (currentStep.value < 5) {
    currentStep.value++;
  }
}

async function submitAuction() {
  isPublishing.value = true;
  try {
    const images = [wizard.value.imageUrl1];
    if (wizard.value.imageUrl2) images.push(wizard.value.imageUrl2);

    await api.post('/seller/auctions', {
      title: wizard.value.title,
      description: wizard.value.description,
      categoryId: wizard.value.categoryId,
      brand: wizard.value.brand,
      model: wizard.value.model,
      year: wizard.value.year,
      condition: wizard.value.condition,
      locationProvince: wizard.value.locationProvince,
      locationCity: wizard.value.locationCity,
      images,
      startingPrice: wizard.value.startingPriceMt * 100, // centavos
      reservePrice: wizard.value.reservePriceMt ? Number(wizard.value.reservePriceMt) * 100 : null,
      bidIncrement: wizard.value.bidIncrementMt * 100,
      durationDays: wizard.value.durationDays
    });

    notifStore.addToast('Sucesso!', 'O seu leilão foi criado e publicado com sucesso no MozBid.', 'success');
    closeWizard();
    fetchSellerDashboard();
  } catch (err: any) {
    notifStore.addToast('Erro ao Publicar', err.response?.data?.message || 'Falha ao criar leilão', 'error');
  } finally {
    isPublishing.value = false;
  }
}

function openShipModal(order: any) {
  const code = prompt('Introduza o código de rastreio de envio:', `MZB-EXP-${Math.floor(100000 + Math.random() * 900000)}`);
  if (code) {
    api.patch(`/seller/orders/${order.id}/status`, {
      status: 'shipped',
      trackingNumber: code,
      carrier: 'MozBid Express Logistics'
    }).then(() => {
      notifStore.addToast('Envio Registado', `Código ${code} associado à encomenda.`, 'success');
      fetchSellerDashboard();
    });
  }
}

onMounted(() => {
  auctionStore.fetchCategories();
  fetchSellerDashboard();
});
</script>

<style scoped>
.seller-dashboard {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.publish-banner {
  padding: 24px 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: linear-gradient(135deg, rgba(255, 195, 116, 0.08) 0%, rgba(20, 20, 20, 0.8) 100%);
  border: 1px solid rgba(255, 195, 116, 0.3);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}

.data-table th {
  padding: 14px 16px;
  font-size: 0.72rem;
  text-transform: uppercase;
  color: #a8a8a8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-thumb {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}

.prod-title {
  font-weight: 600;
  display: block;
}

.prod-sub {
  font-size: 0.75rem;
  color: #a8a8a8;
}

.text-gold {
  color: #ffc374;
}

.link-gold {
  color: #ffc374;
  text-decoration: none;
}

.link-gold:hover {
  text-decoration: underline;
}

.step-pip {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1c1c1c;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a8a8a8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.step-pip.active {
  background: rgba(255, 195, 116, 0.15);
  color: #ffc374;
  border-color: #ffc374;
}

.step-pip.current {
  background: #ffc374;
  color: #121212;
  border-color: #ffc374;
  box-shadow: 0 0 12px rgba(255, 195, 116, 0.5);
}

.empty-tab {
  padding: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border-radius: 16px;
}
</style>
