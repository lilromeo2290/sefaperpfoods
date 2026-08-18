// Generate light-on-dark variant of the horizontal logo for footer / dark backgrounds
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const logoSrc = path.join(__dirname, '../public/logo-emblem.jpeg');
const logoBuf = fs.readFileSync(logoSrc);
const logoB64 = logoBuf.toString('base64');

function buildLightLogo(height) {
  const width = Math.floor(height * 5);
  const emblemSize = Math.floor(height * 0.82);
  const emblemX = Math.floor(height * 0.10);
  const emblemY = Math.floor((height - emblemSize) / 2);
  const textX = emblemX + emblemSize + Math.floor(height * 0.25);
  const nameFontSize = Math.floor(height * 0.40);
  const taglineFontSize = Math.floor(height * 0.16);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="goldHorz" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#B8943D"/>
      <stop offset="0.5" stop-color="#E8D5A3"/>
      <stop offset="1" stop-color="#B8943D"/>
    </linearGradient>
    <clipPath id="emblemClip">
      <circle cx="${emblemX + emblemSize/2}" cy="${emblemY + emblemSize/2}" r="${emblemSize/2}"/>
    </clipPath>
  </defs>

  <!-- Gold ring around emblem -->
  <circle cx="${emblemX + emblemSize/2}" cy="${emblemY + emblemSize/2}" r="${emblemSize/2 + 4}" fill="none" stroke="url(#goldHorz)" stroke-width="3"/>

  <!-- The ACTUAL uploaded logo emblem -->
  <image href="data:image/jpeg;base64,${logoB64}" x="${emblemX}" y="${emblemY}" width="${emblemSize}" height="${emblemSize}" preserveAspectRatio="xMidYMid slice" clip-path="url(#emblemClip)"/>

  <!-- Company name: "Sefaperp" in GOLD + "Foods" in CREAM, for dark backgrounds -->
  <text x="${textX}" y="${Math.floor(height * 0.48)}" font-family="Playfair Display, Georgia, serif" font-size="${nameFontSize}" font-weight="800" letter-spacing="0">
    <tspan fill="url(#goldHorz)">Sefaperp</tspan>
    <tspan fill="#FAF8F5" dx="${Math.floor(nameFontSize * 0.20)}">Foods</tspan>
  </text>

  <!-- Decorative gold divider -->
  <line x1="${textX}" y1="${Math.floor(height * 0.58)}" x2="${textX + Math.floor(height * 2.2)}" y2="${Math.floor(height * 0.58)}" stroke="url(#goldHorz)" stroke-width="1.5"/>
  <circle cx="${textX + Math.floor(height * 1.1)}" cy="${Math.floor(height * 0.58)}" r="3" fill="#D4AF37"/>

  <!-- Tagline in cream/gold -->
  <text x="${textX}" y="${Math.floor(height * 0.78)}" font-family="Georgia, serif" font-size="${taglineFontSize}" font-style="italic" fill="#E8D5A3" letter-spacing="3">Quality · Taste · Trust</text>
</svg>`;
}

(async () => {
  const sizes = [
    { h: 80,  name: 'logo-horizontal-light-sm.png' },
    { h: 120, name: 'logo-horizontal-light.png' },
    { h: 200, name: 'logo-horizontal-light-lg.png' },
  ];

  for (const { h, name } of sizes) {
    const svg = Buffer.from(buildLightLogo(h));
    await sharp(svg, { density: 384 })
      .png()
      .toFile(path.join(__dirname, '../public/' + name));
    console.log('Generated', name, `(${h * 5}x${h})`);
  }
  console.log('Done.');
})();
