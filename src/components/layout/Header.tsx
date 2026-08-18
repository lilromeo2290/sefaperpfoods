'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Menu, X, ShoppingBag, Search, User, ChevronDown, Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useApp, useCartCount, ViewKey } from '@/lib/store';
import { cn } from '@/lib/utils';

const navItems: { label: string; view: ViewKey }[] = [
  { label: 'Home', view: 'home' },
  { label: 'Shop', view: 'products' },
  { label: 'About', view: 'about' },
  { label: 'Distributors', view: 'distributor' },
  { label: 'Contact', view: 'contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartCount();
  const { setView, view, authUser, setCartOpen } = useApp();

  const go = (v: ViewKey) => {
    setView(v);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar */}
      <div className="hidden md:block gradient-brown text-cream/90 text-xs">
        <div className="container mx-auto flex items-center justify-between px-6 py-2">
          <p className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-gold" />
            <span>+233 247 968 973</span>
            <span className="opacity-50">|</span>
            <span className="text-gold font-semibold tracking-wide">Quality · Taste · Trust</span>
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => go('account')} className="hover:text-gold">Track Order</button>
            <span className="opacity-50">|</span>
            <button onClick={() => go('distributor')} className="hover:text-gold">Become a Distributor</button>
            <span className="opacity-50">|</span>
            <button onClick={() => go('admin')} className="hover:text-gold">Staff Login</button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="glass border-b border-gold/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            {/* Logo — composite image (emblem + name + tagline in one row) */}
            <button
              onClick={() => go('home')}
              className="flex items-center shrink-0 group"
              aria-label="Sefaperp Foods home"
            >
              <img
                src="/logo-horizontal-sm.png"
                alt="Sefaperp Foods — Quality, Taste and Trust"
                className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.3))' }}
              />
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => go(item.view)}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    view === item.view
                      ? 'text-burgundy bg-cream shadow-sm'
                      : 'text-burgundy hover:text-burgundy hover:bg-cream/60'
                  )}
                >
                  {item.label}
                  {view === item.view && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gold rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-burgundy hover:bg-cream"
                onClick={() => go('products')}
                aria-label="Search products"
              >
                <Search className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative text-burgundy hover:bg-cream"
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-burgundy hover:bg-cream"
                onClick={() => go(authUser ? 'account' : 'account')}
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Button>

              <Button
                size="sm"
                className="hidden md:inline-flex gradient-gold text-burgundy-dark hover:opacity-90 shadow-gold font-bold"
                onClick={() => go('products')}
              >
                Shop Now
              </Button>

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-burgundy"
                    aria-label="Open menu"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-cream p-0">
                  <SheetHeader className="p-4 border-b border-gold/20">
                    <SheetTitle className="flex items-center">
                      <img
                        src="/logo-horizontal.png"
                        alt="Sefaperp Foods — Quality, Taste and Trust"
                        className="h-12 w-auto"
                      />
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-4 flex flex-col gap-1">
                    {navItems.map((item) => (
                      <button
                        key={item.view}
                        onClick={() => go(item.view)}
                        className={cn(
                          'text-left px-4 py-3 rounded-lg font-medium transition-colors',
                          view === item.view
                            ? 'bg-brown text-cream'
                            : 'text-brown hover:bg-cream-dark'
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="h-px bg-gold/20 my-2" />
                    <button
                      onClick={() => go('account')}
                      className="text-left px-4 py-3 rounded-lg font-medium text-brown hover:bg-cream-dark"
                    >
                      My Account & Orders
                    </button>
                    <button
                      onClick={() => go('admin')}
                      className="text-left px-4 py-3 rounded-lg font-medium text-brown hover:bg-cream-dark"
                    >
                      Admin Dashboard
                    </button>
                    <button
                      onClick={() => go('distributor')}
                      className="text-left px-4 py-3 rounded-lg font-medium text-brown hover:bg-cream-dark"
                    >
                      Distributor Portal
                    </button>
                    <Button
                      className="mt-3 gradient-gold text-burgundy-dark hover:opacity-90 font-bold"
                      onClick={() => go('products')}
                    >
                      Shop Now
                    </Button>
                    <div className="mt-4 p-3 rounded-lg gradient-burgundy text-cream">
                      <p className="text-xs flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gold" /> +233 247 968 973
                      </p>
                      <p className="text-[10px] mt-1 text-cream/70">Dzodze, Volta Region • Ghana</p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
