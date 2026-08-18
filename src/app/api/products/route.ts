import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'popularity';

  // Single product by slug
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

  // List products
  const where: any = {};
  if (category && category !== 'all') where.category = category;

  let orderBy: any = { popularity: 'desc' };
  if (sort === 'price-low') orderBy = { basePrice: 'asc' };
  if (sort === 'price-high') orderBy = { basePrice: 'desc' };
  if (sort === 'new') orderBy = { createdAt: 'desc' };

  const products = await db.product.findMany({ where, orderBy });
  return NextResponse.json(
    products.map((p) => ({
      ...p,
      sizes: JSON.parse(p.sizes),
      nutrition: JSON.parse(p.nutrition),
      images: JSON.parse(p.images),
    }))
  );
}
