'use client';

import { useEffect, useState, useMemo } from 'react';
import { Filter, Search, SlidersHorizontal, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard, ProductCardData } from '@/components/product/ProductCard';

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'shitor', label: 'Shitor & Pastes' },
  { id: 'tom-brown', label: 'Tom Brown & Porridge' },
];

export function ProductsSection() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('popularity');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch(`/api/products?category=${category}&sort=${sort}`);
        const d = await r.json();
        if (!cancelled) {
          setProducts(d);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [category, sort]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="gradient-brown text-cream py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <Badge className="bg-cream/10 text-gold border border-gold/30">Our Products</Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gold mt-3">
            Authentic Ghanaian Foods
          </h1>
          <p className="text-cream/80 mt-3 max-w-2xl">
            Slow-roasted Shitor, stone-ground Tom Brown and more — fresh from our Dzodze kitchen to your table.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={category === c.id ? 'default' : 'outline'}
                className={category === c.id
                  ? 'gradient-gold text-brown-dark hover:opacity-90 font-semibold'
                  : 'border-brown text-brown hover:bg-cream'}
                onClick={() => setCategory(c.id)}
              >
                {c.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-dark" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-cream border-gold/30 text-brown-dark placeholder:text-brown-dark"
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44 bg-cream border-gold/30 text-brown-dark">
                <SlidersHorizontal className="h-4 w-4 mr-1 text-brown-dark" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="new">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-brown-dark mb-4">
          <Filter className="h-3.5 w-3.5" />
          <span>
            {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
            {search && ` matching "${search}"`}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gold/15">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
              <Grid3x3 className="h-9 w-9 text-brown-dark" />
            </div>
            <p className="font-display text-xl font-semibold text-brown-dark">No products found</p>
            <p className="text-sm text-brown-dark mt-1">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
