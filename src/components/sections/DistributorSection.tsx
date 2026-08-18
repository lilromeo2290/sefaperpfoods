'use client';

import { useState } from 'react';
import {
  Users, Store, Truck, FileText, Package, CheckCircle2, ChevronRight,
  TrendingUp, Wallet, MapPin, Phone, Mail, Award, ArrowUpRight, Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/lib/store';
import { toast } from 'sonner';

const GHANA_REGIONS = [
  'Greater Accra', 'Volta', 'Oti', 'Eastern', 'Ashanti', 'Western', 'Western North',
  'Central', 'Bono', 'Bono East', 'Ahafo', 'Northern', 'Savannah', 'North East',
  'Upper East', 'Upper West',
];

export function DistributorSection() {
  const { authUser, login } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: '', contactName: '', email: '', phone: '', whatsapp: '',
    region: 'Greater Accra', city: '', address: '',
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/distributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSubmitted(true);
      login(form.email, 'DISTRIBUTOR');
      toast.success('Application submitted! We will review within 48 hours.');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!authUser || authUser.role !== 'DISTRIBUTOR') {
    return (
      <div>
        {/* Hero */}
        <section className="gradient-brown text-cream py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-grain opacity-10" />
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="max-w-3xl">
              <Badge className="bg-cream/10 text-gold border border-gold/30">Distributor Program</Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gold mt-3 text-balance">
                Build a business with Sefaperp Foods
              </h1>
              <p className="text-cream/80 mt-4 text-lg">
                Join our growing network of distributors across all 16 regions of Ghana. Bulk pricing, regional exclusivity, dedicated invoices, and a complete dashboard to manage your branches.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  { value: '50+', label: 'Active distributors' },
                  { value: '16/16', label: 'Regions covered' },
                  { value: 'GHS 18K+', label: 'Avg monthly profit' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-3xl font-bold text-gold">{s.value}</p>
                    <p className="text-xs text-cream/70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge className="bg-cream-dark text-brown-dark border border-gold/30">Why Distribute with Us</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brown-dark mt-2">Six reasons to partner with SBF</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Wallet, title: 'Bulk Pricing', body: 'Up to 30% off retail on bulk orders. The more you sell, the more you earn.' },
                { icon: MapPin, title: 'Regional Exclusivity', body: 'Lock in your territory. We do not onboard competing distributors in your region.' },
                { icon: FileText, title: 'Dedicated Invoices', body: 'VAT-compliant invoices, downloadable PDFs, automatic statement generation.' },
                { icon: Store, title: 'Branch Management', body: 'Manage multiple shop locations from one dashboard. Track stock per branch.' },
                { icon: Truck, title: 'Priority Dispatch', body: 'Distributor orders ship within 24h with dedicated logistics support.' },
                { icon: Award, title: 'Marketing Support', body: 'Co-branded flyers, POS materials, social media features and recipe cards.' },
              ].map((f) => (
                <Card key={f.title} className="p-6 border-gold/15 hover:shadow-brown transition-shadow">
                  <div className="h-12 w-12 rounded-xl gradient-gold flex items-center justify-center mb-4 shadow-gold">
                    <f.icon className="h-6 w-6 text-brown-dark" />
                  </div>
                  <h3 className="font-display font-bold text-brown-dark text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-brown-dark">{f.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tiers + Form */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Tiers */}
              <div>
                <Badge className="bg-brown text-cream">Distributor Tiers</Badge>
                <h2 className="font-display text-3xl font-bold text-brown-dark mt-2 mb-6">
                  Grow your tier, grow your margins
                </h2>
                <div className="space-y-3">
                  {[
                    { tier: 'Bronze',  min: '50 units/mo',  discount: '10% off', color: '#CD7F32' },
                    { tier: 'Silver',  min: '150 units/mo', discount: '15% off', color: '#C0C0C0' },
                    { tier: 'Gold',    min: '400 units/mo', discount: '22% off', color: '#D4AF37' },
                    { tier: 'Platinum',min: '1000 units/mo',discount: '30% off + free delivery', color: '#E5E4E2' },
                  ].map((t) => (
                    <Card key={t.tier} className="p-4 border-gold/15 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center text-brown-dark font-bold" style={{ background: t.color }}>
                        <Award className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-bold text-brown-dark">{t.tier}</p>
                        <p className="text-xs text-brown-dark">{t.min}</p>
                      </div>
                      <Badge className="bg-brand-green/10 text-brand-green border border-brand-green/30">{t.discount}</Badge>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Form */}
              <Card className="p-6 border-gold/15">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="h-20 w-20 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-12 w-12 text-brand-green" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-brown-dark">Application Received!</h3>
                    <p className="text-brown-dark mt-2">
                      Thank you for applying to become an Sefaperp Foods distributor. Our team will review your application and contact you within 48 hours.
                    </p>
                    <Button className="mt-4 gradient-gold text-brown-dark hover:opacity-90 font-semibold" onClick={() => login(form.email, 'DISTRIBUTOR')}>
                      Continue to Portal <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-2xl font-bold text-brown-dark mb-1">Apply to become a distributor</h3>
                    <p className="text-sm text-brown-dark mb-4">Fill in your details — approval within 48 hours.</p>
                    <form onSubmit={submit} className="space-y-3">
                      <Field label="Business Name" required>
                        <Input required value={form.businessName} onChange={(e) => set('businessName', e.target.value)} placeholder="e.g. Volta Foods Ltd" className="bg-cream border-gold/30 text-brown-dark" />
                      </Field>
                      <Field label="Contact Person" required>
                        <Input required value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="Full name" className="bg-cream border-gold/30 text-brown-dark" />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Email" required>
                          <Input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@business.com" className="bg-cream border-gold/30 text-brown-dark" />
                        </Field>
                        <Field label="Phone" required>
                          <Input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="024 797 8973" className="bg-cream border-gold/30 text-brown-dark" />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="WhatsApp">
                          <Input type="tel" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="024 797 8973" className="bg-cream border-gold/30 text-brown-dark" />
                        </Field>
                        <Field label="Region" required>
                          <select value={form.region} onChange={(e) => set('region', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gold/30 bg-cream text-brown-dark text-sm">
                            {GHANA_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="City / Town" required>
                          <Input required value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Accra" className="bg-cream border-gold/30 text-brown-dark" />
                        </Field>
                        <Field label="Address" required>
                          <Input required value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Shop location" className="bg-cream border-gold/30 text-brown-dark" />
                        </Field>
                      </div>
                      <Button type="submit" className="w-full gradient-gold text-brown-dark hover:opacity-90 font-semibold h-12">
                        Submit Application
                      </Button>
                      <p className="text-xs text-brown-dark text-center">By applying, you agree to our distributor terms and code of conduct.</p>
                    </form>
                  </>
                )}
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Distributor dashboard
  return <DistributorDashboard />;
}

function DistributorDashboard() {
  const { authUser, logout, setView } = useApp();
  const [tab, setTab] = useState('overview');

  return (
    <div className="min-h-screen">
      <div className="gradient-brown text-cream py-6">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gold">Distributor Portal</h1>
            <p className="text-cream/70 text-sm">Welcome, {authUser?.name} • Bronze Tier • Greater Accra</p>
          </div>
          <Button variant="outline" size="sm" className="border-cream/30 text-cream hover:bg-cream/10" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-cream border border-gold/20 h-auto p-1 flex flex-wrap">
            <TabsTrigger value="overview" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Bulk Orders</TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Invoices</TabsTrigger>
            <TabsTrigger value="branches" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Branches</TabsTrigger>
            <TabsTrigger value="deliveries" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">Deliveries</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DistStat icon={Package} label="This Month's Orders" value="14" trend="+3" />
              <DistStat icon={Wallet} label="Total Spent" value="GHS 4,250" trend="+12%" />
              <DistStat icon={TrendingUp} label="Est. Profit" value="GHS 1,820" trend="+8%" />
              <DistStat icon={Award} label="Tier Progress" value="72%" trend="Gold soon" />
            </div>

            <Card className="p-5 border-gold/15">
              <h3 className="font-display font-bold text-brown-dark mb-3">Quick Actions</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <Button className="h-auto py-4 flex-col items-start gradient-gold text-brown-dark hover:opacity-90" onClick={() => setView('products')}>
                  <Package className="h-5 w-5 mb-1" />
                  <span className="font-semibold">Place Bulk Order</span>
                  <span className="text-xs opacity-80">Browse catalog & order at distributor prices</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col items-start border-brown text-brown hover:bg-cream" onClick={() => toast.info('Generating invoice...')}>
                  <FileText className="h-5 w-5 mb-1" />
                  <span className="font-semibold">Download Invoices</span>
                  <span className="text-xs opacity-70">VAT-compliant PDFs</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col items-start border-brown text-brown hover:bg-cream" onClick={() => setTab('deliveries')}>
                  <Truck className="h-5 w-5 mb-1" />
                  <span className="font-semibold">Track Deliveries</span>
                  <span className="text-xs opacity-70">Live status of all shipments</span>
                </Button>
              </div>
            </Card>

            <Card className="p-5 border-gold/15">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-brown-dark">Tier Progress: Bronze → Silver</h3>
                <Badge className="bg-gold/20 text-gold border border-gold/30">72%</Badge>
              </div>
              <div className="h-3 rounded-full bg-cream-dark overflow-hidden">
                <div className="h-full gradient-gold" style={{ width: '72%' }} />
              </div>
              <p className="text-xs text-brown-dark mt-2">
                Order 50 more units this month to unlock Silver tier (15% off all bulk orders).
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card className="p-5 border-gold/15">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-brown-dark">Bulk Order History</h3>
                <Button className="gradient-gold text-brown-dark hover:opacity-90 font-semibold" onClick={() => setView('products')}>
                  <Package className="h-4 w-4 mr-1" /> New Bulk Order
                </Button>
              </div>
              <div className="space-y-2">
                {[
                  { ref: 'DIST-2026-0042', date: 'Aug 10', items: '12 × Shitor 1kg + 8 × Tom Brown 1.5kg', total: 1820, status: 'Delivered' },
                  { ref: 'DIST-2026-0041', date: 'Aug 3', items: '6 × Shitor 5kg + 4 × Tom Brown 5kg', total: 2740, status: 'Delivered' },
                  { ref: 'DIST-2026-0040', date: 'Jul 27', items: '10 × Shitor 500g', total: 550, status: 'Delivered' },
                ].map((o) => (
                  <div key={o.ref} className="flex items-center justify-between p-3 rounded-lg bg-cream/50">
                    <div>
                      <p className="font-semibold text-brown-dark text-sm">{o.ref}</p>
                      <p className="text-xs text-brown-dark">{o.date} • {o.items}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-brown-dark">GHS {o.total}</p>
                      <Badge className="bg-brand-green/10 text-brand-green border border-brand-green/30">{o.status}</Badge>
                      <Button size="sm" variant="ghost" className="text-brown hover:bg-cream" onClick={() => toast.info(`Downloading invoice ${o.ref}`)}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <Card className="p-5 border-gold/15">
              <h3 className="font-display font-bold text-brown-dark mb-3">Invoices & Statements</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {['Aug 2026', 'Jul 2026', 'Jun 2026'].map((m) => (
                  <Card key={m} className="p-4 border-gold/15">
                    <FileText className="h-8 w-8 text-gold mb-2" />
                    <p className="font-semibold text-brown-dark">Statement — {m}</p>
                    <p className="text-xs text-brown-dark">3 orders • GHS 4,510 total</p>
                    <Button size="sm" variant="outline" className="border-brown text-brown hover:bg-cream mt-2 w-full text-xs" onClick={() => toast.info(`Downloading ${m} statement`)}>
                      <Download className="h-3 w-3 mr-1" /> Download PDF
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="branches" className="mt-6">
            <Card className="p-5 border-gold/15">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-brown-dark">Your Branches</h3>
                <Button size="sm" className="gradient-gold text-brown-dark hover:opacity-90" onClick={() => toast.info('Add branch form')}>
                  + Add Branch
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: 'Makola Market Branch', city: 'Accra Central', sales: 1820 },
                  { name: 'East Legon Branch', city: 'East Legon, Accra', sales: 1240 },
                ].map((b) => (
                  <Card key={b.name} className="p-4 border-gold/15">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-brown-dark">{b.name}</p>
                        <p className="text-xs text-brown-dark flex items-center gap-1 mt-1"><Store className="h-3 w-3" /> {b.city}</p>
                      </div>
                      <Badge className="bg-brand-green/10 text-brand-green border border-brand-green/30">Active</Badge>
                    </div>
                    <p className="text-xs text-brown-dark mt-2">This month's sales</p>
                    <p className="font-display font-bold text-brown-dark">GHS {b.sales}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="deliveries" className="mt-6">
            <Card className="p-5 border-gold/15">
              <h3 className="font-display font-bold text-brown-dark mb-3">Active Deliveries</h3>
              <div className="space-y-2">
                {[
                  { ref: 'DIST-2026-0043', status: 'In Transit', eta: 'Today, 4:00 PM', driver: 'Yaw K.' },
                  { ref: 'DIST-2026-0044', status: 'Dispatched', eta: 'Tomorrow, 10:00 AM', driver: 'Kofi M.' },
                ].map((d) => (
                  <div key={d.ref} className="flex items-center justify-between p-3 rounded-lg bg-cream/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full gradient-brown flex items-center justify-center">
                        <Truck className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-brown-dark text-sm">{d.ref}</p>
                        <p className="text-xs text-brown-dark">Driver: {d.driver} • ETA: {d.eta}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-gold/30 text-brown-dark">{d.status}</Badge>
                      <Button size="sm" variant="outline" className="border-brown text-brown hover:bg-cream text-xs" onClick={() => toast.info('Live tracking...')}>
                        Track <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
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

function DistStat({ icon: Icon, label, value, trend }: { icon: any; label: string; value: string; trend: string }) {
  return (
    <Card className="p-4 border-gold/15">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gold" />
        </div>
        <Badge variant="outline" className="border-brand-green/30 text-brand-green text-[10px]">{trend}</Badge>
      </div>
      <p className="text-xs text-brown-dark mt-2">{label}</p>
      <p className="font-display text-xl font-bold text-brown-dark">{value}</p>
    </Card>
  );
}
