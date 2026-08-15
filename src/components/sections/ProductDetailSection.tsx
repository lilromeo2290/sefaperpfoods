'use client';

import { useEffect, useState } from 'react';
import {
  Star, ShoppingCart, Truck, Shield, Leaf, Plus, Minus, Check,
  ChevronRight, Heart, Share2, MapPin, Award, Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ProductCard, ProductCardData } from '@/components/product/ProductCard';

interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  basePrice: number;
  sizes: { label: string; price: number; sku: string }[];
  ingredients: string;
  nutrition: { servingSize: string; servingsPerContainer: string; rows: [string, string][] };
  images: string[];
  popularity: number;
  isNew: boolean;
  inStock: boolean;
  stockQty: number;
  reviews: { id: string; authorName: string; rating: number; title: string; body: string; createdAt: string }[];
}

export function ProductDetailSection() {
  const { productSlug, setView, addToCart } = useApp();
  const [p, setP] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<ProductCardData[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    if (!productSlug) return;
    fetch(`/api/products?slug=${productSlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.slug) {
          setP({
            ...d,
            sizes: Array.isArray(d.sizes) ? d.sizes : [],
            images: Array.isArray(d.images) ? d.images : [],
            reviews: Array.isArray(d.reviews) ? d.reviews : [],
            nutrition: d.nutrition && typeof d.nutrition === 'object' ? d.nutrition : { servingSize: '', servingsPerContainer: '', rows: [] },
          });
          setSizeIdx(0);
          setQty(1);
          setActiveImg(0);
        }
      })
      .catch(() => {});
    fetch('/api/products').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setRelated(d); }).catch(() => {});
  }, [productSlug]);

  if (!p || !p.slug) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-cream-dark rounded" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-cream-dark rounded-3xl" />
            <div className="space-y-3">
              <div className="h-8 w-3/4 bg-cream-dark rounded" />
              <div className="h-4 w-full bg-cream-dark rounded" />
              <div className="h-4 w-2/3 bg-cream-dark rounded" />
              <div className="h-12 w-full bg-cream-dark rounded mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const avgRating = p.reviews.length
    ? (p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)
    : '4.7';

  const handleAdd = () => {
    const size = p.sizes[sizeIdx];
    addToCart({
      slug: p.slug,
      name: p.name,
      size: size.label,
      unitPrice: size.price,
      quantity: qty,
      image: p.images[0],
    });
    toast.success(`${p.name} (${size.label}) × ${qty} added to cart`);
  };

  const handleBuyNow = () => {
    handleAdd();
    setView('checkout');
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-gold/15">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center gap-1 text-xs text-brown/70">
          <button onClick={() => setView('home')} className="hover:text-brown-dark">Home</button>
          <ChevronRight className="h-3 w-3" />
          <button onClick={() => setView('products')} className="hover:text-brown-dark">Shop</button>
          <ChevronRight className="h-3 w-3" />
          <span className="text-brown-dark font-medium">{p.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-3xl overflow-hidden bg-cream-dark border-4 border-white shadow-brown">
              <img src={p.images[activeImg]} alt={p.name} className="h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {p.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'aspect-square rounded-xl overflow-hidden border-2 transition-all',
                    activeImg === i ? 'border-gold shadow-gold' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={img} alt={`${p.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {p.isNew && <Badge className="bg-brand-green text-white">New Arrival</Badge>}
              {p.popularity > 800 && <Badge className="gradient-gold text-brown-dark">Bestseller</Badge>}
              <Badge variant="outline" className="border-gold/40 text-brown capitalize">{p.category.replace('-', ' ')}</Badge>
              {p.inStock ? (
                <Badge className="bg-brand-green/10 text-brand-green border border-brand-green/30">
                  <Check className="h-3 w-3 mr-1" /> In Stock ({p.stockQty} units)
                </Badge>
              ) : (
                <Badge className="bg-brand-red/10 text-brand-red border border-brand-red/30">Out of stock</Badge>
              )}
            </div>

            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-brown-dark text-balance">{p.name}</h1>
              <p className="text-brown/70 mt-2">{p.tagline}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={cn('h-4 w-4', i <= Math.round(Number(avgRating)) ? 'text-gold fill-gold' : 'text-brown/20')} />
                ))}
              </div>
              <span className="text-sm font-semibold text-brown-dark">{avgRating}</span>
              <span className="text-sm text-brown/60">({p.reviews.length} reviews)</span>
            </div>

            <p className="text-brown/80 leading-relaxed">{p.description.split('\n')[0]}</p>

            {/* Size selector */}
            <div>
              <p className="text-sm font-semibold text-brown-dark mb-2">Choose your size</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {p.sizes.map((s, i) => (
                  <button
                    key={s.sku}
                    onClick={() => setSizeIdx(i)}
                    className={cn(
                      'p-3 rounded-xl border-2 text-left transition-all',
                      sizeIdx === i
                        ? 'border-gold bg-cream shadow-gold'
                        : 'border-gold/15 bg-white hover:border-gold/40'
                    )}
                  >
                    <p className="text-sm font-semibold text-brown-dark">{s.label}</p>
                    <p className="text-lg font-bold text-brown">GHS {s.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-cream rounded-xl border border-gold/30">
                <button
                  className="h-10 w-10 flex items-center justify-center text-brown hover:text-brown-dark"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold text-brown-dark">{qty}</span>
                <button
                  className="h-10 w-10 flex items-center justify-center text-brown hover:text-brown-dark"
                  onClick={() => setQty(Math.min(p.stockQty, qty + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                className="flex-1 gradient-gold text-brown-dark hover:opacity-90 font-semibold h-11"
                onClick={handleAdd}
                disabled={!p.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
              <Button
                className="flex-1 gradient-brown text-cream hover:opacity-90 font-semibold h-11"
                onClick={handleBuyNow}
                disabled={!p.inStock}
              >
                Buy Now
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gold/30 text-brown" onClick={() => toast.info('Added to wishlist')}>
                <Heart className="h-4 w-4 mr-1" /> Wishlist
              </Button>
              <Button variant="outline" size="sm" className="border-gold/30 text-brown" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied'); }}>
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
            </div>

            <Separator className="bg-gold/20" />

            {/* Trust badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Truck, label: '24-72h delivery' },
                { icon: Shield, label: 'Secure payment' },
                { icon: Leaf, label: 'No preservatives' },
                { icon: Award, label: 'FDA approved' },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center text-center gap-1 p-2">
                  <f.icon className="h-5 w-5 text-gold" />
                  <span className="text-[11px] text-brown/70 font-medium">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: description, ingredients, nutrition, reviews */}
        <div className="mt-12">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-cream border border-gold/20 h-auto p-1 flex flex-wrap">
              <TabsTrigger value="description" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Description</TabsTrigger>
              <TabsTrigger value="ingredients" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Ingredients</TabsTrigger>
              <TabsTrigger value="nutrition" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Nutrition Facts</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Reviews ({p.reviews.length})</TabsTrigger>
              <TabsTrigger value="preparation" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Preparation</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card className="p-6 border-gold/15">
                <div className="prose prose-brown max-w-none">
                  {p.description.split('\n').map((para, i) => (
                    <p key={i} className="text-brown/80 leading-relaxed mb-3">{para}</p>
                  ))}
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gold/15">
                  <Feature icon={Flame} title="Slow-roasted" body="Small-batch method, never mass-produced." />
                  <Feature icon={Leaf} title="All-natural" body="No preservatives, artificial colours or flavours." />
                  <Feature icon={MapPin} title="Made in Dzodze" body="Volta Region, Ghana." />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <Card className="p-6 border-gold/15">
                <h3 className="font-display text-xl font-bold text-brown-dark mb-3">Ingredients</h3>
                <p className="text-brown/80 leading-relaxed">{p.ingredients}</p>
                <div className="mt-4 p-3 rounded-lg bg-brand-red/5 border border-brand-red/20 text-sm text-brown/80">
                  <strong className="text-brand-red">Allergen note:</strong> Contains fish (anchovies), crustaceans (shrimp) and peanuts (Tom Brown). Produced in a facility that handles nuts, soy and dairy.
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <Card className="p-6 border-gold/15 max-w-2xl">
                <h3 className="font-display text-xl font-bold text-brown-dark mb-1">Nutrition Facts</h3>
                <p className="text-xs text-brown/60 mb-4">{p.nutrition.servingSize} • {p.nutrition.servingsPerContainer}</p>
                <table className="w-full text-sm">
                  <tbody>
                    {p.nutrition.rows.map(([k, v], i) => (
                      <tr key={i} className={cn(i % 2 === 0 ? 'bg-cream/50' : '', 'border-b border-gold/10')}>
                        <td className="py-2 px-3 font-medium text-brown-dark">{k}</td>
                        <td className="py-2 px-3 text-right text-brown/80">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid md:grid-cols-3 gap-5">
                {/* Summary */}
                <Card className="p-6 border-gold/15 h-fit">
                  <div className="text-center">
                    <p className="font-display text-5xl font-bold text-brown-dark">{avgRating}</p>
                    <div className="flex justify-center mt-2">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className={cn('h-5 w-5', i <= Math.round(Number(avgRating)) ? 'text-gold fill-gold' : 'text-brown/20')} />
                      ))}
                    </div>
                    <p className="text-sm text-brown/60 mt-2">{p.reviews.length} verified reviews</p>
                  </div>
                  <Button
                    className="w-full mt-4 gradient-gold text-brown-dark hover:opacity-90 font-semibold"
                    onClick={() => toast.info('Review form coming soon — for now, your review will be auto-approved.')}
                  >
                    Write a Review
                  </Button>
                </Card>

                {/* List */}
                <div className="md:col-span-2 space-y-3">
                  {p.reviews.length === 0 ? (
                    <Card className="p-6 text-center border-gold/15">
                      <p className="text-brown/60">No reviews yet — be the first to share your experience!</p>
                    </Card>
                  ) : (
                    p.reviews.map((r) => (
                      <Card key={r.id} className="p-4 border-gold/15">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full gradient-gold flex items-center justify-center text-brown-dark font-bold shrink-0">
                            {r.authorName[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-brown-dark">{r.authorName}</p>
                              <span className="text-xs text-brown/50">
                                {new Date(r.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex">
                                {[1,2,3,4,5].map((i) => (
                                  <Star key={i} className={cn('h-3 w-3', i <= r.rating ? 'text-gold fill-gold' : 'text-brown/20')} />
                                ))}
                              </div>
                              <span className="text-[10px] bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded">Verified</span>
                            </div>
                            <p className="font-semibold text-sm text-brown-dark mt-1.5">{r.title}</p>
                            <p className="text-sm text-brown/80 mt-1">{r.body}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preparation" className="mt-6">
              <Card className="p-6 border-gold/15">
                <h3 className="font-display text-xl font-bold text-brown-dark mb-4">
                  {p.category === 'tom-brown' ? 'How to prepare Tom Brown' : 'How to enjoy SBF Shitor'}
                </h3>
                {p.category === 'tom-brown' ? (
                  <ol className="space-y-3">
                    {[
                      'Bring 1 cup of water to a rolling boil in a small saucepan.',
                      'In a bowl, mix 3 tablespoons (about 40g) of SBF Tom Brown Powder with 1/4 cup cold water to form a smooth paste (this prevents lumps).',
                      'Pour the paste slowly into the boiling water, stirring continuously with a wooden spoon.',
                      'Simmer on low heat for 3-4 minutes, stirring constantly, until it thickens to your desired consistency.',
                      'Sweeten to taste with honey, sugar or milk. Add a pinch of salt for balance. Serve hot.',
                      'Optional: top with groundnuts, coconut flakes or a teaspoon of SBF Shitor for a savoury twist.',
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="h-7 w-7 rounded-full gradient-gold text-brown-dark flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                        <p className="text-brown/80 pt-0.5">{step}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="space-y-3">
                    <p className="text-brown/80">SBF Special Shitor is a ready-to-eat condiment — no cooking needed. Here are some classic Ghanaian ways to enjoy it:</p>
                    <ul className="space-y-2">
                      {[
                        'Pair with banku and grilled tilapia — the classic Ghanaian combo.',
                        'Stir a spoonful into plain rice, jollof or fried rice for an instant umami kick.',
                        'Serve alongside boiled yam, plantain or cocoyam with a sprinkle of salt.',
                        'Mix with gari and a little water for a quick student meal.',
                        'Use as a marinade for chicken, fish or beef before grilling.',
                        'Top your morning eggs with a small dollop for a fiery start to the day.',
                      ].map((tip, i) => (
                        <li key={i} className="flex gap-2 text-brown/80">
                          <Check className="h-4 w-4 text-brand-green shrink-0 mt-0.5" /> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold text-brown-dark mb-5">You may also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.filter((r) => r.slug !== p.slug).slice(0, 4).map((r) => (
                <ProductCard key={r.slug} p={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="h-9 w-9 rounded-lg bg-cream-dark flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <div>
        <p className="text-sm font-semibold text-brown-dark">{title}</p>
        <p className="text-xs text-brown/60">{body}</p>
      </div>
    </div>
  );
}
