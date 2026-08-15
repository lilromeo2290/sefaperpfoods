import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const reviews = await db.review.findMany({
    where: productId ? { productId, approved: true } : { approved: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = await db.product.findUnique({ where: { slug: body.productSlug } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  const review = await db.review.create({
    data: {
      productId: product.id,
      authorName: body.authorName,
      rating: body.rating,
      title: body.title,
      body: body.body,
      approved: true, // auto-approve for demo
    },
  });
  return NextResponse.json(review);
}
