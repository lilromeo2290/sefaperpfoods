'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ShoppingBag, Truck, Shield, Award, Star, MapPin, Phone, Mail,
  ArrowRight, Sparkles, Leaf, Heart, Users, ChevronRight, Newspaper,
  ChevronLeft, ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useApp, ViewKey } from '@/lib/store';
import { ProductCard, ProductCardData } from '@/components/product/ProductCard';

const HERO_IMAGES = [
  { src: '/hero-1.png', alt: 'Sefaperp Foods — Special Shitor and Tom Brown Powder with fresh ingredients' },
  { src: '/hero-2.png', alt: 'Sefaperp Foods products on rustic wooden table with golden S emblem' },
  { src: '/hero-3.png', alt: 'Sefaperp Foods — four product photography mockups in different settings' },
  { src: '/hero-4.png', alt: 'Sefaperp Foods products on wooden cutting board in bright kitchen' },
];

export function HomeSection() {
  const { setView } = useApp();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts).catch(() => {});
  }, []);

  // Auto-rotate hero carousel every 5 seconds
  const nextHero = useCallback(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), []);
  const prevHero = useCallback(() => setHeroIdx((i) => (i - 1 + HERO_IMAGES.length) % HERO_IMAGES.length), []);
  useEffect(() => {
    const t = setInterval(nextHero, 5000);
    return () => clearInterval(t);
  }, [nextHero]);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <Badge className="inline-flex items-center gap-1 bg-cream text-burgundy border border-gold/40 px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3 w-3 text-gold" />
                Made in Dzodze, Volta Region • Since 2018
              </Badge>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] text-burgundy text-balance">
                Quality, Taste & Trust,
                <span className="block text-gradient-gold mt-2">Delivered Fresh.</span>
              </h1>
              <p className="text-base md:text-lg text-burgundy/80 max-w-xl mx-auto lg:mx-0 text-pretty">
                Premium Shitor, Tom Brown Powder and traditional Ghanaian foods — slow-roasted in small batches in Dzodze and delivered to your door across Ghana. Pay with Mobile Money or card. Track every step.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="gradient-gold text-burgundy-dark hover:opacity-90 font-bold h-12 px-6 shadow-gold"
                  onClick={() => setView('products')}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" /> Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-burgundy text-burgundy hover:bg-cream font-semibold h-12 px-6"
                  onClick={() => setView('checkout')}
                >
                  <Truck className="h-5 w-5 mr-2" /> Order Online
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-burgundy hover:bg-cream font-semibold h-12 px-6"
                  onClick={() => setView('distributor')}
                >
                  <Users className="h-5 w-5 mr-2" /> Become a Distributor
                </Button>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start pt-2 text-xs text-burgundy/70">
                <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-brand-green" /> FDA-approved facility</span>
                <span className="flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-brand-green" /> No preservatives</span>
                <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-gold" /> Nationwide delivery</span>
              </div>
            </div>

            {/* Hero carousel — rotates through 4 product photos */}
            <div className="relative">
              <div className="relative aspect-[3/2] sm:aspect-[16/10] lg:aspect-[3/2] rounded-3xl overflow-hidden shadow-brown border-4 border-white bg-cream">
                {HERO_IMAGES.map((img, i) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
                      i === heroIdx ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                {/* Carousel arrows */}
                <button
                  onClick={prevHero}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full glass shadow-gold flex items-center justify-center text-burgundy hover:bg-gold hover:text-burgundy-dark transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextHero}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full glass shadow-gold flex items-center justify-center text-burgundy hover:bg-gold hover:text-burgundy-dark transition-colors"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {HERO_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIdx(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        i === heroIdx ? 'w-6 bg-gold' : 'w-2 bg-burgundy/30 hover:bg-burgundy/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {/* floating badge: FDA Approved */}
              <Card className="absolute -top-4 -right-4 md:top-6 md:-right-6 glass p-3 flex items-center gap-2 shadow-gold w-44">
                <div className="h-10 w-10 rounded-full bg-brand-green/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-brand-green" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brown-dark">FDA Approved</p>
                  <p className="text-[10px] text-brown/60">Food Safety Certified</p>
                </div>
              </Card>
              {/* floating badge: Made in Ghana */}
              <Card className="absolute -bottom-4 -left-4 md:bottom-6 md:-left-6 glass p-3 flex items-center gap-2 shadow-brown w-52">
                <div className="h-10 w-10 rounded-full gradient-gold flex items-center justify-center">
                  <Star className="h-5 w-5 text-brown-dark fill-brown-dark" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brown-dark">Made in Ghana</p>
                  <p className="text-[10px] text-brown/60">Crafted in Dzodze, Volta Region</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="gradient-brown text-cream py-3 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 text-sm font-medium">
                <span className="flex items-center gap-2"><Sparkles className="h-3 w-3 text-gold" /> Slow-roast small batches</span>
                <span className="flex items-center gap-2"><Truck className="h-3 w-3 text-gold" /> Delivery in 24-72h nationwide</span>
                <span className="flex items-center gap-2"><Shield className="h-3 w-3 text-gold" /> FDA-approved facility</span>
                <span className="flex items-center gap-2"><Leaf className="h-3 w-3 text-gold" /> No artificial preservatives</span>
                <span className="flex items-center gap-2"><Phone className="h-3 w-3 text-gold" /> Mobile Money & card payments</span>
              </span>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="py-6 border-y border-gold/15">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: 'Nationwide Delivery', sub: 'All 16 regions of Ghana' },
            { icon: Shield, label: 'Secure Payments', sub: 'SSL • MoMo • Cards' },
            { icon: Leaf, label: '100% Natural', sub: 'No preservatives' },
            { icon: Award, label: 'FDA Certified', sub: 'Made in Dzodze' },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3 justify-center md:justify-start">
              <div className="h-10 w-10 rounded-lg bg-cream-dark flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brown-dark">{f.label}</p>
                <p className="text-[11px] text-brown/60">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== COMPANY OVERVIEW ===== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-brown border-4 border-white bg-cream">
                <img src="/story-products.png" alt="Sefaperp Foods — prepared with care, made for you, in our Dzodze facility" className="h-full w-full object-contain" />
              </div>
            </div>
            <div className="space-y-5">
              <Badge className="bg-cream-dark text-brown-dark border border-gold/30">Our Story</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark text-balance">
                Born in Dzodze. Rooted in tradition. Made for every Ghanaian table.
              </h2>
              <p className="text-brown/80 leading-relaxed">
                Sefaperp Foods began as a small family kitchen in Dzodze, Volta Region, where the brothers would slow-roast chili peppers and stone-grind roasted maize to make Shitor and Tom Brown for their community. The demand grew beyond Volta, and today we ship nationwide — but our recipes and our slow-craft method have not changed.
              </p>
              <p className="text-brown/80 leading-relaxed">
                Every jar of Shitor is still simmered in small batches with smoked fish, dried shrimp and sun-dried peppers. Every bag of Tom Brown is still stone-ground from roasted maize, soybean and groundnut. No shortcuts. No preservatives. Just the authentic taste of home, delivered fresh.
              </p>
              <Button
                variant="outline"
                className="border-brown text-brown hover:bg-cream"
                onClick={() => setView('about')}
              >
                Read our full story <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 md:py-24 border-y border-gold/15">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <Badge className="bg-brown text-cream">Bestsellers</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark mt-2">
                Our signature products
              </h2>
              <p className="text-brown/70 mt-2 max-w-xl">
                Slow-crafted Ghanaian classics — from our kitchen in Dzodze to your table anywhere in Ghana.
              </p>
            </div>
            <Button variant="ghost" className="text-brown hover:bg-cream self-start md:self-auto" onClick={() => setView('products')}>
              View all products <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge className="bg-cream-dark text-brown-dark border border-gold/30">Why Sefaperp Foods</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark mt-2">
              Six reasons families choose us
            </h2>
            <p className="text-brown/70 mt-3">
              We obsess over quality at every step — from sourcing sun-dried peppers to last-mile delivery.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Leaf, title: '100% Natural Ingredients', body: 'Sun-dried chili peppers, smoked fish, dried shrimp, stone-ground roasted cereals. No preservatives, no artificial colours — ever.' },
              { icon: Shield, title: 'FDA-Approved Facility', body: 'Our Dzodze factory is FDA-certified and audited quarterly. HACCP-compliant process from raw material intake to sealing.' },
              { icon: Truck, title: 'Fresh & Fast Delivery', body: '24-48h in Greater Accra, Kumasi, Takoradi, Ho, Koforidua. 2-4 days elsewhere. GPS-tracked from our dispatch to your door.' },
              { icon: Heart, title: 'Made in Small Batches', body: 'We slow-roast and stone-grind in small batches to preserve flavour and nutrition. Every batch is taste-tested before packing.' },
              { icon: Phone, title: 'Mobile Money & Cards', body: 'Pay with MTN, Telecel, AirtelTigo, Hubtel, Paystack, ExpressPay, Visa or Mastercard. Instant confirmation, automated receipts.' },
              { icon: Users, title: 'Distributor Network', body: 'Become a distributor and unlock bulk pricing, regional exclusivity and dedicated invoices. Apply in 2 minutes — approval in 48 hours.' },
            ].map((f, i) => (
              <Card key={i} className="p-6 border-gold/15 hover:border-gold/40 hover:shadow-brown transition-all">
                <div className="h-12 w-12 rounded-xl gradient-gold flex items-center justify-center mb-4 shadow-gold">
                  <f.icon className="h-6 w-6 text-brown-dark" />
                </div>
                <h3 className="font-display font-bold text-brown-dark text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-brown/70 leading-relaxed">{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DELIVERY COVERAGE ===== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <Badge className="bg-cream-dark text-brown-dark border border-gold/30">Delivery Coverage</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark">
                We deliver to all 16 regions of Ghana
              </h2>
              <p className="text-brown/80">
                From our dispatch hub in Dzodze, we ship nationwide. Our logistics partners cover Greater Accra, Volta, Oti, Eastern, Ashanti, Western, Western North, Central, Bono, Bono East, Ahafo, Northern, Savannah, North East, Upper East and Upper West.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <DeliveryCity city="Accra" eta="24-48h" highlight />
                <DeliveryCity city="Kumasi" eta="48h" />
                <DeliveryCity city="Ho" eta="24h" highlight />
                <DeliveryCity city="Takoradi" eta="48h" />
                <DeliveryCity city="Tamale" eta="3-4 days" />
                <DeliveryCity city="Bolgatanga" eta="3-4 days" />
              </div>
              <Button className="gradient-gold text-brown-dark hover:opacity-90 font-semibold" onClick={() => setView('products')}>
                <ShoppingBag className="h-4 w-4 mr-2" /> Order now — fresh from Dzodze
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[3/2] rounded-3xl overflow-hidden bg-cream-dark shadow-brown p-6">
                <img src="/ghana-map.svg" alt="Ghana delivery coverage map" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LATEST NEWS ===== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge className="bg-brown text-cream"><Newspaper className="h-3 w-3 mr-1" /> News & Recipes</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark mt-2">From our kitchen</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                tag: 'Recipe',
                title: '5 Ways to Enjoy SBF Shitor',
                excerpt: 'Experience the rich, smoky, and authentic taste of SBF Shitor, carefully prepared from quality ingredients to bring true Ghanaian flavour to every meal.',
                ways: [
                  'Banku & grilled tilapia',
                  'Plain rice',
                  'Boiled eggs',
                  'Yam',
                  'Plantain',
                ],
                excerpt2: 'SBF Shitor adds a delicious spicy kick that transforms ordinary meals into memorable dining experiences. You can also use it as a cooking ingredient to enrich soups, stews, sauces, and other local dishes. Made with love, passion, and traditional recipes — bringing the taste of Ghana to every spoonful.',
                featured: true,
              },
              { tag: 'Story', title: 'How we slow-roast our peppers in Dzodze', excerpt: 'A behind-the-scenes look at our small-batch roasting process that gives SBF Shitor its signature deep, smoky heat.' },
              { tag: 'Health', title: 'Why Tom Brown beats imported cereal', excerpt: 'Stone-ground roasted maize, soybean and groundnut pack more fibre and protein than commercial breakfast cereals.' },
            ].map((n, i) => (
              <Card key={i} className={`overflow-hidden border-gold/15 hover:shadow-brown transition-shadow cursor-pointer group ${n.featured ? 'md:col-span-1 ring-2 ring-gold/30' : ''}`}>
                <div className="aspect-[16/9] bg-cream-dark relative overflow-hidden">
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-gold text-brown-dark">{n.tag}</Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-gold/40 group-hover:scale-110 transition-transform" />
                  </div>
                  {n.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-burgundy text-cream text-[10px]">Featured</Badge>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-brown-dark text-lg leading-tight">{n.title}</h3>
                  <p className={`text-sm text-brown/70 mt-2 ${n.featured ? '' : 'line-clamp-3'}`}>{n.excerpt}</p>
                  {n.ways && (
                    <ol className="mt-3 space-y-1.5">
                      {n.ways.map((w, wi) => (
                        <li key={wi} className="flex items-center gap-2 text-sm text-brown-dark">
                          <span className="h-5 w-5 rounded-full gradient-gold text-brown-dark text-[11px] font-bold flex items-center justify-center shrink-0">
                            {wi + 1}
                          </span>
                          {w}
                        </li>
                      ))}
                    </ol>
                  )}
                  {n.excerpt2 && (
                    <p className="text-sm text-brown/70 mt-3">{n.excerpt2}</p>
                  )}
                  <button className="text-xs font-semibold text-brown mt-3 flex items-center gap-1 hover:text-gold">
                    Read more <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <ContactStrip />
    </div>
  );
}

function DeliveryCity({ city, eta, highlight }: { city: string; eta: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${highlight ? 'bg-cream border-gold/40' : 'bg-white border-gold/15'}`}>
      <span className="flex items-center gap-2 text-sm font-medium text-brown-dark">
        <MapPin className="h-3.5 w-3.5 text-gold" /> {city}
      </span>
      <span className="text-xs text-brown/60">{eta}</span>
    </div>
  );
}

export function ContactStrip() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="overflow-hidden border-0 shadow-brown">
          <div className="grid md:grid-cols-2">
            <div className="gradient-brown text-cream p-8 md:p-12">
              <Badge className="bg-cream/10 text-gold border border-gold/30">Get in touch</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gold mt-3">
                We'd love to hear from you
              </h2>
              <p className="text-cream/80 mt-3">
                Questions about products, bulk orders, distributorship, or delivery? Our team is available Mon-Sat, 8am-7pm.
              </p>
              <div className="space-y-3 mt-6">
                <a href="tel:+233247968973" className="flex items-center gap-3 text-cream hover:text-gold transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-cream/10 flex items-center justify-center"><Phone className="h-5 w-5 text-gold" /></div>
                  <div><p className="text-xs text-cream/60">Call us</p><p className="font-semibold">+233 247 968 973</p></div>
                </a>
                <a href="https://wa.me/233553878748" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-cream hover:text-gold transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-cream/10 flex items-center justify-center"><Phone className="h-5 w-5 text-gold" /></div>
                  <div><p className="text-xs text-cream/60">WhatsApp / Alt line</p><p className="font-semibold">+233 553 878 748</p></div>
                </a>
                <a href="mailto:hello@sbffoods.com" className="flex items-center gap-3 text-cream hover:text-gold transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-cream/10 flex items-center justify-center"><Mail className="h-5 w-5 text-gold" /></div>
                  <div><p className="text-xs text-cream/60">Email us</p><p className="font-semibold">hello@sbffoods.com</p></div>
                </a>
                <div className="flex items-center gap-3 text-cream">
                  <div className="h-10 w-10 rounded-lg bg-cream/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-gold" /></div>
                  <div><p className="text-xs text-cream/60">Visit us</p><p className="font-semibold">Dzodze, Ketu North • Volta Region</p></div>
                </div>
              </div>
            </div>
            <div className="bg-cream p-8 md:p-12">
              <h3 className="font-display text-2xl font-bold text-brown-dark">Send a message</h3>
              <form
                className="space-y-3 mt-5"
                onSubmit={(e) => { e.preventDefault(); alert('Thank you! We will get back to you within 24 hours.'); (e.target as HTMLFormElement).reset(); }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="Full name" className="px-3 py-2 rounded-lg border border-gold/30 bg-white text-brown-dark placeholder:text-brown/40 text-sm" />
                  <input required type="tel" placeholder="Phone" className="px-3 py-2 rounded-lg border border-gold/30 bg-white text-brown-dark placeholder:text-brown/40 text-sm" />
                </div>
                <input required type="email" placeholder="Email" className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-white text-brown-dark placeholder:text-brown/40 text-sm" />
                <textarea required placeholder="Your message" rows={4} className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-white text-brown-dark placeholder:text-brown/40 text-sm resize-none" />
                <Button type="submit" className="w-full gradient-gold text-brown-dark hover:opacity-90 font-semibold">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
