'use client';

import { useState } from 'react';
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, X, Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useApp, useCartSubtotal, useCartTotal } from '@/lib/store';
import { toast } from 'sonner';

export function CartSection() {
  const { cart, updateQty, removeFromCart, applyCoupon, coupon, setView, setCartOpen } = useApp();
  const subtotal = useCartSubtotal();
  const total = useCartTotal();
  const [couponInput, setCouponInput] = useState('');

  const apply = async () => {
    if (!couponInput.trim()) return;
    const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponInput)}&subtotal=${subtotal}`);
    const data = await res.json();
    if (data.valid) {
      applyCoupon({ code: data.code, type: data.type, value: data.value });
      toast.success(data.message);
    } else {
      toast.error(data.message || 'Invalid coupon');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <div className="h-24 w-24 rounded-full bg-cream-dark flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-brown/40" />
        </div>
        <h1 className="font-display text-3xl font-bold text-brown-dark">Your cart is empty</h1>
        <p className="text-brown/60 max-w-md">
          Looks like you haven't added any authentic Ghanaian goodness yet. Explore our slow-crafted Shitor and Tom Brown — fresh from Dzodze.
        </p>
        <Button
          className="mt-2 gradient-gold text-brown-dark hover:opacity-90 font-semibold"
          onClick={() => setView('products')}
        >
          <ShoppingBag className="h-4 w-4 mr-2" /> Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="gradient-brown text-cream py-10">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gold">Shopping Cart</h1>
          <p className="text-cream/70 mt-2">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <Card key={`${item.slug}-${item.size}`} className="p-4 border-gold/15 flex gap-4">
                <div className="h-24 w-24 rounded-xl bg-cream-dark overflow-hidden shrink-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-brown-dark text-base line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-brown/60 mt-0.5">Size: {item.size}</p>
                      <p className="text-sm font-bold text-brown mt-1">GHS {item.unitPrice.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.slug, item.size)}
                      className="text-brand-red/70 hover:text-brand-red p-1"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-cream-dark rounded-lg">
                      <button
                        className="h-8 w-8 flex items-center justify-center text-brown hover:text-brown-dark"
                        onClick={() => updateQty(item.slug, item.size, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-semibold w-8 text-center text-brown-dark">{item.quantity}</span>
                      <button
                        className="h-8 w-8 flex items-center justify-center text-brown hover:text-brown-dark"
                        onClick={() => updateQty(item.slug, item.size, item.quantity + 1)}
                        aria-label="Increase"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-bold text-brown-dark">GHS {(item.unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="ghost" className="text-brown hover:bg-cream" onClick={() => setView('products')}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Continue shopping
            </Button>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card className="p-5 border-gold/15 sticky top-24">
              <h2 className="font-display font-bold text-brown-dark text-lg mb-4">Order Summary</h2>

              {coupon ? (
                <div className="flex items-center justify-between bg-brand-green/10 border border-brand-green/30 rounded-lg px-3 py-2 mb-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-brand-green">
                    <Tag className="h-4 w-4" /> {coupon.code}
                  </span>
                  <button onClick={() => { applyCoupon(null); toast.info('Coupon removed'); }} className="text-xs text-brand-red hover:underline">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Coupon (try WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="bg-cream border-gold/30 text-brown-dark placeholder:text-brown/40"
                  />
                  <Button variant="outline" onClick={apply} className="border-brown text-brown hover:bg-cream">Apply</Button>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={`GHS ${subtotal.toFixed(2)}`} />
                {total.discount > 0 && (
                  <Row label="Discount" value={`-GHS ${total.discount.toFixed(2)}`} green />
                )}
                <Row label="Delivery" value={`GHS ${total.deliveryFee.toFixed(2)}`} />
                <Separator className="bg-gold/20 my-2" />
                <div className="flex justify-between font-bold text-lg text-brown-dark">
                  <span>Total</span>
                  <span>GHS {total.total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-4 gradient-brown text-cream hover:opacity-90 font-semibold h-12"
                onClick={() => setView('checkout')}
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>

              <div className="mt-4 pt-4 border-t border-gold/15 space-y-2">
                <p className="text-xs font-semibold text-brown-dark flex items-center gap-1.5">
                  <Truck className="h-3 w-3 text-gold" /> Delivery estimate
                </p>
                <p className="text-xs text-brown/60">
                  Accra & Kumasi: 24-48h • Other regions: 2-4 days. GPS coordinates required at checkout.
                </p>
                <p className="text-xs font-semibold text-brown-dark mt-2">Payment methods</p>
                <div className="flex flex-wrap gap-1">
                  {['MTN MoMo', 'Telecel', 'AirtelTigo', 'Paystack', 'Visa', 'Mastercard'].map((m) => (
                    <Badge key={m} variant="outline" className="text-[10px] border-gold/30 text-brown/70">{m}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={green ? 'text-brand-green' : 'text-brown/70'}>{label}</span>
      <span className={green ? 'text-brand-green font-medium' : 'text-brown-dark font-medium'}>{value}</span>
    </div>
  );
}
