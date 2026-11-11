import { defineStore } from 'pinia';
import api from '../services/api';
import socketService from '../services/socket';
import { useNotificationStore } from './notification';
import type { Auction, Category } from '../types';

interface AuctionFilters {
  search?: string;
  category?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const useAuctionStore = defineStore('auction', {
  state: () => ({
    auctions: [] as Auction[],
    featuredAuctions: [] as Auction[],
    endingSoonAuctions: [] as Auction[],
    automotiveAuctions: [] as Auction[],
    currentAuction: null as Auction | null,
    categories: [] as Category[],
    total: 0,
    totalPages: 1,
    loading: false,
    filters: {
      search: '',
      category: 'all',
      province: 'all',
      status: 'active',
      sort: 'ending_soon',
      page: 1,
      limit: 12
    } as AuctionFilters,
    watchlistIds: new Set<number>()
  }),

  getters: {
    watchlist: (state) => Array.from(state.watchlistIds),
    activeAuctions: (state): Auction[] => state.auctions.filter(a => a.status === 'active')
  },

  actions: {
    async fetchWatchlist() {
      try {
        const res = await api.get('/buyer/watchlist');
        if (Array.isArray(res.data)) {
          this.watchlistIds = new Set(res.data.map((item: any) => item.auction_id || item.id));
        }
      } catch (err) {
        console.error('Error fetching watchlist:', err);
      }
    },
    async fetchCategories() {
      try {
        const res = await api.get('/categories');
        this.categories = res.data;
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    },

    async fetchAuctions(customFilters?: Partial<AuctionFilters>) {
      this.loading = true;
      try {
        const queryParams = { ...this.filters, ...customFilters };
        const res = await api.get('/auctions', { params: queryParams });
        this.auctions = res.data.items;
        this.total = res.data.total;
        this.totalPages = res.data.totalPages;

        // Populate watchlistIds
        res.data.items.forEach((item: Auction) => {
          if (item.is_watchlisted) {
            this.watchlistIds.add(item.id);
          }
        });
      } catch (err) {
        console.error('Error fetching auctions:', err);
      } finally {
        this.loading = false;
      }
    },

    async fetchFeatured() {
      await this.fetchHomepageAuctions();
    },

    async fetchEndingSoon() {
      await this.fetchHomepageAuctions();
    },

    async fetchHomepageAuctions() {
      try {
        // 1. Featured / active auctions
        const featRes = await api.get('/auctions', { params: { limit: 8, sort: 'ending_soon' } });
        this.featuredAuctions = featRes.data.items;

        // 2. Ending Soon (most urgent)
        const endingRes = await api.get('/auctions', { params: { limit: 4, sort: 'ending_soon' } });
        this.endingSoonAuctions = endingRes.data.items;

        // 3. Automotive category
        const autoRes = await api.get('/auctions', { params: { category: 'automoveis-motos', limit: 4 } });
        this.automotiveAuctions = autoRes.data.items;
      } catch (err) {
        console.error('Error fetching homepage collections:', err);
      }
    },

    async fetchAuctionById(id: number) {
      this.loading = true;
      try {
        const res = await api.get(`/auctions/${id}`);
        this.currentAuction = res.data;

        if (res.data.is_watchlisted) {
          this.watchlistIds.add(id);
        } else {
          this.watchlistIds.delete(id);
        }

        // Join real-time room for this auction
        socketService.joinAuction(id);

        return this.currentAuction;
      } catch (err: any) {
        console.error('Error fetching auction details:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    leaveAuctionRoom(id: number) {
      socketService.leaveAuction(id);
    },

    async placeBid(auctionId: number, amount: number) {
      const notifStore = useNotificationStore();
      try {
        const res = await api.post(`/auctions/${auctionId}/bids`, { amount });
        notifStore.addToast('Licitação Aceite!', 'A sua oferta foi validada e registada com sucesso.', 'success');
        
        // Refresh details
        await this.fetchAuctionById(auctionId);
        return res.data;
      } catch (err: any) {
        const msg = err.response?.data?.message || err.response?.data?.error || 'Erro ao processar licitação';
        notifStore.addToast('Licitação Recusada', msg, 'error');
        // Refresh auction to ensure frontend reflects authoritative server state
        await this.fetchAuctionById(auctionId);
        throw new Error(msg);
      }
    },

    async setAutoBid(auctionId: number, maxAmount: number) {
      const notifStore = useNotificationStore();
      try {
        await api.post(`/auctions/${auctionId}/automatic-bids`, { max_amount: maxAmount });
        notifStore.addToast('Licitação Automática Activa', 'O sistema licitará por si em incrementos mínimos até ao limite definido.', 'success');
        await this.fetchAuctionById(auctionId);
      } catch (err: any) {
        const msg = err.response?.data?.message || 'Erro ao configurar licitação automática';
        notifStore.addToast('Erro', msg, 'error');
        throw new Error(msg);
      }
    },

    async toggleWatchlist(auctionId: number) {
      const notifStore = useNotificationStore();
      const isCurrentlyWatchlisted = this.watchlistIds.has(auctionId);

      try {
        if (isCurrentlyWatchlisted) {
          await api.delete(`/buyer/watchlist/${auctionId}`);
          this.watchlistIds.delete(auctionId);
          notifStore.addToast('Favorito Removido', 'Leilão removido da sua lista de acompanhamento.', 'info');
        } else {
          await api.post(`/buyer/watchlist/${auctionId}`);
          this.watchlistIds.add(auctionId);
          notifStore.addToast('Guardado nos Favoritos', 'Receberá alertas sobre o encerramento deste leilão.', 'success');
        }

        if (this.currentAuction && this.currentAuction.id === auctionId) {
          this.currentAuction.is_watchlisted = !isCurrentlyWatchlisted;
        }
      } catch (err: any) {
        notifStore.addToast('Atenção', 'Inicie sessão para guardar leilões nos favoritos.', 'warning');
      }
    },

    initSocketListeners() {
      const notifStore = useNotificationStore();

      // Handle auction live updates
      socketService.on('auction.updated', (data: any) => {
        if (this.currentAuction && this.currentAuction.id === data.auctionId) {
          this.currentAuction.current_price = data.currentPrice;
          this.currentAuction.bid_count = data.bidCount;
          this.currentAuction.winner_id = data.winnerId;
          this.currentAuction.ends_at = data.endsAt;
          this.currentAuction.min_next_bid = data.minNextBid;
        }

        // Also update in lists
        const updateInList = (list: Auction[]) => {
          const item = list.find(a => a.id === data.auctionId);
          if (item) {
            item.current_price = data.currentPrice;
            item.bid_count = data.bidCount;
            item.ends_at = data.endsAt;
          }
        };

        updateInList(this.auctions);
        updateInList(this.featuredAuctions);
        updateInList(this.endingSoonAuctions);
      });

      // Handle extension (anti-sniping)
      socketService.on('auction.extended', (data: any) => {
        if (this.currentAuction && this.currentAuction.id === data.auctionId) {
          this.currentAuction.ends_at = data.newEndsAt;
          notifStore.addToast(
            'Tempo Prolongado!',
            'Uma licitação no minuto final activou a regra anti-sniping (+3 minutos).',
            'warning'
          );
        }
      });

      // Handle auction ended
      socketService.on('auction.ended', (data: any) => {
        if (this.currentAuction && this.currentAuction.id === data.auctionId) {
          this.currentAuction.status = data.auctionStatus || data.status || 'ended';
          if (data.winnerId) this.currentAuction.winner_id = data.winnerId;
          if (data.finalPrice) this.currentAuction.current_price = data.finalPrice;
        }

        const updateEnded = (list: Auction[]) => {
          const item = list.find(a => a.id === data.auctionId);
          if (item) {
            item.status = data.auctionStatus || data.status || 'ended';
            if (data.winnerId) item.winner_id = data.winnerId;
            if (data.finalPrice) item.current_price = data.finalPrice;
          }
        };

        updateEnded(this.auctions);
        updateEnded(this.featuredAuctions);
        updateEnded(this.endingSoonAuctions);
      });
    }
  }
});
