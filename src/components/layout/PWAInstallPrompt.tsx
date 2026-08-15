'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      // Show banner after 12 seconds if not yet installed
      setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          setShow(true);
        }
      }, 12000);
    };
    const onInstalled = () => {
      setInstalled(true);
      setShow(false);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || !show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5">
      <div className="glass rounded-2xl shadow-brown p-4 pr-3 flex items-start gap-3">
        <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-xl gradient-gold text-brown-dark shrink-0">
          <Download className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-brown-dark">Install Sefaperp Foods app</p>
          <p className="text-xs text-brown-dark mt-0.5">
            Add to your home screen for offline access, fast ordering, and push notifications.
          </p>
          <div className="flex gap-2 mt-2.5">
            <Button
              size="sm"
              className="h-8 text-xs gradient-brown hover:opacity-90"
              onClick={async () => {
                if (deferred) {
                  await deferred.prompt();
                  await deferred.userChoice;
                  setShow(false);
                  setDeferred(null);
                } else {
                  setShow(false);
                }
              }}
            >
              Install now
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs"
              onClick={() => setShow(false)}
            >
              Not now
            </Button>
          </div>
        </div>
        <button
          aria-label="Close"
          className="text-brown-dark hover:text-brown p-1"
          onClick={() => setShow(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
