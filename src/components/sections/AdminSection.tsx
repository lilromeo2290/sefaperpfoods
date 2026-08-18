'use client';

import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings,
  TrendingUp, TrendingDown, DollarSign, Boxes, AlertTriangle, Download,
  Search, Filter, Eye, Edit, MoreHorizontal, ChevronRight, Truck,
  Plus, ArrowUpRight, CheckCircle2, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useApp } from '@/lib/store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const COLORS = ['#D4AF37', '#5D4037', '#2E7D32', '#C62828', '#B8941F'];

export function AdminSection() {
  const { authUser, login, logout } = useApp();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  if (!authUser || authUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <Card className="p-8 border-gold/15 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="h-16 w-16 rounded-xl gradient-brown flex items-center justify-center mx-auto mb-3">
              <LayoutDashboard className="h-8 w-8 text-gold" />
            </div>
            <h1 className="font-display text-2xl font-bold text-brown-dark">Staff Portal</h1>
            <p className="text-brown-dark text-sm mt-1">Sign in to access the admin dashboard.</p>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;
            if (username === 'admin' && password === 'Clipe233@eng!') {
              login('admin', 'ADMIN');
              toast.success('Welcome back, Admin');
            } else {
              toast.error('Invalid credentials. Please check your username and password.');
            }
          }} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-brown-dark mb-1 block">Username</label>
              <Input name="username" placeholder="Enter username" required className="bg-cream border-gold/30 text-brown-dark" />
            </div>
            <div>
              <label className="text-xs font-medium text-brown-dark mb-1 block">Password</label>
              <Input name="password" type="password" placeholder="Enter password" required className="bg-cream border-gold/30 text-brown-dark" />
            </div>
            <Button type="submit" className="w-full gradient-brown text-cream hover:opacity-90 font-semibold h-11">
              Sign In
            </Button>
          </form>
          <p className="text-xs text-brown-dark mt-4 text-center">Staff access only. Contact your administrator if you need credentials.</p>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen py-20 text-center">
        <p className="text-brown-dark">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="gradient-brown text-cream py-6">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gold">Admin Dashboard</h1>
            <p className="text-cream/70 text-sm">Welcome back, {authUser.name} • Sefaperp Foods Control Center</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-cream/10 border border-cream/40 text-cream hover:bg-cream/20 hover:text-gold" onClick={() => toast.info('Exporting report...')}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            <Button size="sm" className="gradient-gold text-brown-dark hover:opacity-90 font-semibold border border-gold" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-cream border border-gold/20 h-auto p-1 flex flex-wrap overflow-x-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <LayoutDashboard className="h-3 w-3 mr-1" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <ShoppingCart className="h-3 w-3 mr-1" /> Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <Package className="h-3 w-3 mr-1" /> Products
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <Boxes className="h-3 w-3 mr-1" /> Inventory
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <Users className="h-3 w-3 mr-1" /> Customers
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <BarChart3 className="h-3 w-3 mr-1" /> Reports
            </TabsTrigger>
            <TabsTrigger value="delivery" className="data-[state=active]:gradient-gold data-[state=active]:text-brown-dark">
              <Truck className="h-3 w-3 mr-1" /> Delivery
            </TabsTrigger>
          </TabsList>

          {/* DASHBOARD */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={DollarSign} label="Daily Sales" value={`GHS ${stats.kpis.dailySales.toFixed(0)}`} trend={+12.4} color="gold" />
              <KpiCard icon={TrendingUp} label="Weekly Sales" value={`GHS ${stats.kpis.weeklySales.toFixed(0)}`} trend={+8.1} color="brown" />
              <KpiCard icon={ShoppingCart} label="Total Orders" value={stats.kpis.totalOrders} trend={+5.2} color="green" />
              <KpiCard icon={Users} label="Customers" value={stats.kpis.totalCustomers} trend={+15.7} color="red" />
            </div>

            {/* Charts row */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Sales 7 days */}
              <Card className="p-5 border-gold/15 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-brown-dark">Sales — last 7 days</h3>
                    <p className="text-xs text-brown-dark">Revenue & order count by day</p>
                  </div>
                  <Badge className="bg-brand-green/10 text-brand-green border border-brand-green/30">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12.4% vs last week
                  </Badge>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={stats.sales7d}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8D9B5" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#7B5E4F' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#7B5E4F' }} />
                    <Tooltip
                      contentStyle={{ background: '#FFF8E1', border: '1px solid #D4AF37', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: '#3E2723', fontWeight: 700 }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#colorRev)" name="Revenue (GHS)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Status breakdown */}
              <Card className="p-5 border-gold/15">
                <h3 className="font-display font-bold text-brown-dark mb-2">Order Status</h3>
                <p className="text-xs text-brown-dark mb-4">Current pipeline distribution</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={Object.entries(stats.statusCounts).map(([k, v]) => ({ name: k, value: v }))}
                      dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={45}
                    >
                      {Object.entries(stats.statusCounts).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#FFF8E1', border: '1px solid #D4AF37', borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {Object.entries(stats.statusCounts).map(([k, v]: any, i) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-brown-dark">
                        <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} /> {k.replace('_', ' ')}
                      </span>
                      <span className="font-semibold text-brown-dark">{v}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Top products + Regional */}
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="p-5 border-gold/15">
                <h3 className="font-display font-bold text-brown-dark mb-3">Top Products</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8D9B5" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#7B5E4F' }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fill: '#5D4037' }} />
                    <Tooltip contentStyle={{ background: '#FFF8E1', border: '1px solid #D4AF37', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="qty" fill="#D4AF37" radius={[0, 4, 4, 0]} name="Units sold" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5 border-gold/15">
                <h3 className="font-display font-bold text-brown-dark mb-3">Regional Demand</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.regional}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8D9B5" />
                    <XAxis dataKey="region" tick={{ fontSize: 10, fill: '#7B5E4F' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#7B5E4F' }} />
                    <Tooltip contentStyle={{ background: '#FFF8E1', border: '1px solid #D4AF37', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="#5D4037" radius={[4, 4, 0, 0]} name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent orders + Low stock */}
            <div className="grid lg:grid-cols-3 gap-4">
              <Card className="p-5 border-gold/15 lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-brown-dark">Recent Orders</h3>
                  <Button variant="ghost" size="sm" className="text-brown hover:bg-cream text-xs" onClick={() => setTab('orders')}>
                    View all <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
                  {stats.orders.map((o: any) => (
                    <div key={o.orderRef} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-cream/50">
                      <div>
                        <p className="text-sm font-semibold text-brown-dark">{o.orderRef}</p>
                        <p className="text-xs text-brown-dark">{o.customerName} • {o.region}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brown-dark">GHS {o.total.toFixed(2)}</p>
                        <Badge variant="outline" className={cn('text-[10px] mt-0.5', o.paymentStatus === 'PAID' ? 'border-brand-green/30 text-brand-green' : 'border-brand-red/30 text-brand-red')}>
                          {o.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 border-gold/15">
                <h3 className="font-display font-bold text-brown-dark mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-brand-red" /> Low Stock Alert
                </h3>
                <div className="space-y-2">
                  {stats.lowStock.length === 0 ? (
                    <p className="text-xs text-brown-dark">All products are well stocked.</p>
                  ) : (
                    stats.lowStock.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between text-xs">
                        <span className="text-brown-dark truncate">{p.name}</span>
                        <Badge className="bg-brand-red/10 text-brand-red border border-brand-red/30">
                          {p.stockQty} / {p.reorderLevel}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ORDERS */}
          <TabsContent value="orders" className="mt-6">
            <Card className="p-5 border-gold/15">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-display font-bold text-brown-dark">All Orders</h3>
                <div className="flex gap-2">
                  <Input placeholder="Search orders..." className="bg-cream border-gold/30 text-brown-dark w-48" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40 bg-cream border-gold/30 text-brown-dark">
                      <Filter className="h-3 w-3 mr-1 text-brown-dark" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gold/20 text-brown-dark">
                      <th className="py-2 pr-2 font-medium">Order Ref</th>
                      <th className="py-2 pr-2 font-medium">Customer</th>
                      <th className="py-2 pr-2 font-medium">Region</th>
                      <th className="py-2 pr-2 font-medium">Total</th>
                      <th className="py-2 pr-2 font-medium">Payment</th>
                      <th className="py-2 pr-2 font-medium">Status</th>
                      <th className="py-2 pr-2 font-medium">Date</th>
                      <th className="py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.orders.map((o: any) => (
                      <tr key={o.orderRef} className="border-b border-gold/10 hover:bg-cream/30">
                        <td className="py-2 pr-2 font-semibold text-brown-dark">{o.orderRef}</td>
                        <td className="py-2 pr-2 text-brown-dark">{o.customerName}</td>
                        <td className="py-2 pr-2 text-brown-dark">{o.region}</td>
                        <td className="py-2 pr-2 font-medium text-brown-dark">GHS {o.total.toFixed(2)}</td>
                        <td className="py-2 pr-2">
                          <Badge variant="outline" className={cn('text-[10px]', o.paymentStatus === 'PAID' ? 'border-brand-green/30 text-brand-green' : 'border-brand-red/30 text-brand-red')}>
                            {o.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-2 pr-2">
                          <Badge variant="outline" className="text-[10px] border-gold/30 text-brown-dark">
                            {o.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-2 pr-2 text-xs text-brown-dark">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="py-2">
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-brown hover:bg-cream" onClick={() => toast.info(`Viewing ${o.orderRef}`)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-brown hover:bg-cream" onClick={() => toast.info(`Editing ${o.orderRef}`)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products" className="mt-6">
            <Card className="p-5 border-gold/15">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-display font-bold text-brown-dark">Products ({stats.products.length})</h3>
                <Button className="gradient-gold text-brown-dark hover:opacity-90 font-semibold" onClick={() => toast.info('Add product form opens here')}>
                  <Plus className="h-4 w-4 mr-1" /> Add Product
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.products.map((p: any) => (
                  <Card key={p.id} className="p-4 border-gold/15 hover:shadow-brown transition-shadow">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-brown-dark">{p.name}</p>
                        <p className="text-xs text-brown-dark capitalize">{p.category.replace('-', ' ')}</p>
                      </div>
                      <Badge className={cn(
                        'text-[10px]',
                        p.stockQty <= p.reorderLevel ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-green/10 text-brand-green'
                      )}>
                        {p.stockQty} in stock
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-bold text-brown-dark">GHS {p.basePrice}</p>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-brown hover:bg-cream" onClick={() => toast.info('Edit product')}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-brown hover:bg-cream">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* INVENTORY */}
          <TabsContent value="inventory" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard icon={Boxes} label="Total Stock" value={stats.products.reduce((s: number, p: any) => s + p.stockQty, 0)} trend={+3.2} color="brown" />
              <KpiCard icon={AlertTriangle} label="Low Stock Items" value={stats.lowStock.length} trend={-1.4} color="red" />
              <KpiCard icon={Package} label="Total Products" value={stats.kpis.totalProducts} trend={0} color="gold" />
              <KpiCard icon={TrendingUp} label="Avg Popularity" value={Math.round(stats.products.reduce((s: number, p: any) => s + p.popularity, 0) / stats.products.length)} trend={+5.1} color="green" />
            </div>
            <Card className="p-5 border-gold/15">
              <h3 className="font-display font-bold text-brown-dark mb-3">Inventory Levels</h3>
              <div className="space-y-2">
                {stats.products.map((p: any) => {
                  const pct = Math.min(100, (p.stockQty / Math.max(p.reorderLevel * 3, 1)) * 100);
                  const low = p.stockQty <= p.reorderLevel;
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-32 shrink-0">
                        <p className="text-sm font-medium text-brown-dark truncate">{p.name}</p>
                      </div>
                      <div className="flex-1 h-3 rounded-full bg-cream-dark overflow-hidden">
                        <div
                          className={cn('h-full transition-all', low ? 'bg-brand-red' : 'gradient-gold')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="w-20 text-right text-xs">
                        <span className={cn('font-semibold', low ? 'text-brand-red' : 'text-brown-dark')}>{p.stockQty}</span>
                        <span className="text-brown-dark"> / {p.reorderLevel}</span>
                      </div>
                      {low && (
                        <Button size="sm" variant="outline" className="border-brand-red text-brand-red hover:bg-brand-red/5 text-[10px] h-7" onClick={() => toast.info('Reorder placed')}>
                          Reorder
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* CUSTOMERS */}
          <TabsContent value="customers" className="mt-6">
            <Card className="p-5 border-gold/15">
              <h3 className="font-display font-bold text-brown-dark mb-3">Customer Growth</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={[
                  { month: 'Jan', customers: 120 },
                  { month: 'Feb', customers: 145 },
                  { month: 'Mar', customers: 180 },
                  { month: 'Apr', customers: 210 },
                  { month: 'May', customers: 245 },
                  { month: 'Jun', customers: 280 },
                  { month: 'Jul', customers: 320 },
                  { month: 'Aug', customers: 380 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8D9B5" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7B5E4F' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#7B5E4F' }} />
                  <Tooltip contentStyle={{ background: '#FFF8E1', border: '1px solid #D4AF37', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="customers" stroke="#5D4037" strokeWidth={3} dot={{ fill: '#D4AF37', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* REPORTS */}
          <TabsContent value="reports" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Sales Report', desc: 'Monthly revenue, top products, payment breakdown', icon: DollarSign },
                { title: 'Product Performance', desc: 'Bestsellers, slow-movers, margin analysis', icon: BarChart3 },
                { title: 'Customer Report', desc: 'New vs returning, loyalty tiers, churn', icon: Users },
                { title: 'Delivery Report', desc: 'On-time %, average ETA, driver performance', icon: Truck },
                { title: 'Inventory Report', desc: 'Stock levels, expiry tracking, reorder suggestions', icon: Boxes },
                { title: 'Financial Report', desc: 'Revenue, costs, profit, tax summary', icon: TrendingUp },
              ].map((r) => (
                <Card key={r.title} className="p-5 border-gold/15 hover:shadow-brown transition-shadow">
                  <div className="h-12 w-12 rounded-xl gradient-gold flex items-center justify-center mb-3">
                    <r.icon className="h-6 w-6 text-brown-dark" />
                  </div>
                  <p className="font-display font-bold text-brown-dark">{r.title}</p>
                  <p className="text-xs text-brown-dark mt-1">{r.desc}</p>
                  <div className="flex gap-1 mt-3">
                    <Button size="sm" variant="outline" className="border-brown text-brown hover:bg-cream text-xs flex-1" onClick={() => toast.info(`Generating ${r.title} PDF...`)}>
                      <Download className="h-3 w-3 mr-1" /> PDF
                    </Button>
                    <Button size="sm" variant="outline" className="border-brown text-brown hover:bg-cream text-xs flex-1" onClick={() => toast.info(`Exporting ${r.title} Excel...`)}>
                      Excel
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* DELIVERY */}
          <TabsContent value="delivery" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard icon={Truck} label="Active Deliveries" value={8} trend={+2} color="gold" />
              <KpiCard icon={CheckCircle2} label="Delivered Today" value={14} trend={+5} color="green" />
              <KpiCard icon={Clock} label="Avg ETA" value="42 min" trend={-8} color="brown" />
              <KpiCard icon={TrendingUp} label="On-time Rate" value="96%" trend={+1.2} color="green" />
            </div>
            <Card className="p-5 border-gold/15">
              <h3 className="font-display font-bold text-brown-dark mb-3">Active Deliveries</h3>
              <div className="space-y-2">
                {stats.orders.slice(0, 5).map((o: any) => (
                  <div key={o.orderRef} className="flex items-center justify-between gap-2 p-3 rounded-lg bg-cream/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full gradient-brown flex items-center justify-center">
                        <Truck className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brown-dark">{o.orderRef}</p>
                        <p className="text-xs text-brown-dark">{o.customerName} • {o.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-gold/30 text-brown-dark text-[10px]">{o.status.replace('_', ' ')}</Badge>
                      <Button size="sm" variant="outline" className="border-brown text-brown hover:bg-cream text-xs" onClick={() => toast.info('Opening live map...')}>
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

function KpiCard({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: any; trend: number; color: 'gold' | 'brown' | 'green' | 'red' }) {
  const colors = {
    gold: 'bg-gold/10 text-gold',
    brown: 'bg-brown/10 text-brown',
    green: 'bg-brand-green/10 text-brand-green',
    red: 'bg-brand-red/10 text-brand-red',
  };
  const isUp = trend >= 0;
  return (
    <Card className="p-4 border-gold/15">
      <div className="flex items-start justify-between">
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', colors[color])}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={cn('text-xs font-semibold flex items-center gap-0.5', isUp ? 'text-brand-green' : 'text-brand-red')}>
          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend)}%
        </span>
      </div>
      <p className="text-xs text-brown-dark mt-2">{label}</p>
      <p className="font-display text-xl md:text-2xl font-bold text-brown-dark mt-0.5">{value}</p>
    </Card>
  );
}
