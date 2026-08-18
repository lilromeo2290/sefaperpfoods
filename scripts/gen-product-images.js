// Generate product SVG images for shitor and tom brown
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '../public/products');
if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

const shitorJars = [
  { file: 'shitor-1.svg', jar: '#5D4037', label: 'SBF', sub: 'SPECIAL SHITOR', accent: '#D4AF37' },
  { file: 'shitor-2.svg', jar: '#3E2723', label: 'SBF', sub: 'CHILI PEPPER PASTE', accent: '#C62828' },
  { file: 'shitor-3.svg', jar: '#7B5E4F', label: 'SBF', sub: 'HOMEMADE RECIPE', accent: '#D4AF37' },
  { file: 'shitor-4.svg', jar: '#5D4037', label: 'SBF', sub: 'DZODZE, VOLTA', accent: '#B8941F' },
];

const tbPacks = [
  { file: 'tb-1.svg', pack: '#FFF8E1', band: '#5D4037', label: 'SBF', sub: 'TOM BROWN POWDER', accent: '#D4AF37' },
  { file: 'tb-2.svg', pack: '#F5EAC4', band: '#3E2723', label: 'SBF', sub: 'ROASTED CEREAL MIX', accent: '#2E7D32' },
  { file: 'tb-3.svg', pack: '#FFF8E1', band: '#7B5E4F', label: 'SBF', sub: 'ENERGY BREAKFAST', accent: '#D4AF37' },
  { file: 'tb-4.svg', pack: '#F5EAC4', band: '#5D4037', label: 'SBF', sub: 'DZODZE, VOLTA', accent: '#B8941F' },
];

function jarSvg({ jar, label, sub, accent }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFF8E1"/>
      <stop offset="1" stop-color="#F5EAC4"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${jar}" stop-opacity=".95"/>
      <stop offset=".5" stop-color="${jar}" stop-opacity=".85"/>
      <stop offset="1" stop-color="#2A1F1A"/>
    </linearGradient>
    <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="${accent}" stop-opacity=".7"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="400" cy="400" r="320" fill="#FFF8E1" opacity=".4"/>
  <ellipse cx="400" cy="720" rx="220" ry="22" fill="#5D4037" opacity=".18"/>
  <!-- jar lid -->
  <rect x="280" y="170" width="240" height="60" rx="12" fill="url(#lid)"/>
  <rect x="280" y="170" width="240" height="14" rx="6" fill="#fff" opacity=".25"/>
  <!-- jar body -->
  <path d="M300 230 H500 V580 a200 200 0 0 1 -200 0 Z" fill="url(#glass)"/>
  <rect x="320" y="250" width="30" height="280" rx="15" fill="#fff" opacity=".15"/>
  <!-- label -->
  <rect x="300" y="380" width="200" height="160" rx="14" fill="#FFF8E1"/>
  <rect x="300" y="380" width="200" height="40" rx="14" fill="${accent}"/>
  <rect x="300" y="404" width="200" height="16" fill="${accent}"/>
  <text x="400" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#3E2723">${label}</text>
  <text x="400" y="465" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#5D4037" letter-spacing="2">${sub}</text>
  <text x="400" y="495" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#7B5E4F">SEFAKOR BROTHERS FOODS</text>
  <text x="400" y="515" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#7B5E4F">DZODZE • VOLTA REGION</text>
  <text x="400" y="528" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#B8941F">★ ★ ★ ★ ★</text>
</svg>`;
}

function packSvg({ pack, band, label, sub, accent }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFF8E1"/>
      <stop offset="1" stop-color="#F5EAC4"/>
    </linearGradient>
    <linearGradient id="pkg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${pack}"/>
      <stop offset="1" stop-color="${band}" stop-opacity=".15"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <circle cx="400" cy="400" r="320" fill="#FFF8E1" opacity=".4"/>
  <ellipse cx="400" cy="720" rx="240" ry="22" fill="#5D4037" opacity=".18"/>
  <!-- packet body -->
  <rect x="230" y="180" width="340" height="440" rx="18" fill="url(#pkg)" stroke="${band}" stroke-width="2"/>
  <!-- top seal -->
  <path d="M230 180 H570 L555 220 H245 Z" fill="${band}"/>
  <path d="M230 620 H570 L555 580 H245 Z" fill="${band}"/>
  <!-- accent band -->
  <rect x="230" y="340" width="340" height="80" fill="${accent}"/>
  <rect x="230" y="340" width="340" height="6" fill="#fff" opacity=".35"/>
  <rect x="230" y="414" width="340" height="6" fill="#000" opacity=".15"/>
  <!-- label -->
  <text x="400" y="265" text-anchor="middle" font-family="Georgia, serif" font-size="48" font-weight="700" fill="${band}">${label}</text>
  <text x="400" y="305" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="${band}" letter-spacing="3">SEFAKOR BROTHERS FOODS</text>
  <text x="400" y="395" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#3E2723" letter-spacing="2">${sub}</text>
  <text x="400" y="475" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="${band}">Roasted Maize • Soybean • Groundnut</text>
  <text x="400" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="${band}">Stone-ground in Dzodze, Volta Region</text>
  <text x="400" y="540" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#7B5E4F">NET WT 400g • AUTHENTIC GHANAIAN TASTE</text>
  <text x="400" y="568" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#B8941F">★ ★ ★ ★ ★  •  No preservatives</text>
</svg>`;
}

for (const s of shitorJars) {
  fs.writeFileSync(path.join(out, s.file), jarSvg(s));
  console.log('Wrote', s.file);
}
for (const t of tbPacks) {
  fs.writeFileSync(path.join(out, t.file), packSvg(t));
  console.log('Wrote', t.file);
}
console.log('Done.');
