'use client';

import { useEffect, useState } from 'react';
import {
  Download, X, Smartphone, Monitor, Share, Plus, QrCode, CheckCircle2,
  Bell, Zap, Wifi, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type DeviceType = 'android' | 'ios' | 'desktop' | 'unknown';

function detectDevice(): DeviceType {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  const isAndroid = /android/.test(ua);
  const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isMobile = /mobile|tablet|ipad|iphone|android/.test(ua) || window.innerWidth < 768;
  if (isAndroid) return 'android';
  if (isIOS) return 'ios';
  if (isMobile) return 'android'; // treat unknown mobile as android-like
  return 'desktop';
}

function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [device, setDevice] = useState<DeviceType>('unknown');
  const [showFullGuide, setShowFullGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const detected = detectDevice();
    const standalone = isStandaloneMode();
    const wasDismissed = sessionStorage.getItem('pwa-prompt-dismissed') === 'true';

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setShow(false);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    // Show prompt after 8 seconds on mobile, 15 seconds on desktop
    const delay = detected === 'desktop' ? 15000 : 8000;
    const timer = setTimeout(() => {
      if (!standalone) {
        setShow(true);
      }
    }, delay);

    // Set state asynchronously to avoid synchronous setState in effect
    const asyncInit = async () => {
      if (standalone) {
        setInstalled(true);
        return;
      }
      setDevice(detected);
      if (wasDismissed) setDismissed(true);
    };
    asyncInit();

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
      }
      setShow(false);
      setDeferred(null);
    } else if (device === 'ios') {
      setShowFullGuide(true);
    }
  };

  if (installed || !show || dismissed) return null;

  // ===== MOBILE PROMPT (Android / iOS) =====
  if (device === 'android' || device === 'ios') {
    return (
      <>
        {/* Full-screen guide for iOS (Add to Home Screen instructions) */}
        {showFullGuide && device === 'ios' && (
          <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in">
            <div className="bg-cream rounded-t-3xl md:rounded-3xl max-w-md w-full p-6 shadow-brown max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-bold text-brown-dark">Install on iPhone</h3>
                <button onClick={handleDismiss} className="text-brown-dark hover:text-brown p-1" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-brown-dark mb-4">Follow these steps to add Sefaperp Foods to your home screen:</p>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="h-8 w-8 rounded-full gradient-gold text-brown-dark flex items-center justify-center font-bold shrink-0">1</span>
                  <div>
                    <p className="font-semibold text-brown-dark text-sm">Tap the Share button</p>
                    <p className="text-xs text-brown-dark mt-0.5">It's the square with the arrow pointing up, at the bottom of your screen.</p>
                    <div className="mt-2 h-10 w-10 rounded-lg bg-cream-dark flex items-center justify-center">
                      <Share className="h-5 w-5 text-burgundy" />
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="h-8 w-8 rounded-full gradient-gold text-brown-dark flex items-center justify-center font-bold shrink-0">2</span>
                  <div>
                    <p className="font-semibold text-brown-dark text-sm">Scroll down and tap "Add to Home Screen"</p>
                    <p className="text-xs text-brown-dark mt-0.5">Look for the icon with a plus sign.</p>
                    <div className="mt-2 h-10 w-10 rounded-lg bg-cream-dark flex items-center justify-center">
                      <Plus className="h-5 w-5 text-burgundy" />
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="h-8 w-8 rounded-full gradient-gold text-brown-dark flex items-center justify-center font-bold shrink-0">3</span>
                  <div>
                    <p className="font-semibold text-brown-dark text-sm">Tap "Add"</p>
                    <p className="text-xs text-brown-dark mt-0.5">Sefaperp Foods will appear on your home screen like a native app.</p>
                  </div>
                </li>
              </ol>
              <Button className="w-full mt-5 gradient-brown text-cream hover:opacity-90 font-semibold h-11" onClick={handleDismiss}>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Got it
              </Button>
            </div>
          </div>
        )}

        {/* Mobile banner */}
        <div className="fixed bottom-4 left-3 right-3 z-[60] animate-in slide-in-from-bottom-5">
          <div className="glass rounded-2xl shadow-brown overflow-hidden">
            {/* Header strip with gradient */}
            <div className="gradient-brown p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg gradient-gold flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-brown-dark" />
                </div>
                <div>
                  <p className="font-display font-bold text-gold text-sm">Install Sefaperp App</p>
                  <p className="text-[10px] text-cream/70">Free • Fast • Offline-ready</p>
                </div>
              </div>
              <button onClick={handleDismiss} aria-label="Close" className="text-cream/60 hover:text-cream p-1">
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Body */}
            <div className="p-3 bg-cream">
              <p className="text-xs text-brown-dark mb-2.5">
                Get the full app experience on your phone — order faster, track deliveries, and shop offline.
              </p>
              {/* Feature icons */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-cream-dark">
                  <Zap className="h-4 w-4 text-gold" />
                  <span className="text-[9px] text-brown-dark font-medium text-center">Fast ordering</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-cream-dark">
                  <Wifi className="h-4 w-4 text-gold" />
                  <span className="text-[9px] text-brown-dark font-medium text-center">Works offline</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-cream-dark">
                  <Bell className="h-4 w-4 text-gold" />
                  <span className="text-[9px] text-brown-dark font-medium text-center">Order alerts</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gradient-gold text-brown-dark hover:opacity-90 font-bold h-9"
                  onClick={handleInstall}
                >
                  <Download className="h-4 w-4 mr-1" /> Install App
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-brown-dark hover:bg-cream-dark h-9"
                  onClick={handleDismiss}
                >
                  Not now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ===== DESKTOP PROMPT =====
  return (
    <div className="fixed bottom-4 right-4 z-[60] w-96 max-w-[calc(100vw-2rem)] animate-in slide-in-from-bottom-5">
      <div className="glass rounded-2xl shadow-brown overflow-hidden">
        {/* Header */}
        <div className="gradient-brown p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg gradient-gold flex items-center justify-center">
              <Download className="h-5 w-5 text-brown-dark" />
            </div>
            <div>
              <p className="font-display font-bold text-gold text-sm">Install Sefaperp App</p>
              <p className="text-[10px] text-cream/70">Desktop & mobile apps available</p>
            </div>
          </div>
          <button onClick={handleDismiss} aria-label="Close" className="text-cream/60 hover:text-cream p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Body */}
        <div className="p-4 bg-cream">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Desktop install */}
            <div className="p-3 rounded-xl border border-gold/30 bg-white">
              <Monitor className="h-6 w-6 text-burgundy mb-1.5" />
              <p className="text-xs font-bold text-brown-dark">Install on this computer</p>
              <p className="text-[10px] text-brown-dark mt-0.5">Runs as a desktop app</p>
            </div>
            {/* Mobile (QR) */}
            <div className="p-3 rounded-xl border border-gold/30 bg-white">
              <Smartphone className="h-6 w-6 text-burgundy mb-1.5" />
              <p className="text-xs font-bold text-brown-dark">Get it on your phone</p>
              <p className="text-[10px] text-brown-dark mt-0.5">Install as Android app</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 gradient-gold text-brown-dark hover:opacity-90 font-bold h-9"
              onClick={handleInstall}
            >
              <Download className="h-4 w-4 mr-1" /> {deferred ? 'Install Now' : 'Install on Desktop'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-burgundy text-burgundy hover:bg-cream-dark h-9"
              onClick={() => setShowFullGuide(true)}
            >
              <Smartphone className="h-4 w-4 mr-1" /> Mobile
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-brown-dark hover:bg-cream-dark h-9"
              onClick={handleDismiss}
            >
              Later
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile QR / instructions modal for desktop users */}
      {showFullGuide && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowFullGuide(false)}>
          <div className="bg-cream rounded-2xl max-w-sm w-full p-6 shadow-brown" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-brown-dark">Get the mobile app</h3>
              <button onClick={() => setShowFullGuide(false)} className="text-brown-dark hover:text-brown p-1" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-brown-dark mb-4">Open this page on your Android phone and tap "Install App" — it will be added to your home screen like a native app.</p>
            <div className="bg-white rounded-xl p-4 flex justify-center mb-4 border border-gold/20">
              {/* Simple QR placeholder — in production, generate a real QR to the deployed URL */}
              <div className="h-32 w-32 bg-cream-dark rounded-lg flex items-center justify-center">
                <QrCode className="h-20 w-20 text-burgundy" />
              </div>
            </div>
            <p className="text-center text-xs text-brown-dark mb-3">Scan with your phone camera to open the site</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-brown-dark">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0" /> Works on Android 5.0+
              </div>
              <div className="flex items-center gap-2 text-xs text-brown-dark">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0" /> No Play Store visit needed
              </div>
              <div className="flex items-center gap-2 text-xs text-brown-dark">
                <CheckCircle2 className="h-4 w-4 text-brand-green shrink-0" /> Offline access after install
              </div>
            </div>
            <Button className="w-full mt-4 gradient-brown text-cream hover:opacity-90 font-semibold h-10" onClick={() => setShowFullGuide(false)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
