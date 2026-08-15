// Generate PWA PNG icons from SVG using sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svg = fs.readFileSync(path.join(__dirname, '../public/icons/logo.svg'));

const sizes = [192, 512];
(async () => {
  for (const s of sizes) {
    await sharp(svg, { density: 384 })
      .resize(s, s)
      .png()
      .toFile(path.join(__dirname, '../public/icons/icon-' + s + '.png'));
    console.log('Generated icon-' + s + '.png');
  }
  await sharp(svg, { density: 384 })
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/icons/apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
  await sharp(svg, { density: 256 })
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '../public/icons/favicon-32.png'));
  console.log('Generated favicon-32.png');
})();
