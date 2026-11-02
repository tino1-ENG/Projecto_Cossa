import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import PublicLayout from '../layouts/PublicLayout.vue';
import AuthenticationLayout from '../layouts/AuthenticationLayout.vue';
import BuyerLayout from '../layouts/BuyerLayout.vue';
import SellerLayout from '../layouts/SellerLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

import HomePage from '../pages/public/HomePage.vue';
import CatalogPage from '../pages/public/CatalogPage.vue';
import AuctionDetailsPage from '../pages/public/AuctionDetailsPage.vue';
import HowItWorksPage from '../pages/public/HowItWorksPage.vue';

import LoginPage from '../pages/auth/LoginPage.vue';
import RegisterPage from '../pages/auth/RegisterPage.vue';

import BuyerDashboard from '../pages/buyer/BuyerDashboard.vue';
import SellerDashboard from '../pages/seller/SellerDashboard.vue';
import AdminDashboard from '../pages/admin/AdminDashboard.vue';

const routes: RouteRecordRaw[] = [
  // Public Routes
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
      { path: 'catalog', name: 'catalog', component: CatalogPage },
      { path: 'auctions/:id', name: 'auction-details', component: AuctionDetailsPage },
      { path: 'auction/:id', redirect: to => `/auctions/${to.params.id}` },
      { path: 'how-it-works', name: 'how-it-works', component: HowItWorksPage }
    ]
  },

  // Authentication Routes
  {
    path: '/auth',
    component: AuthenticationLayout,
    children: [
      { path: 'login', name: 'login', component: LoginPage },
      { path: 'register', name: 'register', component: RegisterPage }
    ]
  },

  // Buyer Dashboard (Protected)
  {
    path: '/buyer',
    component: BuyerLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'buyer-dashboard', component: BuyerDashboard }
    ]
  },

  // Seller Dashboard (Protected: Seller or Admin)
  {
    path: '/seller',
    component: SellerLayout,
    meta: { requiresAuth: true, requiresSeller: true },
    children: [
      { path: 'dashboard', name: 'seller-dashboard', component: SellerDashboard }
    ]
  },

  // Admin Dashboard (Protected: Admin)
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboard }
    ]
  },

  // Catch-all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation Guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    await authStore.fetchCurrentUser();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.requiresSeller && !authStore.isSeller && !authStore.isAdmin) {
    next({ name: 'buyer-dashboard' });
    return;
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'buyer-dashboard' });
    return;
  }

  next();
});

export default router;
