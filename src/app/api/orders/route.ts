import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function genOrderRef() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SBF-${year}-${rand}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');
  if (ref) {
    const order = await db.order.findUnique({
      where: { orderRef: ref },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      ...order,
      items: order.items,
      itemsJson: JSON.parse(order.itemsJson),
    });
  }
  // recent orders (for admin)
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderRef = genOrderRef();
    const order = await db.order.create({
      data: {
        orderRef,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail,
        customerWhatsapp: body.customerWhatsapp || null,
        deliveryAddress: body.deliveryAddress,
        digitalAddress: body.digitalAddress || null,
        lat: body.lat ?? null,
        lng: body.lng ?? null,
        city: body.city || 'Accra',
        region: body.region || 'Greater Accra',
        itemsJson: JSON.stringify(body.items),
        subtotal: body.subtotal,
        deliveryFee: body.deliveryFee,
        discount: body.discount || 0,
        total: body.total,
        couponCode: body.couponCode || null,
        paymentMethod: body.paymentMethod,
        paymentStatus: 'PENDING',
        status: 'RECEIVED',
        notes: body.notes || null,
      },
    });
    // create order items + reduce stock + bump popularity
    for (const item of body.items) {
      const p = await db.product.findUnique({ where: { slug: item.slug } });
      if (p) {
        await db.orderItem.create({
          data: {
            orderId: order.id,
            productId: p.id,
            name: item.name,
            size: item.size,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.unitPrice * item.quantity,
          },
        });
        await db.product.update({
          where: { id: p.id },
          data: {
            stockQty: Math.max(0, p.stockQty - item.quantity),
            popularity: p.popularity + item.quantity,
          },
        });
      }
    }
    return NextResponse.json({ orderRef, id: order.id, status: 'RECEIVED' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderRef, status, paymentStatus, driverName, vehicle, eta } = body;
    const order = await db.order.update({
      where: { orderRef },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(driverName !== undefined ? { driverName } : {}),
        ...(vehicle !== undefined ? { vehicle } : {}),
        ...(eta ? { eta: new Date(eta) } : {}),
      },
    });
    return NextResponse.json(order);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
