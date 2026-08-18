// Update admin email from sbffoods.gh to sbffoods.com
import { db } from '../src/lib/db';

async function main() {
  // Find existing admin
  const existing = await db.adminUser.findUnique({ where: { email: 'admin@sbffoods.gh' } });
  if (existing) {
    // Update email
    const updated = await db.adminUser.update({
      where: { email: 'admin@sbffoods.gh' },
      data: { email: 'admin@sbffoods.com' },
    });
    console.log('Updated admin email to:', updated.email);
  } else {
    // Check if already updated
    const already = await db.adminUser.findUnique({ where: { email: 'admin@sbffoods.com' } });
    if (already) {
      console.log('Admin email already is:', already.email);
    } else {
      // Create fresh
      const created = await db.adminUser.create({
        data: {
          email: 'admin@sbffoods.com',
          name: 'Sefaperp Admin',
          role: 'ADMIN',
          passwordHash: 'demo-admin-2026',
        },
      });
      console.log('Created admin:', created.email);
    }
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
