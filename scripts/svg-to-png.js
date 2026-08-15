const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

(async () => {
  // Convert logo.svg to PNG for preview
  const svg = fs.readFileSync(path.join(__dirname, '../public/logo.svg'));
  await sharp(svg, { density: 200 })
    .resize(800, 800)
    .png()
    .toFile(path.join(__dirname, 'logo-preview.png'));
  console.log('Logo preview PNG generated');
})();
