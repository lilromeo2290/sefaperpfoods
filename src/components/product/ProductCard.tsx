'use client';

import { Star, Plus, ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface ProductCardData {
  slug: string;
  name: string;
  tagline: string;
  basePrice: number;
  images: string[];
  popularity: number;
  isNew: boolean;
  inStock: boolean;
  category: string;
  sizes: { label: string; price: number; sku: string }[];
}

export function ProductCard({ p }: { p: ProductCardData }) {
  const { setView, addToCart } = useApp();
  const [added, setAdded] = useState(false);

  const avgRating = 4.7;
  const reviewCount = Math.floor(p.popularity / 50) + 8;
  const img = p.images?.[0] || '/icons/logo.svg';

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const smallest = p.sizes[0];
    addToCart({
      slug: p.slug,
      name: p.name,
      size: smallest.label,
      unitPrice: smallest.price,
      quantity: 1,
      image: img,
    });
    setAdded(true);
    toast.success(`${p.name} (${smallest.label}) added to cart`);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => setView('product', p.slug)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gold/15 hover:border-gold/40 transition-all hover:shadow-brown cursor-pointer flex flex-col"
    >
      {/* image */}
      <div className="relative aspect-square bg-cream-dark overflow-hidden">
        <img
          src={img}
          alt={p.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {p.isNew && <Badge className="bg-brand-green text-white">New</Badge>}
          {!p.inStock && <Badge className="bg-brand-red text-white">Out of stock</Badge>}
          {p.popularity > 800 && <Badge className="gradient-gold text-brown-dark">Bestseller</Badge>}
        </div>
        <button
          onClick={quickAdd}
          disabled={!p.inStock}
          className={cn(
            'absolute bottom-2 right-2 h-10 w-10 rounded-full shadow-lg flex items-center justify-center transition-all',
            added ? 'bg-brand-green text-white' : 'gradient-gold text-brown-dark hover:scale-110',
            !p.inStock && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Quick add to cart"
        >
          {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      {/* body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-brown-dark text-base leading-tight line-clamp-1">{p.name}</h3>
            <p className="text-xs text-brown-dark mt-0.5 line-clamp-2">{p.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className={cn('h-3 w-3', i <= Math.round(avgRating) ? 'text-gold fill-gold' : 'text-brown/20')} />
            ))}
          </div>
          <span className="text-[11px] text-brown-dark">{avgRating} ({reviewCount})</span>
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-[10px] text-brown-dark uppercase tracking-wider">From</p>
            <p className="font-bold text-brown-dark text-lg">GHS {p.basePrice}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-brown text-brown hover:bg-cream text-xs"
            onClick={(e) => { e.stopPropagation(); setView('product', p.slug); }}
          >
            <ShoppingCart className="h-3 w-3 mr-1" /> View
          </Button>
        </div>
      </div>
    </div>
  );
}
