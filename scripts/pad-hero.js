// Pre-process hero image: pad with cream background to 3:2 landscape
// so object-cover shows the ENTIRE original image with no cropping
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

(async () => {
  const src = path.join(__dirname, '../public/hero-products.png');
  const meta = await sharp(src).metadata();
  console.log('Original:', meta.width, 'x', meta.height, 'aspect', (meta.width / meta.height).toFixed(3));

  // We want a 3:2 landscape container (1.5 aspect) — same as source.
  // Source is 1536x1024 = 1.5 exactly, so no padding needed for that ratio.
  // But the issue is the container is 3:2 AND object-contain should already show everything.
  // Let's verify by also creating a version with cream background fill
  // that matches our cream container background, so any tiny letterbox blends.

  // Re-export with cream background flatten (in case of transparency / for consistency)
  await sharp(src)
    .flatten({ background: '#FFFDF7' })
    .resize(1536, 1024, { fit: 'cover', position: 'center' })
    .png({ quality: 90 })
    .toFile(path.join(__dirname, '../public/hero-products-clean.png'));

  console.log('Generated hero-products-clean.png (1536x1024, cream-flattened)');

  // Also create a slightly zoomed-out / padded version (add cream margin around)
  // This way, even if the container is a bit shorter, the products will still fit
  await sharp(src)
    .flatten({ background: '#FFFDF7' })
    .resize(1400, 933, { fit: 'inside' }) // shrink slightly
    .extend({
      top: 50,
      bottom: 50,
      left: 70,
      right: 70,
      background: '#FFFDF7',
    })
    .png({ quality: 90 })
    .toFile(path.join(__dirname, '../public/hero-products-padded.png'));

  console.log('Generated hero-products-padded.png (with cream margin around products)');
})();
