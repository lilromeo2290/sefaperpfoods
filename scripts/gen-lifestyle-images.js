// Generate hero & lifestyle SVG images
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '../public');
if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

// Hero — collage of jars, packets, ingredients
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFF8E1"/>
      <stop offset="1" stop-color="#F5EAC4"/>
    </linearGradient>
    <radialGradient id="warm" cx="50%" cy="40%" r="60%">
      <stop offset="0" stop-color="#D4AF37" stop-opacity=".35"/>
      <stop offset="1" stop-color="#D4AF37" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="jar" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5D4037" stop-opacity=".95"/>
      <stop offset="1" stop-color="#2A1F1A"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E6C659"/>
      <stop offset="1" stop-color="#B8941F"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#warm)"/>

  <!-- decorative chili pepper shapes -->
  <g opacity=".18">
    <path d="M120 200 q80 -40 160 0 q-20 30 -40 20 q-30 -10 -50 10 q-30 30 -70 -30 z" fill="#C62828"/>
    <path d="M1380 700 q-80 -40 -160 0 q20 30 40 20 q30 -10 50 10 q30 30 70 -30 z" fill="#C62828"/>
    <circle cx="1400" cy="180" r="20" fill="#2E7D32"/>
    <circle cx="1450" cy="210" r="14" fill="#2E7D32"/>
  </g>

  <!-- groundnut cluster -->
  <g opacity=".7" transform="translate(1100 540)">
    <ellipse cx="0" cy="0" rx="56" ry="34" fill="#B8941F"/>
    <ellipse cx="-10" cy="-5" rx="46" ry="28" fill="#D4AF37"/>
    <path d="M0 -34 q8 -20 0 -40" stroke="#5D4037" stroke-width="4" fill="none"/>
  </g>

  <!-- jar (left foreground) -->
  <g transform="translate(120 320)">
    <ellipse cx="200" cy="430" rx="220" ry="22" fill="#5D4037" opacity=".22"/>
    <rect x="80" y="20" width="240" height="60" rx="12" fill="url(#gold)"/>
    <path d="M100 80 H300 V400 a200 200 0 0 1 -200 0 Z" fill="url(#jar)"/>
    <rect x="120" y="100" width="30" height="280" rx="15" fill="#fff" opacity=".12"/>
    <rect x="100" y="220" width="200" height="150" rx="14" fill="#FFF8E1"/>
    <rect x="100" y="220" width="200" height="36" rx="14" fill="url(#gold)"/>
    <text x="200" y="247" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="700" fill="#3E2723">SBF</text>
    <text x="200" y="295" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="#5D4037" letter-spacing="2">SPECIAL SHITOR</text>
    <text x="200" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#7B5E4F">Dzodze • Volta Region</text>
    <text x="200" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#B8941F">★ ★ ★ ★ ★</text>
  </g>

  <!-- tom brown packet (right) -->
  <g transform="translate(900 280)">
    <ellipse cx="170" cy="450" rx="240" ry="22" fill="#5D4037" opacity=".22"/>
    <rect x="20" y="20" width="300" height="400" rx="18" fill="#FFF8E1" stroke="#5D4037" stroke-width="2"/>
    <path d="M20 20 H320 L300 60 H40 Z" fill="#5D4037"/>
    <path d="M20 420 H320 L300 380 H40 Z" fill="#5D4037"/>
    <rect x="20" y="180" width="300" height="80" fill="url(#gold)"/>
    <text x="170" y="100" text-anchor="middle" font-family="Georgia, serif" font-size="38" font-weight="700" fill="#5D4037">SBF</text>
    <text x="170" y="135" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#5D4037" letter-spacing="3">SEFAKOR BROTHERS FOODS</text>
    <text x="170" y="232" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#3E2723" letter-spacing="2">TOM BROWN</text>
    <text x="170" y="305" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#5D4037">Roasted Maize • Soybean • Groundnut</text>
    <text x="170" y="328" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#7B5E4F">NET WT 400g • No preservatives</text>
  </g>

  <!-- leaves -->
  <g opacity=".55" transform="translate(1500 100) rotate(20)">
    <path d="M0 0 q80 -40 160 0 q-30 70 -80 60 q-50 -10 -80 -60 z" fill="#2E7D32"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(out, 'hero.svg'), hero);
console.log('Wrote hero.svg');

// Ghana map silhouette (decorative)
const ghana = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
  <path d="M80 90 L180 70 L260 80 L330 70 L420 90 L470 110 L490 160 L470 200 L460 250 L420 300 L350 330 L290 320 L230 330 L180 310 L130 280 L100 230 L80 180 Z" fill="#5D4037" opacity=".85"/>
  <circle cx="430" cy="180" r="10" fill="#C62828"/>
  <text x="445" y="184" font-family="Arial, sans-serif" font-size="14" fill="#5D4037" font-weight="700">Dzodze</text>
  <circle cx="200" cy="180" r="8" fill="#D4AF37"/>
  <text x="215" y="184" font-family="Arial, sans-serif" font-size="12" fill="#5D4037">Accra</text>
  <circle cx="280" cy="220" r="8" fill="#D4AF37"/>
  <text x="295" y="224" font-family="Arial, sans-serif" font-size="12" fill="#5D4037">Kumasi</text>
  <circle cx="380" cy="230" r="8" fill="#D4AF37"/>
  <text x="395" y="234" font-family="Arial, sans-serif" font-size="12" fill="#5D4037">Ho</text>
  <circle cx="420" cy="280" r="8" fill="#D4AF37"/>
  <text x="435" y="284" font-family="Arial, sans-serif" font-size="12" fill="#5D4037">Keta</text>
</svg>`;

fs.writeFileSync(path.join(out, 'ghana-map.svg'), ghana);
console.log('Wrote ghana-map.svg');

// Lifestyle / factory
const lifestyle = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFE082"/>
      <stop offset="1" stop-color="#FFF8E1"/>
    </linearGradient>
    <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D4AF37"/>
      <stop offset="1" stop-color="#B8941F"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#sky)"/>
  <ellipse cx="900" cy="180" rx="120" ry="80" fill="#fff" opacity=".55"/>
  <ellipse cx="700" cy="140" rx="80" ry="50" fill="#fff" opacity=".45"/>
  <path d="M0 520 L1200 520 L1200 800 L0 800 Z" fill="url(#land)"/>
  <!-- factory building -->
  <rect x="200" y="380" width="600" height="160" fill="#5D4037"/>
  <rect x="200" y="380" width="600" height="20" fill="#3E2723"/>
  <polygon points="200,380 280,320 360,380" fill="#7B5E4F"/>
  <polygon points="500,380 580,320 660,380" fill="#7B5E4F"/>
  <!-- chimney -->
  <rect x="640" y="280" width="50" height="100" fill="#3E2723"/>
  <ellipse cx="665" cy="280" rx="40" ry="14" fill="#fff" opacity=".7"/>
  <!-- windows -->
  <rect x="240" y="430" width="60" height="60" fill="#FFE082" stroke="#3E2723" stroke-width="3"/>
  <rect x="340" y="430" width="60" height="60" fill="#FFE082" stroke="#3E2723" stroke-width="3"/>
  <rect x="440" y="430" width="60" height="60" fill="#FFE082" stroke="#3E2723" stroke-width="3"/>
  <rect x="540" y="430" width="60" height="60" fill="#FFE082" stroke="#3E2723" stroke-width="3"/>
  <rect x="640" y="430" width="60" height="60" fill="#FFE082" stroke="#3E2723" stroke-width="3"/>
  <!-- sign -->
  <rect x="240" y="490" width="460" height="40" fill="#FFF8E1"/>
  <text x="470" y="517" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="700" fill="#5D4037">SEFAKOR BROTHERS FOODS</text>
  <!-- palm trees -->
  <g transform="translate(100 380)">
    <rect x="-6" y="0" width="12" height="160" fill="#5D4037"/>
    <path d="M0 0 q-60 -30 -80 -10 q40 30 80 10 z" fill="#2E7D32"/>
    <path d="M0 0 q60 -30 80 -10 q-40 30 -80 10 z" fill="#2E7D32"/>
    <path d="M0 0 q-30 -60 -10 -80 q30 40 10 80 z" fill="#2E7D32"/>
    <path d="M0 0 q30 -60 10 -80 q-30 40 -10 80 z" fill="#2E7D32"/>
  </g>
  <g transform="translate(1050 380)">
    <rect x="-6" y="0" width="12" height="160" fill="#5D4037"/>
    <path d="M0 0 q-60 -30 -80 -10 q40 30 80 10 z" fill="#2E7D32"/>
    <path d="M0 0 q60 -30 80 -10 q-40 30 -80 10 z" fill="#2E7D32"/>
    <path d="M0 0 q-30 -60 -10 -80 q30 40 10 80 z" fill="#2E7D32"/>
    <path d="M0 0 q30 -60 10 -80 q-30 40 -10 80 z" fill="#2E7D32"/>
  </g>
  <!-- ground texture -->
  <ellipse cx="600" cy="710" rx="600" ry="40" fill="#3E2723" opacity=".15"/>
</svg>`;

fs.writeFileSync(path.join(out, 'factory.svg'), lifestyle);
console.log('Wrote factory.svg');

console.log('Done.');
