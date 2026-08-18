// Recreate the user's uploaded pattern EXACTLY — subtle, low-contrast, small-scale
// BUT using the brand's burgundy + gold colors instead of gray.
// Original: light gray triangles at ~45% opacity on cream, 32px cells.
// New: burgundy + gold triangles at ~35% opacity on cream, 40px cells.

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 40px tile (matches the original's small subtle scale)
function buildPatternSvg(size) {
  const half = size / 2;

  // Brand colors at LOW opacity for subtlety (matching original's ~40% feel)
  const BURG = '#6B1C23';
  const GOLD = '#D4AF37';
  const CREAM = '#FDFBF7';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Base cream background (matches original) -->
  <rect width="${size}" height="${size}" fill="${CREAM}"/>

  <!-- Subtle triangle pattern: 4 triangles per tile, alternating burgundy and gold at low opacity -->
  <!-- Top triangle (gold) -->
  <polygon points="0,0 ${size},0 ${half},${half}" fill="${GOLD}" opacity="0.18"/>
  <!-- Bottom triangle (gold) -->
  <polygon points="0,${size} ${size},${size} ${half},${half}" fill="${GOLD}" opacity="0.18"/>
  <!-- Left triangle (burgundy) -->
  <polygon points="0,0 0,${size} ${half},${half}" fill="${BURG}" opacity="0.14"/>
  <!-- Right triangle (burgundy) -->
  <polygon points="${size},0 ${size},${size} ${half},${half}" fill="${BURG}" opacity="0.14"/>
</svg>`;
}

(async () => {
  const tileSize = 40;
  const svg = Buffer.from(buildPatternSvg(tileSize));
  await sharp(svg, { density: 300 })
    .png()
    .toFile(path.join(__dirname, '../public/pattern-tile.png'));
  console.log('Generated pattern-tile.png (40x40, subtle burgundy+gold)');

  const big = Buffer.from(buildPatternSvg(160));
  await sharp(big, { density: 300 })
    .png()
    .toFile(path.join(__dirname, '../public/pattern-tile-large.png'));
  console.log('Generated pattern-tile-large.png (160x160)');
})();
