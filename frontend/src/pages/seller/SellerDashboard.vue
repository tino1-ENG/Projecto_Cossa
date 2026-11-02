<template>
  <div class="seller-dashboard">
    <!-- Seller KPIs Row -->
    <div class="kpi-grid">
      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box">
          <Gavel :size="20" class="text-gold" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Leilões Activos</span>
          <div class="kpi-value text-gold">{{ dashboardData?.metrics?.activeAuctions || 0 }}</div>
        </div>
      </div>

      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box sales-icon">
          <DollarSign :size="20" class="text-green-400" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Volume Total de Vendas</span>
          <div class="kpi-value text-green-400">{{ formatMoney(dashboardData?.metrics?.totalSalesRevenue) }}</div>
        </div>
      </div>

      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box">
          <Users :size="20" class="text-gold" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Licitações Recebidas</span>
          <div class="kpi-value">{{ dashboardData?.metrics?.totalBidsReceived || 0 }}</div>
        </div>
      </div>

      <div class="card-luxury kpi-card">
        <div class="kpi-icon-box rating-icon">
          <Star :size="20" class="text-gold" fill="#F5A000" />
        </div>
        <div class="kpi-data">
          <span class="kpi-label">Avaliação do Vendedor</span>
          <div class="kpi-value">{{ dashboardData?.metrics?.rating || 4.96 }} / 5.0</div>
        </div>
      </div>
    </div>

    <!-- Quick Action Banner -->
    <div class="glass-panel publish-banner">
      <div class="publish-banner-text">
        <h3>Pretende Publicar um Novo Lote de Leilão?</h3>
        <p>Utilize o nosso assistente passo-a-passo para publicar automóveis, equipamento industrial ou tecnologia.</p>
      </div>
      <button class="btn btn-primary btn-lg" @click="openWizard">
        <Plus :size="18" /> Publicar Novo Leilão
      </button>
    </div>

    <!-- Dashboard Tabs -->
    <div class="dashboard-tabs-bar">
      <button
        :class="['dash-tab', { active: activeTab === 'auctions' }]"
        @click="activeTab = 'auctions'"
      >
        <Gavel :size="16" /> Meus Leilões ({{ myAuctions.length }})
      </button>
      <button
        :class="['dash-tab', { active: activeTab === 'products' }]"
        @click="activeTab = 'products'"
      >
        <Package :size="16" /> Meus Produtos ({{ myProducts.length }})
      </button>
      <button
        :class="['dash-tab', { active: activeTab === 'orders' }]"
        @click="activeTab = 'orders'"
      >
        <ShoppingBag :size="16" /> Gestão de Vendas & Envios ({{ myOrders.length }})
      </button>
    </div>

    <!-- TAB 1: My Auctions -->
    <div v-if="activeTab === 'auctions'" class="tab-content">
      <div v-if="myAuctions.length === 0" class="empty-tab glass-panel">
        <Gavel :size="40" class="text-muted" />
        <h4>Ainda não tem leilões criados</h4>
        <p>Clique em "Publicar Novo Leilão" para começar a receber lances em tempo real.</p>
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
                <span v-if="auc.status === 'active'" class="badge badge-active">Activo</span>
                <span v-else class="badge badge-ended">{{ auc.status }}</span>
              </td>
              <td>{{ formatDateTime(auc.ends_at) }}</td>
              <td>
                <router-link :to="`/auctions/${auc.id}`" class="btn btn-sm btn-secondary">
                  Acompanhar
                </router-link>
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
                <span class="badge badge-active">Aprovado</span>
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
        <h4>Nenhuma venda registada de momento</h4>
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
              <th>Actualizar Envio</th>
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
                <span v-if="ord.status === 'paid'" class="badge badge-active">Pago</span>
                <span v-else class="badge badge-urgent">Pendente</span>
              </td>
              <td>
                <span class="tracking-pill">{{ ord.tracking_number || 'A aguardar código' }}</span>
              </td>
              <td>
                <button
                  v-if="ord.delivery_status !== 'delivered'"
                  class="btn btn-sm btn-outline"
                  @click="openShipModal(ord)"
                >
                  <Truck :size="14" /> Despachar
                </button>
                <span v-else class="badge badge-active">Entregue</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 5-STEP GUIDED AUCTION WIZARD MODAL -->
    <div v-if="showWizardModal" class="modal-backdrop" @click="closeWizard">
      <div class="wizard-modal glass-panel" @click.stop>
        <!-- Wizard Header & Steps Stepper -->
        <div class="wizard-header">
          <div>
            <h3>Criar e Publicar Novo Leilão</h3>
            <span class="step-counter-text">Passo {{ currentStep }} de 5: {{ stepTitles[currentStep - 1] }}</span>
          </div>
          <button class="modal-close-btn" @click="closeWizard"><X :size="20" /></button>
        </div>

        <!-- Stepper Progress Bar -->
        <div class="wizard-progress-bar">
          <div
            v-for="step in 5"
            :key="step"
            :class="['step-pip', { active: step <= currentStep, current: step === currentStep }]"
          >
            <span>{{ step }}</span>
          </div>
        </div>

        <div class="wizard-body">
          <!-- STEP 1: Product Information -->
          <div v-if="currentStep === 1" class="step-view">
            <div class="form-group">
              <label class="form-label">Título do Produto / Lote *</label>
              <input
                v-model="wizard.title"
                type="text"
                required
                placeholder="Ex: Toyota Land Cruiser 300 ZX V8 Twin-Turbo 2023"
                class="form-input"
              />
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Categoria *</label>
                <select v-model="wizard.categoryId" class="form-select" required>
                  <option v-for="cat in auctionStore.categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Condição *</label>
                <select v-model="wizard.condition" class="form-select">
                  <option value="new">Novo em Caixa (0 km/h)</option>
                  <option value="used_like_new">Usado — Como Novo</option>
                  <option value="used_good">Usado — Bom Estado</option>
                  <option value="refurbished">Recondicionado Certificado</option>
                </select>
              </div>
            </div>

            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label">Marca</label>
                <input v-model="wizard.brand" type="text" placeholder="Ex: Toyota, BMW, CAT..." class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Modelo</label>
                <input v-model="wizard.model" type="text" placeholder="Ex: Land Cruiser, M4..." class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Ano</label>
                <input v-model="wizard.year" type="number" placeholder="2023" class="form-input" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Província de Localização *</label>
                <select v-model="wizard.locationProvince" class="form-select">
                  <option value="Maputo Cidade">Maputo Cidade</option>
                  <option value="Maputo Província">Maputo Província (Matola)</option>
                  <option value="Sofala">Sofala (Beira)</option>
                  <option value="Nampula">Nampula</option>
                  <option value="Tete">Tete (Moatize)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Cidade / Bairro</label>
                <input v-model="wizard.locationCity" type="text" placeholder="Ex: Sommerschield, Maputo" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Descrição Editorial Completa *</label>
              <textarea
                v-model="wizard.description"
                rows="4"
                placeholder="Descreva o histórico de manutenção, opcionais, livrete e estado geral do bem..."
                class="form-textarea"
              ></textarea>
            </div>
          </div>

          <!-- STEP 2: Product Photographs -->
          <div v-if="currentStep === 2" class="step-view">
            <p class="step-hint">
              Insira o URL de imagens em alta resolução do produto ou seleccione das sugestões automotivas.
            </p>

            <div class="form-group">
              <label class="form-label">URL da Fotografia Principal</label>
              <input
                v-model="wizard.imageUrl1"
                type="text"
                placeholder="/images/products/land-cruiser-300.jpg ou URL"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">URL da Fotografia Secundária (Opcional)</label>
              <input
                v-model="wizard.imageUrl2"
                type="text"
                placeholder="/images/products/porsche-911-gt3rs.jpg ou URL"
                class="form-input"
              />
            </div>

            <!-- Quick Preset Image Pickers -->
            <div class="preset-pickers-box">
              <span class="preset-pickers-title">Sugestões de Alta Qualidade:</span>
              <div class="preset-thumbs-row">
                <img
                  v-for="(img, idx) in presetImages"
                  :key="idx"
                  :src="img"
                  alt=""
                  class="preset-thumb-opt"
                  @click="wizard.imageUrl1 = img"
                />
              </div>
            </div>
          </div>

          <!-- STEP 3: Auction Parameters -->
          <div v-if="currentStep === 3" class="step-view">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Preço Inicial (Meticais MZN) *</label>
                <input
                  v-model="wizard.startingPriceMt"
                  type="number"
                  placeholder="Ex: 2500000"
                  class="form-input"
                />
                <span class="field-hint">Valor do primeiro lance para iniciar a disputa.</span>
              </div>

              <div class="form-group">
                <label class="form-label">Preço de Reserva Confidencial (Opcional)</label>
                <input
                  v-model="wizard.reservePriceMt"
                  type="number"
                  placeholder="Ex: 2800000"
                  class="form-input"
                />
                <span class="field-hint">Mínimo para venda automática. Não é revelado aos licitadores.</span>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Incremento Mínimo por Lance (MZN) *</label>
                <input
                  v-model="wizard.bidIncrementMt"
                  type="number"
                  placeholder="Ex: 25000"
                  class="form-input"
                />
                <span class="field-hint">Aumento obrigatório entre ofertas consecutivas.</span>
              </div>

              <div class="form-group">
                <label class="form-label">Duração do Leilão *</label>
                <select v-model="wizard.durationDays" class="form-select">
                  <option :value="3">3 Dias (Leilão Rápido)</option>
                  <option :value="5">5 Dias</option>
                  <option :value="7">7 Dias (Recomendado)</option>
                  <option :value="14">14 Dias (Maquinaria Pesada)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- STEP 4: Delivery and Inspection Conditions -->
          <div v-if="currentStep === 4" class="step-view">
            <div class="guar-info-box">
              <ShieldCheck :size="24" class="text-gold" />
              <div>
                <strong>Compromisso de Veracidade MozBid</strong>
                <p>Ao submeter este anúncio, declara que o bem é de proveniência lícita e que possui toda a documentação legal moçambicana correspondente.</p>
              </div>
            </div>

            <div class="form-group mt-3">
              <label class="form-label">Condições de Entrega ou Levantamento</label>
              <textarea
                v-model="wizard.deliveryTerms"
                rows="3"
                placeholder="Ex: Levantamento em armazém em Maputo ou envio via transportadora nacional com custos a cargo do comprador."
                class="form-textarea"
              ></textarea>
            </div>
          </div>

          <!-- STEP 5: Review & Confirm Submission -->
          <div v-if="currentStep === 5" class="step-view">
            <div class="review-box">
              <div class="review-row">
                <span class="review-k">Título:</span>
                <strong class="review-v">{{ wizard.title }}</strong>
              </div>
              <div class="review-row">
                <span class="review-k">Preço Inicial:</span>
                <strong class="review-v text-gold">{{ Number(wizard.startingPriceMt).toLocaleString('pt-MZ') }} MT</strong>
              </div>
              <div class="review-row">
                <span class="review-k">Incremento Mínimo:</span>
                <strong class="review-v">{{ Number(wizard.bidIncrementMt).toLocaleString('pt-MZ') }} MT</strong>
              </div>
              <div class="review-row">
                <span class="review-k">Duração:</span>
                <strong class="review-v">{{ wizard.durationDays }} Dias</strong>
              </div>
              <div class="review-row">
                <span class="review-k">Localização:</span>
                <strong class="review-v">{{ wizard.locationCity }}, {{ wizard.locationProvince }}</strong>
              </div>
            </div>

            <p class="final-publish-notice">
              O leilão será publicado imediatamente na plataforma e estará aberto a licitações em tempo real.
            </p>
          </div>
        </div>

        <!-- Wizard Navigation Footer -->
        <div class="wizard-footer">
          <button v-if="currentStep > 1" class="btn btn-secondary" @click="currentStep--">
            Anterior
          </button>
          <div style="flex: 1;"></div>
          <button v-if="currentStep < 5" class="btn btn-primary" @click="nextStep">
            Seguinte <ChevronRight :size="16" />
          </button>
          <button v-else class="btn btn-primary" :disabled="isPublishing" @click="submitAuction">
            <span v-if="isPublishing">A publicar leilão...</span>
            <span v-else>Publicar Leilão Agora</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import { useAuctionStore } from '../../stores/auction';
import { useNotificationStore } from '../../stores/notification';
import { formatMoney } from '../../utils/money';
import { formatDateTime } from '../../utils/date';
import {
  Gavel, DollarSign, Users, Star, Plus, Package,
  ShoppingBag, Truck, X, ChevronRight, ShieldCheck
} from 'lucide-vue-next';

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
  if (currentStep.value === 1 && !wizard.value.title) {
    notifStore.addToast('Campo Obrigatório', 'Por favor indique o título do produto.', 'warning');
    return;
  }
  currentStep.value++;
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

@media (max-width: 520px) {
  .kpi-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.kpi-card {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.kpi-icon-box {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: rgba(245, 160, 0, 0.1);
  border: 1px solid var(--color-border-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sales-icon {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.rating-icon {
  background: rgba(245, 160, 0, 0.15);
}

.kpi-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 2px;
}

.kpi-value {
  font-family: var(--font-family-display);
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
}

.publish-banner {
  padding: 24px 32px;
  border: 1px solid var(--color-border-gold);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.publish-banner-text h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.publish-banner-text p {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.dashboard-tabs-bar {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
  overflow-x: auto;
}

.dash-tab {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.dash-tab:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.dash-tab.active {
  background: rgba(245, 160, 0, 0.12);
  color: var(--color-primary);
  border: 1px solid var(--color-border-gold);
}

.empty-tab {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
}

.data-table {
  width: 100%;
  min-width: 580px;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  padding: 14px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.88rem;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.table-prod-info {
  display: flex;
  flex-direction: column;
}

.prod-title {
  font-weight: 700;
  color: #ffffff;
}

.prod-sub {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.money-cell {
  font-family: var(--font-family-display);
  font-weight: 700;
}

.tracking-pill {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  font-family: monospace;
}

/* Wizard Modal & Form Styling */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.wizard-modal {
  width: 100%;
  max-width: 720px;
  background: #141414;
  border: 1px solid rgba(245, 160, 0, 0.35);
  border-radius: 16px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.95), 0 0 32px rgba(245, 160, 0, 0.1);
  color: #e5e2e1;
}

.wizard-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #0f0f0f;
}

.wizard-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 2px;
  color: #ffffff;
}

.step-counter-text {
  font-size: 0.8rem;
  color: #ffc374;
  font-weight: 600;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: #9e9e9e;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.wizard-progress-bar {
  display: flex;
  justify-content: space-between;
  padding: 14px 24px;
  background: #0a0a0a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
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
  transition: all 0.2s ease;
}

.step-pip.active {
  background: rgba(245, 160, 0, 0.15);
  color: #ffc374;
  border-color: #ffc374;
}

.step-pip.current {
  background: #ffc374;
  color: #121212;
  border-color: #ffc374;
  box-shadow: 0 0 12px rgba(255, 195, 116, 0.5);
}

.wizard-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.step-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.form-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #d8c3ad;
  display: block;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  display: block;
  background-color: #1c1b1b;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  padding: 11px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 0.92rem;
  line-height: 1.4;
  outline: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(216, 195, 173, 0.45);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #ffc374;
  background-color: #242222;
  box-shadow: 0 0 0 2px rgba(255, 195, 116, 0.25);
}

.form-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffc374'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 36px;
  cursor: pointer;
}

.form-select option {
  background-color: #1c1b1b;
  color: #ffffff;
  padding: 8px 12px;
}

.form-textarea {
  resize: vertical;
  min-height: 96px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
}

@media (max-width: 640px) {
  .form-grid-2,
  .form-grid-3 {
    grid-template-columns: 1fr;
  }
}

.field-hint {
  font-size: 0.72rem;
  color: #a8a8a8;
  margin-top: 4px;
  display: block;
}

.preset-pickers-box {
  margin-top: 16px;
}

.preset-pickers-title {
  display: block;
  font-size: 0.75rem;
  color: #a8a8a8;
  margin-bottom: 8px;
}

.preset-thumbs-row {
  display: flex;
  gap: 10px;
}

.preset-thumb-opt {
  width: 90px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.preset-thumb-opt:hover {
  border-color: #ffc374;
  transform: scale(1.05);
}

.guar-info-box {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: rgba(245, 160, 0, 0.08);
  border: 1px solid rgba(245, 160, 0, 0.3);
  border-radius: 10px;
  font-size: 0.85rem;
}

.review-box {
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.review-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
}

.review-k {
  color: #a8a8a8;
}

.final-publish-notice {
  font-size: 0.82rem;
  color: #c2b1a0;
  margin-top: 16px;
  text-align: center;
}

.wizard-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f0f0f;
}
</style>
