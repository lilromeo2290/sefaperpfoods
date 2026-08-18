// Generate PWA icons using the ACTUAL uploaded JPEG logo + "Sefaperp Foods" text
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoSrc = path.join(__dirname, '../public/logo-emblem.jpeg');

// SVG wrapper that places the JPEG logo + adds the company name in a row beneath
function buildIconSvg(size) {
  // Logo area takes top ~60%, text takes bottom ~40%
  const logoSize = Math.floor(size * 0.55);
  const logoX = Math.floor((size - logoSize) / 2);
  const logoY = Math.floor(size * 0.10);
  const base64 = fs.readFileSync(logoSrc).toString('base64');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7A1F26"/>
      <stop offset="1" stop-color="#4A0F14"/>
    </linearGradient>
    <linearGradient id="goldHorz" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#B8943D"/>
      <stop offset="0.5" stop-color="#E8D5A3"/>
      <stop offset="1" stop-color="#B8943D"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.floor(size * 0.18)}" fill="url(#bg)"/>
  <!-- The actual uploaded logo -->
  <image href="data:image/jpeg;base64,${base64}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet"/>
  <!-- Gold divider -->
  <line x1="${Math.floor(size * 0.20)}" y1="${Math.floor(size * 0.72)}" x2="${Math.floor(size * 0.80)}" y2="${Math.floor(size * 0.72)}" stroke="url(#goldHorz)" stroke-width="2"/>
  <circle cx="${size / 2}" cy="${Math.floor(size * 0.72)}" r="4" fill="#D4AF37"/>
  <!-- Company name in a row -->
  <text x="${size / 2}" y="${Math.floor(size * 0.82)}" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-size="${Math.floor(size * 0.085)}" font-weight="800" fill="url(#goldHorz)" letter-spacing="1">SEFAPERP</text>
  <text x="${size / 2}" y="${Math.floor(size * 0.89)}" text-anchor="middle" font-family="Playfair Display, Georgia, serif" font-size="${Math.floor(size * 0.045)}" font-weight="600" fill="#E8D5A3" letter-spacing="${Math.floor(size * 0.025)}">FOODS</text>
  <text x="${size / 2}" y="${Math.floor(size * 0.95)}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.floor(size * 0.028)}" font-style="italic" fill="#E8D5A3" letter-spacing="1">Quality · Taste · Trust</text>
</svg>`;
}

(async () => {
  const sizes = [192, 512];
  for (const s of sizes) {
    const svg = Buffer.from(buildIconSvg(s));
    await sharp(svg, { density: 384 })
      .resize(s, s)
      .png()
      .toFile(path.join(__dirname, '../public/icons/icon-' + s + '.png'));
    console.log('Generated icon-' + s + '.png');
  }
  // Apple touch icon (180)
  const svg180 = Buffer.from(buildIconSvg(180));
  await sharp(svg180, { density: 384 })
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/icons/apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Favicon 32
  const svg32 = Buffer.from(buildIconSvg(32));
  await sharp(svg32, { density: 256 })
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '../public/icons/favicon-32.png'));
  console.log('Generated favicon-32.png');

  // Preview composite (larger, for download folder)
  const svgPreview = Buffer.from(buildIconSvg(800));
  await sharp(svgPreview, { density: 384 })
    .resize(800, 800)
    .png()
    .toFile(path.join(__dirname, '../public/logo-composite.png'));
  console.log('Generated logo-composite.png');
})();
