import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const [products, orders, customers, distributors] = await Promise.all([
    db.product.findMany(),
    db.order.findMany(),
    db.customer.findMany(),
    db.distributor.findMany(),
  ]);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const last7 = new Date(today);
  last7.setDate(last7.getDate() - 7);
  const last30 = new Date(today);
  last30.setDate(last30.getDate() - 30);

  const dailySales = orders
    .filter((o) => new Date(o.createdAt) >= today && o.paymentStatus === 'PAID')
    .reduce((s, o) => s + o.total, 0);
  const weeklySales = orders
    .filter((o) => new Date(o.createdAt) >= last7 && o.paymentStatus === 'PAID')
    .reduce((s, o) => s + o.total, 0);
  const monthlySales = orders
    .filter((o) => new Date(o.createdAt) >= last30 && o.paymentStatus === 'PAID')
    .reduce((s, o) => s + o.total, 0);

  // last 7 days bar chart
  const days: { label: string; revenue: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dStart = new Date(today);
    dStart.setDate(dStart.getDate() - i);
    const dEnd = new Date(dStart);
    dEnd.setDate(dEnd.getDate() + 1);
    const dayOrders = orders.filter(
      (o) => new Date(o.createdAt) >= dStart && new Date(o.createdAt) < dEnd
    );
    days.push({
      label: dStart.toLocaleDateString('en', { weekday: 'short' }),
      revenue: dayOrders
        .filter((o) => o.paymentStatus === 'PAID')
        .reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // top products by qty sold
  const topMap = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const o of orders) {
    const items = JSON.parse(o.itemsJson) as any[];
    for (const it of items) {
      const cur = topMap.get(it.slug) || { name: it.name, qty: 0, revenue: 0 };
      cur.qty += it.quantity;
      cur.revenue += it.unitPrice * it.quantity;
      topMap.set(it.slug, cur);
    }
  }
  const topProducts = Array.from(topMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // regional distribution
  const regionMap = new Map<string, number>();
  for (const o of orders) {
    regionMap.set(o.region, (regionMap.get(o.region) || 0) + 1);
  }
  const regional = Array.from(regionMap.entries())
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);

  // status breakdown
  const statusCounts: Record<string, number> = {};
  for (const o of orders) statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;

  return NextResponse.json({
    kpis: {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalProducts: products.length,
      totalDistributors: distributors.length,
      dailySales,
      weeklySales,
      monthlySales,
      avgOrder: orders.length ? totalRevenue / Math.max(1, orders.filter(o => o.paymentStatus === 'PAID').length) : 0,
    },
    sales7d: days,
    topProducts,
    regional,
    statusCounts,
    lowStock: products.filter((p) => p.stockQty <= p.reorderLevel),
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      stockQty: p.stockQty,
      reorderLevel: p.reorderLevel,
      basePrice: p.basePrice,
      popularity: p.popularity,
      inStock: p.inStock,
      expiryDate: p.expiryDate,
    })),
    orders: orders.slice(0, 20).map((o) => ({
      orderRef: o.orderRef,
      customerName: o.customerName,
      total: o.total,
      status: o.status,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt,
      region: o.region,
    })),
  });
}
