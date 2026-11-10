<template>
  <div class="auth-layout">
    <div class="auth-grid">
      <!-- Left Showcase Cinematic Side -->
      <div class="auth-visual-side hide-tablet">
        <div class="visual-overlay"></div>
        <img
          src="/images/products/porsche-911-gt3rs.jpg"
          alt="MozBid Automotive Showcase"
          class="auth-bg-img"
        />
        <div class="auth-visual-content">
          <router-link to="/" class="auth-logo">
            <div class="logo-box">
              <Gavel :size="20" />
            </div>
            <span class="auth-brand-text font-editorial tracking-wider">MOZ<span class="text-[#B69A68]">BID</span></span>
          </router-link>

          <div class="auth-hero-quote">
            <h2 class="quote-title font-editorial text-white">Activos extraordinários. Oportunidades exclusivas.</h2>
            <p class="quote-desc text-white/70">
              Participe em leilões em tempo real de frotas executivas, supercarros,
              alta relojoaria e maquinaria pesada com liquidação garantida em Meticais (MZN).
            </p>
          </div>

          <div class="auth-trust-badges">
            <div class="trust-pill">
              <ShieldCheck :size="15" class="text-[#B69A68]" />
              <span class="text-xs">Vendedores Verificados (NUIT)</span>
            </div>
            <div class="trust-pill">
              <Lock :size="15" class="text-[#B69A68]" />
              <span class="text-xs">Liquidação Segura M-Pesa & Bancária</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Form Side -->
      <div class="auth-form-side">
        <div class="auth-top-nav flex items-center justify-between">
          <router-link to="/" class="back-link group flex items-center gap-2 text-xs font-semibold text-[#666666] hover:text-[#171717] transition-colors">
            <ArrowLeft :size="16" class="transition-transform group-hover:-translate-x-1" />
            <span class="hidden sm:inline">Voltar ao Marketplace</span>
            <span class="sm:hidden">Início</span>
          </router-link>

          <!-- Mobile Only Brand Header -->
          <router-link to="/" class="flex sm:hidden items-center gap-2 no-underline">
            <div class="w-8 h-8 rounded-lg bg-[#171717] text-[#B69A68] flex items-center justify-center font-bold shadow-xs">
              <Gavel :size="16" />
            </div>
            <span class="font-editorial font-bold text-[#171717] text-lg tracking-wider">MOZ<span class="text-[#B69A68]">BID</span></span>
          </router-link>
        </div>

        <div class="auth-form-container">
          <router-view />
        </div>

        <div class="auth-form-footer text-xs text-[#888888] text-center pt-4">
          &copy; {{ new Date().getFullYear() }} MozBid Leilões de Moçambique. Todos os direitos reservados.
        </div>
      </div>
    </div>
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { Gavel, ShieldCheck, Lock, ArrowLeft } from 'lucide-vue-next';
import ToastContainer from '../components/common/ToastContainer.vue';
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: #F4F1EB;
}

.auth-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  min-height: 100vh;
}

@media (max-width: 960px) {
  .auth-grid {
    grid-template-columns: 1fr;
  }
  .hide-tablet {
    display: none !important;
  }
}

.auth-visual-side {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  background-color: #171717;
}

.auth-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.65;
}

.visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(15, 15, 15, 0.92) 0%,
    rgba(23, 23, 23, 0.65) 50%,
    rgba(15, 15, 15, 0.95) 100%
  );
  z-index: 1;
}

.auth-visual-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #171717;
  border: 1px solid #B69A68;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #B69A68;
}

.auth-brand-text {
  font-size: 1.35rem;
  font-weight: 700;
  color: #ffffff;
}

.quote-title {
  font-size: 2.2rem;
  line-height: 1.25;
  margin-bottom: 16px;
  max-width: 500px;
}

.quote-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 480px;
}

.auth-trust-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.trust-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(23, 23, 23, 0.8);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: 9999px;
  border: 1px solid rgba(182, 154, 104, 0.3);
  color: #f3f3f3;
}

.auth-form-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 48px;
  background: #F4F1EB;
}

@media (max-width: 640px) {
  .auth-form-side {
    padding: 24px 16px;
  }
}

.auth-top-nav {
  margin-bottom: 24px;
}

.auth-form-container {
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}
</style>
