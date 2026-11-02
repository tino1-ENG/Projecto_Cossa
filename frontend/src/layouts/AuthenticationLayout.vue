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
            <span class="auth-brand-text">MOZ<span class="text-gold">BID</span></span>
          </router-link>

          <div class="auth-hero-quote">
            <h2 class="quote-title">O Mercado de Leilões Exclusivo de Moçambique.</h2>
            <p class="quote-desc">
              Participe em disputas em tempo real por automóveis de alta gama, frotas corporativas,
              maquinaria pesada e activos tecnológicos com liquidação 100% segura.
            </p>
          </div>

          <div class="auth-trust-badges">
            <div class="trust-pill">
              <ShieldCheck :size="14" class="text-gold" />
              <span>Vendedores Verificados</span>
            </div>
            <div class="trust-pill">
              <Lock :size="14" class="text-gold" />
              <span>Transacções M-Pesa & Bancárias</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Form Side -->
      <div class="auth-form-side">
        <div class="auth-top-nav">
          <router-link to="/" class="back-link">
            <ArrowLeft :size="16" /> Voltar ao Marketplace
          </router-link>
        </div>

        <div class="auth-form-container">
          <router-view />
        </div>

        <div class="auth-form-footer">
          &copy; {{ new Date().getFullYear() }} MozBid Auction Marketplace Lda.
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
  background-color: var(--color-background);
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
}

.auth-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(8, 8, 8, 0.88) 0%,
    rgba(8, 8, 8, 0.5) 50%,
    rgba(8, 8, 8, 0.95) 100%
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
  border-radius: var(--radius-md);
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #080808;
}

.auth-brand-text {
  font-family: var(--font-family-display);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #ffffff;
}

.text-gold {
  color: var(--color-primary);
}

.quote-title {
  font-size: 2.2rem;
  line-height: 1.25;
  margin-bottom: 16px;
  max-width: 500px;
}

.quote-desc {
  font-size: 0.95rem;
  color: #d1d5db;
  line-height: 1.6;
  max-width: 480px;
}

.auth-trust-badges {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.trust-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  font-size: 0.82rem;
  color: #e5e5e5;
}

.auth-form-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px 48px;
  background: #0d0d0d;
}

@media (max-width: 640px) {
  .auth-form-side {
    padding: 24px 20px;
  }
}

.auth-top-nav {
  margin-bottom: 24px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-primary);
}

.auth-form-container {
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
}

.auth-form-footer {
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 24px;
}
</style>
