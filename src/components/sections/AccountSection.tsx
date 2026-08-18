'use client';

import { useState, useEffect } from 'react';
import {
  User, Package, MapPin, Heart, LogOut, Settings, Star, Truck, CheckCircle2,
  Clock, Search, Copy, Download, Repeat, Award, Gift, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STATUSES = ['RECEIVED', 'PAID', 'PROCESSING', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED'];
const STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'Order Received',
  PAID: 'Payment Confirmed',
  PROCESSING: 'Processing',
  DISPATCHED: 'Dispatched',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export function AccountSection() {
  const { authUser, login, logout, setView, lastOrderRef } = useApp();
  const [tab, setTab] = useState('orders');
  const [emailInput, setEmailInput] = useState('');
  const [trackInput, setTrackInput] = useState(lastOrderRef || '');
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (lastOrderRef) {
      setTrackInput(lastOrderRef);
      trackOrder(lastOrderRef);
    }
  }, [lastOrderRef]);

  const trackOrder = async (ref?: string) => {
    const orderRef = ref || trackInput;
    if (!orderRef) return;
    setTracking(true);
    try {
      const res = await fetch(`/api/orders?ref=${encodeURIComponent(orderRef)}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setTrackedOrder(data);
      setTrackInput(orderRef);
    } catch {
      setTrackedOrder(null);
      toast.error('Order not found. Check your reference and try again.');
    } finally {
      setTracking(false);
    }
  };

  // Load demo orders
  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then((d) => setMyOrders(d.slice(0, 5))).catch(() => {});
  }, []);

  if (!authUser) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-md">
          <Card className="p-8 border-gold/15 shadow-brown">
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-3 shadow-gold">
                <User className="h-8 w-8 text-brown-dark" />
              </div>
              <h1 className="font-display text-2xl font-bold text-brown-dark">Welcome back</h1>
              <p className="text-brown-dark text-sm mt-1">Sign in or track an order without an account.</p>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); login(emailInput || 'guest@sbffoods.com', 'CUSTOMER'); toast.success('Signed in successfully'); }}
              className="space-y-3"
            >
              <Input
                type="email"
                placeholder="Email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-cream border-gold/30 text-brown-dark"
              />
              <Input
                type="password"
                placeholder="Password"
                defaultValue="demo1234"
                className="bg-cream border-gold/30 text-brown-dark"
              />
              <Button type="submit" className="w-full gradient-gold text-brown-dark hover:opacity-90 font-semibold h-11">
                Sign In
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gold/20" />
              <span className="text-xs text-brown-dark">OR</span>
              <div className="flex-1 h-px bg-gold/20" />
            </div>

            <p className="text-sm font-semibold text-brown-dark mb-2">Track an order</p>
            <div className="flex gap-2">
              <Input
                placeholder="Order ref (e.g. SBF-2026-1234)"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                className="bg-cream border-gold/30 text-brown-dark"
              />
              <Button onClick={() => trackOrder()} disabled={tracking} className="gradient-brown text-cream hover:opacity-90">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-brown-dark mt-2">No account needed — just enter your order reference.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Profile header */}
      <div className="gradient-brown text-cream py-10">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-gold">
              <AvatarFallback className="gradient-gold text-brown-dark text-xl font-bold">
                {authUser.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-gold">{authUser.name}</h1>
              <p className="text-cream/70 text-sm">{authUser.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-gold/20 text-gold border border-gold/30">
                  <Award className="h-3 w-3 mr-1" /> Gold Member
                </Badge>
                <Badge className="bg-cream/10 text-cream border border-cream/20">1,250 pts</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" className="border-cream/30 text-cream hover:bg-cream/10" onClick={logout}>
            <LogOut className="h-4 w-4 mr-1" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Loyalty summary */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 border-gold/15">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-xs text-brown-dark">Loyalty Tier</p>
                <p className="font-display font-bold text-brown-dark text-lg">Gold</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-gold/15">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-brand-green/10 flex items-center justify-center">
                <Gift className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <p className="text-xs text-brown-dark">Reward Points</p>
                <p className="font-display font-bold text-brown-dark text-lg">1,250</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-gold/15">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-brand-red/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-brand-red" />
              </div>
              <div>
                <p className="text-xs text-brown-dark">Total Orders</p>
                <p className="font-display font-bold text-brown-dark text-lg">{myOrders.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Order tracking widget */}
        <Card className="p-5 md:p-6 border-gold/15 mb-6">
          <h2 className="font-display font-bold text-brown-dark text-lg mb-3 flex items-center gap-2">
            <Search className="h-5 w-5 text-gold" /> Track an Order
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter order reference (e.g. SBF-2026-1234)"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && trackOrder()}
              className="bg-cream border-gold/30 text-brown-dark"
            />
            <Button onClick={() => trackOrder()} disabled={tracking} className="gradient-gold text-brown-dark hover:opacity-90 font-semibold">
              {tracking ? 'Searching...' : 'Track'}
            </Button>
          </div>

          {trackedOrder && (
            <div className="mt-6">
              <OrderTracker order={trackedOrder} />
            </div>
          )}
        </Card>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-cream border border-gold/20 h-auto p-1 flex flex-wrap">
            <TabsTrigger value="orders" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <Package className="h-3 w-3 mr-1" /> Order History
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <MapPin className="h-3 w-3 mr-1" /> Addresses
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <Heart className="h-3 w-3 mr-1" /> Wishlist
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <Settings className="h-3 w-3 mr-1" /> Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <div className="space-y-3">
              {myOrders.length === 0 ? (
                <Card className="p-8 text-center border-gold/15">
                  <Package className="h-10 w-10 text-brown-dark mx-auto mb-3" />
                  <p className="text-brown-dark">No orders yet. Start shopping to see your history here.</p>
                  <Button className="mt-3 gradient-gold text-brown-dark hover:opacity-90" onClick={() => setView('products')}>
                    Shop Now
                  </Button>
                </Card>
              ) : (
                myOrders.map((o) => (
                  <Card key={o.orderRef} className="p-4 border-gold/15">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-display font-bold text-brown-dark flex items-center gap-2">
                          {o.orderRef}
                          <button onClick={() => { navigator.clipboard?.writeText(o.orderRef); toast.success('Reference copied'); }} className="text-brown-dark hover:text-brown">
                            <Copy className="h-3 w-3" />
                          </button>
                        </p>
                        <p className="text-xs text-brown-dark">
                          {new Date(o.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <Badge className={cn(
                        'border',
                        o.status === 'DELIVERED' ? 'bg-brand-green/10 text-brand-green border-brand-green/30' :
                        o.status === 'CANCELLED' ? 'bg-brand-red/10 text-brand-red border-brand-red/30' :
                        'bg-gold/10 text-gold border-gold/30'
                      )}>
                        {STATUS_LABELS[o.status] || o.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gold/10">
                      <p className="font-bold text-brown-dark">GHS {o.total.toFixed(2)}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-brown text-brown hover:bg-cream text-xs" onClick={() => trackOrder(o.orderRef)}>
                          Track
                        </Button>
                        <Button size="sm" variant="outline" className="border-brown text-brown hover:bg-cream text-xs" onClick={() => toast.info('Receipt downloaded')}>
                          <Download className="h-3 w-3 mr-1" /> Receipt
                        </Button>
                        <Button size="sm" className="gradient-gold text-brown-dark hover:opacity-90 text-xs" onClick={() => setView('products')}>
                          <Repeat className="h-3 w-3 mr-1" /> Reorder
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="addresses" className="mt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-5 border-gold/15">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="bg-gold/20 text-gold border border-gold/30 mb-2">Default</Badge>
                    <p className="font-semibold text-brown-dark">Home</p>
                    <p className="text-sm text-brown-dark mt-1">12 Mango Street, East Legon, Accra</p>
                    <p className="text-xs text-brown-dark mt-1">GA-123-4567 • +233 247 968 973</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-brown hover:bg-cream" onClick={() => toast.info('Edit address')}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
              <Card className="p-5 border-dashed border-2 border-gold/30 flex items-center justify-center min-h-32">
                <Button variant="ghost" className="text-brown hover:bg-cream" onClick={() => toast.info('Add new address')}>
                  + Add new address
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-6">
            <Card className="p-8 text-center border-gold/15">
              <Heart className="h-10 w-10 text-brown-dark mx-auto mb-3" />
              <p className="text-brown-dark">Your wishlist is empty.</p>
              <Button className="mt-3 gradient-gold text-brown-dark hover:opacity-90" onClick={() => setView('products')}>
                Discover products
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6 border-gold/15 max-w-2xl">
              <h3 className="font-display font-bold text-brown-dark text-lg mb-4">Profile Information</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-brown-dark">Full Name</label>
                  <Input defaultValue={authUser.name} className="mt-1 bg-cream border-gold/30 text-brown-dark" />
                </div>
                <div>
                  <label className="text-xs font-medium text-brown-dark">Email</label>
                  <Input defaultValue={authUser.email} className="mt-1 bg-cream border-gold/30 text-brown-dark" />
                </div>
                <div>
                  <label className="text-xs font-medium text-brown-dark">Phone</label>
                  <Input defaultValue="+233 247 968 973" className="mt-1 bg-cream border-gold/30 text-brown-dark" />
                </div>
                <div>
                  <label className="text-xs font-medium text-brown-dark">Birthday</label>
                  <Input type="date" className="mt-1 bg-cream border-gold/30 text-brown-dark" />
                </div>
              </div>
              <Button className="mt-4 gradient-gold text-brown-dark hover:opacity-90 font-semibold" onClick={() => toast.success('Profile updated')}>
                Save Changes
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OrderTracker({ order }: { order: any }) {
  const items = typeof order.itemsJson === 'string' ? JSON.parse(order.itemsJson) : order.itemsJson;
  const currentIdx = STATUSES.indexOf(order.status);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-brown-dark uppercase tracking-wider">Order Reference</p>
          <p className="font-display font-bold text-brown-dark text-xl">{order.orderRef}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-brown-dark uppercase tracking-wider">Estimated Delivery</p>
          <p className="font-semibold text-brown-dark">
            {new Date(Date.now() + 36 * 3600 * 1000).toLocaleString('en', {
              weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="relative">
        <div className="grid grid-cols-6 gap-1">
          {STATUSES.map((s, i) => {
            const done = i <= currentIdx;
            const active = i === currentIdx;
            return (
              <div key={s} className="flex flex-col items-center text-center">
                <div className={cn(
                  'h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                  done ? 'gradient-gold text-brown-dark border-gold' : 'bg-cream text-brown-dark border-gold/30',
                  active && 'ring-4 ring-gold/20 animate-pulse'
                )}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <p className={cn('text-[10px] mt-1 font-medium', done ? 'text-brown-dark' : 'text-brown-dark')}>
                  {STATUS_LABELS[s]}
                </p>
              </div>
            );
          })}
        </div>
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gold/20 -z-10">
          <div
            className="h-full gradient-gold transition-all"
            style={{ width: `${(currentIdx / (STATUSES.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Driver info */}
      {(order.status === 'DISPATCHED' || order.status === 'IN_TRANSIT') && (
        <Card className="p-4 border-gold/15 bg-cream/50">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full gradient-brown flex items-center justify-center">
              <Truck className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brown-dark">{order.driverName || 'Yaw Mensah'} • {order.vehicle || 'Motorbike • GR-1234-24'}</p>
              <p className="text-xs text-brown-dark">Live tracking enabled • ETA 35 mins</p>
            </div>
            <Button size="sm" variant="outline" className="border-brown text-brown hover:bg-cream" onClick={() => toast.info('Calling driver...')}>
              Call
            </Button>
          </div>
        </Card>
      )}

      {/* Items + total */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Card className="p-4 border-gold/15">
          <p className="text-xs font-semibold text-brown-dark mb-2">Items</p>
          <div className="space-y-1">
            {items.map((it: any, i: number) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-brown-dark">{it.name} ({it.size}) × {it.quantity}</span>
                <span className="text-brown-dark font-medium">GHS {(it.unitPrice * it.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4 border-gold/15">
          <p className="text-xs font-semibold text-brown-dark mb-2">Payment & Delivery</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-brown-dark">Total</span><span className="font-bold text-brown-dark">GHS {order.total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-brown-dark">Payment</span><span className="text-brown-dark">{order.paymentMethod.toUpperCase()}</span></div>
            <div className="flex justify-between"><span className="text-brown-dark">Status</span><span className="text-brand-green font-medium">{order.paymentStatus}</span></div>
            <div className="flex justify-between"><span className="text-brown-dark">Delivery to</span><span className="text-brown-dark text-right">{order.city}, {order.region}</span></div>
            {order.lat && order.lng && (
              <div className="flex justify-between"><span className="text-brown-dark">GPS</span><span className="text-brown-dark text-right">{order.lat.toFixed(4)}, {order.lng.toFixed(4)}</span></div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
