// SBF Foods — seed products, coupons, and admin user
import { db } from '../src/lib/db';

async function main() {
  // --- Admin user ---
  const admin = await db.adminUser.upsert({
    where: { email: 'admin@sbffoods.com' },
    update: {},
    create: {
      email: 'admin@sbffoods.com',
      name: 'SBF Admin',
      role: 'ADMIN',
      passwordHash: 'demo-admin-2026',
    },
  });
  console.log('Seeded admin:', admin.email);

  // --- SBF Special Shitor ---
  const shitor = await db.product.upsert({
    where: { slug: 'sbf-special-shitor' },
    update: {},
    create: {
      slug: 'sbf-special-shitor',
      name: 'SBF Special Shitor',
      tagline: 'Authentic Ghanaian chili-pepper paste, slow-roasted in Dzodze',
      description:
        'SBF Special Shitor is a bold, smoky Ghanaian chili-pepper condiment crafted in small batches in Dzodze, Volta Region. We blend sun-dried red chili peppers, fried onions, smoked fish, dried shrimp, ginger, garlic and a secret spice mix, then slow-roast the paste over low heat until it darkens and the oils rise to the surface. The result is a deep, complex umami heat that lifts every meal — from plain rice and boiled yam to gari, kenkey, and banku. No artificial colours. No preservatives. Just the taste of home, bottled fresh.',
      category: 'shitor',
      basePrice: 25,
      sizes: JSON.stringify([
        { label: '120g Jar',  price: 18, sku: 'SHT-120' },
        { label: '250g Jar',  price: 30, sku: 'SHT-250' },
        { label: '500g Jar',  price: 55, sku: 'SHT-500' },
        { label: '1kg Tub',   price: 100, sku: 'SHT-1KG' },
        { label: '5kg Bucket (Bulk)', price: 450, sku: 'SHT-5KG' },
      ]),
      ingredients:
        'Sun-dried red chili peppers, fried onions, smoked fish (anchovies), dried shrimp, ginger, garlic, tomato paste, vegetable oil, sea salt, natural spices.',
      nutrition: JSON.stringify({
        servingSize: '1 tbsp (15g)',
        servingsPerContainer: 'About 16 (250g jar)',
        rows: [
          ['Energy',        '45 kcal'],
          ['Protein',       '1.5 g'],
          ['Carbohydrate',  '3.2 g'],
          ['of which sugars','1.0 g'],
          ['Fat',           '3.1 g'],
          ['of which saturates','0.5 g'],
          ['Fibre',         '0.8 g'],
          ['Sodium',        '420 mg'],
        ],
      }),
      images: JSON.stringify([
        '/products/shitor-real.png',
        '/products/shitor-1.svg',
        '/products/shitor-2.svg',
        '/products/shitor-3.svg',
        '/products/shitor-4.svg',
      ]),
      popularity: 980,
      isNew: false,
      inStock: true,
      stockQty: 320,
      reorderLevel: 80,
    },
  });
  console.log('Seeded product:', shitor.slug);

  // --- SBF Tom Brown Powder ---
  const tomBrown = await db.product.upsert({
    where: { slug: 'sbf-tom-brown-powder' },
    update: {},
    create: {
      slug: 'sbf-tom-brown-powder',
      name: 'SBF Tom Brown Powder',
      tagline: 'Stone-ground roasted-cereal porridge mix — energy for the whole family',
      description:
        'SBF Tom Brown Powder is a nutrient-dense Ghanaian porridge made from a traditional blend of roasted maize, soybeans, groundnuts (peanuts) and a touch of millet. The grains are slow-roast-milled in Dzodze to unlock a nutty, caramelised aroma and to preserve the natural fibre and protein. A warm bowl of Tom Brown powers children through the school morning, sustains farmers in the field, and is a comforting breakfast for every generation. Quick to prepare — just whisk into boiling water, simmer for three minutes, and sweeten to taste with honey or milk.',
      category: 'tom-brown',
      basePrice: 35,
      sizes: JSON.stringify([
        { label: '400g Pack',  price: 32, sku: 'TB-400' },
        { label: '800g Pack',  price: 58, sku: 'TB-800' },
        { label: '1.5kg Pack', price: 95, sku: 'TB-1500' },
        { label: '5kg Bag (Bulk)', price: 280, sku: 'TB-5KG' },
      ]),
      ingredients:
        'Roasted maize flour, roasted soybean flour, roasted groundnut (peanut) paste, roasted millet flour. Contains peanuts.',
      nutrition: JSON.stringify({
        servingSize: '40g (about 3 tbsp)',
        servingsPerContainer: 'About 10 (400g pack)',
        rows: [
          ['Energy',        '168 kcal'],
          ['Protein',       '6.4 g'],
          ['Carbohydrate',  '24 g'],
          ['of which sugars','2.1 g'],
          ['Fat',           '5.8 g'],
          ['of which saturates','1.1 g'],
          ['Fibre',         '3.5 g'],
          ['Sodium',        '95 mg'],
        ],
      }),
      images: JSON.stringify([
        '/products/tom-brown-real.png',
        '/products/tb-1.svg',
        '/products/tb-2.svg',
        '/products/tb-3.svg',
        '/products/tb-4.svg',
      ]),
      popularity: 760,
      isNew: true,
      inStock: true,
      stockQty: 240,
      reorderLevel: 60,
    },
  });
  console.log('Seeded product:', tomBrown.slug);

  // --- Coupons ---
  await db.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'PERCENT',
      value: 10,
      minOrder: 50,
      active: true,
    },
  });
  await db.coupon.upsert({
    where: { code: 'DZODZE50' },
    update: {},
    create: {
      code: 'DZODZE50',
      type: 'FIXED',
      value: 15,
      minOrder: 100,
      active: true,
    },
  });
  console.log('Seeded coupons');

  // --- Sample reviews ---
  const reviewSeeds = [
    { slug: 'sbf-special-shitor', author: 'Ama Serwaa', rating: 5, title: 'Tastes exactly like my mother\'s', body: 'I have tried many shitor brands in Accra and none come close to SBF. The smoked fish flavour is real and the heat is just right. My kids even ask for it on eggs.' },
    { slug: 'sbf-special-shitor', author: 'Kwesi Mensah', rating: 5, title: 'A little goes a long way', body: 'Bought the 500g jar for the office and we are hooked. Pair it with gari and water — game changer. Delivery to Tema was next-day.' },
    { slug: 'sbf-special-shitor', author: 'Esi Attah', rating: 4, title: 'Great taste, jar was a bit small', body: 'Authentic flavour, reminds me of Volta. Wish the 250g jar was a touch bigger for the price, but I will reorder.' },
    { slug: 'sbf-tom-brown-powder', author: 'Akosua Boateng', rating: 5, title: 'My toddler loves it', body: 'We replaced imported cereal with SBF Tom Brown and the difference in energy and focus at school is real. Quick prep on busy mornings.' },
    { slug: 'sbf-tom-brown-powder', author: 'Yaw Osei', rating: 5, title: 'Real groundnut taste', body: 'You can taste the roasted groundnuts — none of that flat commercial porridge taste. Highly recommended for the whole family.' },
  ];
  for (const r of reviewSeeds) {
    const p = await db.product.findUnique({ where: { slug: r.slug } });
    if (p) {
      await db.review.create({
        data: {
          productId: p.id,
          authorName: r.author,
          rating: r.rating,
          title: r.title,
          body: r.body,
          approved: true,
        },
      });
    }
  }
  console.log('Seeded reviews');

  console.log('Seed complete.');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
