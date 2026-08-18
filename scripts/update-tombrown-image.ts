// Update SBF Tom Brown Powder product images to include the real photo
import { db } from '../src/lib/db';

async function main() {
  const product = await db.product.findUnique({ where: { slug: 'sbf-tom-brown-powder' } });
  if (!product) {
    console.error('Product not found');
    process.exit(1);
  }
  const updated = await db.product.update({
    where: { slug: 'sbf-tom-brown-powder' },
    data: {
      images: JSON.stringify([
        '/products/tom-brown-real.png',
        '/products/tb-1.svg',
        '/products/tb-2.svg',
        '/products/tb-3.svg',
        '/products/tb-4.svg',
      ]),
    },
  });
  console.log('Updated product images for:', updated.name);
  console.log('First image is now:', JSON.parse(updated.images)[0]);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
