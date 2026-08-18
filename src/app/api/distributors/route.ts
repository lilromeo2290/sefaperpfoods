import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const dist = await db.distributor.create({
    data: {
      businessName: body.businessName,
      contactName: body.contactName,
      email: body.email,
      phone: body.phone,
      whatsapp: body.whatsapp || null,
      region: body.region,
      city: body.city,
      address: body.address,
      status: 'PENDING',
    },
  });
  return NextResponse.json({ success: true, id: dist.id });
}

export async function GET() {
  const dist = await db.distributor.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(dist);
}
