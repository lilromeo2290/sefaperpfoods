'use client';

import { useState, useRef } from 'react';
import {
  MapPin, LocateFixed, CreditCard, Smartphone, Wallet, CheckCircle2,
  Loader2, ShieldCheck, ChevronRight, ArrowLeft, Truck, Receipt, Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useApp, useCartSubtotal, useCartTotal } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const GHANA_REGIONS = [
  'Greater Accra', 'Volta', 'Oti', 'Eastern', 'Ashanti', 'Western', 'Western North',
  'Central', 'Bono', 'Bono East', 'Ahafo', 'Northern', 'Savannah', 'North East',
  'Upper East', 'Upper West',
];

const PAYMENTS = [
  { id: 'momo_mtn',    label: 'MTN Mobile Money',  sub: 'Dial *170# to approve after submit', icon: Smartphone, badge: 'MoMo', color: '#FFCC00' },
  { id: 'momo_telecel',label: 'Telecel Cash',       sub: 'Dial *110# to approve', icon: Smartphone, badge: 'MoMo', color: '#E60000' },
  { id: 'momo_at',     label: 'AirtelTigo Money',   sub: 'Dial *110# to approve', icon: Smartphone, badge: 'MoMo', color: '#0066CC' },
  { id: 'hubtel',      label: 'Hubtel',              sub: 'Pay via Hubtel checkout', icon: Wallet, badge: 'Gateway' },
  { id: 'paystack',    label: 'Paystack',            sub: 'Card or bank transfer', icon: Wallet, badge: 'Gateway' },
  { id: 'expresspay',  label: 'ExpressPay',          sub: 'Card or bank', icon: Wallet, badge: 'Gateway' },
  { id: 'card_visa',   label: 'Visa Card',           sub: 'Debit / Credit', icon: CreditCard, badge: 'International' },
  { id: 'card_mastercard', label: 'Mastercard',      sub: 'Debit / Credit', icon: CreditCard, badge: 'International' },
];

type Stage = 'form' | 'processing' | 'success';

export function CheckoutSection() {
  const { cart, setView, clearCart, setLastOrderRef, lastOrderRef, coupon } = useApp();
  const subtotal = useCartSubtotal();
  const total = useCartTotal();
  const [stage, setStage] = useState<Stage>('form');
  const [processingMsg, setProcessingMsg] = useState('Validating order details...');

  const [form, setForm] = useState({
    fullName: '', phone: '', whatsapp: '', email: '',
    address: '', digitalAddress: '', city: '', region: 'Greater Accra',
    lat: null as number | null, lng: null as number | null,
    notes: '',
  });
  const [payment, setPayment] = useState('momo_mtn');
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser. Please enter GPS coordinates manually.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set('lat', pos.coords.latitude);
        set('lng', pos.coords.longitude);
        setLocating(false);
        toast.success(`GPS captured: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
      },
      (err) => {
        setLocating(false);
        toast.error(`Could not capture GPS: ${err.message}. Please allow location permission.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.lat || !form.lng) {
      toast.error('Please capture your GPS location for accurate delivery.');
      return;
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    setStage('processing');

    const stages = [
      'Validating order details...',
      'Encrypting payment information...',
      `Sending request to ${PAYMENTS.find((p) => p.id === payment)?.label}...`,
      'Confirming payment with gateway...',
      'Assigning driver & route...',
      'Generating receipt & SMS confirmation...',
    ];
    for (let i = 0; i < stages.length; i++) {
      setProcessingMsg(stages[i]);
      await new Promise((r) => setTimeout(r, 800));
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.fullName,
          customerPhone: form.phone,
          customerEmail: form.email,
          customerWhatsapp: form.whatsapp,
          deliveryAddress: form.address,
          digitalAddress: form.digitalAddress,
          lat: form.lat,
          lng: form.lng,
          city: form.city,
          region: form.region,
          items: cart,
          subtotal: total.subtotal,
          deliveryFee: total.deliveryFee,
          discount: total.discount,
          total: total.total,
          couponCode: coupon?.code || null,
          paymentMethod: payment,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLastOrderRef(data.orderRef);
      clearCart();
      setStage('success');
      toast.success('Order placed successfully!');
    } catch (err: any) {
      setStage('form');
      toast.error('Order failed: ' + err.message);
    }
  };

  if (cart.length === 0 && stage !== 'success') {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <ShoppingBag className="h-12 w-12 text-brown-dark" />
        <h1 className="font-display text-2xl font-bold text-brown-dark">Your cart is empty</h1>
        <Button className="gradient-gold text-brown-dark hover:opacity-90 font-semibold" onClick={() => setView('products')}>
          Browse products
        </Button>
      </div>
    );
  }

  if (stage === 'success') {
    return <OrderSuccess orderRef={lastOrderRef} paymentLabel={PAYMENTS.find((p) => p.id === payment)?.label || ''} />;
  }

  if (stage === 'processing') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-cream rounded-3xl p-8 max-w-md w-full text-center shadow-brown border border-gold/30">
          <div className="h-20 w-20 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 className="h-10 w-10 text-brown-dark animate-spin" />
          </div>
          <h2 className="font-display text-2xl font-bold text-brown-dark">Processing your order</h2>
          <p className="text-brown-dark mt-2 text-sm">{processingMsg}</p>
          <p className="text-xs text-brown-dark mt-4">Please do not close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="gradient-brown text-cream py-10">
        <div className="container mx-auto px-4 md:px-6">
          <Button variant="ghost" size="sm" className="text-cream/70 hover:text-gold hover:bg-cream/10 mb-2" onClick={() => setView('cart')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to cart
          </Button>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gold">Checkout</h1>
          <p className="text-cream/70 mt-2">Almost there — fill in your details to receive fresh delivery.</p>
        </div>
      </div>

      <form onSubmit={submit} className="container mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left: forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer info */}
          <Card className="p-5 md:p-6 border-gold/15">
            <h2 className="font-display font-bold text-brown-dark text-lg mb-4 flex items-center gap-2">
              <span className="h-7 w-7 rounded-full gradient-gold text-brown-dark text-sm flex items-center justify-center font-bold">1</span>
              Customer Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full Name" required>
                <Input required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Ama Serwaa" className="bg-cream border-gold/30 text-brown-dark" />
              </Field>
              <Field label="Phone Number" required>
                <Input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="024 797 8973" className="bg-cream border-gold/30 text-brown-dark" />
              </Field>
              <Field label="WhatsApp Number">
                <Input type="tel" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="024 797 8973" className="bg-cream border-gold/30 text-brown-dark" />
              </Field>
              <Field label="Email Address" required>
                <Input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" className="bg-cream border-gold/30 text-brown-dark" />
              </Field>
            </div>
          </Card>

          {/* Delivery + GPS */}
          <Card className="p-5 md:p-6 border-gold/15">
            <h2 className="font-display font-bold text-brown-dark text-lg mb-4 flex items-center gap-2">
              <span className="h-7 w-7 rounded-full gradient-gold text-brown-dark text-sm flex items-center justify-center font-bold">2</span>
              Delivery Address & GPS Location
            </h2>
            <div className="space-y-3">
              <Field label="Street Address" required>
                <Input required value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="House 12, Mango Street, East Legon" className="bg-cream border-gold/30 text-brown-dark" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Ghana Post Digital Address">
                  <Input value={form.digitalAddress} onChange={(e) => set('digitalAddress', e.target.value)} placeholder="GA-123-4567" className="bg-cream border-gold/30 text-brown-dark" />
                </Field>
                <Field label="City / Town" required>
                  <Input required value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Accra" className="bg-cream border-gold/30 text-brown-dark" />
                </Field>
              </div>
              <Field label="Region" required>
                <select
                  value={form.region}
                  onChange={(e) => set('region', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gold/30 bg-cream text-brown-dark text-sm"
                >
                  {GHANA_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>

              {/* GPS capture */}
              <div className="rounded-xl border-2 border-dashed border-gold/30 bg-cream/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-brown-dark" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-brown-dark text-sm">GPS Location (Required)</p>
                    <p className="text-xs text-brown-dark mt-0.5">
                      We use your GPS coordinates to assign the nearest dispatch rider and verify delivery coverage.
                    </p>
                    {form.lat && form.lng ? (
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <Badge className="bg-brand-green/10 text-brand-green border border-brand-green/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> GPS captured
                        </Badge>
                        <code className="text-xs bg-cream-dark px-2 py-1 rounded text-brown-dark">
                          {form.lat.toFixed(5)}, {form.lng.toFixed(5)}
                        </code>
                        <button type="button" onClick={captureLocation} className="text-xs text-brown underline hover:text-brown-dark">
                          Re-capture
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={captureLocation}
                        disabled={locating}
                        className="mt-2 gradient-brown text-cream hover:opacity-90 font-semibold h-9"
                      >
                        {locating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LocateFixed className="h-4 w-4 mr-2" />}
                        {locating ? 'Locating...' : 'Capture my GPS location'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Map preview */}
                <div
                  ref={mapRef}
                  className="mt-3 aspect-[16/5] rounded-lg bg-gradient-to-br from-cream-dark to-cream relative overflow-hidden border border-gold/20"
                >
                  {/* Mock map */}
                  <div className="absolute inset-0 bg-grain opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {form.lat && form.lng ? (
                      <div className="text-center">
                        <div className="h-12 w-12 rounded-full bg-brand-red/20 flex items-center justify-center mx-auto animate-pulse">
                          <MapPin className="h-6 w-6 text-brand-red fill-brand-red" />
                        </div>
                        <p className="text-xs text-brown-dark mt-1 font-medium">Your delivery location</p>
                        <p className="text-[10px] text-brown-dark">Distance from dispatch: ~12.4 km</p>
                      </div>
                    ) : (
                      <p className="text-xs text-brown-dark">Map preview will appear here after GPS capture</p>
                    )}
                  </div>
                  {/* Mock map grid */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `linear-gradient(#5D4037 1px, transparent 1px), linear-gradient(90deg, #5D4037 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }} />
                </div>
              </div>

              <Field label="Delivery Notes (optional)">
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="e.g. Call on arrival, gate code 1234, etc."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-cream text-brown-dark text-sm resize-none"
                />
              </Field>
            </div>
          </Card>

          {/* Payment */}
          <Card className="p-5 md:p-6 border-gold/15">
            <h2 className="font-display font-bold text-brown-dark text-lg mb-4 flex items-center gap-2">
              <span className="h-7 w-7 rounded-full gradient-gold text-brown-dark text-sm flex items-center justify-center font-bold">3</span>
              Payment Method
            </h2>
            <RadioGroup value={payment} onValueChange={setPayment} className="grid sm:grid-cols-2 gap-2">
              {PAYMENTS.map((p) => (
                <label
                  key={p.id}
                  htmlFor={p.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all',
                    payment === p.id ? 'border-gold bg-cream shadow-gold' : 'border-gold/15 bg-white hover:border-gold/40'
                  )}
                >
                  <RadioGroupItem id={p.id} value={p.id} className="text-gold" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p.icon className="h-4 w-4 text-brown shrink-0" />
                      <p className="text-sm font-semibold text-brown-dark truncate">{p.label}</p>
                    </div>
                    <p className="text-[11px] text-brown-dark">{p.sub}</p>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-gold/30 text-brown-dark shrink-0">{p.badge}</Badge>
                </label>
              ))}
            </RadioGroup>
            <div className="mt-3 flex items-start gap-2 text-xs text-brown-dark bg-brand-green/5 border border-brand-green/20 rounded-lg p-3">
              <ShieldCheck className="h-4 w-4 text-brand-green shrink-0 mt-0.5" />
              <p>All payments are processed over 256-bit SSL encryption. We never store your card details. Mobile Money payments require you to approve the prompt on your phone.</p>
            </div>
          </Card>
        </div>

        {/* Right: summary */}
        <div>
          <Card className="p-5 border-gold/15 sticky top-24">
            <h2 className="font-display font-bold text-brown-dark text-lg mb-4">Your Order</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {cart.map((item) => (
                <div key={`${item.slug}-${item.size}`} className="flex gap-2 items-center text-sm">
                  <div className="h-10 w-10 rounded bg-cream-dark overflow-hidden shrink-0">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brown-dark truncate">{item.name}</p>
                    <p className="text-[11px] text-brown-dark">{item.size} × {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-brown-dark">GHS {(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator className="bg-gold/20 my-3" />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-brown-dark"><span>Subtotal</span><span>GHS {total.subtotal.toFixed(2)}</span></div>
              {total.discount > 0 && (
                <div className="flex justify-between text-brand-green"><span>Discount {coupon ? `(${coupon.code})` : ''}</span><span>-GHS {total.discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-brown-dark"><span>Delivery</span><span>GHS {total.deliveryFee.toFixed(2)}</span></div>
              <Separator className="bg-gold/20 my-1.5" />
              <div className="flex justify-between font-bold text-lg text-brown-dark"><span>Total</span><span>GHS {total.total.toFixed(2)}</span></div>
            </div>

            <Button type="submit" className="w-full mt-4 gradient-gold text-brown-dark hover:opacity-90 font-bold h-12 text-base">
              <ShieldCheck className="h-4 w-4 mr-2" /> Place Order — GHS {total.total.toFixed(2)}
            </Button>

            <div className="mt-3 space-y-1.5 text-xs text-brown-dark">
              <p className="flex items-center gap-1.5"><Truck className="h-3 w-3 text-gold" /> 24-72h delivery nationwide</p>
              <p className="flex items-center gap-1.5"><Receipt className="h-3 w-3 text-gold" /> Instant SMS & WhatsApp receipt</p>
              <p className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-gold" /> 48h money-back guarantee</p>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-medium text-brown-dark mb-1 block">
        {label} {required && <span className="text-brand-red">*</span>}
      </Label>
      {children}
    </div>
  );
}

function ShoppingBag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function OrderSuccess({ orderRef, paymentLabel }: { orderRef: string | null; paymentLabel: string }) {
  const { setView } = useApp();
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <Card className="p-8 text-center border-gold/30 shadow-brown">
          <div className="h-20 w-20 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-12 w-12 text-brand-green" />
          </div>
          <h1 className="font-display text-3xl font-bold text-brown-dark">Order Confirmed!</h1>
          <p className="text-brown-dark mt-2">
            Thank you for your order. We have received your payment via <strong>{paymentLabel}</strong> and our team is preparing your package now.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-cream border border-gold/20">
            <p className="text-xs text-brown-dark uppercase tracking-wider">Your Order Reference</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <p className="font-display text-2xl font-bold text-brown-dark">{orderRef}</p>
              <button
                onClick={() => { navigator.clipboard?.writeText(orderRef || ''); toast.success('Reference copied'); }}
                className="text-brown hover:text-brown-dark p-1"
                aria-label="Copy"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-brown-dark mt-2">
              Save this reference to track your order. We have also sent it via SMS and WhatsApp.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
            {[
              { icon: Receipt, label: 'Receipt sent', sub: 'SMS + WhatsApp' },
              { icon: Truck, label: 'Driver assigned', sub: 'In 1-2 hours' },
              { icon: MapPin, label: 'GPS verified', sub: 'Routing optimized' },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-lg bg-cream/50">
                <s.icon className="h-5 w-5 text-gold mx-auto mb-1" />
                <p className="font-semibold text-brown-dark">{s.label}</p>
                <p className="text-[10px] text-brown-dark">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <Button className="flex-1 gradient-gold text-brown-dark hover:opacity-90 font-semibold" onClick={() => setView('account')}>
              Track My Order <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button variant="outline" className="border-brown text-brown hover:bg-cream" onClick={() => setView('products')}>
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
