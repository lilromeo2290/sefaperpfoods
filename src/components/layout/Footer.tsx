'use client';

import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Send } from 'lucide-react';
import { useApp, ViewKey } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  const { setView } = useApp();
  const go = (v: ViewKey, slug?: string | null) => setView(v, slug ?? null);

  return (
    <footer className="mt-auto gradient-brown text-cream">
      {/* Newsletter */}
      <div className="border-b border-cream/10">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-14 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gold">
              Get Ghanaian recipes & exclusive offers
            </h3>
            <p className="text-cream/90 mt-2 text-sm md:text-base">
              Join our newsletter for seasonal promos, new product drops, and authentic recipe ideas from Dzodze.
            </p>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              (e.currentTarget.querySelector('input') as HTMLInputElement).value = '';
              alert('Thank you for subscribing! Check your inbox for a 10% welcome coupon.');
            }}
          >
            <Input
              type="email"
              placeholder="you@example.com"
              required
              className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40"
            />
            <Button type="submit" className="gradient-gold text-brown-dark hover:opacity-90 font-semibold shrink-0">
              <Send className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Subscribe</span>
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4">
            <img
              src="/logo-horizontal-light-lg.png"
              alt="Sefaperp Foods — Quality, Taste and Trust"
              className="h-16 md:h-20 w-auto"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(212,175,55,0.4))' }}
            />
          </div>
          <p className="text-sm text-cream/90 leading-relaxed">
            Authentic Ghanaian food products crafted in small batches from Dzodze, Volta Region. Quality you can taste, tradition you can trust — delivered fresh across Ghana.
          </p>
          <div className="flex gap-2 mt-4">
            <a href="#" aria-label="Facebook" className="h-9 w-9 rounded-lg bg-cream/10 hover:bg-gold hover:text-brown-dark flex items-center justify-center transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-lg bg-cream/10 hover:bg-gold hover:text-brown-dark flex items-center justify-center transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-lg bg-cream/10 hover:bg-gold hover:text-brown-dark flex items-center justify-center transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-3 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => go('products')} className="text-cream/90 hover:text-gold">All Products</button></li>
            <li><button onClick={() => go('product', 'sbf-special-shitor')} className="text-cream/90 hover:text-gold">SBF Special Shitor</button></li>
            <li><button onClick={() => go('product', 'sbf-tom-brown-powder')} className="text-cream/90 hover:text-gold">SBF Tom Brown Powder</button></li>
            <li><button onClick={() => go('cart')} className="text-cream/90 hover:text-gold">Cart & Checkout</button></li>
            <li><button onClick={() => go('distributor')} className="text-cream/90 hover:text-gold">Bulk Orders</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-3 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => go('about')} className="text-cream/90 hover:text-gold">About Sefaperp Foods</button></li>
            <li><button onClick={() => go('about')} className="text-cream/90 hover:text-gold">Manufacturing Process</button></li>
            <li><button onClick={() => go('about')} className="text-cream/90 hover:text-gold">Food Safety & Certifications</button></li>
            <li><button onClick={() => go('distributor')} className="text-cream/90 hover:text-gold">Become a Distributor</button></li>
            <li><button onClick={() => go('admin')} className="text-cream/90 hover:text-gold">Staff Portal</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-3 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2 text-cream/70">
              <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>Sefaperp Foods Factory<br/>Dzodze, Ketu North<br/>Volta Region, Ghana</span>
            </li>
            <li className="flex items-start gap-2 text-cream/70">
              <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <a href="tel:+233247968973" className="hover:text-gold">+233 247 968 973</a>
                <a href="tel:+233553878748" className="hover:text-gold">+233 553 878 748 <span className="text-[10px] text-cream/50">(WhatsApp)</span></a>
              </div>
            </li>
            <li className="flex items-center gap-2 text-cream/70">
              <Mail className="h-4 w-4 text-gold shrink-0" />
              <a href="mailto:hello@sbffoods.com" className="hover:text-gold">hello@sbffoods.com</a>
            </li>
          </ul>
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="text-[10px] px-2 py-1 rounded bg-cream/10 text-cream/70">MTN MoMo</span>
            <span className="text-[10px] px-2 py-1 rounded bg-cream/10 text-cream/70">Telecel</span>
            <span className="text-[10px] px-2 py-1 rounded bg-cream/10 text-cream/70">Paystack</span>
            <span className="text-[10px] px-2 py-1 rounded bg-cream/10 text-cream/70">Visa</span>
            <span className="text-[10px] px-2 py-1 rounded bg-cream/10 text-cream/70">Mastercard</span>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-cream/60">
          <p>© {new Date().getFullYear()} Sefaperp Foods. All rights reserved. Made with love in Dzodze, Volta Region.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms of Service</a>
            <a href="#" className="hover:text-gold">Refund Policy</a>
          </div>
        </div>
        <div className="border-t border-cream/10">
          <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-center gap-1.5 text-xs text-cream/70">
            <span>Powered and Developed by:</span>
            <a
              href="https://clipeconsult.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold hover:text-gold-light transition-colors"
            >
              CLIPE CONSULT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
