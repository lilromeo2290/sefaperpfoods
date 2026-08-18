import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  if (slug) {
    const product = await db.product.findUnique({ where: { slug } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const reviews = await db.review.findMany({
      where: { productId: product.id, approved: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({
      ...product,
      sizes: JSON.parse(product.sizes),
      nutrition: JSON.parse(product.nutrition),
      images: JSON.parse(product.images),
      reviews,
    });
  }
  return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
}
