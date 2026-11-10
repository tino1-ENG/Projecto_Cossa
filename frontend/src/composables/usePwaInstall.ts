import { ref, onMounted } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const canInstall = ref(false);
const isInstalled = ref(false);
const isIos = ref(false);
const showIosModal = ref(false);

export function usePwaInstall() {
  onMounted(() => {
    // Check if already in standalone mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      isInstalled.value = true;
      canInstall.value = false;
      return;
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    isIos.value = /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;

    // Listen to beforeinstallprompt on Chromium / Android / Windows / Mac
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      deferredPrompt.value = e as BeforeInstallPromptEvent;
      canInstall.value = true;
    });

    window.addEventListener('appinstalled', () => {
      isInstalled.value = true;
      canInstall.value = false;
      deferredPrompt.value = null;
    });
  });

  async function promptInstall() {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      const choice = await deferredPrompt.value.userChoice;
      if (choice.outcome === 'accepted') {
        isInstalled.value = true;
        canInstall.value = false;
      }
      deferredPrompt.value = null;
    } else if (isIos.value) {
      showIosModal.value = true;
    } else {
      // Fallback instruction for browsers without direct prompt
      showIosModal.value = true;
    }
  }

  return {
    canInstall,
    isInstalled,
    isIos,
    showIosModal,
    promptInstall
  };
}
