'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * A small floating "Install" button that appears on mobile devices after the
 * main PWAInstallPrompt has been dismissed. It sits above the WhatsApp/chat
 * buttons so the user always has a way to install the app.
 */
export function MobileInstallButton() {
  const isMobile = useIsMobile();
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (!isMobile || isStandaloneMode()) return;

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

    // Show the floating button 30 seconds after page load if not dismissed
    const dismissed = sessionStorage.getItem('mobile-install-dismissed') === 'true';
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 30000);
      return () => {
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        window.removeEventListener('appinstalled', onInstalled);
        clearTimeout(timer);
      };
    }
  }, [isMobile]);

  if (!isMobile || installed || !show || isStandaloneMode()) return null;

  const handleInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferred(null);
      setShow(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem('mobile-install-dismissed', 'true');
  };

  return (
    <div className="md:hidden fixed bottom-20 right-4 z-40 animate-in slide-in-from-right-5">
      <div className="relative">
        <button
          onClick={handleInstall}
          className="h-12 px-4 rounded-full gradient-gold text-brown-dark font-bold text-xs shadow-gold flex items-center gap-2 hover:scale-105 transition-transform"
          aria-label="Install Sefaperp Foods app"
        >
          <Download className="h-4 w-4" />
          Install App
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-brand-red text-white text-[10px] flex items-center justify-center shadow"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
