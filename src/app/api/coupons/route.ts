import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const subtotal = Number(searchParams.get('subtotal') || '0');
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.active) {
    return NextResponse.json({ valid: false, message: 'Invalid coupon code' });
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, message: 'Coupon has expired' });
  }
  if (subtotal < coupon.minOrder) {
    return NextResponse.json({
      valid: false,
      message: `Minimum order of GHS ${coupon.minOrder} required`,
    });
  }
  const discount =
    coupon.type === 'PERCENT' ? (subtotal * coupon.value) / 100 : coupon.value;
  return NextResponse.json({
    valid: true,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount: Math.round(discount * 100) / 100,
    message: `Coupon applied — you saved GHS ${Math.round(discount * 100) / 100}`,
  });
}
