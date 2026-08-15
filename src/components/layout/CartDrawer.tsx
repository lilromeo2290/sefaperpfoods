'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, Tag, X, ArrowRight } from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useApp, useCartSubtotal, useCartTotal } from '@/lib/store';
import { toast } from 'sonner';

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, applyCoupon, coupon, setView } = useApp();
  const subtotal = useCartSubtotal();
  const total = useCartTotal();
  const [couponInput, setCouponInput] = useState('');

  const handleApply = async () => {
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

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-cream flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-gold/20 bg-brown text-cream">
          <SheetTitle className="flex items-center gap-2 text-cream">
            <ShoppingBag className="h-5 w-5 text-gold" />
            Your Cart
            <Badge className="ml-1 bg-gold text-brown-dark">{cart.length}</Badge>
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
            <div className="h-20 w-20 rounded-full bg-cream-dark flex items-center justify-center">
              <ShoppingBag className="h-9 w-9 text-brown/40" />
            </div>
            <p className="font-display text-xl font-semibold text-brown-dark">Your cart is empty</p>
            <p className="text-sm text-brown/60">Discover our authentic Ghanaian products — fresh from Dzodze.</p>
            <Button
              className="mt-2 gradient-gold text-brown-dark hover:opacity-90 font-semibold"
              onClick={() => {
                setCartOpen(false);
                setView('products');
              }}
            >
              Start Shopping
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={`${item.slug}-${item.size}`}
                  className="flex gap-3 bg-white rounded-xl p-3 border border-gold/15"
                >
                  <div className="h-16 w-16 rounded-lg bg-cream-dark overflow-hidden shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-brown-dark line-clamp-1">{item.name}</p>
                    <p className="text-xs text-brown/60">{item.size}</p>
                    <p className="text-sm font-bold text-brown mt-0.5">GHS {item.unitPrice.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1 bg-cream-dark rounded-lg">
                        <button
                          className="h-7 w-7 flex items-center justify-center text-brown hover:text-brown-dark"
                          onClick={() => updateQty(item.slug, item.size, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center text-brown-dark">{item.quantity}</span>
                        <button
                          className="h-7 w-7 flex items-center justify-center text-brown hover:text-brown-dark"
                          onClick={() => updateQty(item.slug, item.size, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.slug, item.size)}
                        className="text-brand-red/70 hover:text-brand-red p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-brown/60">Subtotal</p>
                    <p className="font-bold text-brown-dark">GHS {(item.unitPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon + Summary */}
            <div className="border-t border-gold/20 bg-white p-4 space-y-3">
              {coupon ? (
                <div className="flex items-center justify-between bg-brand-green/10 border border-brand-green/30 rounded-lg px-3 py-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-brand-green">
                    <Tag className="h-4 w-4" /> {coupon.code}
                  </span>
                  <button
                    onClick={() => { applyCoupon(null); toast.info('Coupon removed'); }}
                    className="text-xs text-brand-red hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code (try WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="bg-cream border-gold/30 text-brown-dark placeholder:text-brown/40"
                  />
                  <Button variant="outline" onClick={handleApply} className="border-brown text-brown hover:bg-cream">
                    Apply
                  </Button>
                </div>
              )}

              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-brown/70">
                  <span>Subtotal</span>
                  <span>GHS {subtotal.toFixed(2)}</span>
                </div>
                {total.discount > 0 && (
                  <div className="flex justify-between text-brand-green">
                    <span>Discount</span>
                    <span>-GHS {total.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-brown/70">
                  <span>Delivery</span>
                  <span>GHS {total.deliveryFee.toFixed(2)}</span>
                </div>
                <Separator className="my-1 bg-gold/30" />
                <div className="flex justify-between font-bold text-base text-brown-dark">
                  <span>Total</span>
                  <span>GHS {total.total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full gradient-brown text-cream hover:opacity-90 font-semibold h-11"
                onClick={() => {
                  setCartOpen(false);
                  setView('checkout');
                }}
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button
                variant="ghost"
                className="w-full text-brown hover:bg-cream"
                onClick={() => {
                  setCartOpen(false);
                  setView('cart');
                }}
              >
                View full cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
