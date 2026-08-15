'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { PWAInstallPrompt } from '@/components/layout/PWAInstallPrompt';
import { MobileInstallButton } from '@/components/layout/MobileInstallButton';
import { SupportWidget } from '@/components/widgets/SupportWidget';
import { HomeSection } from '@/components/sections/HomeSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { ProductDetailSection } from '@/components/sections/ProductDetailSection';
import { CartSection } from '@/components/sections/CartSection';
import { CheckoutSection } from '@/components/sections/CheckoutSection';
import { AccountSection } from '@/components/sections/AccountSection';
import { AdminSection } from '@/components/sections/AdminSection';
import { DistributorSection } from '@/components/sections/DistributorSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function Home() {
  const { view, setView } = useApp();

  // Read ?view= query param on initial mount (for PWA shortcuts / deep links)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qView = params.get('view') as any;
    const qSlug = params.get('slug');
    if (qView) {
      setView(qView, qSlug);
    }
  }, [setView]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {view === 'home' && <HomeSection />}
        {view === 'about' && <AboutSection />}
        {view === 'products' && <ProductsSection />}
        {view === 'product' && <ProductDetailSection />}
        {view === 'cart' && <CartSection />}
        {view === 'checkout' && <CheckoutSection />}
        {view === 'account' && <AccountSection />}
        {view === 'admin' && <AdminSection />}
        {view === 'distributor' && <DistributorSection />}
        {view === 'contact' && <ContactSection />}
      </main>
      <Footer />

      {/* Floating widgets */}
      <CartDrawer />
      <SupportWidget />
      <PWAInstallPrompt />
      <MobileInstallButton />
    </div>
  );
}
